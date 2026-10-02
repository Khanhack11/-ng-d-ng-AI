import React, { useState } from 'react';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import TransactionResultPage from './components/TransactionResultPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import MiniCart from './components/MiniCart';
import ShopeeHomePage from './components/ZShop/ShopeeHomePage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ChatBot from './components/ChatBot';
import WarehousePage from './components/WarehousePage';
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
import { ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS_LIST } from './constants';
import { GioHangService, AuthService, AuthUserData, getProductVisualSync, SanPhamAdminService } from './services';

type ViewState = 'home' | 'product' | 'confirmation' | 'checkout' | 'result' | 'order-detail' | 'login' | 'tracking' | 'orders' | 'admin' | 'register' | 'forgot-password' | 'warehouse' | 'customers' | 'returns' | 'pos' | 'cskh';

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  { id: 'CUST-001', name: 'Nguyễn Quốc Khánh', phone: '0901234567', email: 'khanh.nguyen@gmail.com', address: '12 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM', points: 450, tier: 'Vàng', totalSpent: 12500000, createdAt: '10/01/2026' },
  { id: 'CUST-002', name: 'Trần Thị Hà My', phone: '0918765432', email: 'hamy.tran@yahoo.com', address: '45 Nguyễn Huệ, Q.1, TP.HCM', points: 820, tier: 'Kim Cương', totalSpent: 28900000, createdAt: '15/02/2026' },
  { id: 'CUST-003', name: 'Lê Hoàng Nam', phone: '0988112233', email: 'hoangnam@outlook.com', address: '78 Hai Bà Trưng, Q.3, TP.HCM', points: 180, tier: 'Bạc', totalSpent: 4200000, createdAt: '02/03/2026' },
  { id: 'CUST-004', name: 'Phạm Thuỳ Dung', phone: '0977445566', email: 'thuydung.pham@gmail.com', address: '102 Cách Mạng Tháng 8, Q.10, TP.HCM', points: 50, tier: 'Đồng', totalSpent: 1150000, createdAt: '20/04/2026' }
];

const INITIAL_IMPORT_TICKETS: StockImportTicket[] = [
  {
    id: 'ticket-1',
    code: 'NK-2026-0901',
    supplier: 'Apple Vietnam Distribution (Digiworld / Synnex FPT)',
    importDate: '20/09/2026 09:30',
    creator: 'Trần Văn Kho (Thủ kho chính)',
    items: [
      { productId: 'ip-18-promax', productName: 'iPhone 18 Pro Max 256GB | Chính hãng VN/A', quantity: 35, importPrice: 33500000 },
      { productId: 'ip-17-promax', productName: 'iPhone 17 Pro Max 256GB | Chính hãng VN/A', quantity: 38, importPrice: 30200000 }
    ],
    totalQuantity: 73,
    totalCost: 2320100000,
    status: 'COMPLETED',
    note: 'Nhập lô Flagship iPhone 18 Pro Max & iPhone 17 Pro Max chính hãng VN/A'
  },
  {
    id: 'ticket-2',
    code: 'NK-2026-0902',
    supplier: 'CellphoneS Wholesale & Apple Authorized Reseller',
    importDate: '22/09/2026 14:15',
    creator: 'Trần Văn Kho (Thủ kho chính)',
    items: [
      { productId: 'ip-16-promax', productName: 'iPhone 16 Pro Max 256GB | Chính hãng VN/A', quantity: 48, importPrice: 26500000 }
    ],
    totalQuantity: 48,
    totalCost: 1272000000,
    status: 'COMPLETED',
    note: 'Nhập bổ sung iPhone 16 Pro Max theo khuyến nghị kho AI'
  }
];

const INITIAL_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'RET-001',
    orderId: 'DH-20241227-02',
    customerName: 'Phạm Văn C',
    customerPhone: '0933221144',
    items: [{ name: 'iPhone 15 Pro Max 256GB | Chính hãng VN/A', quantity: 1, price: 25990000 }],
    reason: 'Muốn đổi nâng cấp dung lượng từ 256GB lên 512GB (Nguyên seal hộp)',
    refundAmount: 25990000,
    pointsToDeduct: 120,
    status: 'PENDING',
    requestedAt: '22/09/2026 11:20'
  },
  {
    id: 'RET-002',
    orderId: 'DH-20241226-03',
    customerName: 'Hoàng Thị D',
    customerPhone: '0944556677',
    items: [{ name: 'iPhone 16 Pro 128GB | Chính hãng VN/A', quantity: 1, price: 24990000 }],
    reason: 'Đổi màu từ Titan Trắng sang Titan Sa Mạc theo chính sách 1 đổi 1',
    refundAmount: 24990000,
    pointsToDeduct: 110,
    status: 'APPROVED',
    requestedAt: '21/09/2026 16:45'
  }
];

