import React, { useState } from 'react';
import { 
  Package, AlertTriangle, ArrowLeft, Plus, Search, 
  CheckCircle, FileText, Sparkles, X, DollarSign, BarChart3,
  RotateCcw, Tag, CheckCircle2, Edit3, Smartphone, Flame, Boxes
} from 'lucide-react';
import { ProductDetail, StockImportTicket, ReturnRequest, UserRole } from '../types';
import PortalTopBar from './PortalTopBar';

interface WarehousePageProps {
  products: ProductDetail[];
  onBack: () => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  importTickets: StockImportTicket[];
  onAddImportTicket: (ticket: StockImportTicket) => void;
  returnRequests?: ReturnRequest[];
  onAddProduct?: (product: ProductDetail) => void;
  userRole?: string;
  currentUser?: { name?: string; email?: string; role?: string } | null;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
}

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

const APPLE_SUPPLIERS = [
  'Apple Vietnam Distribution (Digiworld / Synnex FPT)',
  'Synnex FPT Distribution (Đối tác Ủy quyền Apple VN/A)',
  'Viettel Commerce (Tổng kho Apple Chính Ngạch)',
  'Petrovietnam PSD (Nhà Phân Phối Apple Chính Hãng)'
];

const getColorBadgeStyle = (id: string, colorName: string = '') => {
  const c = colorName.toLowerCase();
  if (id === 'ip-18-promax' || c.includes('đỏ rượu vang')) return { dot: '#9e1b32', bg: 'bg-rose-950/15 text-rose-900 border-rose-300', imgFilter: 'hue-rotate(332deg) saturate(1.45)' };
  if (id === 'ip-18-pro' || c.includes('lục bảo')) return { dot: '#0f5e46', bg: 'bg-emerald-950/15 text-emerald-900 border-emerald-300', imgFilter: 'hue-rotate(122deg) saturate(1.35)' };
  if (id === 'ip-18' || c.includes('hồng ánh sao')) return { dot: '#d96b94', bg: 'bg-pink-100 text-pink-900 border-pink-300', imgFilter: 'hue-rotate(295deg) saturate(1.25)' };
  if (id === 'ip-17-promax' || c.includes('cam vũ trụ')) return { dot: '#e85d24', bg: 'bg-orange-100 text-orange-900 border-orange-300', imgFilter: 'saturate(1.18)' };
  if (id === 'ip-17-pro' || c.includes('xanh lam')) return { dot: '#1d4ed8', bg: 'bg-blue-100 text-blue-900 border-blue-300', imgFilter: 'hue-rotate(192deg) saturate(1.45)' };
  if (id === 'ip-17-air' || c.includes('băng giá')) return { dot: '#38bdf8', bg: 'bg-sky-100 text-sky-900 border-sky-300', imgFilter: 'none' };
  if (id === 'ip-16-promax' || c.includes('sa mạc') || c.includes('vàng')) return { dot: '#c5a059', bg: 'bg-amber-100 text-amber-900 border-amber-300', imgFilter: 'sepia(0.28) saturate(1.35)' };
  if (c.includes('tím')) return { dot: '#7e22ce', bg: 'bg-purple-100 text-purple-900 border-purple-300', imgFilter: 'none' };
  return { dot: '#78716c', bg: 'bg-stone-100 text-stone-800 border-stone-300', imgFilter: 'none' };
};

