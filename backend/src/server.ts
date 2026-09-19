import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole, requirePermission } from './middlewares/auth';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. API Đăng nhập
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Sai thông tin đăng nhập' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'super-secret-jwt-key', { expiresIn: '1d' });
  res.json({ token, role: user.role.name });
});

// 2. API Browse Sản phẩm (Public / Guest)
app.get('/api/products', (req: Request, res: Response) => {
  res.json({ message: 'Danh sách sản phẩm (Public)' });
});

// 3. API Cart (Yêu cầu đăng nhập, Role nào cũng được, nhung thuong la Customer)
app.post('/api/cart', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: `Đã thêm vào giỏ hàng của user ${user.fullName}` });
});

// 4. API Checkout (Chỉ Role CUSTOMER)
app.post('/api/checkout', authMiddleware, requireRole(['CUSTOMER']), (req: Request, res: Response) => {
  res.json({ message: 'Checkout thành công cho Customer' });
});

// 5. API Seller Dashboard (Chỉ Role SELLER, hoặc CHECK PERMISSION product.create)
app.get('/api/seller/dashboard', authMiddleware, requireRole(['SELLER']), (req: Request, res: Response) => {
  res.json({ message: 'Dữ liệu báo cáo Dashboard dành cho Seller' });
});

// API Nâng cao kiểm tra Permission
app.post('/api/products', authMiddleware, requirePermission('product.create'), (req: Request, res: Response) => {
  res.json({ message: 'Đăng sản phẩm mới thành công (Đã check Permission)' });
});

app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại port ${PORT}`);
});
