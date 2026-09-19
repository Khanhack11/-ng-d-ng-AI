const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed dữ liệu mẫu...');

  // 1. Tạo Roles (CUSTOMER, SELLER, ADMIN)
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Quản trị viên hệ thống' },
  });

  const roleCustomer = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Khách hàng' },
  });

  const roleSeller = await prisma.role.upsert({
    where: { name: 'SELLER' },
    update: {},
    create: { name: 'SELLER', description: 'Người bán hàng' },
  });

  // 2. Tạo test Permissions cho product.view, product.create, admin.access
  const permViewProduct = await prisma.permission.upsert({
    where: { code: 'product.view' },
    update: {},
    create: { code: 'product.view', module: 'product', description: 'Xem sản phẩm' },
  });

  const permCreateProduct = await prisma.permission.upsert({
    where: { code: 'product.create' },
    update: {},
    create: { code: 'product.create', module: 'product', description: 'Tạo sản phẩm' },
  });

  // 3. Gán Permissions cho Roles
  // Admin được mọi thứ (ở đây demo 2 quyền)
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: permViewProduct.id } },
    update: {},
    create: { roleId: roleAdmin.id, permissionId: permViewProduct.id },
  });
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: permCreateProduct.id } },
    update: {},
    create: { roleId: roleAdmin.id, permissionId: permCreateProduct.id },
  });

  // Customer chỉ được xem
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleCustomer.id, permissionId: permViewProduct.id } },
    update: {},
    create: { roleId: roleCustomer.id, permissionId: permViewProduct.id },
  });

  // 4. Tạo Admin Account
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      email: 'admin@system.com',
      password: adminPassword,
      fullName: 'System Administrator',
      roleId: roleAdmin.id,
    },
  });

  console.log('Seed dữ liệu thành công!');
  console.log('Tài khoản Admin: admin@system.com | Pass: Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
