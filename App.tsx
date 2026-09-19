import React, { useState } from 'react';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import TransactionResultPage from './components/TransactionResultPage';
import OrderDetailPage from './components/OrderDetailPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SellerChannelPage from './components/SellerChannelPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import AdminDashboard from './components/AdminDashboard';
import MiniCart from './components/MiniCart';
import HomePage from './components/HomePage';
import ShopeeHomePage from './components/ZShop/ShopeeHomePage';
import LandingPage3D from './components/Landing3D/LandingPage3D';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ChatBot from './components/ChatBot';
import WarehousePage from './components/WarehousePage';
import CustomerManagementPage from './components/CustomerManagementPage';
import ReturnManagementPage from './components/ReturnManagementPage';
import POSPage from './components/POSPage';
import ChangePasswordModal from './components/ChangePasswordModal';
import CustomerLoyaltyModal from './components/CustomerLoyaltyModal';
import MyOrdersPage from './components/MyOrdersPage';
import CSKHPortalPage from './components/CSKHPortalPage';
import { PortalWorkspace } from './components/PortalTopBar';
import { 
  UserRole, CartItem, ProductDetail, CustomerProfile, 
  StockImportTicket, ReturnRequest, CustomerOrder, 
  CustomerOrderItem, CustomerReview, OrderStatus 
} from './types';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, RotateCcw, 
  Store, Sparkles, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';
import { MOCK_CART_ITEMS, MOCK_PRODUCTS_LIST } from './constants';
import { GioHangService, AuthService, AuthUserData } from './services';

type ViewState = 'landing-3d' | 'home' | 'product' | 'confirmation' | 'checkout' | 'result' | 'order-detail' | 'login' | 'tracking' | 'orders' | 'admin' | 'register' | 'seller-channel' | 'forgot-password' | 'warehouse' | 'customers' | 'returns' | 'pos' | 'cskh';

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  { id: 'CUST-001', name: 'Nguyễn Quốc Khánh', phone: '0901234567', email: 'khanh.nguyen@gmail.com', address: '12 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM', points: 450, tier: 'Vàng', totalSpent: 12500000, createdAt: '10/01/2026' },
  { id: 'CUST-002', name: 'Trần Thị Hà My', phone: '0918765432', email: 'hamy.tran@yahoo.com', address: '45 Nguyễn Huệ, Q.1, TP.HCM', points: 820, tier: 'Kim Cương', totalSpent: 28900000, createdAt: '15/02/2026' },
  { id: 'CUST-003', name: 'Lê Hoàng Nam', phone: '0988112233', email: 'hoangnam@outlook.com', address: '78 Hai Bà Trưng, Q.3, TP.HCM', points: 180, tier: 'Bạc', totalSpent: 4200000, createdAt: '02/03/2026' },
  { id: 'CUST-004', name: 'Phạm Thuỳ Dung', phone: '0977445566', email: 'thuydung.pham@gmail.com', address: '102 Cách Mạng Tháng 8, Q.10, TP.HCM', points: 50, tier: 'Đồng', totalSpent: 1150000, createdAt: '20/04/2026' }
];

const INITIAL_IMPORT_TICKETS: StockImportTicket[] = [
  {
    id: 'ticket-1',
    code: 'NK-2026-0810',
    supplier: 'Xưởng May Dệt May Gia Định',
    importDate: '26/12/2024 09:30',
    creator: 'Trần Văn Kho (Thủ kho chính)',
    items: [
      { productId: 'DIOR-TSHIRT-001', productName: 'Áo Thun Cao Cấp DIOR In Chữ Nổi', quantity: 100, importPrice: 280000 },
      { productId: 'ZSHOP-POLO-002', productName: 'Áo Polo Thể Thao Nam ZShop Limited Edition', quantity: 80, importPrice: 210000 }
    ],
    totalQuantity: 180,
    totalCost: 44800000,
    status: 'COMPLETED',
    note: 'Đợt nhập bổ sung nguồn hàng bán Tết 2026'
  },
  {
    id: 'ticket-2',
    code: 'NK-2026-0811',
    supplier: 'Công ty Thời Trang Quốc Tế Vina',
    importDate: '27/12/2024 14:15',
    creator: 'Trần Văn Kho (Thủ kho chính)',
    items: [
      { productId: 'SNEAKER-001', productName: 'Giày Sneaker Nam Retro Streetwear', quantity: 50, importPrice: 520000 }
    ],
    totalQuantity: 50,
    totalCost: 26000000,
    status: 'COMPLETED',
    note: 'Nhập theo khuyến nghị kho AI (UC08)'
  }
];

const INITIAL_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'RET-001',
    orderId: 'DH-20241227-02',
    customerName: 'Phạm Văn C',
    customerPhone: '0933221144',
    items: [{ name: 'Áo Khoác Bomber Unisex', quantity: 1, price: 120000 }],
    reason: 'Không vừa size, áo hơi chật vai',
    refundAmount: 120000,
    pointsToDeduct: 6,
    status: 'PENDING',
    requestedAt: '28/12/2024 11:20'
  },
  {
    id: 'RET-002',
    orderId: 'DH-20241226-03',
    customerName: 'Hoàng Thị D',
    customerPhone: '0944556677',
    items: [{ name: 'Áo Thun Cao Cấp DIOR', quantity: 1, price: 890000 }],
    reason: 'Hàng không đúng như màu sắc mô tả trên ảnh',
    refundAmount: 890000,
    pointsToDeduct: 45,
    status: 'APPROVED',
    requestedAt: '27/12/2024 16:45'
  }
];

