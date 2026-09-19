import React, { useState } from 'react';
import { 
  Package, AlertTriangle, ArrowLeft, Plus, Search, Filter, 
  TrendingUp, CheckCircle, FileText, Calendar, Truck, 
  Sparkles, ChevronRight, X, DollarSign, BarChart3, Clock,
  RotateCcw, Tag, CheckCircle2, Edit3, Layers
} from 'lucide-react';
import { ProductDetail, StockImportTicket, InventoryRecommendation, ReturnRequest } from '../types';

interface WarehousePageProps {
  products: ProductDetail[];
  onBack: () => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  importTickets: StockImportTicket[];
  onAddImportTicket: (ticket: StockImportTicket) => void;
  returnRequests?: ReturnRequest[];
  onAddProduct?: (product: ProductDetail) => void;
}

export const WarehousePage: React.FC<WarehousePageProps> = ({
  products,
  onBack,
  onUpdateStock,
  importTickets,
  onAddImportTicket,
  returnRequests = [],
  onAddProduct
}) => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'LOW_STOCK' | 'IMPORT_HISTORY' | 'AI_RECOMMEND' | 'PRODUCTS' | 'RETURNS_RESTOCK'>('INVENTORY');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal Lập Phiếu Nhập Kho (UC05)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSupplier, setImportSupplier] = useState('Xưởng May Dệt May Gia Định');
  const [importNote, setImportNote] = useState('Nhập hàng bổ sung theo kế hoạch tuần');
  const [importItems, setImportItems] = useState<{ productId: string; quantity: number; importPrice: number }[]>([
    { productId: products[0]?.id || '', quantity: 50, importPrice: Math.round((products[0]?.price || 300000) * 0.6) }
  ]);

  // Modal Thêm Sản Phẩm Mới (UC02)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Áo',
    price: 350000,
    stock: 50,
    description: 'Sản phẩm chất lượng cao ZShop',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
  });

  // Modal Sửa Giá & Tồn Kho (UC02)
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  // Quality inspection & restocked map for returned items (UC10)
  const [inspectedStatus, setInspectedStatus] = useState<Record<string, 'PASSED' | 'DEFECTIVE'>>({});
  const [restockedMap, setRestockedMap] = useState<Record<string, boolean>>({});

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category || 'Khác')))];

  // Ngưỡng cảnh báo hết hàng: stock <= 30
  const LOW_STOCK_THRESHOLD = 30;
  const lowStockProducts = products.filter(p => p.stock <= LOW_STOCK_THRESHOLD);
  const outOfStockProducts = products.filter(p => p.stock <= 0);

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

  // Lọc sản phẩm
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Xử lý tạo phiếu nhập kho
  const handleCreateImportTicket = () => {
    if (importItems.length === 0 || importItems.some(i => i.quantity <= 0)) {
      alert('Vui lòng kiểm tra lại số lượng sản phẩm nhập kho!');
      return;
    }

    const ticketItems = importItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Sản phẩm',
        quantity: item.quantity,
        importPrice: item.importPrice
      };
    });

    const totalQty = ticketItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalCost = ticketItems.reduce((sum, i) => sum + i.quantity * i.importPrice, 0);

    const newTicket: StockImportTicket = {
      id: `ticket-${Date.now()}`,
      code: `NK-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      supplier: importSupplier,
      importDate: new Date().toLocaleString('vi-VN'),
      creator: 'Trần Văn Kho (Thủ kho chính)',
      items: ticketItems,
      totalQuantity: totalQty,
      totalCost: totalCost,
      note: importNote,
      status: 'COMPLETED'
    };

    // 1. Cập nhật số lượng tồn kho cho từng sản phẩm
    ticketItems.forEach(item => {
      const currentProd = products.find(p => p.id === item.productId);
      const newStock = (currentProd?.stock || 0) + item.quantity;
      onUpdateStock(item.productId, newStock);
    });

    // 2. Lưu phiếu vào lịch sử
    onAddImportTicket(newTicket);
    setIsImportModalOpen(false);
    alert(`Đã lập thành công phiếu nhập ${newTicket.code}! Đã nhập thêm ${totalQty} sản phẩm vào kho.`);
  };

  // Mở modal nhập kho nhanh từ cảnh báo hết hàng
  const handleQuickReorder = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setImportItems([{
      productId: prod.id,
      quantity: 50,
      importPrice: Math.round(prod.price * 0.6)
    }]);
    setImportNote(`Nhập khẩn cấp sản phẩm [${prod.name}] do sắp hết hàng`);
    setIsImportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} /> Thoát Quản Lý Kho
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Package size={18} />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Quản Lý Nhập Kho & Tồn Kho (UC05)</h1>
              <p className="text-[11px] text-slate-400">Phân hệ dành cho Nhân viên Kho & Chủ cửa hàng</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} /> Lập Phiếu Nhập Kho Mới
          </button>
        </div>
      </header>

      {/* KPI Overview Cards */}
      <div className="p-6 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng mẫu sản phẩm</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{products.length} mã</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng lượng tồn kho</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{totalInventoryUnits.toLocaleString('vi-VN')} chiếc</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-800 font-medium">Cảnh báo sắp hết hàng</span>
            <h3 className="text-xl font-black text-amber-900 mt-0.5">{lowStockProducts.length} mặt hàng</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Ước tính giá trị kho</span>
            <h3 className="text-xl font-black text-purple-900 mt-0.5">
              {(totalInventoryValue / 1000000).toFixed(1)} Tr
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="px-6 pt-3">
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`pb-3 flex items-center gap-2 transition-all relative ${
              activeTab === 'INVENTORY'
                ? 'text-sky-600 border-b-2 border-sky-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package size={16} /> Danh Mục Tồn Kho ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('LOW_STOCK')}
            className={`pb-3 flex items-center gap-2 transition-all relative ${
              activeTab === 'LOW_STOCK'
                ? 'text-amber-600 border-b-2 border-amber-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle size={16} /> Cảnh Báo Hết Hàng
            {lowStockProducts.length > 0 && (
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px]">
                {lowStockProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('AI_RECOMMEND')}
            className={`pb-3 flex items-center gap-2 transition-all relative ${
              activeTab === 'AI_RECOMMEND'
                ? 'text-purple-600 border-b-2 border-purple-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={16} /> AI Khuyến Nghị Kho (UC08)
          </button>

          <button
            onClick={() => setActiveTab('IMPORT_HISTORY')}
            className={`pb-3 flex items-center gap-2 transition-all relative ${
              activeTab === 'IMPORT_HISTORY'
                ? 'text-sky-600 border-b-2 border-sky-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={16} /> Lịch Sử Phiếu Nhập ({importTickets.length})
          </button>

          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`pb-3 flex items-center gap-2 transition-all relative ${
              activeTab === 'PRODUCTS'
                ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag size={16} /> Sản Phẩm & Danh Mục (UC02)
          </button>

          <button
            onClick={() => setActiveTab('RETURNS_RESTOCK')}
            className={`pb-3 flex items-center gap-2 transition-all relative ${
              activeTab === 'RETURNS_RESTOCK'
                ? 'text-rose-600 border-b-2 border-rose-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <RotateCcw size={16} /> Tái Nhập Hàng Hoàn Trả (UC10)
            {returnRequests.filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED').length > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px]">
                {returnRequests.filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 flex-1 overflow-y-auto">
        
        {/* TAB 1: ALL INVENTORY */}
        {activeTab === 'INVENTORY' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            {/* Filter bar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Tìm mã sản phẩm, tên hàng..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ảnh & Sản phẩm</th>
                    <th className="py-3 px-4">Danh mục</th>
                    <th className="py-3 px-4">Đơn giá niêm yết</th>
                    <th className="py-3 px-4 text-center">Tồn kho hiện tại</th>
                    <th className="py-3 px-4">Trạng thái kho</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(prod => {
                    const isLow = prod.stock <= LOW_STOCK_THRESHOLD;
                    const isOut = prod.stock <= 0;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img 
                            src={prod.images && prod.images.length > 0 ? prod.images[0] : '/Image-Product/Áo polo Nam.jpg'} 
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">Mã: {prod.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                            {prod.category || 'Khác'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block font-extrabold text-sm px-2.5 py-0.5 rounded ${
                            isOut ? 'bg-red-100 text-red-700' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isOut 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : isLow 
                                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                            {isOut ? 'Hết hàng' : isLow ? 'Sắp hết hàng' : 'Đầy đủ'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleQuickReorder(prod.id)}
                              className="px-2.5 py-1 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded text-[11px] font-bold transition-colors"
                              title="Tạo phiếu nhập thêm"
                            >
                              + Nhập hàng
                            </button>
                            <button
                              onClick={() => {
                                const input = prompt(`Cập nhật số lượng tồn kho cho "${prod.name}":`, prod.stock.toString());
                                if (input !== null && !isNaN(Number(input))) {
                                  onUpdateStock(prod.id, Math.max(0, parseInt(input, 10)));
                                }
                              }}
                              className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-[11px] font-semibold transition-colors"
                            >
                              Sửa số tồn
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

        {/* TAB 2: LOW STOCK ALERTS («extend» Cảnh báo hết hàng) */}
        {activeTab === 'LOW_STOCK' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-900">Quy chuẩn Cảnh Báo Tồn Kho Tối Thiểu (Threshold: &le; 30)</h4>
                  <p className="text-xs text-amber-700">Hệ thống tự động phát hiện và cảnh báo các mặt hàng có nguy cơ đứt hàng để thủ kho lập phiếu nhập hàng kịp thời.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setImportItems(lowStockProducts.map(p => ({
                    productId: p.id,
                    quantity: 50,
                    importPrice: Math.round(p.price * 0.6)
                  })));
                  setImportNote('Nhập kho hàng loạt cho toàn bộ danh sách mặt hàng chạm ngưỡng cảnh báo');
                  setIsImportModalOpen(true);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow transition-colors"
              >
                Nhập kho toàn bộ ({lowStockProducts.length} mã)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map(prod => (
                <div key={prod.id} className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="flex gap-3 items-start">
                    <img 
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : '/Image-Product/Áo polo Nam.jpg'} 
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {prod.stock <= 0 ? 'HẾT HÀNG' : `CÒN LẠI: ${prod.stock} CHIẾC`}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-2">{prod.name}</h4>
                      <span className="text-[11px] text-slate-500">Mã SP: {prod.id}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-700">
                      Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                    </span>
                    <button
                      onClick={() => handleQuickReorder(prod.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <Plus size={14} /> Lập phiếu nhập (+50)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AI KHUYẾN NGHỊ KHO (UC08) */}
        {activeTab === 'AI_RECOMMEND' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-5 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-amber-300" />
                <h3 className="font-extrabold text-base tracking-wide">Hệ Thống Trợ Lý AI Khuyến Nghị Kho (UC08 - Stock Copilot)</h3>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed max-w-3xl">
                Mô hình AI tự động phân tích tốc độ tiêu thụ sản phẩm (Run-Rate / Velocity) và tính toán thời gian tồn kho dự kiến (Days Until Stockout). Từ đó đưa ra giải pháp nhập hàng tối ưu, tránh đọng vốn hoặc đứt gãy chuỗi bán lẻ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nhóm Cần Nhập Gấp */}
              <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                    <h4 className="font-bold text-sm text-slate-800">1. Nhóm Cần Nhập Hàng Khẩn Cấp</h4>
                  </div>
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                    Ưu tiên cao
                  </span>
                </div>

                <div className="space-y-2.5">
                  {products.slice(0, 3).map(prod => (
                    <div key={prod.id} className="p-3 bg-red-50/50 rounded-lg border border-red-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{prod.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Tồn hiện tại: <strong className="text-red-600">{prod.stock}</strong> • Dự kiến hết trong <strong>3 ngày</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-sky-700 block">+100 chiếc</span>
                        <button
                          onClick={() => handleQuickReorder(prod.id)}
                          className="mt-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                        >
                          Tạo phiếu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhóm Hàng Tồn Lâu Cần Xả Kho */}
              <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <h4 className="font-bold text-sm text-slate-800">2. Nhóm Hàng Bán Chậm Cần Xả Kho</h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Kích cầu Flash Sale
                  </span>
                </div>

                <div className="space-y-2.5">
                  {products.slice(3, 5).map(prod => (
                    <div key={prod.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{prod.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Tồn kho cao: <strong>{prod.stock} chiếc</strong> • Vòng quay hàng hóa chậm
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-700 block">Giảm 15% - 20%</span>
                        <button
                          onClick={() => alert(`Đã đề xuất chiến dịch Flash Sale cho sản phẩm [${prod.name}]!`)}
                          className="mt-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold"
                        >
                          Tạo Flash Sale
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-xs text-slate-800">Danh sách các phiếu nhập kho đã thực hiện</h3>
              <span className="text-[11px] text-slate-500">Tổng cộng: {importTickets.length} phiếu</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Mã phiếu</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Nhà cung cấp</th>
                    <th className="py-3 px-4">Người lập</th>
                    <th className="py-3 px-4 text-center">Tổng SL</th>
                    <th className="py-3 px-4 text-right">Tổng chi phí nhập</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-700">{ticket.code}</td>
                      <td className="py-3 px-4 text-slate-500">{ticket.importDate}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{ticket.supplier}</td>
                      <td className="py-3 px-4">{ticket.creator}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">+{ticket.totalQuantity}</td>
                      <td className="py-3 px-4 text-right font-bold text-red-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.totalCost)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          Đã hoàn tất
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col space-y-4 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Tag size={18} className="text-emerald-600" /> Quản Lý Sản Phẩm & Danh Mục Kho (UC02)
                </h3>
                <p className="text-xs text-slate-500">Thêm mới sản phẩm, cập nhật giá bán, số lượng tồn kho và phân loại danh mục</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Plus size={16} /> Thêm Sản Phẩm Mới (UC02)
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Tìm sản phẩm theo tên, mã SKU..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto w-full md:w-auto text-xs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      selectedCategory === cat 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tất cả danh mục' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ảnh</th>
                    <th className="py-3 px-4">Mã SKU</th>
                    <th className="py-3 px-4">Tên Sản Phẩm</th>
                    <th className="py-3 px-4">Danh Mục</th>
                    <th className="py-3 px-4 text-right">Giá Bán</th>
                    <th className="py-3 px-4 text-center">Tồn Kho</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                    <th className="py-3 px-4 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4">
                        <img 
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'} 
                          alt={prod.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{prod.id}</td>
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                        <div className="text-[10px] text-slate-400">Đã bán: {prod.soldCount || 0} | Đánh giá: {prod.rating || 5}★</div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700">
                          {prod.category || 'Thời trang'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-red-600 font-mono">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold font-mono">
                        <span className={prod.stock <= 30 ? 'text-amber-600' : 'text-slate-900'}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.stock <= 0 ? 'bg-rose-100 text-rose-700' :
                          prod.stock <= 30 ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {prod.stock <= 0 ? 'Hết hàng' : prod.stock <= 30 ? 'Sắp hết' : 'Đang bán'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setEditPrice(prod.price);
                            setEditStock(prod.stock);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Edit3 size={13} /> Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: RETURNS INSPECTION & RESTOCK (UC10) */}
        {activeTab === 'RETURNS_RESTOCK' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col space-y-4 p-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <RotateCcw size={18} className="text-rose-600" /> Kiểm Định & Tái Nhập Hàng Hoàn Trả (UC10)
                </h3>
                <p className="text-xs text-slate-500">
                  Thẩm định ngoại quan các gói hàng đổi trả do CSKH đã duyệt. Nếu đạt chuẩn chất lượng, thực hiện tái nhập kho để tăng tồn kho.
                </p>
              </div>
            </div>

            {returnRequests.filter(r => r.status === 'APPROVED' || r.status === 'REFUNDED').length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <RotateCcw size={36} className="mx-auto mb-2 opacity-50 text-slate-400" />
                <p className="text-xs font-bold text-slate-600">Hiện không có kiện hàng đổi trả nào cần kiểm định tái nhập kho.</p>
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
                            ? 'bg-emerald-50/50 border-emerald-200' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-rose-700">{req.id}</span>
                              <span className="text-xs text-slate-400">• Đơn gốc: <strong className="text-slate-800">{req.orderId}</strong></span>
                              <span className="text-xs text-slate-400">• Khách: <strong className="text-slate-800">{req.customerName}</strong> ({req.customerPhone})</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Lý do hoàn trả: <em className="text-slate-700 font-medium">"{req.reason}"</em>
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isRestocked 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {isRestocked ? '✅ Đã Tái Nhập Kho' : 'Chờ Kiểm Định'}
                          </span>
                        </div>

                        {/* Items in Return */}
                        <div className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            {req.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-xs text-slate-800">
                                <Package size={14} className="text-slate-400 shrink-0" />
                                <span className="font-bold">{item.name}</span>
                                <span className="text-slate-500">Số lượng hoàn trả: <strong>{item.quantity}</strong> cái</span>
                                <span className="text-red-600 font-mono font-bold">
                                  ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)})
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Quality Check Selector */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-700">Kiểm định chất lượng:</span>
                            <select
                              disabled={isRestocked}
                              value={inspection}
                              onChange={(e) => setInspectedStatus({ ...inspectedStatus, [req.id]: e.target.value as any })}
                              className="p-1.5 border border-slate-300 rounded-lg text-xs font-medium outline-none bg-white disabled:opacity-60"
                            >
                              <option value="PASSED">Đạt Chuẩn (Còn mới, nguyên tem/hộp)</option>
                              <option value="DEFECTIVE">Lỗi Hỏng (Hư hại, không thể tái bán)</option>
                            </select>
                          </div>
                        </div>

                        {/* Restock Action Button */}
                        <div className="pt-2 flex justify-end">
                          {isRestocked ? (
                            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                              <CheckCircle2 size={16} /> Đã cộng số lượng tồn kho thành công vào hệ thống.
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (inspection === 'DEFECTIVE') {
                                  alert('Sản phẩm kiểm định "Lỗi hỏng" không thể tái nhập kho bán hàng. Đã lưu biên bản xử lý hủy hàng!');
                                  return;
                                }

                                // 1. Restock items into product inventory
                                req.items.forEach(item => {
                                  const targetProd = products.find(p => p.name.includes(item.name) || item.name.includes(p.name)) || products[0];
                                  if (targetProd) {
                                    onUpdateStock(targetProd.id, targetProd.stock + item.quantity);
                                  }
                                });

                                // 2. Add Stock Import Ticket for record keeping
                                const returnTicket: StockImportTicket = {
                                  id: `ticket-return-${req.id}`,
                                  code: `NK-HOAN-${req.id}`,
                                  supplier: `Khách hoàn trả: ${req.customerName}`,
                                  importDate: new Date().toLocaleString('vi-VN'),
                                  creator: 'Trần Văn Kho (Thủ kho chính)',
                                  items: req.items.map(i => ({
                                    productId: products[0]?.id || 'PROD',
                                    productName: i.name,
                                    quantity: i.quantity,
                                    importPrice: i.price
                                  })),
                                  totalQuantity: req.items.reduce((s, i) => s + i.quantity, 0),
                                  totalCost: req.refundAmount,
                                  status: 'COMPLETED',
                                  note: `Tái nhập kho sau kiểm định đạt chuẩn từ đơn đổi trả ${req.orderId}`
                                };
                                onAddImportTicket(returnTicket);

                                setRestockedMap({ ...restockedMap, [req.id]: true });
                                alert(`✅ Kiểm định & Tái nhập thành công!\nĐã cộng ${req.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm vào tồn kho của hệ thống.`);
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                            >
                              <CheckCircle2 size={15} /> Xác Nhận Tái Nhập Kho (UC10)
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

      {/* MODAL: Lập Phiếu Nhập Kho (UC05) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-amber-400" />
                <h3 className="font-bold text-sm">Lập Phiếu Nhập Kho Mới (UC05)</h3>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Nhà Cung Cấp</label>
                  <select 
                    value={importSupplier}
                    onChange={e => setImportSupplier(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  >
                    <option value="Xưởng May Dệt May Gia Định">Xưởng May Dệt May Gia Định</option>
                    <option value="Công ty Thời Trang Quốc Tế Vina">Công ty Thời Trang Quốc Tế Vina</option>
                    <option value="Kho Tổng Phân Phối Sài Gòn">Kho Tổng Phân Phối Sài Gòn</option>
                    <option value="Xưởng Giày Thể Thao Sneaker VN">Xưởng Giày Thể Thao Sneaker VN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Thủ Kho Tiếp Nhận</label>
                  <input 
                    type="text" 
                    readOnly
                    value="Trần Văn Kho (Thủ kho chính)"
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Ghi Chú Nhập Hàng</label>
                <input 
                  type="text"
                  value={importNote}
                  onChange={e => setImportNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Items in ticket */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800">Danh Sách Mặt Hàng Nhập</label>
                  <button
                    type="button"
                    onClick={() => setImportItems([...importItems, { productId: products[0].id, quantity: 20, importPrice: 200000 }])}
                    className="text-sky-600 hover:text-sky-800 font-bold text-[11px] flex items-center gap-1"
                  >
                    + Thêm dòng sản phẩm
                  </button>
                </div>

                {importItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={item.productId}
                        onChange={e => {
                          const newProd = products.find(p => p.id === e.target.value);
                          const updated = [...importItems];
                          updated[idx].productId = e.target.value;
                          if (newProd) updated[idx].importPrice = Math.round(newProd.price * 0.6);
                          setImportItems(updated);
                        }}
                        className="flex-1 p-1.5 border border-slate-300 rounded bg-white text-xs outline-none"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (Kho hiện tại: {p.stock})</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setImportItems(importItems.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 text-[10px]">Số lượng nhập:</span>
                        <input 
                          type="number" 
                          value={item.quantity}
                          min={1}
                          onChange={e => {
                            const updated = [...importItems];
                            updated[idx].quantity = parseInt(e.target.value, 10) || 0;
                            setImportItems(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded font-bold text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Đơn giá nhập (VNĐ):</span>
                        <input 
                          type="number" 
                          value={item.importPrice}
                          step={10000}
                          onChange={e => {
                            const updated = [...importItems];
                            updated[idx].importPrice = parseInt(e.target.value, 10) || 0;
                            setImportItems(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded font-bold text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-slate-100 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Tổng số lượng nhập thêm:</span>
                  <span className="font-bold text-slate-900">
                    +{importItems.reduce((sum, i) => sum + i.quantity, 0)} chiếc
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-red-600 pt-1 border-t border-slate-200">
                  <span>Tổng kinh phí nhập kho:</span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      importItems.reduce((sum, i) => sum + i.quantity * i.importPrice, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleCreateImportTicket}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1"
              >
                <CheckCircle size={16} /> Xác Nhận Nhập Kho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Mới Sản Phẩm (UC02) */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-emerald-400" />
                <h3 className="font-bold text-sm">Thêm Mới Sản Phẩm Vào Kho (UC02)</h3>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProductForm.name) {
                  alert('Vui lòng nhập tên sản phẩm!');
                  return;
                }
                const newId = `SP-${Date.now().toString().slice(-4)}`;
                const created: ProductDetail = {
                  id: newId,
                  name: newProductForm.name,
                  category: newProductForm.category,
                  rating: 5.0,
                  reviewCount: 0,
                  soldCount: 0,
                  price: newProductForm.price,
                  originalPrice: Math.round(newProductForm.price * 1.2),
                  discountRate: 15,
                  shippingFee: 30000,
                  shippingEstimate: 'Giao trong 2-3 ngày',
                  colors: ['Đen', 'Trắng'],
                  sizes: ['M', 'L', 'XL'],
                  stock: newProductForm.stock,
                  images: [newProductForm.image],
                  videoDuration: '00:30',
                  description: newProductForm.description
                };

                if (onAddProduct) {
                  onAddProduct(created);
                } else {
                  products.push(created);
                }

                // Auto create initial stock import ticket
                onAddImportTicket({
                  id: `ticket-${Date.now()}`,
                  code: `NK-TAO-${newId}`,
                  supplier: 'Nhập khởi tạo danh mục mới',
                  importDate: new Date().toLocaleString('vi-VN'),
                  creator: 'Trần Văn Kho (Thủ kho chính)',
                  items: [{ productId: newId, productName: created.name, quantity: created.stock, importPrice: Math.round(created.price * 0.6) }],
                  totalQuantity: created.stock,
                  totalCost: Math.round(created.price * 0.6) * created.stock,
                  status: 'COMPLETED',
                  note: `Khởi tạo mã sản phẩm mới [${newId}]`
                });

                setIsAddProductModalOpen(false);
                setNewProductForm({
                  name: '',
                  category: 'Áo',
                  price: 350000,
                  stock: 50,
                  description: 'Sản phẩm chất lượng cao ZShop',
                  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
                });
                alert(`✅ Đã thêm mới sản phẩm "${created.name}" (Mã: ${newId}) với ${created.stock} chiếc tồn kho!`);
              }}
              className="p-6 overflow-y-auto space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên Sản Phẩm *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="VD: Áo Khoác Gió Nam Chống Nước 2 Lớp"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Danh Mục</label>
                  <select
                    value={newProductForm.category}
                    onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Áo">Áo</option>
                    <option value="Quần">Quần</option>
                    <option value="Giày">Giày</option>
                    <option value="Túi">Túi</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Số Lượng Tồn Ban Đầu</label>
                  <input
                    type="number"
                    min={1}
                    value={newProductForm.stock}
                    onChange={e => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Giá Bán Niêm Yết (VNĐ)</label>
                <input
                  type="number"
                  step={10000}
                  value={newProductForm.price}
                  onChange={e => setNewProductForm({ ...newProductForm, price: Number(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Link Ảnh Sản Phẩm (URL)</label>
                <input
                  type="text"
                  value={newProductForm.image}
                  onChange={e => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={e => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1 shadow"
                >
                  <CheckCircle size={15} /> Lưu & Khởi Tạo Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Sửa Giá & Tồn Kho (UC02) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-amber-400" />
                <h3 className="font-bold text-sm">Chỉnh Sửa Thông Tin SP (UC02)</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Mã sản phẩm:</span>
                <strong className="text-slate-900 font-mono text-sm">{editingProduct.id}</strong>
                <p className="font-bold text-slate-800 line-clamp-1 mt-0.5">{editingProduct.name}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Giá Bán (VNĐ):</label>
                <input
                  type="number"
                  step={10000}
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500 font-bold text-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số Lượng Tồn Kho:</label>
                <input
                  type="number"
                  min={0}
                  value={editStock}
                  onChange={e => setEditStock(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500 font-bold text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editingProduct.price = editPrice;
                    onUpdateStock(editingProduct.id, editStock);
                    setEditingProduct(null);
                    alert(`✅ Đã cập nhật giá bán (${new Intl.NumberFormat('vi-VN').format(editPrice)}đ) và tồn kho (${editStock}) thành công!`);
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition shadow"
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
