
export enum PaymentMethodType {
  QR_CODE = 'QR_CODE',
  DOMESTIC_CARD = 'DOMESTIC_CARD',
  INTERNATIONAL_CARD = 'INTERNATIONAL_CARD',
  MOMO = 'MOMO',
  COD = 'COD'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  id: string;
  items: Product[];
  shippingFee: number;
  discount: number;
  createdAt: string;
  customerInfo?: OrderFormData; // Added linkage to customer
}

export interface PaymentMethodConfig {
  id: PaymentMethodType;
  title: string;
  description: string;
  iconName: string; // Mapping string to icon component
}

// Entity: SanPham (Sản phẩm)
export interface ProductDetail {
  id: string;
  name: string;
  category: string; // Added category
  rating: number;
  reviewCount: number;
  soldCount: number;
  price: number;
  originalPrice: number;
  discountRate: number;
  shippingFee: number;
  shippingEstimate: string;
  colors: string[];
  sizes: string[];
  stock: number;
  images: string[];
  videoDuration: string;
  description: string;
}

// Entity: BienThe (Biến thể sản phẩm trong kho)
export interface ProductVariant {
    sku: string;
    productId: string;
    color: string;
    size: string;
    stockQuantity: number;
}

// New types for UC03 - Order Confirmation & Selective Cart Checkout
export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  size: string;
  color?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  selected?: boolean;
  imgFilter?: string;
  studioBg?: string;
  swatchHex?: string;
}

// Entity: KhachHang (Thông tin khách hàng)
export interface OrderFormData {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  note: string;
}

// Entity: PaymentTransaction (Giao dịch thanh toán)
export interface PaymentTransaction {
    transactionId: string;
    orderId: string;
    amount: number;
    method: PaymentMethodType;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    timestamp: string;
}

// --- NEW TYPES FOR EXTENDED USE CASES ---

export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',    // Khách hàng
  SUPPORT = 'SUPPORT',      // Hỗ trợ / CSKH (gộp vào Nhân viên Bán hàng)
  ADMIN = 'ADMIN',          // Admin (Chủ cửa hàng)
  SALES = 'SALES',          // Nhân viên Bán hàng (POS & CSKH)
  WAREHOUSE = 'WAREHOUSE'   // Nhân viên Kho
}

// Khách hàng thân thiết & Điểm tích lũy (UC03)
export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  points: number;           // Điểm tích lũy hiện có
  tier: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
  totalSpent: number;       // Tổng chi tiêu
  createdAt: string;
}

// Phiếu nhập kho (UC05)
export interface StockImportTicket {
  id: string;
  code: string;             // VD: NK-2026-001
  supplier: string;         // Nhà cung cấp
  importDate: string;
  creator: string;          // Nhân viên kho / Admin tạo phiếu
  items: {
    productId: string;
    productName: string;
    quantity: number;
    importPrice: number;
  }[];
  totalQuantity: number;
  totalCost: number;
  note?: string;
  status: 'COMPLETED' | 'DRAFT';
}

// Yêu cầu Đổi trả & Hoàn hàng (UC10)
export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  reason: string;
  refundAmount: number;
  pointsToDeduct: number;   // Điểm thưởng cần thu hồi khi hoàn tiền
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

// Khuyến nghị kho AI (UC08)
export interface InventoryRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  dailySalesRate: number;    // Số lượng bán trung bình / ngày
  daysUntilOut: number;      // Số ngày dự kiến hết hàng
  suggestedAction: 'REORDER_URGENT' | 'MONITOR' | 'CLEARANCE';
  suggestedQuantity: number;
  reason: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',       // Chờ thanh toán / Chờ duyệt
  PAID = 'PAID',             // Đã thanh toán / Chờ xác nhận
  PROCESSING = 'PROCESSING', // Đang xử lý
  SHIPPING = 'SHIPPING',     // Đang giao
  DELIVERED = 'DELIVERED',   // Đã giao
  RETURN_REQUESTED = 'RETURN_REQUESTED', // Đang yêu cầu đổi trả (UC10)
  RETURNED = 'RETURNED',     // Đã hoàn trả & thu hồi điểm (UC10)
  CANCELLED = 'CANCELLED'    // Đã hủy
}

