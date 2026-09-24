import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Search, 
  TrendingUp, Plus, Edit, CheckCircle, XCircle, Truck, Package, 
  DollarSign, BarChart3, Calendar, Image as ImageIcon, ChevronDown, 
  ShieldCheck, Store, FileSpreadsheet, Printer, RotateCcw, Sparkles, 
  Boxes, Smartphone, Flame, CreditCard
} from 'lucide-react';
import { MOCK_PRODUCTS_LIST, MOCK_ORDER } from '../constants';
import { ProductDetail, OrderStatus, UserRole } from '../types';
import PortalTopBar, { PortalWorkspace } from './PortalTopBar';

const GENERATE_MOCK_ORDERS = () => [
  { ...MOCK_ORDER, id: 'DH-20260924-01', item: 'iPhone 18 Pro Max 256GB (Titan Đỏ Rượu Vang)', status: OrderStatus.PAID, total: 37990000, customer: 'Nguyễn Quốc Khánh', date: '24/09/2026 10:15' },
  { ...MOCK_ORDER, id: 'DH-20260924-02', item: 'iPhone 17 Pro Max 256GB (Titan Cam Vũ Trụ)', status: OrderStatus.PENDING, total: 34490000, customer: 'Trần Thị Hà My', date: '24/09/2026 09:40' },
  { ...MOCK_ORDER, id: 'DH-20260923-03', item: 'iPhone 16 Pro Max 256GB (Titan Sa Mạc)', status: OrderStatus.SHIPPING, total: 29990000, customer: 'Lê Hoàng Nam', date: '23/09/2026 16:20' },
  { ...MOCK_ORDER, id: 'DH-20260923-04', item: 'iPhone 17 Air 256GB (Xanh Băng Giá)', status: OrderStatus.DELIVERED, total: 26990000, customer: 'Phạm Thuỳ Dung', date: '23/09/2026 11:05' },
  { ...MOCK_ORDER, id: 'DH-20260922-05', item: 'iPhone 18 Pro 128GB (Xanh Lục Bảo)', status: OrderStatus.PAID, total: 31990000, customer: 'Hoàng Minh Tuấn', date: '22/09/2026 18:30' },
];

const REVENUE_DATA = [
  { day: 'T2', value: 68900000 },
  { day: 'T3', value: 94500000 },
  { day: 'T4', value: 82000000 },
  { day: 'T5', value: 115400000 },
  { day: 'T6', value: 138900000 },
  { day: 'T7', value: 176500000 },
  { day: 'CN', value: 159200000 },
];

const IPHONE_CATEGORIES = [
  'iPhone 18 Series (Flagship 2026)',
  'iPhone 17 Series',
  'iPhone 16 Series',
  'iPhone 15 Series',
  'iPhone 14 Series',
  'iPhone 13 Series',
  'iPhone 12 Series',
  'iPhone 11 Series',
  'iPhone Cổ Điển & Sưu Tầm (4s - XS Max)'
];

