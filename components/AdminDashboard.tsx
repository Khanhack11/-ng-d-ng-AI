import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Search, 
  MoreHorizontal, TrendingUp, AlertCircle, Plus, Edit, Trash2, 
  CheckCircle, XCircle, Truck, Package, DollarSign, BarChart3, 
  Calendar, Image as ImageIcon, ChevronDown, ChevronUp, Filter, Tag, 
  Navigation, ShieldCheck, Link, Store, Download, FileSpreadsheet, 
  Printer, RotateCcw, Sparkles, ShoppingCart, Boxes
} from 'lucide-react';
import { MOCK_PRODUCTS_LIST, MOCK_ORDER } from '../constants';
import { ProductDetail, OrderStatus, Order } from '../types';
import PortalTopBar, { PortalWorkspace } from './PortalTopBar';

// --- MOCK DATA GENERATORS FOR DEMO ---
const GENERATE_MOCK_ORDERS = () => [
  { ...MOCK_ORDER, id: 'DH-20241228-01', status: OrderStatus.PAID, total: 1919000, customer: 'Nguyễn Quốc Khánh', date: '28/12/2024' },
  { ...MOCK_ORDER, id: 'DH-20241228-02', status: OrderStatus.PENDING, total: 550000, customer: 'Trần Văn A', date: '28/12/2024' },
  { ...MOCK_ORDER, id: 'DH-20241227-01', status: OrderStatus.SHIPPING, total: 2450000, customer: 'Lê Thị B', date: '27/12/2024' },
  { ...MOCK_ORDER, id: 'DH-20241227-02', status: OrderStatus.DELIVERED, total: 120000, customer: 'Phạm Văn C', date: '27/12/2024' },
  { ...MOCK_ORDER, id: 'DH-20241226-03', status: OrderStatus.CANCELLED, total: 890000, customer: 'Hoàng Thị D', date: '26/12/2024' },
];

const REVENUE_DATA = [
  { day: 'T2', value: 12500000 },
  { day: 'T3', value: 18200000 },
  { day: 'T4', value: 15600000 },
  { day: 'T5', value: 22400000 },
  { day: 'T6', value: 19800000 },
  { day: 'T7', value: 28500000 },
  { day: 'CN', value: 25100000 },
];

const CATEGORIES = ["Thời trang nam", "Thời trang nữ", "Giày dép", "Phụ kiện", "Áo khoác & Hoodie", "Khác"];

interface AdminDashboardProps {
  onLogout: () => void;
  globalSellers?: any[];
  setGlobalSellers?: any;
  onNavigateToWarehouse?: () => void;
  onNavigateToCustomers?: () => void;
  onNavigateToReturns?: () => void;
  onNavigateToHome?: () => void;
  onSwitchWorkspace?: (workspace: PortalWorkspace) => void;
  currentUser?: any;
  pendingReturnsCount?: number;
  initialTab?: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  globalSellers, 
  setGlobalSellers,
  onNavigateToWarehouse,
  onNavigateToCustomers,
  onNavigateToReturns,
  onNavigateToHome,
  onSwitchWorkspace,
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
  
  // --- STATE FOR PRODUCTS ---
  const [products, setProducts] = useState<ProductDetail[]>(MOCK_PRODUCTS_LIST);
  const [dbCategories, setDbCategories] = useState<string[]>(CATEGORIES);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  
  // Form State
  const [productForm, setProductForm] = useState<Partial<ProductDetail>>({
    name: '', price: 0, stock: 0, description: '', images: [''], category: 'Thời trang nam', colors: [], sizes: []
  });

  // --- STATE FOR ORDERS ---
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // --- STATE FOR SELLERS & CONFIG ---
  // Dùng global state để mô phỏng "thấy ngay lập tức" theo yêu cầu, fallback local nếu chạy độc lập
  const [localSellers, setLocalSellers] = useState([
      { id: 'S-101', name: 'Nguyễn Văn Nam', shopName: 'Nam Sneaker', status: 'PENDING', date: '19/04/2026', email: 'nam.sneaker@gmail.com' },
      { id: 'S-102', name: 'Trần Thị Hà', shopName: 'Hà Cosmatic', status: 'PENDING', date: '19/04/2026', email: 'ha.beauty99@gmail.com' },
      { id: 'S-103', name: 'Lê Hoàng', shopName: 'Hoàng Tech', status: 'APPROVED', date: '15/04/2026', email: 'congnghe.hoang@vietnam.vn' },
  ]);
  const sellers = globalSellers || localSellers;
  const updateSellersState = setGlobalSellers || setLocalSellers;
  