const INITIAL_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'DH-20260908-01',
    createdAt: '08/09/2026 10:15',
    status: OrderStatus.DELIVERED,
    items: [
      {
        id: 'ZSHOP-POLO-002',
        name: 'Áo Polo Thể Thao Nam ZShop Limited Edition',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600',
        size: 'L',
        color: 'Xanh Navy',
        price: 299000,
        quantity: 1
      },
      {
        id: 'SHORT-001',
        name: 'Quần Short Kaki Co Giãn 4 Chiều Phong Cách Trẻ',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600',
        size: 'L',
        color: 'Be',
        price: 199000,
        quantity: 1
      }
    ],
    subtotal: 498000,
    shippingFee: 0,
    discount: 50000,
    totalAmount: 448000,
    paymentMethod: 'VietQR Napas 24/7',
    isPaid: true,
    shippingAddress: {
      fullName: 'Nguyễn Quốc Khánh',
      phone: '0901234567',
      address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM'
    },
    trackingCode: 'ZSE-88291038VN',
    carrierName: 'ZShop Express Fast 24/7',
    estimatedDelivery: '08/09/2026 15:30',
    completedAt: '08/09/2026 15:30'
  },
  {
    id: 'DH-20260907-03',
    createdAt: '07/09/2026 14:00',
    status: OrderStatus.SHIPPING,
    items: [
      {
        id: 'DIOR-TSHIRT-001',
        name: 'Áo Thun Cao Cấp DIOR In Chữ Nổi Chuẩn Form',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        size: 'M',
        color: 'Trắng Basic',
        price: 349000,
        quantity: 1
      }
    ],
    subtotal: 349000,
    shippingFee: 30000,
    discount: 30000,
    totalAmount: 349000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    isPaid: false,
    shippingAddress: {
      fullName: 'Nguyễn Quốc Khánh',
      phone: '0901234567',
      address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM'
    },
    trackingCode: 'ZSE-99120482VN',
    carrierName: 'ZShop Express Fast 24/7',
    estimatedDelivery: 'Hôm nay trước 18:00'
  },
  {
    id: 'DH-20260908-04',
    createdAt: '08/09/2026 09:30',
    status: OrderStatus.PENDING,
    items: [
      {
        id: 'SNEAKER-001',
        name: 'Giày Sneaker Nam Retro Streetwear Đế Đệm Êm',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
        size: '42 (26.0cm)',
        color: 'Trắng Basic',
        price: 650000,
        quantity: 1
      }
    ],
    subtotal: 650000,
    shippingFee: 30000,
    discount: 50000,
    totalAmount: 630000,
    paymentMethod: 'Chuyển khoản VietQR',
    isPaid: true,
    shippingAddress: {
      fullName: 'Nguyễn Quốc Khánh',
      phone: '0901234567',
      address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM'
    },
    trackingCode: 'ZSE-11002349VN',
    carrierName: 'ZShop Express Fast 24/7'
  },
  {
    id: 'DH-20241227-02',
    createdAt: '27/12/2024 16:45',
    status: OrderStatus.RETURN_REQUESTED,
    items: [
      {
        id: 'BOMBER-001',
        name: 'Áo Khoác Bomber Unisex Thêu Logo Sắc Nét',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
        size: 'M',
        color: 'Đen Tuyển',
        price: 120000,
        quantity: 1
      }
    ],
    subtotal: 120000,
    shippingFee: 30000,
    discount: 0,
    totalAmount: 150000,
    paymentMethod: 'COD',
    isPaid: true,
    shippingAddress: {
      fullName: 'Phạm Văn C',
      phone: '0933221144',
      address: 'Số 123, Đường Xuân Thủy, Phổ Yên, Thái Nguyên'
    },
    returnReason: 'Không vừa size, áo hơi chật vai',
    returnType: 'EXCHANGE_SIZE',
    exchangeSize: 'L'
  }
];