const INITIAL_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'DH-20260908-01',
    createdAt: '23/09/2026 10:15',
    status: OrderStatus.DELIVERED,
    items: [
      {
        id: 'ip-18-promax',
        name: 'iPhone 18 Pro Max 256GB | Chính hãng VN/A',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg',
        size: '256GB',
        color: 'Titan Đỏ Rượu Vang',
        price: 37990000,
        quantity: 1
      }
    ],
    subtotal: 37990000,
    shippingFee: 0,
    discount: 500000,
    totalAmount: 37490000,
    paymentMethod: 'VietQR Napas 24/7',
    isPaid: true,
    shippingAddress: {
      fullName: 'Nguyễn Quốc Khánh',
      phone: '0901234567',
      address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM'
    },
    trackingCode: 'ZSE-88291038VN',
    carrierName: 'ZShop Apple Express 2h',
    estimatedDelivery: '23/09/2026 12:30',
    completedAt: '23/09/2026 12:15'
  },
  {
    id: 'DH-20260907-03',
    createdAt: '22/09/2026 14:00',
    status: OrderStatus.SHIPPING,
    items: [
      {
        id: 'ip-17-promax',
        name: 'iPhone 17 Pro Max 256GB | Chính hãng VN/A',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg',
        size: '256GB',
        color: 'Titan Cam Vũ Trụ',
        price: 34490000,
        quantity: 1
      }
    ],
    subtotal: 34490000,
    shippingFee: 0,
    discount: 500000,
    totalAmount: 33990000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    isPaid: false,
    shippingAddress: {
      fullName: 'Nguyễn Quốc Khánh',
      phone: '0901234567',
      address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM'
    },
    trackingCode: 'ZSE-99120482VN',
    carrierName: 'ZShop Apple Express 2h',
    estimatedDelivery: 'Hôm nay trước 18:00'
  },
  {
    id: 'DH-20260908-04',
    createdAt: '21/09/2026 09:30',
    status: OrderStatus.PENDING,
    items: [
      {
        id: 'ip-16-promax',
        name: 'iPhone 16 Pro Max 256GB | Chính hãng VN/A',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png',
        size: '256GB',
        color: 'Titan Sa Mạc',
        price: 29990000,
        quantity: 1
      }
    ],
    subtotal: 29990000,
    shippingFee: 0,
    discount: 500000,
    totalAmount: 29490000,
    paymentMethod: 'Chuyển khoản VietQR',
    isPaid: true,
    shippingAddress: {
      fullName: 'Nguyễn Quốc Khánh',
      phone: '0901234567',
      address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM'
    },
    trackingCode: 'ZSE-11002349VN',
    carrierName: 'ZShop Apple Express 2h'
  },
  {
    id: 'DH-20241227-02',
    createdAt: '20/09/2026 16:45',
    status: OrderStatus.RETURN_REQUESTED,
    items: [
      {
        id: 'ip-15-promax',
        name: 'iPhone 15 Pro Max 256GB | Chính hãng VN/A',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5_2_1_1.jpg',
        size: '256GB',
        color: 'Titan Tự Nhiên',
        price: 25990000,
        quantity: 1
      }
    ],
    subtotal: 25990000,
    shippingFee: 0,
    discount: 0,
    totalAmount: 25990000,
    paymentMethod: 'COD',
    isPaid: true,
    shippingAddress: {
      fullName: 'Phạm Văn C',
      phone: '0933221144',
      address: 'Số 123, Đường Xuân Thủy, Phổ Yên, Thái Nguyên'
    },
    returnReason: 'Đổi nâng cấp dung lượng từ 256GB lên 512GB',
    returnType: 'EXCHANGE_SIZE',
    exchangeSize: '512GB'
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
        const parsed: CartItem[] = JSON.parse(saved);
        // Lọc chỉ giữ các sản phẩm iPhone trong danh mục < 30 mẫu hiện tại
        return Array.isArray(parsed)
          ? parsed.filter(item => item?.name?.toLowerCase().includes('iphone') || item?.id?.startsWith('ip-'))
          : [];
      }
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
    }
    return [];
  });

  const [lastCompletedOrder, setLastCompletedOrder] = useState<CustomerOrder | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("ip-18-promax");

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

  // Global Staff State for Admin (Chủ cửa hàng) managing Nhân viên Bán hàng & Nhân viên Kho (UC01)
  const [globalSellers, setGlobalSellers] = useState([
      { id: 'NV-BH01', name: 'Nguyễn Thu Ngân', shopName: 'Nhân viên Bán hàng (POS & CSKH)', status: 'APPROVED', date: '10/01/2026', email: 'sales@test.com' },
      { id: 'NV-KH01', name: 'Trần Văn Kho', shopName: 'Nhân viên Kho (Thủ kho chính)', status: 'APPROVED', date: '12/01/2026', email: 'warehouse@test.com' },
      { id: 'NV-BH02', name: 'Lê Thị Hương', shopName: 'Nhân viên Bán hàng (Ca tối)', status: 'PENDING', date: '20/04/2026', email: 'huong.sales@zshop.vn' },
  ]);

  // Tab states for role portals
  const [adminInitialTab, setAdminInitialTab] = useState<'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI'>('DASHBOARD');
  const [cskhInitialTab, setCskhInitialTab] = useState<'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING'>('POS');

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


  // Async Cart Handlers to update SQL & Sync Product Studio Image/Color
  const enrichCartItemWithStudioSync = (item: CartItem): CartItem => {
    const visual = getProductVisualSync(item, MOCK_PRODUCTS_LIST);
    return {
      ...item,
      productId: item.productId || visual.canonicalId,
      image: visual.image,
      color: item.color || visual.colorLabel,
      imgFilter: item.imgFilter || visual.imgFilter,
      studioBg: item.studioBg || visual.studioBg,
      swatchHex: item.swatchHex || visual.swatchHex,
      selected: item.selected !== undefined ? item.selected : true
    };
  };

  // Helper lấy số lượng tồn kho thực tế cho CartItem (TC14 - Anti-Overselling)
  const getProductStockForCartItem = (item: { id?: string; productId?: string; name?: string }): number => {
    const matched = products.find(p => 
      p.id === item.productId || 
      p.id === item.id || 
      p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    ) || MOCK_PRODUCTS_LIST.find(p => 
      p.id === item.productId || 
      p.id === item.id || 
      p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    );
    return matched ? matched.stock : 30;
  };

  const handleAddToCart = async (rawItem: CartItem) => {
    const item = enrichCartItemWithStudioSync(rawItem);
    const availableStock = getProductStockForCartItem(item);

    // TC14: Kiểm tra sản phẩm đã hết hàng
    if (availableStock <= 0) {
      alert(`⚠️ SẢN PHẨM HẾT HÀNG (TC14):\nSản phẩm "${item.name}" hiện không còn trong kho!`);
      return;
    }

    // TC14: Kiểm tra vượt tồn kho khi thêm vào giỏ
    const existing = cartItems.find(i => i.name === item.name && i.size === item.size);
    const currentQtyInCart = existing ? existing.quantity : 0;
    const requestedTotal = currentQtyInCart + item.quantity;

    if (requestedTotal > availableStock) {
      const allowedToAdd = Math.max(0, availableStock - currentQtyInCart);
      alert(`⚠️ CHẶN BÁN VƯỢT TỒN KHO (TC14):\nSản phẩm "${item.name}" trong kho chỉ còn ${availableStock} máy.\nTrong giỏ bạn đã có ${currentQtyInCart} máy. ${allowedToAdd > 0 ? `Bạn chỉ có thể thêm tối đa ${allowedToAdd} máy nữa.` : 'Bạn đã chọn đủ số lượng tối đa trong kho!'}`);
      if (allowedToAdd <= 0) return;
      item.quantity = allowedToAdd;
    }

    // 1. Optimistic UI update
    setCartItems(prev => {
      const existingItem = prev.find(i => i.name === item.name && i.size === item.size);
      if (existingItem) {
        return prev.map(i => i.id === existingItem.id ? { 
          ...i, 
          quantity: Math.min(availableStock, i.quantity + item.quantity), 
          selected: true, 
          image: item.image, 
          imgFilter: item.imgFilter, 
          studioBg: item.studioBg, 
          swatchHex: item.swatchHex,
          stock: availableStock 
        } : i);
      }
      return [...prev.map(i => enrichCartItemWithStudioSync(i)), { ...item, stock: availableStock }];
    });
    setIsMiniCartOpen(true);

    // 2. Sync to Backend
    if (userRole === UserRole.CUSTOMER) {
      await GioHangService.themVaoGio(item, 1);
      const refreshed = await GioHangService.layGioHang(1);
      if (refreshed && refreshed.length > 0) {
        setCartItems(refreshed.map((i: any) => enrichCartItemWithStudioSync({ ...i, id: i.cartItemId?.toString() || i.id?.toString() })));
      }
    }
  };

  // Chọn / Bỏ chọn 1 món hàng trong giỏ để thanh toán riêng
  const handleToggleSelectCartItem = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, selected: item.selected === false ? true : false } : item));
  };

  // Chọn / Bỏ chọn tất cả món trong giỏ
  const handleSelectAllCartItems = (selectAll: boolean) => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: selectAll })));
  };

  // Chia mục chọn mua theo Nhóm / Dòng sản phẩm (vd: Chỉ chọn mua nhóm Flagship 18/17 Series hoặc nhóm iPhone 16/15)
  const handleSelectCartGroup = (groupKey: 'ALL' | 'FLAGSHIP_18_17' | 'PRO_16_15_14' | 'CLASSIC_OTHER') => {
    setCartItems(prev => prev.map(item => {
      if (groupKey === 'ALL') return { ...item, selected: true };
      const visual = getProductVisualSync(item, MOCK_PRODUCTS_LIST);
      return { ...item, selected: visual.categoryGroup === groupKey };
    }));
  };

  // Chỉ chọn mua duy nhất 1 món hàng và chuyển tới thanh toán ngay (Không phải mua cả giỏ hàng)
  const handleBuySingleCartItem = (id: string) => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: item.id === id })));
    setIsMiniCartOpen(false);
    window.scrollTo(0, 0);
    setCurrentView('checkout');
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

    // TC14: Anti-Overselling Guard khi chỉnh số lượng trong giỏ
    const targetItem = cartItems.find(i => i.id === id);
    if (targetItem && newQuantity > targetItem.quantity) {
      const availableStock = getProductStockForCartItem(targetItem);
      if (newQuantity > availableStock) {
        alert(`⚠️ CHẶN BÁN VƯỢT TỒN KHO (TC14):\nSản phẩm "${targetItem.name}" chỉ còn tối đa ${availableStock} máy trong kho!`);
        return;
      }
    }

    // Optimistic UI update
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
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

  // Danh sách các món được khách tích chọn để thanh toán (nếu chưa chọn món nào thì lấy món đầu tiên)
  const selectedCheckoutItems = React.useMemo(() => {
    const checked = cartItems.filter(item => item.selected !== false);
    return checked.length > 0 ? checked : cartItems.slice(0, 1);
  }, [cartItems]);

  // Navigation handlers: Chuyển trực tiếp tới One-Page Checkout với các món đã chọn
  const navigateToConfirmation = () => {
    if (cartItems.length > 0 && cartItems.every(i => i.selected === false)) {
      alert('Vui lòng tích chọn ít nhất 1 sản phẩm bạn muốn mua trong giỏ hàng!');
      return;
    }
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
    const session = AuthService.getSession();
    const isAdmin = currentUser?.role === 'ADMIN' || session?.role === 'ADMIN';
    if (!isAdmin) {
      alert('Chỉ tài khoản Chủ cửa hàng (Admin) mới có quyền truy cập khu vực Quản trị!');
      return;
    }
    setAdminInitialTab(tab);
    if (userRole !== UserRole.ADMIN) {
      setUserRole(UserRole.ADMIN);
    }
    window.scrollTo(0, 0);
    setCurrentView('admin');
  };

  // Điều hướng nhanh đến Cổng Bán Hàng & CSKH Hợp Nhất
  const handleCSKHNavigateTab = (tab: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING' = 'POS') => {
    setCskhInitialTab(tab);
    if (userRole !== UserRole.SALES) {
      setUserRole(UserRole.SALES);
    }
    window.scrollTo(0, 0);
    setCurrentView('cskh');
  };

  // Điều hướng nhanh đến Quản trị Cửa hàng
  const handleSellerNavigateTab = (_tab: 'overview' | 'products' | 'orders' | 'profile' = 'overview') => {
    const session = AuthService.getSession();
    const isAdmin = currentUser?.role === 'ADMIN' || session?.role === 'ADMIN';
    if (!isAdmin) {
      alert('Chỉ tài khoản Chủ cửa hàng (Admin) mới có quyền truy cập!');
      return;
    }
    window.scrollTo(0, 0);
    setCurrentView('admin');
  };

  // Chuyển đổi vai trò làm việc linh hoạt - CHỈ DÀNH CHO ADMIN ĐÃ ĐĂNG NHẬP
  const handleSwitchRole = (role: UserRole) => {
    const session = AuthService.getSession();
    const isAdmin = currentUser?.role === 'ADMIN' || session?.role === 'ADMIN';
    if (!isAdmin) {
      alert('Chỉ tài khoản Chủ cửa hàng (Admin) mới có quyền chuyển đổi giữa các tác nhân!');
      return;
    }
    setUserRole(role);
    if (role === UserRole.ADMIN) {
      setAdminInitialTab('DASHBOARD');
      setCurrentView('admin');
    } else if (role === UserRole.SALES) {
      setCskhInitialTab('POS');
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
    const session = AuthService.getSession();
    const isAdmin = currentUser?.role === 'ADMIN' || session?.role === 'ADMIN';
    if (!isAdmin) {
      return;
    }
    if (workspace === 'ADMIN') {
      handleSwitchRole(UserRole.ADMIN);
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

    // Tự động lưu đơn hàng mới vào danh sách Đơn mua của khách hàng (Chỉ gồm các món đã tích chọn mua)
    const purchasedItems = selectedCheckoutItems;
    if (orderInfo && purchasedItems.length > 0) {
      createdOrder = {
        id: orderInfo.orderId || `DH-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: OrderStatus.PROCESSING,
        items: purchasedItems.map(c => ({
          id: c.id,
          name: c.name,
          image: c.image,
          size: c.size,
          price: c.price,
          quantity: c.quantity
        })),
        subtotal: purchasedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        shippingFee: orderInfo.shippingMethod === 'express' ? 50000 : 30000,
        discount: 50000,
        totalAmount: orderInfo.totalAmount || purchasedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
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

    // TC14: DEDUCT STOCK (Tự động trừ số lượng tồn kho sản phẩm khi đặt hàng thành công)
    if (purchasedItems && purchasedItems.length > 0) {
      setProducts(prevProducts => {
        return prevProducts.map(prod => {
          const matchedItem = purchasedItems.find(it => 
            it.id === prod.id || 
            it.productId === prod.id || 
            it.name.trim().toLowerCase() === prod.name.trim().toLowerCase()
          );
          if (matchedItem) {
            const newStock = Math.max(0, prod.stock - matchedItem.quantity);
            // Sync to backend DB if possible
            SanPhamAdminService.capNhatSanPham(prod.id, { stock: newStock }).catch(() => {});
            return {
              ...prod,
              stock: newStock,
              soldCount: (prod.soldCount || 0) + matchedItem.quantity
            };
          }
          return prod;
        });
      });
    }

    // Chỉ xóa những sản phẩm đã chọn mua khỏi giỏ hàng, GIỮ LẠI các sản phẩm chưa chọn mua trong giỏ!
    const purchasedIds = new Set(purchasedItems.map(i => i.id));
    setCartItems(prev => {
      const remaining = prev.filter(item => !purchasedIds.has(item.id));
      return remaining;
    });
    if (userRole === UserRole.CUSTOMER) {
      purchasedItems.forEach(item => {
        if (!item.id.startsWith('mock')) {
          GioHangService.xoaKhoiGio(item.id, 1);
        }
      });
    }

    setCurrentView('result');
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
    _refundBankInfo?: string
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
    if (userRole === UserRole.ADMIN) {
      window.scrollTo(0, 0);
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  };

  const navigateToBecomeSeller = () => {
    setCurrentView('login');
  };

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

      alert(`✅ Đã xử lý hoàn tất!\n- Hoàn tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(target.refundAmount)}\n- Đã thu hồi: ${target.pointsToDeduct} điểm thưởng tích lũy của khách hàng.`);
    }
  };

  const handleLoginSuccess = (role: 'CUSTOMER' | 'ADMIN' | 'SALES' | 'WAREHOUSE') => {
    const session = AuthService.getSession();
    setCurrentUser(session?.user || null);
    if (role === 'ADMIN') {
      setUserRole(UserRole.ADMIN);
      setAdminInitialTab('DASHBOARD');
      setCurrentView('admin');
    } else if (role === 'SALES') {
      setUserRole(UserRole.SALES);
      setCskhInitialTab('POS');
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
          products={products}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={navigateToConfirmation}
          onAddToCart={handleAddToCart}
          onClearCart={handleClearAllCart}
          onToggleSelectItem={handleToggleSelectCartItem}
          onSelectAllItems={handleSelectAllCartItems}
          onSelectCartGroup={handleSelectCartGroup}
          onBuySingleItem={handleBuySingleCartItem}
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
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          customerProfile={customers.find(c => c.email === currentUser?.email) || customers[0]}
          customerOrders={customerOrders as any}
        />
      )}

      {currentView === 'product' && (
        <ProductDetailPage
          productId={selectedProductId}
          products={products}
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

      {(currentView === 'tracking' || currentView === 'orders' || currentView === 'order-detail') && (
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
          cartItems={selectedCheckoutItems}
          allCartItems={cartItems}
          products={products}
          onToggleSelectItem={handleToggleSelectCartItem}
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

      {currentView === 'admin' && (
        userRole === UserRole.ADMIN ? (
          <AdminDashboard 
            onLogout={handleLogout} 
            globalSellers={globalSellers} 
            setGlobalSellers={setGlobalSellers} 
            onNavigateToWarehouse={() => setCurrentView('warehouse')}
            onNavigateToCustomers={() => handleCSKHNavigateTab('POS')}
            onNavigateToReturns={() => handleCSKHNavigateTab('RETURNS')}
            onNavigateToHome={navigateToHome}
            onSwitchWorkspace={handleSwitchWorkspace}
            onSwitchRole={handleSwitchRole}
            currentUser={currentUser}
            pendingReturnsCount={returnRequests.filter(r => r.status === 'PENDING').length}
            initialTab={adminInitialTab}
          />
        ) : (
          <AccessDenied 
            title="Quản Trị Cửa Hàng (Chủ Cửa Hàng)"
            requiredRole="Chủ cửa hàng (Admin)"
            currentRole={userRole}
            onGoHome={navigateToHome}
            onGoLogin={() => setCurrentView('login')}
          />
        )
      )}

      {(currentView === 'cskh' || currentView === 'customers' || currentView === 'returns' || currentView === 'pos') && (
        userRole === UserRole.SALES || userRole === UserRole.ADMIN ? (
          <CSKHPortalPage
            returnRequests={returnRequests}
            onProcessReturn={handleProcessReturn}
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomerPoints={(id, delta, spent) => handleUpdateCustomerPoints(id, delta, spent || 0)}
            products={products}
            onBackToHome={navigateToHome}
            onSwitchWorkspace={handleSwitchWorkspace}
            currentUser={currentUser}
            initialTab={
              currentView === 'customers' ? 'CUSTOMERS' :
              currentView === 'returns' ? 'RETURNS' :
              currentView === 'pos' ? 'POS' :
              cskhInitialTab
            }
            userRole={userRole}
            onSwitchRole={handleSwitchRole}
            onLogout={handleLogout}
            onDeductStock={handleDeductStock}
            onNavigateAdminTab={handleAdminNavigateTab}
            onNavigateWarehouse={() => setCurrentView('warehouse')}
          />
        ) : (
          <AccessDenied 
            title="Bàn Làm Việc Nhân Viên Bán Hàng (POS & CSKH)"
            requiredRole="Nhân viên Bán hàng hoặc Chủ cửa hàng"
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
            userRole={userRole}
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            onLogout={handleLogout}
            onNavigateAdminTab={handleAdminNavigateTab}
            onNavigateCSKH={handleCSKHNavigateTab}
          />
        ) : (
          <AccessDenied 
            title="Quản Lý Kho Hàng & Nhập Hàng VN/A"
            requiredRole="Nhân viên Kho hoặc Chủ cửa hàng"
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
        onOpenCart={() => setIsMiniCartOpen(true)}
        onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
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