export const WarehousePage: React.FC<WarehousePageProps> = ({
  products,
  onBack,
  onUpdateStock,
  importTickets,
  onAddImportTicket,
  returnRequests = [],
  onAddProduct,
  userRole = 'WAREHOUSE',
  currentUser,
  onSwitchRole,
  onLogout,
  onNavigateAdminTab,
  onNavigateCSKH
}) => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'LOW_STOCK' | 'IMPORT_HISTORY' | 'AI_RECOMMEND' | 'PRODUCTS' | 'RETURNS_RESTOCK'>('INVENTORY');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal Lập Phiếu Nhập Kho (UC05)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSupplier, setImportSupplier] = useState(APPLE_SUPPLIERS[0]);
  const [importNote, setImportNote] = useState('Nhập lô Flagship iPhone VN/A nguyên seal chính hãng bổ sung tồn kho Showroom');
  const [importItems, setImportItems] = useState<{ productId: string; quantity: number; importPrice: number }[]>([
    { productId: products[0]?.id || 'ip-18-promax', quantity: 25, importPrice: Math.round((products[0]?.price || 37990000) * 0.86) }
  ]);

  // Modal Thêm Sản Phẩm Mới (UC02)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: 'iPhone 18 Ultra 512GB | Chính hãng VN/A',
    category: 'iPhone 18 Series (Flagship 2026)',
    color: 'Titan Đỏ Rượu Vang (Burgundy)',
    price: 41990000,
    stock: 25,
    description: 'Siêu phẩm iPhone 18 Ultra chip A20 Pro 2nm, khung viền Titanium cấp độ 5, bảo hành chính hãng Apple Việt Nam 12 tháng.',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg'
  });

  // Modal Sửa Giá & Tồn Kho (UC02)
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  // Quality inspection & restocked map for returned items (UC10)
  const [inspectedStatus, setInspectedStatus] = useState<Record<string, 'PASSED' | 'DEFECTIVE'>>({});
  const [restockedMap, setRestockedMap] = useState<Record<string, boolean>>({});

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category || 'iPhone 18 Series (Flagship 2026)')))];

  // Ngưỡng cảnh báo sắp hết hàng cho điện thoại iPhone: stock <= 25
  const LOW_STOCK_THRESHOLD = 25;
  const lowStockProducts = products.filter(p => p.stock <= LOW_STOCK_THRESHOLD);

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

  // Top 4 Model Hot Hit 2026 để Thủ Kho giám sát ưu tiên
  const hotHitModels = products.filter(p => ['ip-18-promax', 'ip-18-pro', 'ip-17-promax', 'ip-16-promax'].includes(p.id));

  // Lọc sản phẩm
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.colors?.[0] || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Xử lý tạo phiếu nhập kho
  const handleCreateImportTicket = () => {
    if (importItems.length === 0 || importItems.some(i => i.quantity <= 0)) {
      alert('Vui lòng kiểm tra lại số lượng máy iPhone nhập kho!');
      return;
    }

    const ticketItems = importItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'iPhone Chính Hãng VN/A',
        quantity: item.quantity,
        importPrice: item.importPrice
      };
    });

    const totalQty = ticketItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalCost = ticketItems.reduce((sum, i) => sum + i.quantity * i.importPrice, 0);

    const newTicket: StockImportTicket = {
      id: `ticket-${Date.now()}`,
      code: `NK-VNA-${Date.now().toString().slice(-4)}`,
      supplier: importSupplier,
      importDate: new Date().toLocaleString('vi-VN'),
      creator: currentUser?.name || 'Trần Văn Kho (Thủ kho VN/A)',
      items: ticketItems,
      totalQuantity: totalQty,
      totalCost: totalCost,
      note: importNote,
      status: 'COMPLETED'
    };

    ticketItems.forEach(item => {
      const currentProd = products.find(p => p.id === item.productId);
      const newStock = (currentProd?.stock || 0) + item.quantity;
      onUpdateStock(item.productId, newStock);
    });

    onAddImportTicket(newTicket);
    setIsImportModalOpen(false);
    alert(`✅ Đã lập thành công Phiếu Nhập Kho ${newTicket.code}!\nĐã cộng thêm +${totalQty} máy iPhone VN/A nguyên seal vào kho Thế Giới iPhone.`);
  };

  // Mở modal nhập kho nhanh
  const handleQuickReorder = (productId: string, qty: number = 20) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setImportItems([{
      productId: prod.id,
      quantity: qty,
      importPrice: Math.round(prod.price * 0.86)
    }]);
    setImportNote(`Nhập bổ sung lô máy Hot Hit [${prod.name} - ${prod.colors?.[0] || 'VN/A'}] nguyên seal`);
    setIsImportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C4B49E] via-[#BBA992] to-[#B2A088] flex flex-col font-sans">
      {/* 1. Unified Boutique Top Bar */}
      <PortalTopBar
        userRole={userRole}
        currentUser={currentUser}
        pendingReturnsCount={returnRequests.filter(r => r.status === 'PENDING').length}
        onNavigateAdminTab={onNavigateAdminTab}
        onNavigateCSKH={onNavigateCSKH}
        onNavigateWarehouse={() => setActiveTab('INVENTORY')}
        onNavigateHome={onBack}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />

      {/* 2. Luxury Titanium Warehouse Header */}
      <header className="bg-gradient-to-r from-[#1e1d1a] via-[#26231f] to-[#1e1d1a] text-stone-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl border-b border-[#c5a880]/40">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="px-3 py-2 bg-[#2e2a24] hover:bg-[#3d372e] border border-[#c5a880]/40 rounded-xl text-[#e5c9a3] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft size={15} /> Về Showroom
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4b996] to-[#8c6f46] flex items-center justify-center font-black text-[#1e1d1a] shadow-md">
              <Boxes size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white">
                  KHO TRUNG TÂM THẾ GIỚI IPHONE • QUẢN LÝ TỒN KHO VN/A
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4b996]/20 text-[#e5c9a3] border border-[#d4b996]/40 text-[10px] font-bold uppercase tracking-wider">
                  Tác nhân: Nhân Viên Kho
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Kiểm kê 25 mã iPhone (4s ➔ 18 Pro Max), giám sát màu máy độc bản, nhập lô VN/A & AI dự báo kho
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="px-3.5 py-2 bg-[#2e2a24] hover:bg-[#3d372e] text-[#e5c9a3] border border-[#c5a880]/40 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone size={15} /> + Thêm Mã iPhone Mới
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#d4b996] to-[#b89768] hover:brightness-105 text-[#1e1d1a] font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> Lập Phiếu Nhập Lô VN/A
          </button>
        </div>
      </header>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5 flex-1">
        {/* 3. KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#d4b996]/50 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-semibold">Danh mục máy cửa hàng</span>
              <h3 className="text-2xl font-black text-stone-900 mt-0.5">{products.length} mẫu iPhone</h3>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">Mỗi mẫu 1 màu Titan độc bản</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#1e1d1a] text-[#e5c9a3] flex items-center justify-center shadow-sm">
              <Smartphone size={22} />
            </div>
          </div>

          <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#d4b996]/50 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-semibold">Tổng máy nguyên seal trong kho</span>
              <h3 className="text-2xl font-black text-stone-900 mt-0.5">{totalInventoryUnits.toLocaleString('vi-VN')} máy</h3>
              <p className="text-[11px] text-stone-500 mt-1">100% Chính hãng Apple VN/A</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-900 text-emerald-200 flex items-center justify-center shadow-sm">
              <BarChart3 size={22} />
            </div>
          </div>

          <div className="bg-[#faf8f5] p-4 rounded-2xl border border-amber-400/70 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-900 font-bold">Mã máy sắp chạm đáy (&le; {LOW_STOCK_THRESHOLD} máy)</span>
              <h3 className="text-2xl font-black text-amber-900 mt-0.5">{lowStockProducts.length} mã máy</h3>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">Cần nhập bổ sung từ Apple VN</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#d4b996]/50 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-semibold">Tổng giá trị tài sản kho</span>
              <h3 className="text-2xl font-black text-[#8c6f46] mt-0.5">
                {(totalInventoryValue / 1000000000).toFixed(2)} Tỷ ₫
              </h3>
              <p className="text-[11px] text-stone-500 mt-1">{importTickets.length} phiếu nhập lô VN/A</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#8c6f46] text-white flex items-center justify-center shadow-sm">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* 4. KỆ GIÁM SÁT NHANH TOP MODEL HOT HIT 2026 */}
        <div className="bg-gradient-to-r from-[#1e1d1a] via-[#28241e] to-[#1e1d1a] rounded-2xl p-4 sm:p-5 border border-[#c5a880]/40 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Flame size={13} /> Model Hot Hit 2026
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#e5c9a3]">
                Giám Sát Nhanh Tồn Kho Các Siêu Phẩm Chủ Lực Của Shop
              </h2>
            </div>
            <span className="text-[11px] text-stone-400">
              Bấm <strong className="text-[#e5c9a3]">+ Nhập Nhanh 20 Máy</strong> để lập phiếu nhập ngay cho dòng đang cháy hàng
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {hotHitModels.map(model => {
              const colorMeta = getColorBadgeStyle(model.id, model.colors?.[0]);
              return (
                <div
                  key={model.id}
                  className="bg-[#faf8f5] rounded-xl p-3.5 border border-[#d4b996]/60 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={model.images?.[0]}
                        alt={model.name}
                        style={{ filter: colorMeta.imgFilter }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorMeta.dot }} />
                        <span className="text-[10px] font-bold text-stone-600 truncate">
                          {model.colors?.[0] || 'Titan Đặc Biệt'}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-stone-900 line-clamp-1 mt-0.5" title={model.name}>
                        {model.name.replace(' | Chính hãng VN/A', '')}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-rose-700">
                          {new Intl.NumberFormat('vi-VN').format(model.price)}₫
                        </span>
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          Kho: {model.stock} máy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 gap-2">
                    <span className="text-[10px] text-stone-500 font-semibold">
                      Đã bán: <strong className="text-stone-800">{model.soldCount || 1200}</strong>
                    </span>
                    <button
                      onClick={() => handleQuickReorder(model.id, 20)}
                      className="px-3 py-1.5 rounded-lg bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={12} /> Nhập Nhanh 20 Máy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Main Tabs Navigation */}
        <div className="bg-[#faf8f5] rounded-2xl p-1.5 border border-[#d4b996]/50 shadow-sm flex flex-wrap gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'INVENTORY'
                ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <Package size={15} /> Bảng Tồn Kho 25 Mã iPhone ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('LOW_STOCK')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'LOW_STOCK'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <AlertTriangle size={15} /> Cảnh Báo Sắp Hết Hàng
            {lowStockProducts.length > 0 && (
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px]">
                {lowStockProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('AI_RECOMMEND')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'AI_RECOMMEND'
                ? 'bg-gradient-to-r from-[#8c6f46] to-[#6e5534] text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <Sparkles size={15} /> AI Dự Báo Nhập Kho iPhone
          </button>

          <button
            onClick={() => setActiveTab('IMPORT_HISTORY')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'IMPORT_HISTORY'
                ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <FileText size={15} /> Phiếu Nhập Lô VN/A ({importTickets.length})
          </button>

          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PRODUCTS'
                ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <Tag size={15} /> Điều Chỉnh Giá & Danh Mục
          </button>

          <button
            onClick={() => setActiveTab('RETURNS_RESTOCK')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'RETURNS_RESTOCK'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <RotateCcw size={15} /> Kiểm Định Máy Đổi Trả
            {returnRequests.filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED').length > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px]">
                {returnRequests.filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED').length}
              </span>
            )}
          </button>
        </div>

        {/* 6. Tab Contents */}
        <div>
          {/* TAB 1: ALL INVENTORY */}
          {activeTab === 'INVENTORY' && (
            <div className="bg-[#faf8f5] rounded-2xl shadow-md border border-[#d4b996]/50 overflow-hidden flex flex-col">
              {/* Filter bar */}
              <div className="p-4 border-b border-stone-200 flex flex-col lg:flex-row gap-3 justify-between items-center bg-stone-100/70">
                <div className="relative w-full lg:w-96">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="Tìm theo tên máy (VD: 18 Pro Max, 17 Air), mã SKU hoặc màu sắc..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#8c6f46] outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-sm'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat === 'ALL' ? `Tất cả (${products.length})` : cat.replace(' (Flagship 2026)', '').replace(' & Sưu Tầm (4s - XS Max)', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-200/70 text-stone-700 font-black uppercase tracking-wider border-b border-stone-300 text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Mẫu Máy iPhone & SKU</th>
                      <th className="py-3.5 px-4">Màu Độc Bản (25 Màu)</th>
                      <th className="py-3.5 px-4">Phân Khúc Series</th>
                      <th className="py-3.5 px-4">Giá Niêm Yết VN/A</th>
                      <th className="py-3.5 px-4 text-center">Tồn Kho (Máy)</th>
                      <th className="py-3.5 px-4">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác Thủ Kho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    {filteredProducts.map(prod => {
                      const isLow = prod.stock <= LOW_STOCK_THRESHOLD;
                      const isOut = prod.stock <= 0;
                      const primaryColor = prod.colors?.[0] || 'Titan Tự Nhiên';
                      const colorMeta = getColorBadgeStyle(prod.id, primaryColor);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-100/80 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0">
                              <img 
                                src={prod.images?.[0]} 
                                alt={prod.name}
                                style={{ filter: colorMeta.imgFilter }}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="font-black text-stone-900">{prod.name}</div>
                              <span className="text-[10px] text-stone-500 font-mono">
                                SKU: {prod.id} • Dung lượng: {(prod.sizes || ['256GB', '512GB']).join(' / ')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${colorMeta.bg}`}>
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorMeta.dot }} />
                              {primaryColor}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-stone-200/70 text-stone-800 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                              {prod.category || 'iPhone Series'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-rose-700 font-mono">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block font-black text-sm px-3 py-0.5 rounded-lg ${
                              isOut ? 'bg-red-100 text-red-700' : isLow ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {prod.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isOut 
                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                : isLow 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                              {isOut ? 'Đứt hàng' : isLow ? 'Cần nhập thêm' : 'Sẵn hàng VN/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleQuickReorder(prod.id, 15)}
                                className="px-2.5 py-1.5 bg-[#1e1d1a] text-[#e5c9a3] hover:bg-[#332e27] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                + Nhập Lô
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setEditPrice(prod.price);
                                  setEditStock(prod.stock);
                                }}
                                className="px-2.5 py-1.5 bg-stone-200/80 text-stone-800 hover:bg-stone-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Sửa Tồn / Giá
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LOW STOCK ALERTS */}
          {activeTab === 'LOW_STOCK' && (
            <div className="space-y-4">
              <div className="bg-[#faf8f5] border border-amber-400 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-stone-900">Cảnh Báo Tồn Kho Tối Thiểu Cho Cửa Hàng iPhone (&le; {LOW_STOCK_THRESHOLD} máy)</h4>
                    <p className="text-xs text-stone-600">Các mã máy dưới đây cần lập phiếu nhập bổ sung từ Apple Vietnam Distribution để đảm bảo đủ máy giao ngay 2h.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setImportItems(lowStockProducts.map(p => ({
                      productId: p.id,
                      quantity: 20,
                      importPrice: Math.round(p.price * 0.86)
                    })));
                    setImportNote('Nhập bổ sung toàn bộ các mã iPhone chạm ngưỡng cảnh báo tồn kho');
                    setIsImportModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow transition-colors cursor-pointer"
                >
                  Nhập Kho Toàn Bộ ({lowStockProducts.length} mã iPhone)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.map(prod => {
                  const colorMeta = getColorBadgeStyle(prod.id, prod.colors?.[0]);
                  return (
                    <div key={prod.id} className="bg-[#faf8f5] p-4 rounded-2xl border border-amber-300 shadow-sm flex flex-col justify-between space-y-3">
                      <div className="flex gap-3 items-start">
                        <img 
                          src={prod.images?.[0]} 
                          alt={prod.name}
                          style={{ filter: colorMeta.imgFilter }}
                          className="w-16 h-16 object-contain rounded-xl bg-white p-1 shrink-0 border border-stone-200"
                        />
                        <div>
                          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                            CÒN LẠI: {prod.stock} MÁY
                          </span>
                          <h4 className="font-black text-xs text-stone-900 mt-1 line-clamp-2">{prod.name}</h4>
                          <span className="text-[11px] text-stone-600 font-semibold block mt-0.5">
                            Màu: {prod.colors?.[0]}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between">
                        <span className="font-black text-xs text-rose-700">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                        </span>
                        <button
                          onClick={() => handleQuickReorder(prod.id, 25)}
                          className="px-3 py-1.5 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={14} /> Lập phiếu nhập (+25 máy)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI KHUYẾN NGHỊ KHO (UC08) */}
          {activeTab === 'AI_RECOMMEND' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#1e1d1a] via-[#2c261e] to-[#1e1d1a] text-white p-5 rounded-2xl shadow-md border border-[#c5a880]/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#e5c9a3]" />
                  <h3 className="font-black text-base tracking-wide text-[#e5c9a3]">
                    Thế Giới iPhone AI — Hệ Thống Dự Báo & Khuyến Nghị Nhập Kho
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                  Phân tích tốc độ bán ra thực tế tại Showroom & Online cho 25 mã iPhone. Tự động đề xuất nhập thêm các phiên bản màu Titan đang cháy hàng (18 Pro Max Đỏ Rượu Vang, 17 Pro Max Cam Vũ Trụ) và gợi ý gói kích cầu cho dòng sưu tầm.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-rose-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
                      <h4 className="font-black text-sm text-stone-900">1. Nhóm Flagship Tốc Độ Bán Cực Nhanh (Cần Nhập Gấp)</h4>
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                      Ưu tiên số 1
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {products.slice(0, 4).map(prod => (
                      <div key={prod.id} className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-black text-xs text-stone-900">{prod.name}</div>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            Màu: <strong className="text-rose-700">{prod.colors?.[0]}</strong> • Tồn: <strong>{prod.stock} máy</strong> • Sức mua: <strong>~8 máy/ngày</strong>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-emerald-700 block">Đề xuất: +30 máy</span>
                          <button
                            onClick={() => handleQuickReorder(prod.id, 30)}
                            className="mt-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Nhập Lô Ngay
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-amber-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <h4 className="font-black text-sm text-stone-900">2. Nhóm Máy Sưu Tầm & Đời Cũ (Đề Xuất Combo Thu Cũ Đổi Mới)</h4>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Tối ưu vòng quay vốn
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {products.slice(-4).map(prod => (
                      <div key={prod.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-black text-xs text-stone-900">{prod.name}</div>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            Màu: <strong>{prod.colors?.[0]}</strong> • Tồn kho: <strong>{prod.stock} máy</strong>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-amber-800 block">Tặng kèm sạc 20W</span>
                          <button
                            onClick={() => alert(`✅ Đã kích hoạt gói ưu đãi Tặng Củ Sạc Apple 20W & Ốp lưng MagSafe cho [${prod.name}]!`)}
                            className="mt-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Bật Khuyến Mãi
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMPORT TICKETS HISTORY */}
          {activeTab === 'IMPORT_HISTORY' && (
            <div className="bg-[#faf8f5] rounded-2xl shadow-md border border-[#d4b996]/50 overflow-hidden">
              <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-100/70">
                <h3 className="font-black text-xs text-stone-900 uppercase tracking-wider">Sổ Nhật Ký Nhập Lô iPhone Chính Hãng VN/A</h3>
                <span className="text-xs font-bold text-[#8c6f46]">Tổng cộng: {importTickets.length} phiếu nhập</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-200/70 text-stone-700 font-black uppercase tracking-wider border-b border-stone-300">
                    <tr>
                      <th className="py-3 px-4">Mã Phiếu</th>
                      <th className="py-3 px-4">Thời Gian Nhập</th>
                      <th className="py-3 px-4">Nhà Phân Phối Apple VN/A</th>
                      <th className="py-3 px-4">Chi Tiết Lô Máy</th>
                      <th className="py-3 px-4 text-center">Tổng SL</th>
                      <th className="py-3 px-4 text-right">Tổng Vốn Nhập</th>
                      <th className="py-3 px-4 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    {importTickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-stone-100/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-[#8c6f46]">{ticket.code}</td>
                        <td className="py-3 px-4 text-stone-600">{ticket.importDate}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">{ticket.supplier}</td>
                        <td className="py-3 px-4">
                          {ticket.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] font-semibold text-stone-700">
                              • {it.productName} <strong className="text-emerald-700">(+{it.quantity} máy)</strong>
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-emerald-700">+{ticket.totalQuantity} máy</td>
                        <td className="py-3 px-4 text-right font-black text-rose-700 font-mono">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.totalCost)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            Đã nhập kho VN/A
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS & CATEGORY MANAGEMENT (UC02) */}
          {activeTab === 'PRODUCTS' && (
            <div className="bg-[#faf8f5] rounded-2xl shadow-md border border-[#d4b996]/50 overflow-hidden flex flex-col space-y-4 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <Tag size={18} className="text-[#8c6f46]" /> Quản Lý Danh Mục & Điều Chỉnh Giá 25 Mã iPhone
                  </h3>
                  <p className="text-xs text-stone-600">Cập nhật nhanh giá niêm yết, số lượng tồn kho và màu sắc độc bản cho từng dòng iPhone</p>
                </div>

                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-4 py-2 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={16} /> Thêm Mẫu iPhone Mới
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-200/70 text-stone-700 font-black uppercase tracking-wider border-b border-stone-300 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Ảnh</th>
                      <th className="py-3 px-4">Mã SKU</th>
                      <th className="py-3 px-4">Tên Máy iPhone</th>
                      <th className="py-3 px-4">Màu Đặc Trưng</th>
                      <th className="py-3 px-4 text-right">Giá Bán Niêm Yết</th>
                      <th className="py-3 px-4 text-center">Tồn Kho</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    {filteredProducts.map(prod => {
                      const colorMeta = getColorBadgeStyle(prod.id, prod.colors?.[0]);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-100/80 transition-colors">
                          <td className="py-2.5 px-4">
                            <img 
                              src={prod.images?.[0]} 
                              alt={prod.name}
                              style={{ filter: colorMeta.imgFilter }}
                              className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-stone-200"
                            />
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-stone-900">{prod.id}</td>
                          <td className="py-2.5 px-4 font-bold text-stone-900">{prod.name}</td>
                          <td className="py-2.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${colorMeta.bg}`}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMeta.dot }} />
                              {prod.colors?.[0]}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-black text-rose-700 font-mono">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                          </td>
                          <td className="py-2.5 px-4 text-center font-black font-mono">
                            {prod.stock}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setEditPrice(prod.price);
                                setEditStock(prod.stock);
                              }}
                              className="px-3 py-1 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-bold rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} /> Sửa Giá / Kho
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: RETURNS INSPECTION & RESTOCK (UC10) */}
          {activeTab === 'RETURNS_RESTOCK' && (
            <div className="bg-[#faf8f5] rounded-2xl shadow-md border border-[#d4b996]/50 overflow-hidden flex flex-col space-y-4 p-6">
              <div className="flex justify-between items-start pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <RotateCcw size={18} className="text-rose-600" /> Kiểm Định IMEI / Seal & Tái Nhập Kho Máy Đổi Trả
                  </h3>
                  <p className="text-xs text-stone-600">
                    Kiểm tra ngoại quan, số Serial/IMEI, tình trạng Pin và áp suất máy từ bộ phận Bán hàng & CSKH chuyển sang.
                  </p>
                </div>
              </div>

              {returnRequests.filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED').length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <RotateCcw size={36} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-stone-600">Hiện không có máy iPhone đổi trả nào chờ kiểm định tái nhập kho.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {returnRequests
                    .filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED')
                    .map(req => {
                      const isRestocked = restockedMap[req.id];
                      const inspection = inspectedStatus[req.id] || 'PASSED';

                      return (
                        <div 
                          key={req.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            isRestocked 
                              ? 'bg-emerald-50/70 border-emerald-300' 
                              : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-stone-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-rose-700">{req.id}</span>
                                <span className="text-xs text-stone-400">• Đơn gốc: <strong className="text-stone-800">{req.orderId}</strong></span>
                                <span className="text-xs text-stone-400">• Khách: <strong className="text-stone-800">{req.customerName}</strong> ({req.customerPhone})</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-0.5">
                                Lý do đổi trả: <em className="text-stone-800 font-semibold">"{req.reason}"</em>
                              </p>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isRestocked 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {isRestocked ? '✅ Đã Tái Nhập Kho VN/A' : 'Chờ Kỹ Thuật Kiểm Định'}
                            </span>
                          </div>

                          <div className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                              {req.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-xs text-stone-800">
                                  <Smartphone size={14} className="text-[#8c6f46] shrink-0" />
                                  <span className="font-bold">{item.name}</span>
                                  <span className="text-stone-500">SL: <strong>{item.quantity}</strong> máy</span>
                                  <span className="text-rose-700 font-mono font-bold">
                                    ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)})
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-stone-700">Kết quả kiểm định Apple:</span>
                              <select
                                disabled={isRestocked}
                                value={inspection}
                                onChange={(e) => setInspectedStatus({ ...inspectedStatus, [req.id]: e.target.value as any })}
                                className="p-1.5 border border-stone-300 rounded-lg text-xs font-bold outline-none bg-white disabled:opacity-60"
                              >
                                <option value="PASSED">Đạt Chuẩn (Nguyên Seal / Chưa Active / Pin 100%)</option>
                                <option value="DEFECTIVE">Lỗi Kỹ Thuật (Chuyển Bảo Hành Apple Care)</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            {isRestocked ? (
                              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                                <CheckCircle2 size={16} /> Đã cộng lại số lượng tồn kho thành công.
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (inspection === 'DEFECTIVE') {
                                    alert('Máy có lỗi kỹ thuật đã được lập biên bản gửi Trung tâm Bảo hành Ủy quyền Apple (AASP)!');
                                    return;
                                  }

                                  req.items.forEach(item => {
                                    const targetProd = products.find(p => p.name.includes(item.name) || item.name.includes(p.name)) || products[0];
                                    if (targetProd) {
                                      onUpdateStock(targetProd.id, targetProd.stock + item.quantity);
                                    }
                                  });

                                  const returnTicket: StockImportTicket = {
                                    id: `ticket-return-${req.id}`,
                                    code: `NK-HOAN-${req.id}`,
                                    supplier: `Khách đổi trả 1-1: ${req.customerName}`,
                                    importDate: new Date().toLocaleString('vi-VN'),
                                    creator: currentUser?.name || 'Trần Văn Kho (Thủ kho chính)',
                                    items: req.items.map(i => ({
                                      productId: products[0]?.id || 'ip-16-pro',
                                      productName: i.name,
                                      quantity: i.quantity,
                                      importPrice: i.price
                                    })),
                                    totalQuantity: req.items.reduce((s, i) => s + i.quantity, 0),
                                    totalCost: req.refundAmount,
                                    status: 'COMPLETED',
                                    note: `Tái nhập kho máy nguyên seal từ hồ sơ đổi trả ${req.orderId}`
                                  };
                                  onAddImportTicket(returnTicket);

                                  setRestockedMap({ ...restockedMap, [req.id]: true });
                                  alert(`✅ Kiểm định IMEI/Seal đạt chuẩn! Đã tái nhập kho thành công.`);
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 size={15} /> Xác Nhận Tái Nhập Kho
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Lập Phiếu Nhập Kho */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[#faf8f5] rounded-2xl max-w-xl w-full shadow-2xl border border-[#d4b996] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#1e1d1a] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#e5c9a3]" />
                <h3 className="font-black text-sm text-[#e5c9a3]">Lập Phiếu Nhập Lô iPhone Chính Hãng VN/A</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-stone-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Nhà Phân Phối Ủy Quyền Apple</label>
                  <select 
                    value={importSupplier}
                    onChange={e => setImportSupplier(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white font-semibold"
                  >
                    {APPLE_SUPPLIERS.map(sup => (
                      <option key={sup} value={sup}>{sup}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Thủ Kho Tiếp Nhận</label>
                  <input 
                    type="text" 
                    readOnly
                    value={currentUser?.name || 'Trần Văn Kho (Thủ kho VN/A)'}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-100 text-stone-700 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Ghi Chú Lô Hàng & Số Hợp Đồng</label>
                <input 
                  type="text"
                  value={importNote}
                  onChange={e => setImportNote(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex justify-between items-center">
                  <label className="font-black text-stone-800">Danh Sách Mã Máy iPhone Nhập Kho</label>
                  <button
                    type="button"
                    onClick={() => setImportItems([...importItems, { productId: products[0]?.id || 'ip-18-promax', quantity: 10, importPrice: Math.round((products[0]?.price || 37990000) * 0.86) }])}
                    className="text-[#8c6f46] hover:underline font-black text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    + Thêm dòng máy iPhone
                  </button>
                </div>

                {importItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={item.productId}
                        onChange={e => {
                          const newProd = products.find(p => p.id === e.target.value);
                          const updated = [...importItems];
                          updated[idx].productId = e.target.value;
                          if (newProd) updated[idx].importPrice = Math.round(newProd.price * 0.86);
                          setImportItems(updated);
                        }}
                        className="flex-1 p-2 border border-stone-300 rounded-lg bg-stone-50 text-xs font-bold outline-none"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — [{p.colors?.[0]}] (Tồn: {p.stock})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setImportItems(importItems.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-stone-500 text-[10px] font-semibold">Số lượng máy nhập:</span>
                        <input 
                          type="number" 
                          value={item.quantity}
                          min={1}
                          onChange={e => {
                            const updated = [...importItems];
                            updated[idx].quantity = parseInt(e.target.value, 10) || 0;
                            setImportItems(updated);
                          }}
                          className="w-full p-1.5 border border-stone-300 rounded-lg font-black text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] font-semibold">Giá vốn nhập sỉ VN/A (VNĐ):</span>
                        <input 
                          type="number" 
                          value={item.importPrice}
                          step={100000}
                          onChange={e => {
                            const updated = [...importItems];
                            updated[idx].importPrice = parseInt(e.target.value, 10) || 0;
                            setImportItems(updated);
                          }}
                          className="w-full p-1.5 border border-stone-300 rounded-lg font-black text-rose-700 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-stone-200/70 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Tổng số lượng máy nhập thêm:</span>
                  <span className="font-black text-emerald-800">
                    +{importItems.reduce((sum, i) => sum + i.quantity, 0)} máy VN/A
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm text-rose-700 pt-1 border-t border-stone-300">
                  <span>Tổng giá trị lô nhập:</span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      importItems.reduce((sum, i) => sum + i.quantity * i.importPrice, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end gap-2">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleCreateImportTicket}
                className="px-5 py-2 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-black text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle size={15} /> Xác Nhận Nhập Kho VN/A
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Mới Sản Phẩm iPhone (UC02) */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#faf8f5] rounded-2xl max-w-lg w-full shadow-2xl border border-[#d4b996] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#1e1d1a] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-[#e5c9a3]" />
                <h3 className="font-black text-sm text-[#e5c9a3]">Thêm Mẫu iPhone Mới Vào Kho</h3>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-stone-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProductForm.name) {
                  alert('Vui lòng nhập tên máy iPhone!');
                  return;
                }
                const newId = `ip-custom-${Date.now().toString().slice(-4)}`;
                const created: ProductDetail = {
                  id: newId,
                  name: newProductForm.name,
                  category: newProductForm.category,
                  rating: 5.0,
                  reviewCount: 18,
                  soldCount: 25,
                  price: newProductForm.price,
                  originalPrice: Math.round(newProductForm.price * 1.12),
                  discountRate: 10,
                  shippingFee: 0,
                  shippingEstimate: 'Giao hỏa tốc 2h nội thành',
                  colors: [newProductForm.color, 'Titan Tự Nhiên'],
                  sizes: ['256GB', '512GB', '1TB'],
                  stock: newProductForm.stock,
                  images: [newProductForm.image],
                  videoDuration: '',
                  description: newProductForm.description
                };

                if (onAddProduct) {
                  onAddProduct(created);
                } else {
                  products.push(created);
                }

                onAddImportTicket({
                  id: `ticket-${Date.now()}`,
                  code: `NK-NEW-${newId.toUpperCase()}`,
                  supplier: APPLE_SUPPLIERS[0],
                  importDate: new Date().toLocaleString('vi-VN'),
                  creator: currentUser?.name || 'Trần Văn Kho (Thủ kho chính)',
                  items: [{ productId: newId, productName: created.name, quantity: created.stock, importPrice: Math.round(created.price * 0.86) }],
                  totalQuantity: created.stock,
                  totalCost: Math.round(created.price * 0.86) * created.stock,
                  status: 'COMPLETED',
                  note: `Khởi tạo mẫu iPhone mới [${created.name}]`
                });

                setIsAddProductModalOpen(false);
                alert(`✅ Đã thêm mẫu máy "${created.name}" (${newProductForm.color}) với ${created.stock} máy tồn kho!`);
              }}
              className="p-6 overflow-y-auto space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-stone-700 font-bold mb-1">Tên Máy iPhone *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="VD: iPhone 18 Ultra 512GB | Chính hãng VN/A"
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Dòng Series</label>
                  <select
                    value={newProductForm.category}
                    onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white font-semibold"
                  >
                    {IPHONE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Màu Máy Đặc Trưng</label>
                  <input
                    type="text"
                    value={newProductForm.color}
                    onChange={e => setNewProductForm({ ...newProductForm, color: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Giá Bán Niêm Yết (VNĐ)</label>
                  <input
                    type="number"
                    step={100000}
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({ ...newProductForm, price: Number(e.target.value) || 0 })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white font-black text-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Số Lượng Tồn Ban Đầu</label>
                  <input
                    type="number"
                    min={1}
                    value={newProductForm.stock}
                    onChange={e => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) || 0 })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Link Ảnh Sản Phẩm (URL)</label>
                <input
                  type="text"
                  value={newProductForm.image}
                  onChange={e => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white text-[11px]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Thông Số & Mô Tả</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={e => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-black rounded-xl transition flex items-center gap-1 shadow cursor-pointer"
                >
                  <CheckCircle size={15} /> Lưu & Nhập Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Sửa Giá & Tồn Kho (UC02) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#faf8f5] rounded-2xl max-w-sm w-full shadow-2xl border border-[#d4b996] overflow-hidden flex flex-col">
            <div className="p-4 bg-[#1e1d1a] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-[#e5c9a3]" />
                <h3 className="font-black text-sm text-[#e5c9a3]">Cập Nhật Giá & Tồn Kho</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <span className="text-stone-500 text-[10px] block">Mã SKU: {editingProduct.id}</span>
                <p className="font-black text-stone-900 text-sm mt-0.5">{editingProduct.name}</p>
                <span className="text-[11px] font-bold text-[#8c6f46]">Màu: {editingProduct.colors?.[0]}</span>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Giá Bán Niêm Yết (VNĐ):</label>
                <input
                  type="number"
                  step={100000}
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none font-black text-rose-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Số Lượng Máy Tồn Kho:</label>
                <input
                  type="number"
                  min={0}
                  value={editStock}
                  onChange={e => setEditStock(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none font-black text-stone-900 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl transition"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editingProduct.price = editPrice;
                    onUpdateStock(editingProduct.id, editStock);
                    setEditingProduct(null);
                    alert(`✅ Đã cập nhật giá bán (${new Intl.NumberFormat('vi-VN').format(editPrice)}đ) và tồn kho (${editStock} máy) thành công!`);
                  }}
                  className="px-4 py-2 bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-black rounded-xl transition shadow cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