const AccessDenied: React.FC<{
  title: string;
  requiredRole: string;
  currentRole: string;
  onGoHome: () => void;
  onGoLogin: () => void;
}> = ({ title, requiredRole, currentRole, onGoHome, onGoLogin }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl space-y-4 animate-fade-in">
      <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-center justify-center mx-auto text-rose-400 shadow-inner">
        <ShieldCheck size={36} />
      </div>
      <h2 className="text-xl font-black text-white tracking-tight">403 - Quyền Truy Cập Bị Từ Chối</h2>
      <p className="text-xs text-slate-300 leading-relaxed">
        Phân hệ <strong>{title}</strong> chỉ cho phép tài khoản có vai trò <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 font-bold rounded-md">{requiredRole}</span>.
      </p>
      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-400">
        Vai trò hiện tại: <strong className="text-amber-400 uppercase font-mono">{currentRole || 'GUEST'}</strong>
      </div>
      <p className="text-[11px] text-slate-400">
        Bạn chỉ có thể thực hiện những nghiệp vụ thuộc phạm vi quyền hạn tài khoản của mình.
      </p>
      <div className="flex gap-3 pt-2">
        <button 
          onClick={onGoHome}
          className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
        >
          Về Mua Sắm
        </button>
        <button 
          onClick={onGoLogin}
          className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20"
        >
          Đổi Tài Khoản
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  
  // Toàn bộ sản phẩm được quản lý tập trung để đồng bộ số lượng tồn kho (Stock) giữa POS, Kho và Khách mua
  const [products, setProducts] = useState<ProductDetail[]>(MOCK_PRODUCTS_LIST);

  // Danh sách khách hàng CRM (UC03)
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);

  // Lịch sử phiếu nhập kho (UC05)
  const [importTickets, setImportTickets] = useState<StockImportTicket[]>(INITIAL_IMPORT_TICKETS);

  // Danh sách yêu cầu đổi trả & hoàn tiền (UC10)
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(INITIAL_RETURN_REQUESTS);

  // Danh sách đơn hàng mua sắm của khách hàng (Order History Hub)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(INITIAL_CUSTOMER_ORDERS);

  // Khôi phục session người dùng từ localStorage nếu có
  const [currentUser, setCurrentUser] = useState<AuthUserData | null>(() => {
    const session = AuthService.getSession();
    return session?.user || null;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const session = AuthService.getSession();
    if (session?.role === 'ADMIN') return UserRole.ADMIN;
    if (session?.role === 'SELLER') return UserRole.SELLER;
    if (session?.role === 'SALES') return UserRole.SALES;
    if (session?.role === 'WAREHOUSE') return UserRole.WAREHOUSE;
    if (session?.role === 'CUSTOMER') return UserRole.CUSTOMER;
    return UserRole.CUSTOMER;
  });

  // -- NEW: Cart State Management linked with LocalStorage & Database --
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zshop_customer_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
    }
    return []; // Mặc định giỏ rỗng, tuyệt đối không chèn dữ liệu cũ/giả lập
  });

  const [lastCompletedOrder, setLastCompletedOrder] = useState<CustomerOrder | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("DIOR-TSHIRT-001");

  // Đồng bộ giỏ hàng vào localStorage khi có thay đổi
  React.useEffect(() => {
    try {
      localStorage.setItem('zshop_customer_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cartItems]);

  // Modals for Customer (UC01, UC03)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  // Global Seller State to sync request between Seller UI and Admin UI
  const [globalSellers, setGlobalSellers] = useState([
      { id: 'S-101', name: 'Nguyễn Văn Nam', shopName: 'Nam Sneaker', status: 'PENDING', date: '19/04/2026', email: 'nam.sneaker@gmail.com' },
      { id: 'S-102', name: 'Trần Thị Hà', shopName: 'Hà Cosmatic', status: 'PENDING', date: '19/04/2026', email: 'ha.beauty99@gmail.com' },
      { id: 'S-103', name: 'Lê Hoàng', shopName: 'Hoàng Tech', status: 'APPROVED', date: '15/04/2026', email: 'congnghe.hoang@vietnam.vn' },
  ]);

  // Tab states for role portals
  const [adminInitialTab, setAdminInitialTab] = useState<'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI'>('DASHBOARD');
  const [cskhInitialTab, setCskhInitialTab] = useState<'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING'>('RETURNS');
  const [sellerInitialTab, setSellerInitialTab] = useState<'overview' | 'products' | 'orders' | 'profile'>('overview');

  // Tải giỏ hàng từ máy chủ nếu có (tuyệt đối KHÔNG gán fallback MOCK_CART_ITEMS để tránh tái lặp đồ cũ)
  React.useEffect(() => {
    if (userRole === UserRole.CUSTOMER) {
      GioHangService.layGioHang(1).then(items => {
        if (items && items.length > 0) {
          // Map backend properties (cartItemId) to frontend 'id' requirement
          const mappedItems = items.map((i: any) => ({ ...i, id: i.cartItemId?.toString() || i.id?.toString() }));
          setCartItems(mappedItems);
        }
      }).catch(err => {
        console.warn('Backend cart not reachable, maintaining local cart state:', err);
      });
    }
  }, [userRole]);


  // Async Cart Handlers to update SQL
  const handleAddToCart = async (item: CartItem) => {
    // 1. Optimistic UI update
    setCartItems(prev => {
      const existing = prev.find(i => i.name === item.name && i.size === item.size);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setIsMiniCartOpen(true);

    // 2. Sync to Backend
    if (userRole === UserRole.CUSTOMER) {
      await GioHangService.themVaoGio(item, 1);
      // Re-fetch to get correct backend IDs if needed
      const refreshed = await GioHangService.layGioHang(1);
      if (refreshed && refreshed.length > 0) {
        setCartItems(refreshed.map((i: any) => ({ ...i, id: i.cartItemId?.toString() || i.id?.toString() })));
      }
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    // 1. Optimistic
    setCartItems(prev => prev.filter(item => item.id !== id));

    // 2. Sync to backend
    if (userRole === UserRole.CUSTOMER && !id.startsWith("mock")) {
      await GioHangService.xoaKhoiGio(id, 1);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(id);
      return;
    }
    // Optimistic UI update
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    // For a real app, we would sync this exact quantity to the backend here via an update API.
  };

  // Xóa toàn bộ giỏ hàng (Clear Cart)
  const handleClearAllCart = async () => {
    setCartItems([]);
    try {
      localStorage.removeItem('zshop_customer_cart');
    } catch (e) {}
    if (userRole === UserRole.CUSTOMER) {
      await GioHangService.xoaToanBoGio(1);
    }
  };

  // Navigation handlers: Chuyển trực tiếp tới One-Page Checkout
  const navigateToConfirmation = () => {
    setIsMiniCartOpen(false); // Close mini cart if open
    window.scrollTo(0, 0);
    setCurrentView('checkout');
  };

  const navigateToCheckout = () => {
    setIsMiniCartOpen(false);
    window.scrollTo(0, 0);
    setCurrentView('checkout');
  };

  const navigateToProduct = (productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo(0, 0);
    setCurrentView('product');
  };

  const navigateToHome = () => {
    window.scrollTo(0, 0);
    setCurrentView('home');
  };

  // Điều hướng nhanh đến từng chức vụ của Admin
  const handleAdminNavigateTab = (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => {
    setAdminInitialTab(tab);
    if (userRole !== UserRole.ADMIN) {
      setUserRole(UserRole.ADMIN);
    }
    window.scrollTo(0, 0);
    setCurrentView('admin');
  };

  // Điều hướng nhanh đến Cổng CSKH & Sales Hợp Nhất
  const handleCSKHNavigateTab = (tab: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING' = 'RETURNS') => {
    setCskhInitialTab(tab);
    if (userRole !== UserRole.SALES) {
      setUserRole(UserRole.SALES);
    }
    window.scrollTo(0, 0);
    setCurrentView('cskh');
  };

  // Điều hướng nhanh đến Kênh Nhà Bán Hàng
  const handleSellerNavigateTab = (tab: 'overview' | 'products' | 'orders' | 'profile' = 'overview') => {
    setSellerInitialTab(tab);
    if (userRole !== UserRole.SELLER) {
      setUserRole(UserRole.SELLER);
    }
    window.scrollTo(0, 0);
    setCurrentView('seller-channel');
  };

  // Chuyển đổi vai trò làm việc linh hoạt (phục vụ kiểm thử và phân quyền)
  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.ADMIN) {
      setAdminInitialTab('DASHBOARD');
      setCurrentView('admin');
    } else if (role === UserRole.SELLER) {
      setSellerInitialTab('overview');
      setCurrentView('seller-channel');
    } else if (role === UserRole.SALES) {
      setCskhInitialTab('RETURNS');
      setCurrentView('cskh');
    } else if (role === UserRole.WAREHOUSE) {
      setCurrentView('warehouse');
    } else {
      setCurrentView('home');
    }
    window.scrollTo(0, 0);
  };

  // Switch workspace handler từ PortalTopBar
  const handleSwitchWorkspace = (workspace: PortalWorkspace) => {
    if (workspace === 'ADMIN') {
      handleSwitchRole(UserRole.ADMIN);
    } else if (workspace === 'SELLER') {
      handleSwitchRole(UserRole.SELLER);
    } else if (workspace === 'CSKH') {
      handleSwitchRole(UserRole.SALES);
    } else {
      handleSwitchRole(UserRole.CUSTOMER);
    }
  };

  const navigateToResult = (orderInfo?: any) => {
    setIsMiniCartOpen(false);
    window.scrollTo(0, 0);

    let createdOrder: CustomerOrder | null = null;

    // Tự động lưu đơn hàng mới vào danh sách Đơn mua của khách hàng
    if (orderInfo && cartItems.length > 0) {
      createdOrder = {
        id: orderInfo.orderId || `DH-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: OrderStatus.PROCESSING,
        items: cartItems.map(c => ({
          id: c.id,
          name: c.name,
          image: c.image,
          size: c.size,
          price: c.price,
          quantity: c.quantity
        })),
        subtotal: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        shippingFee: orderInfo.shippingMethod === 'express' ? 50000 : 30000,
        discount: 50000,
        totalAmount: orderInfo.totalAmount || cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        paymentMethod: orderInfo.paymentMethod === 'QR_CODE' ? 'VietQR Napas 24/7' : orderInfo.paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : 'Thanh toán trực tuyến',
        isPaid: orderInfo.paymentMethod !== 'COD',
        shippingAddress: {
          fullName: orderInfo.recipientName || 'Nguyễn Quốc Khánh',
          phone: orderInfo.recipientPhone || '0901234567',
          address: orderInfo.recipientAddress || '12 Lê Lợi, Q.1, TP.HCM'
        },
        trackingCode: `ZSE-${Math.floor(10000000 + Math.random() * 90000000)}VN`,
        carrierName: 'ZShop Express Fast 24/7',
        estimatedDelivery: 'Dự kiến giao ngày mai trước 18:00'
      };

      setCustomerOrders(prev => [createdOrder!, ...prev]);
      setLastCompletedOrder(createdOrder);
    } else if (orderInfo) {
      createdOrder = {
        id: orderInfo.orderId || `DH-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: OrderStatus.PROCESSING,
        items: [],
        subtotal: orderInfo.totalAmount || 0,
        shippingFee: 30000,
        discount: 0,
        totalAmount: orderInfo.totalAmount || 0,
        paymentMethod: orderInfo.paymentMethod === 'QR_CODE' ? 'VietQR Napas 24/7' : orderInfo.paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : 'Thanh toán trực tuyến',
        isPaid: orderInfo.paymentMethod !== 'COD',
        shippingAddress: {
          fullName: orderInfo.recipientName || 'Nguyễn Quốc Khánh',
          phone: orderInfo.recipientPhone || '0901234567',
          address: orderInfo.recipientAddress || '12 Lê Lợi, Q.1, TP.HCM'
        },
        trackingCode: `ZSE-${Math.floor(10000000 + Math.random() * 90000000)}VN`,
        carrierName: 'ZShop Express Fast 24/7',
        estimatedDelivery: 'Dự kiến giao ngày mai trước 18:00'
      };
      setLastCompletedOrder(createdOrder);
    }

    // Làm sạch triệt để giỏ hàng sau khi thanh toán thành công
    setCartItems([]);
    try {
      localStorage.removeItem('zshop_customer_cart');
    } catch (e) {}
    if (userRole === UserRole.CUSTOMER) {
      GioHangService.xoaToanBoGio(1);
    }

    setCurrentView('result');
  };

  const navigateToOrderDetail = () => {
    window.scrollTo(0, 0);
    setCurrentView('order-detail');
  };

  // 1-Click Re-Order: Thêm lại tất cả sản phẩm vào giỏ hàng và mở giỏ
  const handleReOrder = (items: CustomerOrderItem[]) => {
    const newCartItems: CartItem[] = items.map(it => ({
      id: `${it.id}-${Date.now()}`,
      name: it.name,
      size: it.size,
      price: it.price,
      quantity: it.quantity,
      image: it.image
    }));

    setCartItems(prev => [...prev, ...newCartItems]);
    setIsMiniCartOpen(true);
  };

  // Hủy đơn hàng phía người mua
  const handleCancelCustomerOrder = (orderId: string) => {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`)) {
      setCustomerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o));
      alert(`Đã hủy thành công đơn hàng #${orderId}.`);
    }
  };

  // Yêu cầu đổi trả / đổi size phía người mua (UC10)
  const handleRequestReturn = (
    orderId: string, 
    item: CustomerOrderItem, 
    returnType: 'EXCHANGE_SIZE' | 'REFUND', 
    reason: string, 
    exchangeSize?: string, 
    refundBankInfo?: string
  ) => {
    // 1. Cập nhật trạng thái đơn hàng của người mua
    setCustomerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: OrderStatus.RETURN_REQUESTED,
          returnReason: reason,
          returnType,
          exchangeSize
        };
      }
      return o;
    }));

    // 2. Đồng bộ trực tiếp vào danh sách Quản Lý Đổi Trả & Hoàn Tiền (UC10)
    const newReturnReq: ReturnRequest = {
      id: `RET-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      customerName: currentUser?.name || customers[0]?.name || 'Nguyễn Quốc Khánh',
      customerPhone: customers[0]?.phone || '0901234567',
      items: [{ name: item.name, quantity: item.quantity, price: item.price }],
      reason: returnType === 'EXCHANGE_SIZE' ? `Đổi sang size ${exchangeSize}: ${reason}` : reason,
      refundAmount: returnType === 'REFUND' ? item.price * item.quantity : 0,
      pointsToDeduct: Math.round((item.price * item.quantity) / 20000), // Điểm tương ứng cần thu hồi nếu hoàn tiền
      status: 'PENDING',
      requestedAt: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setReturnRequests(prev => [newReturnReq, ...prev]);
  };

  // Gửi đánh giá sản phẩm & Tặng điểm VIP
  const handleSubmitReview = (orderId: string, review: CustomerReview) => {
    // 1. Lưu đánh giá vào đơn hàng
    setCustomerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, review };
      }
      return o;
    }));

    // 2. Tặng thưởng +50 Điểm VIP cho khách hàng (UC03)
    const activeCustId = customers[0]?.id || 'CUST-001';
    handleUpdateCustomerPoints(activeCustId, 50, 0);

    alert(`🎉 Chúc mừng bạn đã nhận được +50 Điểm Thưởng VIP nhờ đánh giá hữu ích cho cộng đồng mua sắm ZShop!`);
  };

  const navigateToSellerChannel = () => {
    if (userRole === UserRole.SELLER) {
      window.scrollTo(0, 0);
      setCurrentView('seller-channel');
    } else {
      if (confirm('Bạn cần đăng nhập với tài khoản Nhà bán hàng (Seller) để vào Kênh người bán. Chuyển đến trang Đăng nhập?')) {
        setCurrentView('login');
      }
    }
  };

  const navigateToBecomeSeller = () => {
    if (userRole === UserRole.GUEST) {
      if (confirm('Bạn cần đăng nhập hoặc đăng ký tài khoản để trở thành Người bán. Chuyển đến trang Đăng nhập?')) {
        setCurrentView('login');
      }
    } else if (userRole === UserRole.SELLER) {
      navigateToSellerChannel();
    } else {
      window.scrollTo(0, 0);
      setCurrentView('seller-channel');
    }
  };

  // Guard: never allow GUEST to stay on seller-channel view
  React.useEffect(() => {
    if (currentView === 'seller-channel' && userRole === UserRole.GUEST) {
      setCurrentView('login');
    }
  }, [currentView, userRole]);

  // Auto-upgrade role to SELLER for demo if Admin approves "Cửa hàng ZS-Economy Demo"
  React.useEffect(() => {
    const demoShop = globalSellers.find(s => s.shopName === 'Cửa hàng ZS-Economy Demo');
    if (demoShop && demoShop.status === 'APPROVED' && userRole !== UserRole.SELLER) {
       setUserRole(UserRole.SELLER);
       alert('Chúc mừng! Yêu cầu trở thành Người bán của bạn đã được phê duyệt. Bạn hiện đã có quyền truy cập đầy đủ vào Kênh người bán.');
    }
  }, [globalSellers, userRole]);

  // Deduct stock for POS or Store checkout
  const handleDeductStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock - quantity) };
      }
      return p;
    }));
  };

  // Update stock (Thủ kho / Admin)
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Customer loyalty points & spend updater (UC03)
  const handleUpdateCustomerPoints = (customerId: string, pointsDelta: number, spentDelta: number = 0) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updatedPoints = Math.max(0, c.points + pointsDelta);
        const updatedSpent = c.totalSpent + spentDelta;
        let newTier: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương' = c.tier;
        if (updatedSpent >= 25000000) newTier = 'Kim Cương';
        else if (updatedSpent >= 10000000) newTier = 'Vàng';
        else if (updatedSpent >= 3000000) newTier = 'Bạc';
        return { ...c, points: updatedPoints, totalSpent: updatedSpent, tier: newTier };
      }
      return c;
    }));
  };

  const handleAddCustomer = (customer: CustomerProfile) => {
    setCustomers(prev => [customer, ...prev]);
  };

  const handleAddImportTicket = (ticket: StockImportTicket) => {
    setImportTickets(prev => [ticket, ...prev]);
  };

  const handleProcessReturn = (requestId: string, action: 'APPROVE' | 'REJECT' | 'REFUND_AND_CLAWBACK') => {
    const target = returnRequests.find(r => r.id === requestId);
    if (!target) return;

    if (action === 'APPROVE') {
      setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'APPROVED', processedAt: new Date().toLocaleString() } : r));
      alert(`Đã phê duyệt nhận lại hàng cho đơn ${target.orderId}. Vui lòng kiểm tra sản phẩm và thực hiện Hoàn tiền!`);
    } else if (action === 'REJECT') {
      setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED', processedAt: new Date().toLocaleString() } : r));
      alert(`Đã từ chối yêu cầu đổi trả của đơn ${target.orderId}.`);
    } else if (action === 'REFUND_AND_CLAWBACK') {
      // 1. Hoàn tiền
      setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'REFUNDED', processedAt: new Date().toLocaleString() } : r));
      
      // 2. Thu hồi điểm tích lũy của khách hàng
      if (customers.length > 0) {
        handleUpdateCustomerPoints(customers[0].id, -target.pointsToDeduct, 0);
      }

      alert(`✅ Đã xử lý hoàn tất (UC10 Include)!\n- Hoàn tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(target.refundAmount)}\n- Đã thu hồi: ${target.pointsToDeduct} điểm thưởng tích lũy của khách hàng.`);
    }
  };

  const handleLoginSuccess = (role: 'CUSTOMER' | 'ADMIN' | 'SELLER' | 'SALES' | 'WAREHOUSE') => {
    const session = AuthService.getSession();
    setCurrentUser(session?.user || null);
    if (role === 'ADMIN') {
      setUserRole(UserRole.ADMIN);
      setAdminInitialTab('DASHBOARD');
      setCurrentView('admin');
    } else if (role === 'SELLER') {
      setUserRole(UserRole.SELLER);
      setSellerInitialTab('overview');
      setCurrentView('seller-channel');
    } else if (role === 'SALES') {
      setUserRole(UserRole.SALES);
      setCskhInitialTab('RETURNS');
      setCurrentView('cskh');
    } else if (role === 'WAREHOUSE') {
      setUserRole(UserRole.WAREHOUSE);
      setCurrentView('warehouse');
    } else {
      setUserRole(UserRole.CUSTOMER);
      setCurrentView('home');
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    AuthService.clearSession();
    setCurrentUser(null);
    setUserRole(UserRole.GUEST);
    setCurrentView('home');
    setIsMiniCartOpen(false);
  };

  return (
    <>

      {/* Global Mini Cart Overlay - Available on customer views */}
      {currentView !== 'admin' && currentView !== 'login' && currentView !== 'register' && (
        <MiniCart
          isOpen={isMiniCartOpen}
          onClose={() => setIsMiniCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={navigateToConfirmation}
          onAddToCart={handleAddToCart}
          onClearCart={handleClearAllCart}
          onContinueShopping={() => {
            setIsMiniCartOpen(false);
            if (currentView === 'product') {
              // stay on product
            } else {
              navigateToHome();
            }
          }}
        />
      )}

      {currentView === 'landing-3d' && (
        <LandingPage3D
          onEnterStore={() => setCurrentView('home')}
          onProductClick={navigateToProduct}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onGoToAdmin={() => setCurrentView('admin')}
          onOpenSellerChannel={navigateToSellerChannel}
        />
      )}

      {currentView === 'home' && (
        <ShopeeHomePage
          onProductClick={navigateToProduct}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          currentUser={currentUser}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onViewOrders={() => setCurrentView('tracking')}
          onGoToAdmin={() => handleAdminNavigateTab('DASHBOARD')}
          onGoToWarehouse={() => setCurrentView('warehouse')}
          onGoToCustomers={() => handleCSKHNavigateTab('CUSTOMERS')}
          onGoToReturns={() => handleCSKHNavigateTab('RETURNS')}
          onOpenPOS={() => handleCSKHNavigateTab('POS')}
          onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
          onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
          customerPoints={customers[0]?.points || 450}
          customerTier={customers[0]?.tier || 'Vàng'}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          pendingReturnsCount={returnRequests.filter(r => r.status === 'PENDING').length}
          pendingSellersCount={globalSellers.filter(s => s.status === 'PENDING').length}
          onNavigateAdminTab={handleAdminNavigateTab}
          onNavigateCSKH={handleCSKHNavigateTab}
          onNavigateSeller={handleSellerNavigateTab}
          onSwitchRole={handleSwitchRole}
          onSwitchWorkspace={handleSwitchWorkspace}
        />
      )}

      {currentView === 'product' && (
        <ProductDetailPage
          productId={selectedProductId}
          onBuyNow={navigateToConfirmation}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          currentUser={currentUser}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onViewOrders={() => setCurrentView('tracking')}
          onGoToAdmin={() => handleAdminNavigateTab('DASHBOARD')}
          onGoToWarehouse={() => setCurrentView('warehouse')}
          onGoToCustomers={() => handleCSKHNavigateTab('CUSTOMERS')}
          onGoToReturns={() => handleCSKHNavigateTab('RETURNS')}
          onOpenPOS={() => handleCSKHNavigateTab('POS')}
          onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
          onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
          customerPoints={customers[0]?.points || 450}
          customerTier={customers[0]?.tier || 'Vàng'}
          onBackToHome={navigateToHome}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
          pendingReturnsCount={returnRequests.filter(r => r.status === 'PENDING').length}
          pendingSellersCount={globalSellers.filter(s => s.status === 'PENDING').length}
          onNavigateAdminTab={handleAdminNavigateTab}
          onNavigateCSKH={handleCSKHNavigateTab}
          onNavigateSeller={handleSellerNavigateTab}
          onSwitchRole={handleSwitchRole}
          onSwitchWorkspace={handleSwitchWorkspace}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBack={navigateToHome}
          onGoToRegister={() => setCurrentView('register')}
          onGoToForgotPassword={() => setCurrentView('forgot-password')}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onRegisterSuccess={(role) => {
            if (role) {
              handleLoginSuccess(role);
            } else {
              setCurrentView('login');
            }
          }}
          onBack={navigateToHome}
          onGoToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPasswordPage
          onBack={() => setCurrentView('login')}
        />
      )}

      {currentView === 'seller-channel' && (
        userRole !== UserRole.WAREHOUSE && userRole !== UserRole.SALES ? (
          <SellerChannelPage
            onBack={navigateToHome}
            userRole={userRole}
            initialTab={sellerInitialTab}
            shopStatus={globalSellers.find(s => s.shopName === 'Cửa hàng ZS-Economy Demo')?.status as 'PENDING' | 'APPROVED' | 'REJECTED'}
            onRequestApproval={(shopInfo) => {
               const newId = `S-${Math.floor(Math.random() * 1000) + 200}`;
               setGlobalSellers([...globalSellers, {
                   id: newId,
                   name: 'Nhà Bán Hàng Mới',
                   shopName: shopInfo.shopName || 'Cửa hàng ZS-Economy Demo',
                   status: 'PENDING',
                   date: new Date().toLocaleDateString('en-GB'),
                   email: 'seller.new@gmail.com'
               }]);
            }}
          />
        ) : (
          <AccessDenied 
            title="Kênh Người Bán (Seller Channel)"
            requiredRole="Nhà bán hàng (Seller) hoặc Khách hàng"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {(currentView === 'tracking' || currentView === 'orders') && (
        <MyOrdersPage
          orders={customerOrders}
          onBackToHome={navigateToHome}
          onReOrder={handleReOrder}
          onCancelOrder={handleCancelCustomerOrder}
          onRequestReturn={handleRequestReturn}
          onSubmitReview={handleSubmitReview}
          customerProfile={customers.find(c => c.email === currentUser?.email) || customers[0]}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onGoToAdmin={() => handleAdminNavigateTab('DASHBOARD')}
          onGoToWarehouse={() => setCurrentView('warehouse')}
          onGoToCustomers={() => handleCSKHNavigateTab('CUSTOMERS')}
          onGoToReturns={() => handleCSKHNavigateTab('RETURNS')}
          onOpenPOS={() => handleCSKHNavigateTab('POS')}
          onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
          onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
          pendingReturnsCount={returnRequests.filter(r => r.status === 'PENDING').length}
          pendingSellersCount={globalSellers.filter(s => s.status === 'PENDING').length}
          onNavigateAdminTab={handleAdminNavigateTab}
          onNavigateCSKH={handleCSKHNavigateTab}
          onNavigateSeller={handleSellerNavigateTab}
          onSwitchRole={handleSwitchRole}
          onSwitchWorkspace={handleSwitchWorkspace}
        />
      )}

      {(currentView === 'confirmation' || currentView === 'checkout') && (
        <CheckoutPage
          cartItems={cartItems}
          onBack={navigateToHome}
          onPaymentSuccess={navigateToResult}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          currentUser={currentUser}
          customerProfile={customers.find(c => c.email === currentUser?.email) || customers[0]}
          onUpdatePoints={(id, delta) => handleUpdateCustomerPoints(id, delta, 0)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'result' && (
        <TransactionResultPage
          lastOrder={lastCompletedOrder}
          onViewOrder={() => setCurrentView('orders')}
          onGoHome={navigateToHome}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'order-detail' && (
        <OrderDetailPage
          cartItems={cartItems}
          onBack={navigateToResult}
          onGoHome={navigateToHome}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'admin' && (
        userRole === UserRole.ADMIN ? (
          <AdminDashboard 
            onLogout={handleLogout} 
            globalSellers={globalSellers} 
            setGlobalSellers={setGlobalSellers} 
            onNavigateToWarehouse={() => setCurrentView('warehouse')}
            onNavigateToCustomers={() => handleCSKHNavigateTab('CUSTOMERS')}
            onNavigateToReturns={() => handleCSKHNavigateTab('RETURNS')}
            onNavigateToHome={navigateToHome}
            onSwitchWorkspace={handleSwitchWorkspace}
            currentUser={currentUser}
            pendingReturnsCount={returnRequests.filter(r => r.status === 'PENDING').length}
            initialTab={adminInitialTab}
          />
        ) : (
          <AccessDenied 
            title="Quản Trị Hệ Thống (Admin Dashboard)"
            requiredRole="Chủ shop (Admin)"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {currentView === 'cskh' && (
        userRole === UserRole.SALES || userRole === UserRole.ADMIN ? (
          <CSKHPortalPage
            returnRequests={returnRequests}
            onProcessReturn={handleProcessReturn}
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomerPoints={(id, delta) => handleUpdateCustomerPoints(id, delta, 0)}
            products={products}
            onBackToHome={navigateToHome}
            onSwitchWorkspace={handleSwitchWorkspace}
            currentUser={currentUser}
            initialTab={cskhInitialTab}
          />
        ) : (
          <AccessDenied 
            title="Cổng CSKH & Vận Hành Bán Hàng"
            requiredRole="NV CSKH / Bán hàng hoặc Admin"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {currentView === 'warehouse' && (
        userRole === UserRole.WAREHOUSE || userRole === UserRole.ADMIN ? (
          <WarehousePage
            products={products}
            importTickets={importTickets}
            onBack={navigateToHome}
            onUpdateStock={handleUpdateStock}
            onAddImportTicket={handleAddImportTicket}
            returnRequests={returnRequests}
            onAddProduct={(newProd) => setProducts(prev => [newProd, ...prev])}
          />
        ) : (
          <AccessDenied 
            title="Quản Lý Kho Hàng & Nhập Hàng"
            requiredRole="Nhân viên Kho hoặc Admin"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {currentView === 'customers' && (
        userRole === UserRole.SALES || userRole === UserRole.ADMIN ? (
          <CustomerManagementPage
            customers={customers}
            onBack={navigateToHome}
            onAddCustomer={handleAddCustomer}
            onUpdatePoints={(id, delta) => handleUpdateCustomerPoints(id, delta, 0)}
            onOpenReturns={() => setCurrentView('returns')}
            onOpenPOS={() => setCurrentView('pos')}
          />
        ) : (
          <AccessDenied 
            title="Quản Lý Khách Hàng (CRM)"
            requiredRole="NV CSKH / Bán hàng hoặc Admin"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {currentView === 'returns' && (
        userRole === UserRole.SALES || userRole === UserRole.ADMIN ? (
          <ReturnManagementPage
            returnRequests={returnRequests}
            onBack={navigateToHome}
            onProcessReturn={handleProcessReturn}
            onOpenCustomers={() => setCurrentView('customers')}
            onOpenPOS={() => setCurrentView('pos')}
          />
        ) : (
          <AccessDenied 
            title="Quản Lý Đổi Trả & Hoàn Tiền"
            requiredRole="NV CSKH / Bán hàng hoặc Admin"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {currentView === 'pos' && (
        userRole === UserRole.SALES || userRole === UserRole.ADMIN ? (
          <POSPage
            products={products}
            customers={customers}
            cashierName={currentUser?.name || 'Nguyễn Thu Ngân (NV Bán hàng POS)'}
            onBack={navigateToHome}
            onDeductStock={handleDeductStock}
            onUpdateCustomerPoints={handleUpdateCustomerPoints}
            onOpenCustomers={() => setCurrentView('customers')}
            onOpenReturns={() => setCurrentView('returns')}
          />
        ) : (
          <AccessDenied 
            title="Điểm Bán Hàng Tại Quầy (POS)"
            requiredRole="Nhân viên Bán hàng hoặc Admin"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {/* Global AI ChatBot positioned at the bottom right with AI Skills & Multi-Persona Engine */}
      <ChatBot 
        products={products}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onSelectProduct={(productId) => {
          setSelectedProductId(productId);
          setCurrentView('product');
        }}
        userRole={userRole}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        currentUser={currentUser}
        customerProfile={customers.find(c => c.email === currentUser?.email) || customers[0]}
        customerOrders={customerOrders as any}
      />

      {/* Global Modals: Đổi mật khẩu (UC01) & Điểm thưởng tích lũy (UC03) */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        userEmail={currentUser?.email || 'customer@test.com'}
      />

      <CustomerLoyaltyModal
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        customer={customers.find(c => c.email === currentUser?.email) || customers[0]}
        onGoShopping={() => {
          setIsLoyaltyModalOpen(false);
          navigateToHome();
        }}
      />
    </>
  );
};

export default App;