const getAdminColorBadge = (id: string, colorName: string = '') => {
  const c = colorName.toLowerCase();
  if (id === 'ip-18-promax' || c.includes('đỏ rượu vang')) return { dot: '#9e1b32', badge: 'bg-rose-100 text-rose-900 border-rose-300', imgFilter: 'hue-rotate(332deg) saturate(1.45)' };
  if (id === 'ip-18-pro' || c.includes('lục bảo')) return { dot: '#0f5e46', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', imgFilter: 'hue-rotate(122deg) saturate(1.35)' };
  if (id === 'ip-18' || c.includes('hồng ánh sao')) return { dot: '#d96b94', badge: 'bg-pink-100 text-pink-900 border-pink-300', imgFilter: 'hue-rotate(295deg) saturate(1.25)' };
  if (id === 'ip-17-promax' || c.includes('cam vũ trụ')) return { dot: '#e85d24', badge: 'bg-orange-100 text-orange-900 border-orange-300', imgFilter: 'saturate(1.18)' };
  if (id === 'ip-17-pro' || c.includes('xanh lam')) return { dot: '#1d4ed8', badge: 'bg-blue-100 text-blue-900 border-blue-300', imgFilter: 'hue-rotate(192deg) saturate(1.45)' };
  if (id === 'ip-17-air' || c.includes('băng giá')) return { dot: '#38bdf8', badge: 'bg-sky-100 text-sky-900 border-sky-300', imgFilter: 'none' };
  if (id === 'ip-16-promax' || c.includes('sa mạc') || c.includes('vàng')) return { dot: '#c5a059', badge: 'bg-amber-100 text-amber-900 border-amber-300', imgFilter: 'sepia(0.28) saturate(1.35)' };
  return { dot: '#78716c', badge: 'bg-stone-100 text-stone-800 border-stone-300', imgFilter: 'none' };
};

interface AdminDashboardProps {
  onLogout: () => void;
  globalSellers?: any[];
  setGlobalSellers?: any;
  onNavigateToWarehouse?: () => void;
  onNavigateToCustomers?: () => void;
  onNavigateToReturns?: () => void;
  onNavigateToHome?: () => void;
  onSwitchWorkspace?: (workspace: PortalWorkspace) => void;
  onSwitchRole?: (role: UserRole) => void;
  currentUser?: any;
  pendingReturnsCount?: number;
  initialTab?: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  onNavigateToWarehouse,
  onNavigateToCustomers,
  onNavigateToReturns,
  onNavigateToHome,
  onSwitchWorkspace,
  onSwitchRole,
  currentUser,
  pendingReturnsCount = 0,
  initialTab = 'DASHBOARD'
}) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Danh mục 25 mã iPhone độc quyền của Cửa hàng
  const [products, setProducts] = useState<ProductDetail[]>(MOCK_PRODUCTS_LIST);
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  
  const [productForm, setProductForm] = useState<Partial<ProductDetail>>({
    name: '', price: 34990000, stock: 25, description: '', images: [''], category: 'iPhone 18 Series (Flagship 2026)', colors: ['Titan Đỏ Rượu Vang'], sizes: ['256GB', '512GB', '1TB']
  });

  // Đơn hàng cửa hàng
  const [orders, setOrders] = useState<any[]>(GENERATE_MOCK_ORDERS);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Nhân sự nội bộ cửa hàng nhỏ (Chỉ Nhân viên Bán hàng & Nhân viên Kho - UC01)
  const [localStaff, setLocalStaff] = useState([
    { id: 'NV-BH01', name: 'Nguyễn Thu Ngân', roleTitle: 'Nhân viên Bán hàng (Thu ngân POS & Tư vấn)', roleCode: 'SALES', status: 'APPROVED', date: '10/01/2026', email: 'sales@test.com', shift: 'Ca Sáng & Chiều' },
    { id: 'NV-KH01', name: 'Trần Văn Kho', roleTitle: 'Nhân viên Kho (Thủ kho máy VN/A & Kiểm định)', roleCode: 'WAREHOUSE', status: 'APPROVED', date: '12/01/2026', email: 'warehouse@test.com', shift: 'Toàn thời gian' },
    { id: 'NV-BH02', name: 'Lê Thị Hương', roleTitle: 'Nhân viên Bán hàng (Tư vấn & Đổi trả 1-1)', roleCode: 'SALES', status: 'APPROVED', date: '20/04/2026', email: 'huong.sales@thegioiiphone.vn', shift: 'Ca Tối' },
    { id: 'NV-KH02', name: 'Phạm Hoàng Bảo', roleTitle: 'Nhân viên Kho (Nhập lô Apple & Check IMEI)', roleCode: 'WAREHOUSE', status: 'PENDING', date: '05/09/2026', email: 'bao.warehouse@thegioiiphone.vn', shift: 'Ca Chiều' },
  ]);
  
  const [config, setConfig] = useState({ maintenance: false, autoApprove: true, vipPointRate: 1, tradeInSubsidy: 3000000 });

  // --- HỆ THỐNG AI CHỦ CỬA HÀNG (THEO BẢNG ĐẶC TẢ USE CASE: AI CHATBOT • AI FORECASTING & ANALYTICS • AI TEXT-TO-DATA) ---
  const [aiSubModule, setAiSubModule] = useState<'ALL' | 'TEXT_TO_DATA' | 'FORECASTING' | 'CHATBOT_NLP'>('ALL');
  const [textToDataInput, setTextToDataInput] = useState<string>('Mặt hàng nào bán chậm nhất?');
  const [activeQueryType, setActiveQueryType] = useState<'SLOWEST_SELLING' | 'BEST_SELLING' | 'LOW_STOCK' | 'REVENUE_BY_SERIES' | 'HIGH_VALUE' | 'NEW_COLORS'>('SLOWEST_SELLING');
  const [aiActionToast, setAiActionToast] = useState<string | null>(null);
  const [chatbotTestInput, setChatbotTestInput] = useState<string>('18prm màu mới giá bn sốp ơi có trả góp ko?');

  const triggerAiToast = (msg: string) => {
    setAiActionToast(msg);
    setTimeout(() => setAiActionToast(null), 3500);
  };

  // Trình biên dịch Ngôn ngữ tự nhiên sang Truy vấn CSDL (AI Text-to-Data Engine)
  const handleRunTextToData = (rawQuestion: string) => {
    setTextToDataInput(rawQuestion);
    const q = rawQuestion.toLowerCase();
    if (q.includes('chậm') || q.includes('ế') || q.includes('ít người mua') || q.includes('tồn đọng')) {
      setActiveQueryType('SLOWEST_SELLING');
    } else if (q.includes('chạy') || q.includes('hot') || q.includes('nhiều nhất') || q.includes('top bán')) {
      setActiveQueryType('BEST_SELLING');
    } else if (q.includes('tồn kho') || q.includes('sắp hết') || q.includes('nhập') || q.includes('cần nhập')) {
      setActiveQueryType('LOW_STOCK');
    } else if (q.includes('doanh thu') || q.includes('dòng') || q.includes('series')) {
      setActiveQueryType('REVENUE_BY_SERIES');
    } else if (q.includes('màu mới') || q.includes('burgundy') || q.includes('glacier') || q.includes('mocha')) {
      setActiveQueryType('NEW_COLORS');
    } else if (q.includes('giá cao') || q.includes('đắt') || q.includes('lợi nhuận') || q.includes('ultra') || q.includes('1tb')) {
      setActiveQueryType('HIGH_VALUE');
    } else {
      setActiveQueryType('SLOWEST_SELLING');
    }
    if (activeTab !== 'AI_BI') {
      setActiveTab('AI_BI');
    }
  };

  // Dữ liệu kết quả thực thi AI Text-to-Data trực tiếp trên CSDL 45 mẫu iPhone
  const textToDataResult = React.useMemo(() => {
    const copy = [...products];
    if (activeQueryType === 'SLOWEST_SELLING') {
      const rows = copy.sort((a, b) => a.soldCount - b.soldCount).slice(0, 6);
      return {
        intent: 'FIND_SLOWEST_SELLING_PRODUCTS (Tìm mặt hàng bán chậm nhất để kích cầu / xả kho)',
        sql: `SELECT id, name, category, colors[0] AS flagship_color, soldCount, stock, price\nFROM ZShop_Products\nORDER BY soldCount ASC, stock DESC\nLIMIT 6;`,
        summary: `Phát hiện ${rows.length} mặt hàng có lượng bán thấp nhất (từ ${rows[0]?.soldCount || 0} đến ${rows[rows.length - 1]?.soldCount || 0} máy). Khuyến nghị áp dụng mã giảm giá kích cầu -5% hoặc tặng kèm gói Bảo hành VIP để giải phóng vốn lưu động.`,
        rows
      };
    }
    if (activeQueryType === 'BEST_SELLING') {
      const rows = copy.sort((a, b) => b.soldCount - a.soldCount).slice(0, 6);
      return {
        intent: 'FIND_TOP_BEST_SELLERS (Tìm mặt hàng chủ lực bán chạy nhất)',
        sql: `SELECT id, name, category, soldCount, stock, (soldCount * price) AS total_revenue\nFROM ZShop_Products\nORDER BY soldCount DESC\nLIMIT 6;`,
        summary: `Top 6 dòng iPhone bán chạy nhất đóng góp tỷ trọng lớn nhất cho cửa hàng (dẫn đầu bởi ${rows[0]?.name} với ${rows[0]?.soldCount} máy đã bán).`,
        rows
      };
    }
    if (activeQueryType === 'LOW_STOCK') {
      const rows = copy.sort((a, b) => a.stock - b.stock).slice(0, 6);
      return {
        intent: 'CHECK_LOW_INVENTORY_ALERT (Kiểm tra mặt hàng sắp chạm đáy tồn kho cần nhập gấp)',
        sql: `SELECT id, name, stock, soldCount, price\nFROM ZShop_Products\nWHERE stock <= 20\nORDER BY stock ASC, soldCount DESC\nLIMIT 6;`,
        summary: `Có ${rows.length} mặt hàng có mức tồn kho thấp nhất (chỉ còn từ ${rows[0]?.stock} máy). Cần lập phiếu nhập bổ sung ngay để không đứt hàng cuối tuần.`,
        rows
      };
    }
    if (activeQueryType === 'NEW_COLORS') {
      const rows = copy.filter(p => (p.colors?.[0] || '').includes('(Mới)') || p.id.includes('ip-18')).slice(0, 6);
      return {
        intent: 'FILTER_APPLE_2026_NEW_COLORS (Truy vấn các mẫu iPhone phiên bản Màu Mới Nhất Apple.com)',
        sql: `SELECT id, name, colors, stock, soldCount, price\nFROM ZShop_Products\nWHERE colors LIKE '%(Mới)%' OR category LIKE '%iPhone 18%'\nORDER BY price DESC LIMIT 6;`,
        summary: `Toàn bộ ${rows.length} phiên bản màu mới nhất hãng Apple (Đỏ Rượu Vang Burgundy Titan, Xanh Băng Hà Glacier Blue, Cà Phê Mocha Titan) đã được đồng bộ hình ảnh Studio và sẵn hàng giao ngay.`,
        rows
      };
    }
    if (activeQueryType === 'HIGH_VALUE') {
      const rows = copy.sort((a, b) => b.price - a.price).slice(0, 6);
      return {
        intent: 'ANALYZE_HIGH_MARGIN_FLAGSHIPS (Phân tích nhóm máy cao cấp biên lợi nhuận gộp cao nhất)',
        sql: `SELECT id, name, price, stock, (price * 0.145) AS est_gross_profit\nFROM ZShop_Products\nWHERE price >= 35000000\nORDER BY price DESC LIMIT 6;`,
        summary: `Nhóm 6 siêu phẩm iPhone Ultra & Pro Max 1TB/512GB có giá trị đơn hàng cao nhất (từ ${(rows[rows.length - 1]?.price / 1000000).toFixed(1)}Tr đến ${(rows[0]?.price / 1000000).toFixed(1)}Tr/máy), mang lại biên lợi nhuận gộp ~14.5%/máy.`,
        rows
      };
    }
    // REVENUE_BY_SERIES
    const rows = copy.sort((a, b) => (b.soldCount * b.price) - (a.soldCount * a.price)).slice(0, 6);
    return {
      intent: 'AGGREGATE_REVENUE_BY_MODEL (Tổng hợp doanh thu lũy kế theo từng dòng máy)',
      sql: `SELECT id, name, category, soldCount, price, (soldCount * price) AS cumulative_revenue\nFROM ZShop_Products\nORDER BY cumulative_revenue DESC LIMIT 6;`,
      summary: `Bảng xếp hạng các dòng máy mang về doanh thu lũy kế cao nhất cho Thế Giới iPhone.`,
      rows
    };
  }, [products, activeQueryType]);

  // Thao tác 1 chạm cho Chủ cửa hàng ngay trên bảng kết quả AI: Nhập thêm hàng hoặc Giảm giá kích cầu
  const handleQuickRestockProduct = (productId: string, addQty: number = 15) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + addQty } : p));
    const target = products.find(p => p.id === productId);
    triggerAiToast(`✅ Đã lập lệnh nhập kho +${addQty} máy cho "${target?.name}"! Tồn kho mới: ${(target?.stock || 0) + addQty} máy.`);
  };

  const handleQuickPromoSlowItem = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const newPrice = Math.round((p.price * 0.95) / 10000) * 10000;
      return { ...p, price: newPrice, discountRate: Math.min(35, (p.discountRate || 10) + 5) };
    }));
    const target = products.find(p => p.id === productId);
    triggerAiToast(`🏷️ Đã áp dụng ưu đãi kích cầu -5% cho mặt hàng bán chậm "${target?.name}"!`);
  };

  const handleApproveAllAiRestock = () => {
    setProducts(prev => prev.map(p => p.stock <= 22 ? { ...p, stock: p.stock + 15 } : p));
    triggerAiToast(`🚀 AI Forecasting: Đã duyệt nhập bổ sung +15 máy cho toàn bộ các mặt hàng tồn kho thấp!`);
  };

  const handleToggleStaffStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setLocalStaff(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  // Xuất Excel CSV
  const handleExportExcel = () => {
    const headers = "Mã Đơn Hàng,Ngày Đặt,Khách Hàng,Dòng Máy iPhone,Tổng Tiền (VNĐ),Trạng Thái\n";
    const rows = orders.map(o => `"${o.id}","${o.date}","${o.customer}","${o.item || 'iPhone VN/A'}",${o.total},"${o.status}"`).join("\n");
    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_Cao_Doanh_Thu_TheGioiIphone_${new Date().toLocaleDateString('en-CA')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleOpenProductModal = (product?: ProductDetail) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({ 
        name: 'iPhone 18 Ultra 512GB | Chính hãng VN/A', 
        price: 41990000, 
        stock: 20, 
        description: 'Flagship iPhone 18 Ultra khung Titanium cấp độ 5, bảo hành chính hãng Apple VN/A 12 tháng.', 
        images: ['https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg'], 
        category: 'iPhone 18 Series (Flagship 2026)',
        colors: ['Titan Đỏ Rượu Vang (Burgundy)'], 
        sizes: ['256GB', '512GB', '1TB'] 
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as ProductDetail : p));
      alert(`✅ Đã cập nhật giá bán & tồn kho cho "${productForm.name}" thành công!`);
    } else {
      const created: ProductDetail = {
        ...(productForm as ProductDetail),
        id: `ip-custom-${Date.now().toString().slice(-4)}`,
        rating: 5.0,
        reviewCount: 24,
        soldCount: 15,
        shippingFee: 0,
        shippingEstimate: 'Giao hỏa tốc 2h'
      };
      setProducts(prev => [created, ...prev]);
      alert(`✅ Đã thêm mẫu máy mới "${created.name}" vào cửa hàng Thế Giới iPhone!`);
    }
    setIsProductModalOpen(false);
  };

  const SimpleLineChart = ({ data }: { data: typeof REVENUE_DATA }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / maxVal) * 85;
      return `${x},${y}`;
    }).join(' ');

    const formatCurrency = (val: number) => (val / 1000000).toFixed(1) + ' Tr';

    return (
      <div className="w-full h-56 relative mt-4 select-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible font-sans">
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e7e5e4" strokeWidth="0.5" />
          ))}
          <defs>
            <linearGradient id="titanChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c6f46" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8c6f46" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,100 ${points} 100,100`} fill="url(#titanChartGradient)" />
          <polyline points={points} fill="none" stroke="#8c6f46" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.value / maxVal) * 85;
            return (
              <g key={i} className="group cursor-pointer">
                <circle cx={x} cy={y} r="2.5" className="fill-[#1e1d1a] stroke-[#d4b996] stroke-[1]" />
                <foreignObject x={x - 15} y={y - 12} width="30" height="15" className="opacity-0 group-hover:opacity-100 transition-all pointer-events-none overflow-visible">
                  <div className="bg-[#1e1d1a] text-[#e5c9a3] text-[3.5px] font-bold px-1.5 py-0.5 rounded shadow-lg -translate-x-1/2 -translate-y-full whitespace-nowrap absolute left-1/2 top-0 border border-[#c5a880]/40">
                    {formatCurrency(d.value)}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between mt-3 text-[11px] font-black text-stone-600 uppercase">
          {data.map(d => <span key={d.day} className="w-8 text-center">{d.day}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C4B49E] via-[#BBA992] to-[#B2A088] flex flex-col font-sans">
      {/* 1. Unified Boutique TopBar */}
      <PortalTopBar
        userRole="ADMIN"
        currentUser={currentUser}
        pendingReturnsCount={pendingReturnsCount}
        onNavigateAdminTab={(tab) => setActiveTab(tab)}
        onNavigateWarehouse={onNavigateToWarehouse}
        onNavigateCSKH={() => onNavigateToReturns?.()}
        onNavigateHome={onNavigateToHome}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Luxury Titanium Sidebar */}
        <aside className="w-64 bg-[#1e1d1a] text-stone-100 flex-shrink-0 hidden lg:flex flex-col border-r border-[#c5a880]/30">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#d4b996] to-[#8c6f46] rounded-xl flex items-center justify-center text-[#1e1d1a] font-black shadow-md">
                <Smartphone size={20} />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white leading-none">
                  THẾ GIỚI <span className="text-[#e5c9a3]">IPHONE</span>
                </h1>
                <p className="text-[10px] text-[#c5a880] font-bold uppercase tracking-wider mt-1">
                  Admin • Chủ Cửa Hàng
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-3 space-y-1.5 mt-3 overflow-y-auto text-xs">
            <div className="text-[10px] font-black text-[#c5a880] uppercase px-3 py-1">Điều Hành Cửa Hàng Nhỏ</div>
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                activeTab === 'DASHBOARD' ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] shadow-md' : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <BarChart3 size={17} /> Báo Cáo Doanh Thu (UC06)
            </button>
            <button
              onClick={() => setActiveTab('AI_BI')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                activeTab === 'AI_BI' ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] shadow-md' : 'text-[#e5c9a3] hover:bg-white/5'
              }`}
            >
              <Sparkles size={17} className="text-amber-400" /> AI Cố Vấn Chủ Shop (UC09)
            </button>
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                activeTab === 'PRODUCTS' ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] shadow-md' : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Smartphone size={17} /> Quản Lý 25 Mã iPhone (UC02)
            </button>
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                activeTab === 'ORDERS' ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] shadow-md' : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Package size={17} /> Đơn Đặt Máy ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('SELLERS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                activeTab === 'SELLERS' ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] shadow-md' : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Users size={17} /> Nhân Sự Cửa Hàng (UC01)
            </button>
            <button
              onClick={() => setActiveTab('CONFIG')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                activeTab === 'CONFIG' ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] shadow-md' : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Settings size={17} /> Cấu Hình Shop & Điểm VIP
            </button>

            <div className="text-[10px] font-black text-[#c5a880] uppercase px-3 pt-4 pb-1 border-t border-white/10 mt-3">
              Kiểm Tra Nghiệp Vụ Nhân Viên
            </div>
            {onNavigateToWarehouse && (
              <button onClick={onNavigateToWarehouse} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-300 hover:bg-white/5 font-semibold cursor-pointer">
                <Boxes size={16} className="text-amber-400" /> Bàn Làm Việc Nhân Viên Kho
              </button>
            )}
            {onNavigateToCustomers && (
              <button onClick={onNavigateToCustomers} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-300 hover:bg-white/5 font-semibold cursor-pointer">
                <CreditCard size={16} className="text-sky-400" /> Bàn Làm Việc NV Bán Hàng
              </button>
            )}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-1.5">
            {onNavigateToHome && (
              <button onClick={onNavigateToHome} className="flex items-center gap-2 text-[#e5c9a3] hover:bg-white/5 transition-colors text-xs font-bold w-full px-3 py-2 rounded-xl cursor-pointer">
                <Store size={15} /> Ra Trang Chủ Showroom
              </button>
            )}
            <button onClick={onLogout} className="flex items-center gap-2 text-rose-300 hover:bg-rose-950/40 transition-colors text-xs font-bold w-full px-3 py-2 rounded-xl cursor-pointer">
              <LogOut size={15} /> Đăng Xuất Quản Trị
            </button>
          </div>
        </aside>

        {/* 3. Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="bg-[#faf8f5] border-b border-[#d4b996]/60 flex flex-wrap items-center justify-between px-6 py-3.5 shrink-0 gap-3 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-stone-900 text-base">
                  {activeTab === 'DASHBOARD' ? 'Tổng Quan Doanh Thu & Top Model iPhone Hot Hit (UC06)' : 
                   activeTab === 'AI_BI' ? 'Thế Giới iPhone AI — Cố Vấn Kinh Doanh Cho Chủ Cửa Hàng (UC09)' :
                   activeTab === 'PRODUCTS' ? 'Quản Lý Bảng Giá & 25 Mã iPhone Chính Hãng VN/A (UC02)' : 
                   activeTab === 'SELLERS' ? 'Quản Lý Nhân Sự Cửa Hàng Nhỏ: NV Bán Hàng & NV Kho (UC01)' :
                   activeTab === 'CONFIG' ? 'Cấu Hình Cửa Hàng Thế Giới iPhone & Chính Sách Thu Cũ Đổi Mới' :
                   'Điều Phối Đơn Đặt Mua iPhone Online & Giao Hỏa Tốc 2h'}
                </h2>
              </div>
              <p className="text-[11px] text-stone-500">
                Mô hình Cửa Hàng Bán Lẻ iPhone Chuyên Biệt (4 Tác nhân: Chủ cửa hàng, Nhân viên Bán hàng, Nhân viên Kho, Khách hàng)
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet size={14} /> Xuất Báo Cáo Excel
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#1e1d1a] text-[#e5c9a3] rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> In Báo Cáo PDF
              </button>
            </div>
          </header>

          <div className="p-6 space-y-6 max-w-[1400px] w-full mx-auto">
            {/* THÔNG BÁO THAO TÁC AI THỜI GIAN THỰC */}
            {aiActionToast && (
              <div className="bg-emerald-900 text-emerald-100 border border-emerald-500/60 px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>{aiActionToast}</span>
                </div>
                <button onClick={() => setAiActionToast(null)} className="text-emerald-300 hover:text-white cursor-pointer">✕</button>
              </div>
            )}

            {/* --- TAB: DASHBOARD (REVENUE & HOT HIT MODELS + QUICK AI TEXT-TO-DATA BAR) --- */}
            {activeTab === 'DASHBOARD' && (
              <div className="space-y-6 animate-fade-in">
                {/* THANH TRUY VẤN NHANH HỆ THỐNG AI CHỦ CỬA HÀNG (3-IN-1 SPEC MODULE) */}
                <div className="bg-gradient-to-r from-[#1e1d1a] via-[#2c251d] to-[#1e1d1a] text-white p-5 rounded-2xl shadow-lg border border-[#c5a880]/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[#e5c9a3] text-[10px] font-black uppercase tracking-wider">
                        Hệ Thống AI Chủ Cửa Hàng (3-in-1)
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold">● Đã đồng bộ {products.length} mẫu iPhone VN/A</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      AI Text-to-Data • AI Forecasting & Analytics • AI Chatbot NLP
                    </h3>
                    <p className="text-xs text-stone-300">
                      Hỏi trực tiếp bằng ngôn ngữ tự nhiên (VD: <em>"Mặt hàng nào bán chậm nhất?"</em>, <em>"Danh mục hàng cần nhập?"</em>) để chuyển đổi thành truy vấn CSDL.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {[
                      { label: '📉 Mặt hàng nào bán chậm nhất?', q: 'Mặt hàng nào bán chậm nhất?' },
                      { label: '📦 Khuyến nghị hàng cần nhập', q: 'Sản phẩm nào tồn kho thấp cần nhập gấp?' },
                      { label: '🔥 Top máy bán chạy nhất', q: 'Mặt hàng nào bán chạy nhất?' }
                    ].map((btn, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRunTextToData(btn.q)}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-[#d4b996] text-[#e5c9a3] hover:text-[#1e1d1a] border border-[#c5a880]/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        {btn.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setActiveTab('AI_BI')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles size={14} /> Mở Trung Tâm AI Chủ Shop
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#d4b996]/60 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-500">Doanh thu tuần (iPhone VN/A)</p>
                      <h3 className="text-2xl font-black text-stone-900 mt-1">835.4 Tr ₫</h3>
                      <p className="text-xs mt-1.5 font-bold text-emerald-700 flex items-center gap-1">
                        <TrendingUp size={12} /> +18.4% nhờ iPhone 18 Series
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1e1d1a] text-[#e5c9a3]">
                      <DollarSign size={22} />
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#d4b996]/60 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-500">Tổng danh mục CSDL iPhone</p>
                      <h3 className="text-2xl font-black text-stone-900 mt-1">{products.length} Mẫu Máy</h3>
                      <p className="text-xs mt-1.5 font-bold text-[#8c6f46]">Đầy đủ iPhone 18 Ultra / PRM 2026</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-900 text-emerald-200">
                      <Smartphone size={22} />
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#d4b996]/60 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-500">Tỷ lệ khách lên đời (Trade-in)</p>
                      <h3 className="text-2xl font-black text-stone-900 mt-1">46.5%</h3>
                      <p className="text-xs mt-1.5 font-bold text-amber-800">Thu cũ từ 14/15 PRM lên 18 PRM</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-600 text-white">
                      <RotateCcw size={22} />
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#d4b996]/60 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-500">Nhân sự vận hành cửa hàng</p>
                      <h3 className="text-2xl font-black text-stone-900 mt-1">4 Nhân sự</h3>
                      <p className="text-xs mt-1.5 font-bold text-stone-600">2 NV Bán hàng • 2 NV Kho</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#8c6f46] text-white">
                      <Users size={22} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart Section */}
                  <div className="lg:col-span-2 bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996]/60 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-black text-stone-900 text-sm">Biểu Đồ Doanh Thu Bán Máy iPhone (7 Ngày Gần Nhất)</h3>
                        <p className="text-xs text-stone-500">Đơn vị tính: Triệu VNĐ (Tổng hợp từ Quầy POS & Website)</p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#1e1d1a] text-[#e5c9a3] text-xs font-bold">
                        Tháng 09/2026
                      </span>
                    </div>
                    <SimpleLineChart data={REVENUE_DATA} />
                  </div>

                  {/* Top Hot Hit iPhones */}
                  <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996]/60 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                        <Flame size={16} className="text-rose-600" /> Top Flagship Hot Hit Nhất
                      </h3>
                      <span className="text-[10px] font-bold text-[#8c6f46] uppercase">2026 VN/A</span>
                    </div>
                    <div className="space-y-3.5">
                      {products.slice(0, 5).map((p, i) => {
                        const colorMeta = getAdminColorBadge(p.id, p.colors?.[0]);
                        return (
                          <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-stone-200/70 last:border-0 last:pb-0">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                              i === 0 ? 'bg-rose-600 text-white' : i === 1 ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-700'
                            }`}>
                              #{i + 1}
                            </span>
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              style={{ filter: colorMeta.imgFilter }}
                              className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-stone-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-stone-900 truncate">{p.name.replace(' | Chính hãng VN/A', '')}</p>
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="text-[10px] font-bold text-[#8c6f46] truncate">{p.colors?.[0]}</span>
                                <span className="text-xs font-black text-rose-700 font-mono">
                                  {(p.price / 1000000).toFixed(1)}Tr
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB: AI_BI (HỆ THỐNG AI CHỦ CỬA HÀNG 3-IN-1 CHUẨN ĐẶC TẢ USE CASE) --- */}
            {activeTab === 'AI_BI' && (
              <div className="space-y-6 animate-fade-in">
                {/* 1. BẢNG ĐẶC TẢ TỔNG QUAN HỆ THỐNG AI (ĐÚNG THEO TÀI LIỆU THIẾT KẾ HỆ THỐNG) */}
                <div className="bg-[#faf8f5] rounded-2xl border-2 border-[#c5a880] shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e1d1a] via-[#2c251d] to-[#1e1d1a] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#c5a880]/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d4b996]/20 border border-[#d4b996]/50 flex items-center justify-center">
                        <Sparkles className="text-[#e5c9a3]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#e5c9a3] uppercase tracking-wide">
                          Hệ Thống AI Tích Hợp Cho Chủ Cửa Hàng & Khách Hàng (Chuẩn Đặc Tả Use Case)
                        </h3>
                        <p className="text-xs text-stone-300">
                          3 phân hệ AI vận hành trực tiếp trên CSDL {products.length} mẫu iPhone chính hãng VN/A
                        </p>
                      </div>
                    </div>

                    {/* Bộ lọc chuyển nhanh giữa 3 phân hệ AI */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: 'ALL' as const, label: 'Tất cả 3 Phân hệ AI' },
                        { id: 'TEXT_TO_DATA' as const, label: '1. AI Text-to-Data' },
                        { id: 'FORECASTING' as const, label: '2. AI Forecasting & Analytics' },
                        { id: 'CHATBOT_NLP' as const, label: '3. AI Chatbot (NLP)' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setAiSubModule(m.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            aiSubModule === m.id
                              ? 'bg-[#d4b996] text-[#1e1d1a] shadow-xs font-black'
                              : 'bg-white/10 text-stone-200 hover:bg-white/20'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bảng Mô Tả Kiến Trúc Hệ Thống AI (Giống hệt bảng trong tài liệu Use Case của người dùng) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-white text-xs">
                    <div className="p-4 space-y-1.5 hover:bg-stone-50/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                          💬 AI Chatbot (NLP)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Đang hoạt động</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        <strong>Tiếp nhận câu hỏi của khách hàng</strong>, phân tích cú pháp (NLP & từ viết tắt GenZ) và tự động tra cứu CSDL để trả lời/tư vấn sản phẩm chính xác.
                      </p>
                    </div>

                    <div className="p-4 space-y-1.5 hover:bg-stone-50/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                          📈 AI Forecasting & Analytics
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">Tự động tổng hợp</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        <strong>Tự động tổng hợp dữ liệu doanh thu, tồn kho</strong> để sinh nhận xét kinh doanh và khuyến nghị danh mục mặt hàng cần nhập bổ sung.
                      </p>
                    </div>

                    <div className="p-4 space-y-1.5 hover:bg-stone-50/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                          🔎 AI Text-to-Data
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">Truy vấn Quản lý</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        <strong>Tiếp nhận câu hỏi bằng ngôn ngữ tự nhiên từ Quản lý</strong> (ví dụ: <em>"Mặt hàng nào bán chậm nhất?"</em>), chuyển đổi thành truy vấn dữ liệu và trả về kết quả chính xác.
                      </p>
                    </div>
                  </div>
                </div>

                {/* =====================================================================
                    PHÂN HỆ 1: AI TEXT-TO-DATA (TRUY VẤN CSDL BẰNG NGÔN NGỮ TỰ NHIÊN CHO QUẢN LÝ)
                   ===================================================================== */}
                {(aiSubModule === 'ALL' || aiSubModule === 'TEXT_TO_DATA') && (
                  <div className="bg-[#faf8f5] rounded-2xl border border-[#d4b996] shadow-sm p-6 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          Phân Hệ 1 • AI Text-to-Data Cho Chủ Cửa Hàng
                        </span>
                        <h4 className="text-base font-black text-stone-900 mt-1">
                          🔎 Đặt Câu Hỏi Bằng Ngôn Ngữ Tự Nhiên ➔ Tự Động Sinh Truy Vấn CSDL & Trả Kết Quả
                        </h4>
                        <p className="text-xs text-stone-500">
                          Gõ câu hỏi bất kỳ hoặc chọn câu hỏi mẫu bên dưới (Ví dụ chuẩn: <strong>"Mặt hàng nào bán chậm nhất?"</strong>)
                        </p>
                      </div>
                    </div>

                    {/* Ô nhập câu hỏi tự nhiên của Quản lý */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c6f46]" size={16} />
                          <input
                            type="text"
                            value={textToDataInput}
                            onChange={(e) => setTextToDataInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRunTextToData(textToDataInput)}
                            placeholder='Nhập câu hỏi của Quản lý (VD: "Mặt hàng nào bán chậm nhất?", "Mặt hàng nào sắp hết kho?")...'
                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#c5a880] rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#8c6f46]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRunTextToData(textToDataInput)}
                          className="px-6 py-3 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer shrink-0 flex items-center justify-center gap-2"
                        >
                          <Sparkles size={16} /> Chuyển Đổi Text-to-Data
                        </button>
                      </div>

                      {/* Các chip câu hỏi mẫu dành cho Quản lý */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-stone-500">Câu hỏi Quản lý thường dùng:</span>
                        {[
                          { label: '📉 Mặt hàng nào bán chậm nhất?', q: 'Mặt hàng nào bán chậm nhất?', type: 'SLOWEST_SELLING' },
                          { label: '🔥 Mặt hàng nào bán chạy nhất?', q: 'Mặt hàng nào bán chạy nhất?', type: 'BEST_SELLING' },
                          { label: '📦 Mặt hàng nào tồn kho thấp cần nhập?', q: 'Sản phẩm nào tồn kho thấp cần nhập gấp?', type: 'LOW_STOCK' },
                          { label: '🎨 Các mẫu màu mới Apple 2026 còn bao nhiêu máy?', q: 'Các mẫu iPhone màu mới Burgundy & Glacier còn bao nhiêu máy?', type: 'NEW_COLORS' },
                          { label: '💎 Top máy giá cao biên lợi nhuận lớn nhất?', q: 'Top máy iPhone giá cao lợi nhuận lớn nhất?', type: 'HIGH_VALUE' },
                          { label: '💰 Doanh thu lũy kế theo từng dòng máy?', q: 'Tổng hợp doanh thu theo từng dòng iPhone?', type: 'REVENUE_BY_SERIES' }
                        ].map((chip) => (
                          <button
                            key={chip.type}
                            type="button"
                            onClick={() => handleRunTextToData(chip.q)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              activeQueryType === chip.type
                                ? 'bg-[#1e1d1a] text-[#e5c9a3] border-[#8c6f46] shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-[#8c6f46]'
                            }`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Khối hiển thị: Câu lệnh SQL tự động sinh + Nhận xét + Bảng dữ liệu chính xác */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
                      {/* Cột trái: Truy vấn SQL tự động sinh */}
                      <div className="lg:col-span-5 bg-[#1e1d1a] text-stone-100 rounded-2xl p-4 border border-[#c5a880]/40 flex flex-col justify-between space-y-3">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-[11px] font-black text-[#e5c9a3] uppercase tracking-wider">
                              ⚡ Bộ Biên Dịch NLP ➔ Truy Vấn Dữ Liệu (SQL)
                            </span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                              2.4ms • 45 rows scanned
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-300">
                            <strong className="text-white">Câu hỏi Quản lý:</strong> "{textToDataInput}"
                          </div>
                          <div className="text-[11px] text-amber-300">
                            <strong className="text-white">Ý định (Parsed Intent):</strong> {textToDataResult.intent}
                          </div>
                          <pre className="bg-black/60 text-emerald-400 p-3 rounded-xl text-[11px] font-mono overflow-x-auto border border-white/10 leading-relaxed">
                            {textToDataResult.sql}
                          </pre>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-[#c5a880]/30 text-xs text-stone-200 leading-relaxed">
                          <strong className="text-[#e5c9a3] block mb-1">💡 Kết luận từ AI Text-to-Data:</strong>
                          {textToDataResult.summary}
                        </div>
                      </div>

                      {/* Cột phải: Bảng kết quả chính xác từ CSDL kèm Nút hành động cho Chủ cửa hàng */}
                      <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                        <div className="px-4 py-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                          <span className="text-xs font-black text-stone-800 uppercase">
                            📊 Bảng Kết Quả Trả Về Chính Xác Từ CSDL ({textToDataResult.rows.length} bản ghi)
                          </span>
                          <span className="text-[11px] text-stone-500 font-semibold">
                            Chủ cửa hàng có thể thao tác trực tiếp
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-stone-50 text-stone-600 font-black border-b border-stone-200">
                              <tr>
                                <th className="px-3.5 py-2.5">Mặt Hàng iPhone</th>
                                <th className="px-3 py-2.5 text-center">Đã Bán</th>
                                <th className="px-3 py-2.5 text-center">Tồn Kho</th>
                                <th className="px-3 py-2.5 text-right">Giá Bán</th>
                                <th className="px-3.5 py-2.5 text-right">Thao Tác Chủ Shop</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {textToDataResult.rows.map((row) => {
                                const badge = getAdminColorBadge(row.id, row.colors?.[0]);
                                return (
                                  <tr key={row.id} className="hover:bg-[#faf8f5] transition-colors">
                                    <td className="px-3.5 py-2.5">
                                      <div className="flex items-center gap-2.5">
                                        <img
                                          src={row.images[0]}
                                          alt={row.name}
                                          style={{ filter: badge.imgFilter }}
                                          className="w-9 h-9 rounded-lg object-contain bg-white border border-stone-200 p-0.5 shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <p className="font-black text-stone-900 truncate max-w-[200px]">
                                            {row.name.replace(' | Chính hãng VN/A', '')}
                                          </p>
                                          <p className="text-[10px] text-stone-500 truncate">
                                            Màu: {row.colors?.[0]?.replace(/\s*\(Mới\)/gi, '')}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                      <span className={`px-2 py-0.5 rounded-full font-mono font-black text-[11px] ${
                                        row.soldCount <= 230 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {row.soldCount} máy
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-center font-mono font-bold text-stone-800">
                                      {row.stock} máy
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-black text-rose-700">
                                      {(row.price / 1000000).toFixed(2)}Tr
                                    </td>
                                    <td className="px-3.5 py-2.5 text-right">
                                      {activeQueryType === 'SLOWEST_SELLING' ? (
                                        <button
                                          type="button"
                                          onClick={() => handleQuickPromoSlowItem(row.id)}
                                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer shadow-2xs"
                                        >
                                          🏷️ Giảm 5% Xả Kho
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleQuickRestockProduct(row.id, 15)}
                                          className="px-2.5 py-1 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] rounded-lg text-[10px] font-bold cursor-pointer shadow-2xs"
                                        >
                                          + Nhập 15 Máy
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================================
                    PHÂN HỆ 2: AI FORECASTING & ANALYTICS (TỔNG HỢP DOANH THU, TỒN KHO & KHUYẾN NGHỊ NHẬP HÀNG)
                   ===================================================================== */}
                {(aiSubModule === 'ALL' || aiSubModule === 'FORECASTING') && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Cột Nhận xét Kinh doanh tự động */}
                    <div className="lg:col-span-5 bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996] shadow-sm space-y-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          Phân Hệ 2 • AI Forecasting & Analytics
                        </span>
                        <h4 className="font-black text-base text-stone-900 mt-1 flex items-center gap-2">
                          <TrendingUp className="text-emerald-700" size={18} /> Nhận Xét Kinh Doanh Tự Động Từ Doanh Thu & Tồn Kho
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            title: '1. Dự báo Doanh thu & Sức mua Flagship 18 Series',
                            detail: `Dòng iPhone 18 Pro Max (Đỏ Rượu Vang Burgundy & Xanh Băng Hà Glacier Blue) và iPhone 18 Ultra đang chiếm 64% doanh thu tuần. Dự báo 14 ngày tới sức mua tăng +22% (ước đạt 1.65 Tỷ VNĐ).`
                          },
                          {
                            title: '2. Phân tích Tồn kho & Vòng quay Vốn lưu động',
                            detail: `Tổng tồn kho hiện tại gồm ${products.reduce((s, p) => s + p.stock, 0)} máy trên ${products.length} mã iPhone. Nhóm máy 512GB/1TB có tốc độ xuất kho nhanh nhưng tồn kho trung bình chỉ còn 10–18 máy/mã, nguy cơ thiếu hàng trong 5 ngày tới.`
                          },
                          {
                            title: '3. Chiến lược Kích cầu Nhóm hàng Bán chậm',
                            detail: `Các dòng máy đời cũ (iPhone 4s, 8 Plus, XS Max) có vòng quay chậm hơn. AI khuyến nghị ghép combo "Mua Flagship tặng máy phụ Sưu tầm giảm 15%" hoặc trợ giá Thu Cũ Đổi Mới 3.000.000₫.`
                          }
                        ].map((ins, i) => (
                          <div key={i} className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                            <div className="font-black text-stone-900">{ins.title}</div>
                            <p className="text-stone-600 leading-relaxed">{ins.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cột Khuyến nghị Danh mục hàng cần nhập (Restock Recommendations) */}
                    <div className="lg:col-span-7 bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996] shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              AI Restock Engine
                            </span>
                            <h4 className="font-black text-base text-stone-900 mt-1">
                              📦 Khuyến Nghị Danh Mục Hàng Cần Nhập Bổ Sung
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={handleApproveAllAiRestock}
                            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle size={14} /> Duyệt Nhập Kho Tất Cả Đề Xuất (+15 máy/mã)
                          </button>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-xl border border-stone-200">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-stone-100 text-stone-700 font-black border-b border-stone-200">
                              <tr>
                                <th className="px-3.5 py-2.5">Danh Mục Máy Cần Nhập</th>
                                <th className="px-3 py-2.5 text-center">Tồn Hiện Tại</th>
                                <th className="px-3 py-2.5 text-center">Đề Xuất Nhập</th>
                                <th className="px-3 py-2.5 text-right">Lý Do AI Khuyến Nghị</th>
                                <th className="px-3.5 py-2.5 text-right">Duyệt Nhanh</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {products
                                .filter(p => p.stock <= 24 || p.soldCount >= 500)
                                .slice(0, 6)
                                .map((item) => (
                                  <tr key={item.id} className="hover:bg-stone-50">
                                    <td className="px-3.5 py-2.5 font-bold text-stone-900">
                                      {item.name.replace(' | Chính hãng VN/A', '')}
                                      <span className="block text-[10px] text-[#8c6f46] font-semibold">
                                        Màu hot: {item.colors?.[0]?.replace(/\s*\(Mới\)/gi, '')}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-black">
                                        {item.stock} máy
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-center font-mono font-black text-emerald-700">
                                      +20 máy
                                    </td>
                                    <td className="px-3 py-2.5 text-right text-[11px] text-stone-600">
                                      Đã bán {item.soldCount} máy • Cầu vượt cung
                                    </td>
                                    <td className="px-3.5 py-2.5 text-right">
                                      <button
                                        type="button"
                                        onClick={() => handleQuickRestockProduct(item.id, 20)}
                                        className="px-2.5 py-1 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] rounded-lg text-[10px] font-bold cursor-pointer"
                                      >
                                        + Nhập 20
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================================
                    PHÂN HỆ 3: AI CHATBOT NLP (TIẾP NHẬN CÂU HỎI KHÁCH HÀNG, PHÂN TÍCH CÚ PHÁP & TRA CỨU CSDL)
                   ===================================================================== */}
                {(aiSubModule === 'ALL' || aiSubModule === 'CHATBOT_NLP') && (
                  <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996] shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                          Phân Hệ 3 • AI Chatbot NLP & Tự Động Tra Cứu CSDL
                        </span>
                        <h4 className="font-black text-base text-stone-900 mt-1">
                          💬 Giám Sát Bộ Phân Tích Cú Pháp Ngôn Ngữ Tự Nhiên (NLP) & Tư Vấn Sản Phẩm Tự Động
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                        ✓ Đã kết nối CSDL {products.length} mẫu iPhone & Từ điển GenZ Việt Nam
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="font-black text-stone-900">1. Tiếp nhận & Chuẩn hóa Ngôn ngữ (NLP)</div>
                        <p className="text-stone-600 leading-relaxed">
                          Tự động dịch hơn 60 từ viết tắt & tiếng lóng Việt Nam (<code>18prm</code> ➔ <em>iPhone 18 Pro Max</em>, <code>bn củ</code> ➔ <em>bao nhiêu triệu đồng</em>, <code>ko/đc/bh/tg/hssv</code>) trước khi phân tích ý định.
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="font-black text-stone-900">2. Tự động Tra cứu CSDL Sản phẩm</div>
                        <p className="text-stone-600 leading-relaxed">
                          Truy vấn trực tiếp bảng giá, dung lượng (128GB - 1TB), tồn kho và 2–3 màu mới nhất chuẩn Apple.com (Đỏ Burgundy, Xanh Glacier, Cà Phê Mocha) để báo giá chính xác 100%.
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="font-black text-stone-900">3. Hỗ trợ Đặt hàng & Đổi trả Trực tuyến</div>
                        <p className="text-stone-600 leading-relaxed">
                          Cho phép khách thêm sản phẩm trực tiếp vào giỏ hàng từ khung chat, tra cứu lịch sử mua hàng, tích điểm VIP và gửi yêu cầu đổi trả/hoàn hàng trực tuyến.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB: PRODUCTS (QUẢN LÝ 25 MÃ IPHONE ĐỘC QUYỀN CỦA SHOP) --- */}
            {activeTab === 'PRODUCTS' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#faf8f5] p-4 rounded-2xl border border-[#d4b996]/60 shadow-sm">
                  <div>
                    <h3 className="font-black text-stone-900 text-sm">
                      Danh Mục 25 Mã iPhone Chính Hãng VN/A ({products.length} mẫu máy độc bản)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Mỗi mẫu máy sở hữu 1 phối màu đặc trưng riêng biệt — Chủ cửa hàng toàn quyền chỉnh giá niêm yết & tồn kho
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        placeholder="Tìm tên máy, màu sắc..."
                        className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleOpenProductModal()}
                      className="px-4 py-2 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus size={15} /> Thêm Mẫu iPhone
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products
                    .filter(p =>
                      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      (p.colors?.[0] || '').toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map(product => {
                      const primaryColor = product.colors?.[0] || 'Titan Tự Nhiên';
                      const colorMeta = getAdminColorBadge(product.id, primaryColor);
                      return (
                        <div key={product.id} className="bg-[#faf8f5] rounded-2xl border border-[#d4b996]/60 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="h-44 bg-white relative p-3 flex items-center justify-center border-b border-stone-200/80">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{ filter: colorMeta.imgFilter }}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-2.5 left-2.5 bg-[#1e1d1a] text-[#e5c9a3] text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {product.category?.replace(' (Flagship 2026)', '').replace(' & Sưu Tầm (4s - XS Max)', '')}
                              </div>
                              <div className="absolute bottom-2.5 right-2.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md">
                                Kho: {product.stock} máy
                              </div>
                            </div>

                            <div className="p-4 space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorMeta.dot }} />
                                <span className="text-[11px] font-bold text-stone-600 truncate">{primaryColor}</span>
                              </div>
                              <h4 className="font-black text-stone-900 text-xs line-clamp-2" title={product.name}>{product.name}</h4>
                            </div>
                          </div>

                          <div className="px-4 pb-4 pt-2 border-t border-stone-200/70 flex items-center justify-between">
                            <span className="text-rose-700 font-black font-mono text-sm">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </span>
                            <button
                              onClick={() => handleOpenProductModal(product)}
                              className="px-3 py-1.5 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit size={12} /> Sửa Giá / Kho
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* --- TAB: ORDERS --- */}
            {activeTab === 'ORDERS' && (
              <div className="bg-[#faf8f5] rounded-2xl shadow-sm border border-[#d4b996]/60 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-100/70">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'ALL', label: 'Tất cả đơn máy' }, 
                      { id: OrderStatus.PENDING, label: 'Chờ duyệt giao' },
                      { id: OrderStatus.PAID, label: 'Đã thanh toán VietQR' },
                      { id: OrderStatus.SHIPPING, label: 'Đang giao hỏa tốc 2h' },
                      { id: OrderStatus.DELIVERED, label: 'Đã giao thành công' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderFilter(tab.id as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          orderFilter === tab.id ? 'bg-[#1e1d1a] text-[#e5c9a3]' : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
                    <input 
                      type="text" 
                      placeholder="Tìm mã đơn, tên khách hàng..." 
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-white border border-stone-300 rounded-xl text-xs outline-none w-full md:w-64" 
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-200/70 text-stone-700 font-black uppercase border-b border-stone-300">
                      <tr>
                        <th className="px-5 py-3.5">Mã Đơn</th>
                        <th className="px-5 py-3.5">Thời Gian</th>
                        <th className="px-5 py-3.5">Khách Hàng</th>
                        <th className="px-5 py-3.5">Dòng Máy iPhone Đặt Mua</th>
                        <th className="px-5 py-3.5">Tổng Thanh Toán</th>
                        <th className="px-5 py-3.5">Trạng Thái</th>
                        <th className="px-5 py-3.5 text-right">Điều Phối</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/70">
                      {orders
                        .filter(o => 
                          (orderFilter === 'ALL' || o.status === orderFilter) && 
                          (o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer.toLowerCase().includes(orderSearch.toLowerCase()))
                        )
                        .map((order: any) => (
                          <tr key={order.id} className="hover:bg-stone-100/80 transition-colors">
                            <td className="px-5 py-3.5 font-mono font-black text-[#8c6f46]">{order.id}</td>
                            <td className="px-5 py-3.5 text-stone-600">{order.date}</td>
                            <td className="px-5 py-3.5 font-black text-stone-900">{order.customer}</td>
                            <td className="px-5 py-3.5 font-bold text-stone-800">{order.item || 'iPhone 18 Pro Max 256GB VN/A'}</td>
                            <td className="px-5 py-3.5 font-mono font-black text-rose-700">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                {order.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID) ? (
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.SHIPPING)}
                                  className="px-3 py-1.5 text-xs bg-[#1e1d1a] text-[#e5c9a3] rounded-lg font-bold cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Truck size={13} /> Xuất Kho Giao 2h
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-bold">Đã điều phối</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB: STAFF MANAGEMENT (CHỈ NHÂN VIÊN BÁN HÀNG & NHÂN VIÊN KHO CỦA SHOP NHỎ - UC01) --- */}
            {activeTab === 'SELLERS' && (
              <div className="bg-[#faf8f5] rounded-2xl shadow-sm border border-[#d4b996]/60 p-6 space-y-5 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <h3 className="font-black text-stone-900 text-base">
                      Quản Lý Nhân Sự Nội Bộ Cửa Hàng Thế Giới iPhone (UC01)
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Mô hình cửa hàng nhỏ tinh gọn: Chủ cửa hàng (Admin) trực tiếp phân quyền cho <strong>Nhân viên Bán hàng</strong> và <strong>Nhân viên Kho</strong> (Không có nhà bán hàng trung gian).
                    </p>
                  </div>
                  <span className="text-xs font-black bg-[#1e1d1a] text-[#e5c9a3] px-3.5 py-1.5 rounded-xl">
                    Tổng nhân sự: {localStaff.length} nhân viên
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localStaff.map(staff => (
                    <div key={staff.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#1e1d1a] text-[#e5c9a3] flex items-center justify-center font-black text-lg">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-stone-900 text-sm">{staff.name}</h4>
                            <p className="text-xs font-bold text-[#8c6f46]">{staff.roleTitle}</p>
                            <span className="text-[11px] text-stone-500 font-mono">{staff.email} • Ca: {staff.shift}</span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          staff.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {staff.status === 'APPROVED' ? 'Đang làm việc' : 'Chờ kích hoạt'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                        <span className="text-stone-500">Mã NV: <strong className="text-stone-800">{staff.id}</strong></span>
                        <div className="flex gap-2">
                          {staff.status !== 'APPROVED' ? (
                            <button
                              onClick={() => handleToggleStaffStatus(staff.id, 'APPROVED')}
                              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                            >
                              Kích hoạt ca trực
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStaffStatus(staff.id, 'REJECTED')}
                              className="px-3 py-1.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-lg font-bold text-xs cursor-pointer"
                            >
                              Tạm khóa ca
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB: CONFIG --- */}
            {activeTab === 'CONFIG' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996]/60 shadow-sm space-y-5">
                  <h3 className="font-black text-stone-900 border-b border-stone-200 pb-3 flex items-center gap-2 text-sm">
                    <Settings size={17} className="text-[#8c6f46]" /> Vận Hành Cửa Hàng Thế Giới iPhone
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">Chế độ bảo trì Showroom Online</h4>
                      <p className="text-[11px] text-stone-500">Tạm dừng nhận đơn đặt máy trực tuyến để kiểm kê kho</p>
                    </div>
                    <button
                      onClick={() => setConfig({...config, maintenance: !config.maintenance})}
                      className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${config.maintenance ? 'bg-rose-600' : 'bg-stone-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${config.maintenance ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">Tự động xác nhận đơn VietQR Napas 24/7</h4>
                      <p className="text-[11px] text-stone-500">Chuyển ngay đơn đã thanh toán sang bộ phận Kho đóng gói</p>
                    </div>
                    <button
                      onClick={() => setConfig({...config, autoApprove: !config.autoApprove})}
                      className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${config.autoApprove ? 'bg-emerald-600' : 'bg-stone-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${config.autoApprove ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>

                <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#d4b996]/60 shadow-sm space-y-5">
                  <h3 className="font-black text-stone-900 border-b border-stone-200 pb-3 flex items-center gap-2 text-sm">
                    <DollarSign size={17} className="text-[#8c6f46]" /> Chính Sách Trợ Giá Thu Cũ & Tích Điểm VIP (UC03)
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Mức trợ giá Thu Cũ Lên Đời iPhone 18/17 Series (VNĐ):</label>
                      <input 
                        type="number" 
                        step={500000}
                        className="border border-stone-300 rounded-xl p-2.5 w-full bg-white font-black text-emerald-700"
                        value={config.tradeInSubsidy}
                        onChange={(e) => setConfig({...config, tradeInSubsidy: Number(e.target.value)})}
                      />
                    </div>
                    <button
                      onClick={() => alert("✅ Đã lưu cấu hình vận hành Cửa hàng Thế Giới iPhone!")}
                      className="bg-[#1e1d1a] text-[#e5c9a3] px-5 py-2.5 rounded-xl font-black text-xs shadow cursor-pointer"
                    >
                      Lưu Thiết Lập Cửa Hàng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL CHỈNH SỬA / THÊM MẪU IPHONE */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#d4b996] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-[#1e1d1a] text-[#e5c9a3] flex justify-between items-center">
              <h3 className="font-black text-sm">{editingProduct ? 'Cập Nhật Giá & Tồn Kho iPhone' : 'Thêm Mẫu iPhone Mới Vào Shop'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-white"><XCircle size={20}/></button>
            </div>
            
            <div className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên Mẫu Máy iPhone</label>
                <input 
                  type="text" 
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-white font-bold"
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dòng Series</label>
                  <select 
                    className="w-full border border-stone-300 rounded-xl p-2.5 bg-white font-semibold"
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                  >
                    {IPHONE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Màu Máy Độc Bản</label>
                  <input 
                    type="text" 
                    className="w-full border border-stone-300 rounded-xl p-2.5 bg-white font-semibold"
                    value={productForm.colors?.[0] || ''}
                    onChange={e => setProductForm({...productForm, colors: [e.target.value]})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Giá Bán Niêm Yết (VNĐ)</label>
                  <input 
                    type="number" 
                    step={100000}
                    className="w-full border border-stone-300 rounded-xl p-2.5 bg-white font-black text-rose-700"
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tồn Kho (Máy)</label>
                  <input 
                    type="number" 
                    className="w-full border border-stone-300 rounded-xl p-2.5 bg-white font-black"
                    value={productForm.stock}
                    onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-100 flex justify-end gap-2">
              <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-stone-600 bg-stone-200 rounded-xl font-bold text-xs">Hủy</button>
              <button onClick={handleSaveProduct} className="px-5 py-2 bg-[#1e1d1a] text-[#e5c9a3] rounded-xl font-black text-xs cursor-pointer">
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;