export interface TrackingStep {
  status: OrderStatus;
  date: string;
  description: string;
  completed: boolean;
}

// ==========================================
// THÔNG TIN BẢNG DATABASE MỚI
// Mappings cho các bảng SQL (11 bảng)
// ==========================================

export interface RoleEntity {
  id: number;
  name: string;
}

export interface UserEntity {
  id: number;
  role_id: number;
  email: string;
  password?: string; // Tùy chọn vì không nên gửi password về frontend
}

export interface CustomerEntity {
  id: number;
  user_id: number;
  address: string | null;
  phone: string | null;
}

export interface SellerEntity {
  id: number;
  user_id: number;
  shop_name: string;
  wallet_balance: number;
}

export interface CategoryEntity {
  id: number;
  name: string;
}

export interface ProductEntity {
  id: number;
  seller_id: number;
  category_id: number | null;
  name: string;
  price: number;
  stock: number;
}

export interface CartEntity {
  id: number;
  customer_id: number;
  created_at: string;
}

export interface CartItemEntity {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
}

export interface OrderEntity {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItemEntity {
  id: number;
  order_id: number;
  seller_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  shipping_status: string;
  commission_fee: number;
}

export interface PaymentEntity {
  id: number;
  order_id: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  amount: number;
  payment_date: string;
}

// -------------------------------------------------------------
// ĐA TRỢ LÝ AI CHUYÊN BIỆT & CÁ NHÂN HÓA (MULTI-PERSONA AI SYSTEM)
// -------------------------------------------------------------
export type AIPersonaType = 'STYLIST' | 'FITTING' | 'ORDERS' | 'LOYALTY' | 'BUSINESS';

export interface UserMeasurements {
  height: number;           // Chiều cao (cm)
  weight: number;           // Cân nặng (kg)
  chest?: number;           // Vòng 1 (cm)
  waist?: number;           // Vòng 2 (cm)
  preferredFit?: 'tight' | 'regular' | 'loose'; // Ôm / Vừa vặn / Rộng thoải mái
  gender?: 'nam' | 'nu' | 'unisex';
}

export interface CustomerContext {
  currentUser?: {
    id?: number | string;
    email?: string;
    name?: string;
    role?: string;
    avatar?: string;
  } | null;
  customerProfile?: CustomerProfile | null;
  cartItems?: CartItem[];
  allProducts?: ProductDetail[];
  activeProduct?: ProductDetail | null;
  currentView?: string;
  customerOrders?: Order[];
  measurements?: UserMeasurements | null;
}

export interface OutfitCombo {
  id: string;
  title: string;
  style: string;
  occasion: string;
  description: string;
  items: ProductDetail[];
  totalPrice: number;
  discountPrice?: number;
}

export interface SizeFittingResult {
  recommendedSize: string;
  confidence: number;
  fitDescription: string;
  measurementsUsed: {
    height: number;
    weight: number;
    fitPreference: string;
  };
  details: {
    chestFit: string;
    lengthFit: string;
    shoulderFit: string;
  };
}

// -------------------------------------------------------------
// ĐƠN MUA CỦA TÔI, ĐỔI TRẢ & ĐÁNH GIÁ SẢN PHẨM (MY ORDERS & REVIEWS)
// -------------------------------------------------------------
export interface CustomerOrderItem {
  id: string;
  name: string;
  image: string;
  size: string;
  color?: string;
  price: number;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  rating: number; // 1 đến 5 sao
  fitRating: 'tight' | 'fit' | 'loose'; // Chật | Vừa vặn | Rộng
  qualityRating: 'good' | 'normal' | 'poor';
  comment: string;
  customerName: string;
  createdAt: string;
  photos?: string[];
  vipPointsEarned: number;
}

export interface CustomerOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CustomerOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  pointsDeductedAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  isPaid: boolean;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    note?: string;
  };
  trackingCode?: string;
  carrierName?: string;
  estimatedDelivery?: string;
  completedAt?: string;
  review?: CustomerReview;
  returnReason?: string;
  returnType?: 'EXCHANGE_SIZE' | 'REFUND';
  exchangeSize?: string;
}