  const [config, setConfig] = useState({ maintenance: false, autoApprove: false, commission: 5 });

  const handleApproveSeller = (id: string) => {
      updateSellersState(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
  };
  const handleRejectSeller = (id: string) => {
      updateSellersState(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
  };

  // Fetch from Backend
  React.useEffect(() => {
    // Luôn fetch danh mục để đưa vào form Thêm sản phẩm
    fetch('http://localhost:5000/api/categories')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                setDbCategories(data.map(c => c.name));
            }
        })
        .catch(err => console.error('Failed to load categories', err));

    if (activeTab === 'ORDERS') {
      fetch('http://localhost:5000/api/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(err => console.error('Failed to load orders', err));
    }
    
    if (activeTab === 'PRODUCTS') {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                     // Chuyển format từ SQL sang ProductDetail để component hiển thị được ko bị lỗi
                     const dbProducts = data.map(p => ({
                         id: `SP-${p.id}`,
                         name: p.name,
                         price: p.price,
                         stock: p.stock,
                         category: p.categoryName || 'Khác',
                         images: [p.image_url || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(p.name)],
                         approvalStatus: p.approval_status || 'PENDING',
                         rating: 5, reviewCount: 0, soldCount: 0, shippingFee: 0, shippingEstimate: '3-5 ngày', colors: [], sizes: []
                     })) as (ProductDetail & { approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' })[];
                     
                     // Gộp với các mock data đã có từ file constants
                     const mockProducts = MOCK_PRODUCTS_LIST.map(p => ({ ...p, approvalStatus: 'APPROVED' }));
                     setProducts([...dbProducts, ...mockProducts]);
                }
            })
            .catch(err => console.error('Failed to load products', err));
    }
  }, [activeTab]);

  // --- EXPORT TO EXCEL & PDF (UC06 EXTEND) ---
  const handleExportExcel = () => {
    const headers = "Mã Đơn Hàng,Ngày Đặt,Khách Hàng,Tổng Tiền (VNĐ),Trạng Thái\n";
    const dataRows = orders.length > 0 ? orders : GENERATE_MOCK_ORDERS();
    const rows = dataRows.map(o => `"${o.id}","${o.date}","${o.customer}",${o.total},"${o.status}"`).join("\n");
    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_Cao_Doanh_Thu_ZShop_${new Date().toLocaleDateString('en-CA')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  // --- HANDLERS ---

  // Order Actions
  const handleUpdateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    // Optimistic UI Update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // Update to DB
    try {
      await fetch(`http://localhost:5000/api/orders/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Lỗi khi cập nhật trạng thái:', e);
    }
  };

  // Product Actions
  const handleOpenProductModal = (product?: ProductDetail) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({ 
          name: '', 
          price: 0, 
          stock: 0, 
          description: '', 
          images: ['https://via.placeholder.com/150'], 
          category: 'Thời trang nam',
          colors: [], 
          sizes: [] 
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (editingProduct) {
        const isMockProduct = !editingProduct.id.startsWith('SP-');

        if (isMockProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as ProductDetail : p));
            alert('Đã cập nhật sản phẩm mẫu thành công (Lưu ý: Sản phẩm này chỉ lưu tạm trên giao diện vì chưa có trong CSDL).');
            setIsProductModalOpen(false);
            return;
        }

        try {
            // SP-123 -> 123
            const id = editingProduct.id.replace('SP-', '');
            
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productForm)
            });
            
            if (response.ok) {
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as ProductDetail : p));
                alert('Đã cập nhật sản phẩm thành công vào CSDL!');
                setIsProductModalOpen(false);
            } else {
                const err = await response.json();
                alert('Lỗi khi cập nhật CSDL: ' + (err.error || 'Vui lòng thử lại sau.'));
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối server!');
        }
    } 
    // Removed creating logic, Admin shouldn't create products independently.
  };

  const handleDeleteProduct = async (id: string) => {
      if(confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
          try {
              const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                  method: 'DELETE'
              });
              const data = await response.json();
              
              if (response.ok && data.success) {
                  setProducts(prev => prev.filter(p => p.id !== id));
              } else {
                  alert(data.error || 'Lỗi: Sản phẩm này có thể đang nằm trong một Đơn Hàng (Ràng buộc khóa ngoại). Vui lòng kiểm tra lại!');
              }
          } catch(e) {
              console.error(e);
          }
      }
  }

  const handleReviewProduct = async (id: string, approvalStatus: 'APPROVED' | 'REJECTED') => {
      try {
          const realId = id.replace('SP-', '');
          const response = await fetch(`http://localhost:5000/api/products/${realId}/review`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ approvalStatus })
          });

          const data = await response.json();
          if (!response.ok) {
              alert(data.error || 'Không thể duyệt sản phẩm');
              return;
          }

          setProducts(prev => prev.map(p => p.id === id ? { ...p, approvalStatus } : p));
      } catch (e) {
          console.error(e);
          alert('Lỗi kết nối server khi duyệt sản phẩm');
      }
  };

  // --- COMPONENTS ---

  const SimpleLineChart = ({ data }: { data: typeof REVENUE_DATA }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return (val / 1000000).toFixed(1) + ' Tr';
        return (val / 1000).toFixed(0) + 'k';
    };

    return (
        <div className="w-full h-64 relative mt-4 select-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible font-sans">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                ))}
                {/* Area Gradient */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M0,100 ${points} 100,100`} fill="url(#chartGradient)" />
                {/* Line */}
                <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (d.value / maxVal) * 100;
                    return (
                        <g key={i} className="group cursor-pointer">
                             <circle cx={x} cy={y} r="2.5" className="fill-brand-600 stroke-white stroke-[0.8] group-hover:r-4 transition-all duration-300" />
                             {/* Tooltip */}
                             <foreignObject x={x - 15} y={y - 12} width="30" height="15" className="opacity-0 group-hover:opacity-100 transition-all pointer-events-none overflow-visible">
                                 <div className="bg-slate-900 text-white text-[3.5px] font-bold px-1.5 py-0.5 rounded shadow-lg -translate-x-1/2 -translate-y-full whitespace-nowrap absolute left-1/2 top-0 border border-slate-700">
                                     {formatCurrency(d.value)}
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[1.5px] border-l-transparent border-r-[1.5px] border-r-transparent border-t-[1.5px] border-t-slate-900"></div>
                                 </div>
                             </foreignObject>
                        </g>
                    );
                })}
            </svg>
            <div className="flex justify-between mt-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {data.map(d => <span key={d.day} className="w-8 text-center">{d.day}</span>)}
            </div>
        </div>
    );
  };

  const StatsCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>
                <TrendingUp size={12} /> {sub}
            </p>
        </div>
        <div className={`p-3 rounded-lg ${color === 'green' ? 'bg-green-50 text-green-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
            <Icon size={24} />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex animate-fade-in font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={18} className="text-white" />
                </div>
                SZSHOP
            </h1>
            <p className="text-xs text-slate-500 mt-2 pl-10">Admin Dashboard v1.0</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1">Quản trị & Báo cáo</div>
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs ${activeTab === 'DASHBOARD' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <BarChart3 size={18} /> Tổng quan doanh thu
            </button>
            <button onClick={() => setActiveTab('AI_BI')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs ${activeTab === 'AI_BI' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:bg-purple-950/50'}`}>
                <Sparkles size={18} className="text-amber-400" /> AI Hỏi đáp K.Doanh (UC09)
            </button>
            <button onClick={() => setActiveTab('ORDERS')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs ${activeTab === 'ORDERS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Package size={18} /> Đơn hàng trực tuyến
                <span className="ml-auto bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>
            </button>
            <button onClick={() => setActiveTab('PRODUCTS')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'PRODUCTS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard size={18} /> Quản lý sản phẩm
            </button>

            <div className="text-[10px] font-bold text-slate-500 uppercase px-3 pt-3 pb-1 border-t border-slate-800 mt-2">Nghiệp vụ Bán lẻ & Kho</div>
            {onNavigateToWarehouse && (
              <button onClick={onNavigateToWarehouse} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs text-amber-300 hover:bg-amber-950/60 hover:text-white">
                  <Boxes size={18} /> Nhập kho & Tồn kho (UC05)
              </button>
            )}
            {onNavigateToCustomers && (
              <button onClick={onNavigateToCustomers} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs text-indigo-300 hover:bg-indigo-950/60 hover:text-white">
                  <Users size={18} /> Khách hàng & Điểm (UC03)
              </button>
            )}
            {onNavigateToReturns && (
              <button onClick={onNavigateToReturns} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs text-rose-300 hover:bg-rose-950/60 hover:text-white">
                  <RotateCcw size={18} /> Đổi trả & Hoàn tiền (UC10)
              </button>
            )}

            <div className="pt-2 border-t border-slate-800 mt-2">
                <button onClick={() => setActiveTab('SELLERS')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs ${activeTab === 'SELLERS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <Store size={18} /> Duyệt đối tác Seller
                    {sellers.filter(s => s.status === 'PENDING').length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{sellers.filter(s => s.status === 'PENDING').length}</span>}
                </button>
                <button onClick={() => setActiveTab('CONFIG')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs ${activeTab === 'CONFIG' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <Settings size={18} /> Cấu hình hệ thống
                </button>
            </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
            {onNavigateToHome && (
              <button onClick={onNavigateToHome} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold w-full px-4 py-2 hover:bg-slate-800 rounded-lg">
                  <Store size={16} /> Xem Cửa Hàng (Shop)
              </button>
            )}
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-medium w-full px-4 py-2 hover:bg-slate-800 rounded-lg">
                <LogOut size={16} /> Đăng xuất quản trị
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-gray-800 text-base">
                  {activeTab === 'DASHBOARD' ? 'Báo cáo doanh thu & Phân tích (UC06)' : 
                   activeTab === 'AI_BI' ? 'AI Hỏi Đáp Kinh Doanh Doanh Nghiệp (UC09)' :
                   activeTab === 'PRODUCTS' ? 'Quản lý kho hàng & Duyệt sản phẩm' : 
                   activeTab === 'SELLERS' ? 'Duyệt nhà bán hàng' :
                   activeTab === 'CONFIG' ? 'Cấu hình hệ thống' :
                   'Quản lý đơn hàng'}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
                {/* UC06 EXTEND: EXCEL & PDF EXPORT BUTTONS */}
                {onNavigateToHome && (
                  <button
                    onClick={onNavigateToHome}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Chuyển sang giao diện website cửa hàng (với thanh Admin Control Bar gắn trên đầu)"
                  >
                    <Store size={14} className="text-purple-600" />
                    <span>Xem Cửa Hàng (Shop)</span>
                  </button>
                )}

                <button
                    onClick={handleExportExcel}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    title="Xuất file Excel (CSV UTF-8) có dấu chuẩn"
                >
                    <FileSpreadsheet size={15} /> Xuất Excel
                </button>

                <button
                    onClick={handleExportPDF}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    title="In ấn hoặc lưu file PDF báo cáo"
                >
                    <Printer size={15} /> Xuất PDF
                </button>

                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                    <Calendar size={13} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">28/12/2024</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs ring-2 ring-white shadow-sm">AD</div>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
            
            {/* --- TAB: AI_BI (UC09: AI HỎI ĐÁP KINH DOANH) --- */}
            {activeTab === 'AI_BI' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center">
                                <Sparkles className="text-amber-300" size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-wide">Trợ Lý AI Hỏi Đáp Kinh Doanh Doanh Nghiệp (UC09)</h3>
                                <p className="text-xs text-purple-200">Phân tích chuyên sâu tình hình kinh doanh, dự báo doanh số & khuyến nghị chiến lược điều hành cho Chủ shop</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-xs text-slate-500 font-medium">Tăng trưởng doanh thu (MoM)</span>
                            <h4 className="text-xl font-black text-emerald-600 mt-1">+14.8%</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Đạt 142.5 triệu đồng</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-xs text-slate-500 font-medium">Biên lợi nhuận gộp</span>
                            <h4 className="text-xl font-black text-purple-700 mt-1">34.2%</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Cao hơn trung bình ngành (28%)</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-xs text-slate-500 font-medium">Tỷ lệ đổi trả hàng (UC10)</span>
                            <h4 className="text-xl font-black text-blue-600 mt-1">1.8%</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Ngưỡng an toàn tối ưu (&lt; 3%)</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-xs text-slate-500 font-medium">Khách quay lại mua tiếp</span>
                            <h4 className="text-xl font-black text-amber-600 mt-1">42.5%</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Hiệu quả tích điểm (UC03)</p>
                        </div>
                    </div>

                    {/* AI Executive Recommendations & Q&A Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <Sparkles className="text-purple-600" size={16} /> Các Câu Hỏi Kinh Doanh Phổ Biến Cho AI:
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { q: 'Dự báo doanh thu 7 ngày tới?', a: 'Dự kiến đạt 185.000.000đ khi kết hợp chương trình Payday và đẩy mạnh quảng cáo danh mục Thời trang nam.' },
                                    { q: 'Mặt hàng nào mang lại lợi nhuận gộp cao nhất?', a: 'Áo Thun Cao Cấp DIOR (Biên lợi nhuận 41%) và Giày Sneaker Retro (Biên lợi nhuận 38%).' },
                                    { q: 'Cần làm gì để giảm chi phí tồn kho?', a: 'Áp dụng AI Khuyến nghị kho (UC08) để nhập đúng số lượng đề xuất và chạy Flash Sale xả 2 mặt hàng tồn chậm.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 text-xs space-y-1">
                                        <div className="font-bold text-purple-900">❓ {item.q}</div>
                                        <div className="text-slate-700 leading-relaxed">💡 {item.a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" size={16} /> Đề Xuất Kế Hoạch Tuần Mới:
                            </h4>
                            <ul className="text-xs text-slate-700 space-y-3">
                                <li className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                                    <span>Tăng hạn mức đặt hàng thêm <strong>100 chiếc Áo Polo</strong> theo khuyến nghị kho trước khi bước vào đợt khuyến mãi cuối tháng.</span>
                                </li>
                                <li className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                                    <span>Gửi tin nhắn ưu đãi voucher độc quyền cho nhóm khách hàng hạng <strong>Kim Cương & Vàng</strong> để kích cầu đơn hàng tại quầy POS.</span>
                                </li>
                                <li className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                                    <span>Thường xuyên tra cứu với <strong>AI Copilot</strong> góc phải màn hình để nhận tư vấn tức thì mọi lúc mọi nơi.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: DASHBOARD (REVENUE) --- */}
            {activeTab === 'DASHBOARD' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard title="Tổng doanh thu" value="142.5M" sub="+12.5% so với tuần trước" icon={DollarSign} color="green" />
                        <StatsCard title="Đơn hàng mới" value="1,240" sub="+5.2% so với tuần trước" icon={Package} color="blue" />
                        <StatsCard title="Khách hàng mới" value="350" sub="+2.4% so với tuần trước" icon={Users} color="orange" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart Section */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Biểu đồ doanh thu (7 ngày)</h3>
                                <select className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2 py-1 outline-none">
                                    <option>Tuần này</option>
                                    <option>Tháng này</option>
                                </select>
                            </div>
                            <SimpleLineChart data={REVENUE_DATA} />
                        </div>

                        {/* Top Products */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Top sản phẩm bán chạy</h3>
                            <div className="space-y-4">
                                {products.slice(0, 4).map((p, i) => (
                                    <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                            #{i + 1}
                                        </span>
                                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-50" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.soldCount} đã bán</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: ORDERS --- */}
            {activeTab === 'ORDERS' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full animate-fade-in">
                    {/* Filter Bar */}
                    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            {[
                                { id: 'ALL', label: 'Tất cả' }, 
                                { id: OrderStatus.PENDING, label: 'Chờ duyệt' },
                                { id: OrderStatus.PAID, label: 'Đã thanh toán' },
                                { id: OrderStatus.SHIPPING, label: 'Đang giao' },
                                { id: OrderStatus.CANCELLED, label: 'Đã hủy' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setOrderFilter(tab.id as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${orderFilter === tab.id ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Tìm mã đơn, khách hàng..." 
                                value={orderSearch}
                                onChange={(e) => setOrderSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 w-full md:w-64" 
                            />
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-auto flex-1 font-arial-stylized">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Mã đơn</th>
                                    <th className="px-6 py-4">Ngày đặt</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Tổng tiền</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.filter(o => 
                                    (orderFilter === 'ALL' || o.status === orderFilter) && 
                                    (o.id.toLowerCase().includes(orderSearch.toLowerCase()) || (o as any).customer.toLowerCase().includes(orderSearch.toLowerCase()))
                                ).map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 group transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-brand-600">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-xs text-gray-400">Khách vãng lai</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1
                                                ${order.status === OrderStatus.PAID ? 'bg-green-100 text-green-700' : 
                                                  order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                                                  order.status === OrderStatus.SHIPPING ? 'bg-blue-100 text-blue-700' :
                                                  order.status === OrderStatus.CANCELLED ? 'bg-gray-100 text-gray-500' :
                                                  'bg-purple-100 text-purple-700'}`}>
                                                {order.status === OrderStatus.SHIPPING && <Truck size={10} />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.status === OrderStatus.PENDING && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.SHIPPING)}
                                                            className="px-3 py-1.5 text-xs bg-brand-600 text-white hover:bg-brand-700 rounded-md font-bold shadow-sm transition-colors flex items-center gap-1" title="Duyệt đơn và giao hàng">
                                                            <CheckCircle size={14} /> Duyệt đơn
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.CANCELLED)}
                                                            className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md font-bold transition-colors flex items-center gap-1" title="Hủy đơn hàng">
                                                            <XCircle size={14} /> Hủy
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === OrderStatus.PAID && (
                                                    <button 
                                                        onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.SHIPPING)}
                                                        className="px-3 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-md font-bold shadow-sm transition-colors flex items-center gap-1" title="Giao cho vận chuyển">
                                                        <Truck size={14} /> Giao hàng
                                                    </button>
                                                )}
                                                {order.status === OrderStatus.SHIPPING && (
                                                     <span className="text-xs text-gray-400 italic">Đang giao...</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB: PRODUCTS --- */}
            {activeTab === 'PRODUCTS' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800">Danh sách sản phẩm ({products.length})</h3>
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 flex items-center gap-2">
                             <ShieldCheck size={16} className="text-brand-600"/>
                             Chỉ duyệt sản phẩm seller đăng
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => {
                            const approvalStatus = (product as any).approvalStatus || 'APPROVED';
                            return (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                <div className="aspect-[4/3] bg-gray-100 relative">
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    {approvalStatus === 'PENDING' && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg">
                                            <button onClick={() => handleReviewProduct(product.id, 'APPROVED')} className="p-1.5 hover:bg-green-100 text-green-600 rounded" title="Duyệt sản phẩm"><CheckCircle size={16}/></button>
                                            <button onClick={() => handleReviewProduct(product.id, 'REJECTED')} className="p-1.5 hover:bg-red-100 text-red-600 rounded" title="Từ chối sản phẩm"><XCircle size={16}/></button>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        Kho: {product.stock}
                                    </div>
                                    {product.category && (
                                        <div className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded shadow-sm">
                                            {product.category}
                                        </div>
                                    )}
                                    <div className={`absolute bottom-2 right-2 text-white text-[10px] px-2 py-1 rounded shadow-sm ${
                                        approvalStatus === 'APPROVED'
                                            ? 'bg-green-600'
                                            : approvalStatus === 'REJECTED'
                                                ? 'bg-red-600'
                                                : 'bg-yellow-600'
                                    }`}>
                                        {approvalStatus === 'APPROVED' ? 'Đã duyệt' : approvalStatus === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 truncate mb-1" title={product.name}>{product.name}</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-red-600 font-bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                        <span className="text-xs text-gray-400">#{product.id}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}

            {/* --- TAB: SELLERS --- */}
            {activeTab === 'SELLERS' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full animate-fade-in">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800">Danh sách nhà bán hàng đăng ký</h3>
                    </div>
                    <div className="overflow-auto flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sellers.map(seller => (
                                <div key={seller.id} className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-gray-50 relative">
                                    {seller.status === 'PENDING' && <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-sm shadow-yellow-200/50"></div>}
                                    {seller.status === 'APPROVED' && <div className="absolute top-4 right-4"><CheckCircle size={16} className="text-green-500"/></div>}
                                    {seller.status === 'REJECTED' && <div className="absolute top-4 right-4"><XCircle size={16} className="text-red-500"/></div>}
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center text-xl shadow-inner font-bold text-brand-600">
                                            {seller.shopName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{seller.shopName}</h4>
                                            <p className="text-xs text-gray-500">{seller.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Mã KH:</span> <span className="font-medium">{seller.id}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-700">{seller.email}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Ngày ĐK:</span> <span className="font-medium">{seller.date}</span></div>
                                    </div>
                                    
                                    {seller.status === 'PENDING' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleApproveSeller(seller.id)} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"><CheckCircle size={16}/> Duyệt</button>
                                            <button onClick={() => handleRejectSeller(seller.id)} className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 rounded-lg py-2 text-sm font-bold shadow-sm transition-colors">Từ chối</button>
                                        </div>
                                    ) : (
                                        <button disabled className="w-full bg-gray-100 text-gray-400 rounded-lg py-2 text-sm font-bold border border-gray-200 cursor-not-allowed">
                                            Đã xử lý
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: CONFIG --- */}
            {activeTab === 'CONFIG' && (
                <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><Settings size={18}/> Cài đặt hệ thống chung</h3>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900">Bảo trì hệ thống</h4>
                                <p className="text-xs text-gray-500">Tắt truy cập dành cho người dùng mua hàng</p>
                            </div>
                            <button onClick={() => setConfig({...config, maintenance: !config.maintenance})} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${config.maintenance ? 'bg-red-500' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${config.maintenance ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900">Duyệt tự động đơn hàng</h4>
                                <p className="text-xs text-gray-500">Tự động chuyển Pending sang Shipping</p>
                            </div>
                            <button onClick={() => setConfig({...config, autoApprove: !config.autoApprove})} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${config.autoApprove ? 'bg-brand-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${config.autoApprove ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><DollarSign size={18}/> Cài đặt Tài chính & Hoa hồng</h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Tỉ lệ phần trăm hoa hồng (%)</label>
                            <p className="text-xs text-gray-500 mb-3">Mức phí thu về từ giao dịch của nhà bán hàng trên mỗi đơn thành công.</p>
                            <div className="flex gap-4 items-center">
                                <input 
                                    type="number" 
                                    className="border border-gray-300 rounded-lg p-3 w-32 focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                                    value={config.commission}
                                    onChange={(e) => setConfig({...config, commission: Number(e.target.value)})}
                                />
                                <span className="text-gray-500 font-medium text-lg">%</span>
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
                            <button onClick={() => alert("Đã lưu các thiết lập cấu hình!")} className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* --- PRODUCT FORM MODAL --- */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-800">{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                      <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                              <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={productForm.name}
                                onChange={e => setProductForm({...productForm, name: e.target.value})}
                              />
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                              <div className="relative">
                                  <select 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none appearance-none bg-white"
                                    value={productForm.category}
                                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                                  >
                                      {dbCategories.map(cat => (
                                          <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                              <input 
                                type="number" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={productForm.price}
                                onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                              />
                          </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                              <input 
                                type="number" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={productForm.stock}
                                onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})}
                              />
                          </div>
                          <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh (URL)</label>
                              <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="https://example.com/image.jpg"
                                    value={productForm.images?.[0] || ''}
                                    onChange={e => setProductForm({...productForm, images: [e.target.value]})}
                                  />
                                  <div className="w-10 h-10 border rounded bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                      {productForm.images?.[0] ? <img src={productForm.images[0]} alt="" className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-gray-400"/>}
                                  </div>
                              </div>
                          </div>
                          <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                              <textarea 
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                                value={productForm.description}
                                onChange={e => setProductForm({...productForm, description: e.target.value})}
                              ></textarea>
                          </div>
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                      <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">Hủy bỏ</button>
                      <button onClick={handleSaveProduct} className="px-6 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg font-bold shadow-md shadow-brand-200 transition-all transform active:scale-95">
                          {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;