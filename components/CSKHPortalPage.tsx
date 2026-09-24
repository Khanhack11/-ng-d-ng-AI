import React, { useState } from 'react';
import { 
  RotateCcw, Users, ShoppingCart, Truck, Search, 
  CheckCircle, XCircle, ArrowLeft, Phone, 
  Clock, Printer, X, CreditCard, Flame, Smartphone, RefreshCw
} from 'lucide-react';
import { 
  ReturnRequest, CustomerProfile, ProductDetail, 
  OrderStatus, UserRole 
} from '../types';
import PortalTopBar, { PortalWorkspace } from './PortalTopBar';
import { DatHangService } from '../services';

interface CSKHPortalPageProps {
  returnRequests: ReturnRequest[];
  onProcessReturn: (requestId: string, action: 'APPROVE' | 'REJECT' | 'REFUND_AND_CLAWBACK') => void;
  customers: CustomerProfile[];
  onAddCustomer: (customer: CustomerProfile) => void;
  onUpdateCustomerPoints: (customerId: string, deltaPoints: number, deltaSpent?: number) => void;
  products: ProductDetail[];
  onBackToHome: () => void;
  onSwitchWorkspace: (workspace: PortalWorkspace) => void;
  currentUser?: { name?: string; email?: string; role?: string } | null;
  initialTab?: CSKHTab;
  userRole?: string;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
  onDeductStock?: (productId: string, quantity: number) => void;
}

export type CSKHTab = 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING';

const getPOSColorStyle = (id: string, colorName: string = '') => {
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

export const CSKHPortalPage: React.FC<CSKHPortalPageProps> = ({
  returnRequests,
  onProcessReturn,
  customers,
  onAddCustomer,
  onUpdateCustomerPoints,
  products,
  onBackToHome,
  onSwitchWorkspace,
  currentUser,
  initialTab = 'POS',
  userRole = 'SALES',
  onSwitchRole,
  onLogout,
  onDeductStock
}) => {
  const [activeTab, setActiveTab] = useState<CSKHTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // ==========================================
  // TAB 1: STATE FOR RETAIL POS (UC04)
  // ==========================================
  const [posCart, setPosCart] = useState<{ product: ProductDetail; size: string; color: string; quantity: number }[]>([
    {
      product: products[0] || ({} as ProductDetail),
      size: '256GB',
      color: products[0]?.colors?.[0] || 'Titan Đỏ Rượu Vang (Burgundy)',
      quantity: 1
    }
  ]);
  const [posSearch, setPosSearch] = useState('');
  const [posSeriesFilter, setPosSeriesFilter] = useState<'HOT' | 'ALL' | '18' | '17' | '16' | '15_14'>('ALL');
  const [posCustomerPhone, setPosCustomerPhone] = useState('0901234567');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'CASH' | 'VIETQR'>('VIETQR');
  const [posUsePoints, setPosUsePoints] = useState(false);
  const [posTradeInBonus, setPosTradeInBonus] = useState(false); // Thu cũ đổi mới trợ giá 3 triệu
  const [posCashReceived, setPosCashReceived] = useState<number>(40000000);

  const matchedPOSCustomer = customers.find(c => c.phone === posCustomerPhone);

  const posFilteredProducts = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(posSearch.toLowerCase()) ||
      (p.colors?.[0] || '').toLowerCase().includes(posSearch.toLowerCase());
    if (!matchSearch) return false;

    if (posSeriesFilter === 'HOT') {
      return ['ip-18-promax', 'ip-18-pro', 'ip-17-promax', 'ip-17-pro', 'ip-17-air', 'ip-16-promax'].includes(p.id);
    }
    if (posSeriesFilter === '18') return p.category?.includes('iPhone 18');
    if (posSeriesFilter === '17') return p.category?.includes('iPhone 17');
    if (posSeriesFilter === '16') return p.category?.includes('iPhone 16');
    if (posSeriesFilter === '15_14') return p.category?.includes('iPhone 15') || p.category?.includes('iPhone 14');
    return true;
  });

  const handlePOSAddToCart = (product: ProductDetail, chosenSize?: string) => {
    const defaultSize = chosenSize || product.sizes?.[0] || '256GB';
    const defaultColor = product.colors?.[0] || 'Titan Tự Nhiên';
    setPosCart(prev => {
      const exist = prev.find(item => item.product.id === product.id && item.size === defaultSize);
      if (exist) {
        return prev.map(item =>
          item.product.id === product.id && item.size === defaultSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size: defaultSize, color: defaultColor, quantity: 1 }];
    });
  };

  const handlePOSUpdateQty = (idx: number, delta: number) => {
    setPosCart(prev => {
      const copy = [...prev];
      const newQ = copy[idx].quantity + delta;
      if (newQ <= 0) {
        copy.splice(idx, 1);
      } else {
        copy[idx].quantity = newQ;
      }
      return copy;
    });
  };

  const posSubtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const posPointsDiscount = posUsePoints && matchedPOSCustomer ? Math.min(posSubtotal, matchedPOSCustomer.points * 1000) : 0;
  const tradeInDiscount = posTradeInBonus ? 3000000 : 0;
  const posFinalTotal = Math.max(0, posSubtotal - posPointsDiscount - tradeInDiscount);
  const posChange = Math.max(0, posCashReceived - posFinalTotal);

  const handlePOSCompleteOrder = () => {
    if (posCart.length === 0) {
      alert('Vui lòng chọn ít nhất 1 máy iPhone vào hóa đơn POS!');
      return;
    }
    // Trừ tồn kho thực tế
    posCart.forEach(item => {
      onDeductStock?.(item.product.id, item.quantity);
    });

    if (posUsePoints && matchedPOSCustomer) {
      const usedPoints = Math.round(posPointsDiscount / 1000);
      onUpdateCustomerPoints(matchedPOSCustomer.id, -usedPoints, posFinalTotal);
    } else if (matchedPOSCustomer) {
      const earnedPoints = Math.round(posFinalTotal / 100000);
      onUpdateCustomerPoints(matchedPOSCustomer.id, earnedPoints, posFinalTotal);
    }
    alert(
      `🎉 XUẤT HÓA ĐƠN & KÍCH HOẠT BẢO HÀNH VN/A THÀNH CÔNG!\n` +
      `- Khách hàng: ${matchedPOSCustomer?.name || 'Khách mua tại Showroom'}\n` +
      `- Sản phẩm: ${posCart.map(i => `${i.product.name} (${i.color} - ${i.size}) x${i.quantity}`).join(', ')}\n` +
      `- Tổng thanh toán: ${new Intl.NumberFormat('vi-VN').format(posFinalTotal)} ₫\n` +
      `- Phương thức: ${posPaymentMethod === 'VIETQR' ? 'Quét mã VietQR Napas 24/7' : 'Tiền mặt tại quầy'}\n` +
      `- Đã trừ tồn kho tự động & in Phiếu Bảo Hành Apple 12 Tháng.`
    );
    setPosCart([]);
  };

  // ==========================================
  // TAB 2: STATE FOR RETURN MANAGEMENT (UC10)
  // ==========================================
  const [returnStatusFilter, setReturnStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REFUNDED' | 'REJECTED'>('ALL');
  const [returnSearchTerm, setReturnSearchTerm] = useState('');

  const filteredReturnRequests = returnRequests.filter(req => {
    const matchStatus = returnStatusFilter === 'ALL' || req.status === returnStatusFilter;
    const matchSearch =
      req.orderId.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
      req.customerName.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(returnSearchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingReturnsCount = returnRequests.filter(r => r.status === 'PENDING').length;

  // ==========================================
  // TAB 3: STATE FOR CUSTOMER CRM (UC03)
  // ==========================================
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<CustomerProfile | null>(null);
  const [pointDeltaInput, setPointDeltaInput] = useState<number>(100);

  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchTier = selectedTier === 'ALL' || c.tier === selectedTier;
    const matchSearch =
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase());
    return matchTier && matchSearch;
  });

  const handleSaveNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) {
      alert('Vui lòng nhập họ tên và số điện thoại khách hàng!');
      return;
    }
    const created: CustomerProfile = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail || `${newCustPhone}@thegioiiphone.vn`,
      address: newCustAddress || 'Quận 1, TP. Hồ Chí Minh',
      points: 100,
      tier: 'Đồng',
      totalSpent: 0,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };
    onAddCustomer(created);
    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
    alert(`✅ Đã mở thẻ Hội Viên Thế Giới iPhone cho khách hàng ${created.name} (+100 điểm thưởng chào mừng)!`);
  };

  const handleApplyPointChange = () => {
    if (!selectedCustomerForPoints) return;
    onUpdateCustomerPoints(selectedCustomerForPoints.id, pointDeltaInput, 0);
    alert(`✅ Đã ${pointDeltaInput >= 0 ? 'cộng' : 'trừ'} ${Math.abs(pointDeltaInput)} điểm VIP cho khách hàng ${selectedCustomerForPoints.name}!`);
    setSelectedCustomerForPoints(null);
  };

  // ==========================================
  // TAB 4: STATE FOR TRACKING LOOKUP (UC06)
  // ==========================================
  const [trackingQuery, setTrackingQuery] = useState('DH-20260908-01');
  const [trackingResult, setTrackingResult] = useState<any>([
    { status: OrderStatus.SHIPPING, date: '24/09/2026 10:30', description: 'Chuyên viên giao hàng Apple Express Nguyễn Văn Hùng đang giao máy nguyên seal tại Q.1', completed: true },
    { status: OrderStatus.PROCESSING, date: '24/09/2026 09:45', description: 'Đã kiểm tra IMEI/Serial & niêm phong hộp chống sốc tại Showroom Thế Giới iPhone', completed: true },
    { status: OrderStatus.PAID, date: '24/09/2026 09:30', description: 'Đã xác nhận thanh toán VietQR Napas 24/7', completed: true }
  ]);

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    const res = DatHangService.traCuuDonHang(trackingQuery.trim());
    setTrackingResult(
      res || [
        { status: OrderStatus.SHIPPING, date: '24/09/2026 10:30', description: 'Chuyên viên giao hàng Apple Express Nguyễn Văn Hùng đang giao máy nguyên seal tại Q.1', completed: true },
        { status: OrderStatus.PROCESSING, date: '24/09/2026 09:45', description: 'Đã kiểm tra IMEI/Serial & niêm phong hộp chống sốc tại Showroom Thế Giới iPhone', completed: true },
        { status: OrderStatus.PAID, date: '24/09/2026 09:30', description: 'Đã xác nhận thanh toán VietQR Napas 24/7', completed: true }
      ]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C4B49E] via-[#BBA992] to-[#B2A088] flex flex-col font-sans">
      {/* 1. Unified Boutique Top Bar */}
      <PortalTopBar
        userRole={userRole}
        currentWorkspace="CSKH"
        onSwitchWorkspace={onSwitchWorkspace}
        currentUser={currentUser}
        pendingReturnsCount={pendingReturnsCount}
        onNavigateCSKH={(tab) => tab && setActiveTab(tab)}
        onNavigateHome={onBackToHome}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />

      {/* 2. Sales & POS Workspace Header */}
      <header className="bg-gradient-to-r from-[#1e1d1a] via-[#26231f] to-[#1e1d1a] text-stone-100 px-6 py-4 shadow-xl border-b border-[#c5a880]/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToHome}
            className="px-3 py-2 bg-[#2e2a24] hover:bg-[#3d372e] border border-[#c5a880]/40 rounded-xl text-[#e5c9a3] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft size={15} /> Về Showroom
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4b996] to-[#8c6f46] text-[#1e1d1a] flex items-center justify-center font-black shadow-md">
              <CreditCard size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white">
                  BÀN LÀM VIỆC NHÂN VIÊN BÁN HÀNG • THẾ GIỚI IPHONE SHOWROOM
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4b996]/20 text-[#e5c9a3] border border-[#d4b996]/40 text-[10px] font-bold uppercase tracking-wider">
                  Tác nhân: Nhân Viên Bán Hàng
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Thu ngân bán máy POS tại quầy (UC04), tư vấn Thu cũ đổi mới, tích điểm VIP (UC03) & Bảo hành 1-đổi-1 (UC10)
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center bg-[#141311] p-1.5 rounded-2xl border border-[#c5a880]/30 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('POS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'POS'
                ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] font-black shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingCart size={14} />
            <span>1. Bán Hàng POS Tại Quầy (UC04)</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'CUSTOMERS'
                ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] font-black shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={14} />
            <span>2. Khách Hàng VIP CRM (UC03)</span>
          </button>

          <button
            onClick={() => setActiveTab('RETURNS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'RETURNS'
                ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] font-black shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCcw size={14} />
            <span>3. Đổi Trả 1-Đổi-1 (UC10)</span>
            {pendingReturnsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-black text-[10px]">
                {pendingReturnsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('TRACKING')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'TRACKING'
                ? 'bg-gradient-to-r from-[#d4b996] to-[#b89768] text-[#1e1d1a] font-black shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Truck size={14} />
            <span>4. Giao Hỏa Tốc 2h (UC06)</span>
          </button>
        </div>
      </header>

      {/* 3. Tab Body Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">
        
        {/* =========================================================================
            TAB 1: BÁN HÀNG POS & THU NGÂN SHOWROOM IPHONE (UC04)
           ========================================================================= */}
        {activeTab === 'POS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
            {/* Left: iPhone Catalog Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#d4b996]/60 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                    <input
                      type="text"
                      value={posSearch}
                      onChange={(e) => setPosSearch(e.target.value)}
                      placeholder="Tìm nhanh mã máy (VD: 18 Pro Max, 17 Air, 16 Pro Max) hoặc màu sắc..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#8c6f46] font-semibold"
                    />
                  </div>
                  <span className="text-xs text-[#8c6f46] font-black shrink-0 bg-[#f3ede2] px-3 py-1.5 rounded-xl border border-[#d4b996]/50">
                    Hiển thị: {posFilteredProducts.length} mẫu iPhone
                  </span>
                </div>

                {/* Quick Series Filter Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'HOT', label: '🔥 Top Flagship Bán Chạy (18 PRM / 17 PRM / 16 PRM)' },
                    { id: 'ALL', label: 'Tất Cả 25 Mã iPhone' },
                    { id: '18', label: 'iPhone 18 Series (2026)' },
                    { id: '17', label: 'iPhone 17 Series' },
                    { id: '16', label: 'iPhone 16 Series' },
                    { id: '15_14', label: 'iPhone 15 & 14 Series' }
                  ].map(chip => (
                    <button
                      key={chip.id}
                      onClick={() => setPosSeriesFilter(chip.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        posSeriesFilter === chip.id
                          ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-sm'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* POS Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[660px] overflow-y-auto pr-1">
                {posFilteredProducts.map((p) => {
                  const primaryColor = p.colors?.[0] || 'Titan Tự Nhiên';
                  const colorStyle = getPOSColorStyle(p.id, primaryColor);
                  const isHot = ['ip-18-promax', 'ip-18-pro', 'ip-17-promax', 'ip-16-promax'].includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#d4b996]/60 shadow-sm hover:border-[#8c6f46] hover:shadow-md transition-all flex flex-col justify-between relative"
                    >
                      {isHot && (
                        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-600 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                          <Flame size={10} /> HOT 2026
                        </span>
                      )}
                      <div>
                        <div className="w-full h-32 rounded-xl bg-white border border-stone-200/80 p-2 mb-2.5 flex items-center justify-center">
                          <img 
                            src={p.images?.[0]} 
                            alt={p.name}
                            style={{ filter: colorStyle.imgFilter }}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorStyle.dot }} />
                          <span className="text-[10px] font-bold text-stone-600 truncate">{primaryColor}</span>
                        </div>

                        <h5 className="text-xs font-black text-stone-900 line-clamp-2">{p.name}</h5>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-stone-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-rose-700">
                            {new Intl.NumberFormat('vi-VN').format(p.price)}₫
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Kho: {p.stock}
                          </span>
                        </div>

                        {/* Storage Quick Add Buttons */}
                        <div className="grid grid-cols-3 gap-1">
                          {(p.sizes && p.sizes.length > 0 ? p.sizes.slice(0, 3) : ['256GB', '512GB', '1TB']).map(sz => (
                            <button
                              key={sz}
                              onClick={() => handlePOSAddToCart(p, sz)}
                              className="py-1 px-1.5 rounded-lg bg-[#1e1d1a] hover:bg-[#332e27] text-[#e5c9a3] font-bold text-[10px] transition-colors cursor-pointer text-center"
                              title={`Thêm bản ${sz} vào hóa đơn POS`}
                            >
                              + {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Cashier Receipt & Payment (5 cols) */}
            <div className="lg:col-span-5 bg-[#faf8f5] rounded-2xl border border-[#d4b996]/70 shadow-md p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
                  <div>
                    <h4 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
                      <ShoppingCart size={16} className="text-[#8c6f46]" />
                      PHIẾU THU NGÂN SHOWROOM • THẾ GIỚI IPHONE
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Thu ngân: <strong>{currentUser?.name || 'Nguyễn Thu Ngân'}</strong>
                    </span>
                  </div>
                  <span className="text-xs text-[#8c6f46] font-mono font-bold bg-[#f3ede2] px-2.5 py-1 rounded-lg">
                    24/09/2026
                  </span>
                </div>

                {/* Customer Phone Input for loyalty */}
                <div className="p-3 bg-white rounded-xl border border-stone-200 mb-3 text-xs space-y-2">
                  <label className="font-bold text-stone-700 block">SĐT Khách Hàng (Tích điểm & Bảo hành điện tử):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={posCustomerPhone}
                      onChange={(e) => setPosCustomerPhone(e.target.value)}
                      placeholder="Nhập SĐT khách hàng..."
                      className="flex-1 p-2 bg-stone-50 border border-stone-300 rounded-lg outline-none font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAddCustomerOpen(true)}
                      className="px-2.5 py-1.5 bg-[#1e1d1a] text-[#e5c9a3] rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      + Khách mới
                    </button>
                  </div>
                  {matchedPOSCustomer ? (
                    <div className="flex items-center justify-between text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <span>★ Hội viên: <strong>{matchedPOSCustomer.name}</strong> (Hạng {matchedPOSCustomer.tier})</span>
                      <strong>{matchedPOSCustomer.points} Điểm VIP</strong>
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400 italic">Khách vãng lai — Sẽ tự động kích hoạt bảo hành theo SĐT</p>
                  )}
                </div>

                {/* POS Items List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-200/70 text-xs bg-white rounded-xl border border-stone-200 p-3">
                  {posCart.length === 0 ? (
                    <p className="text-center py-8 text-stone-400">Chưa chọn máy iPhone nào vào hóa đơn</p>
                  ) : (
                    posCart.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-stone-900 truncate">{it.product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                            <span className="px-1.5 py-0.2 bg-stone-100 rounded font-bold text-stone-800">{it.size}</span>
                            <span className="truncate">• {it.color}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handlePOSUpdateQty(idx, -1)} className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold cursor-pointer">
                            -
                          </button>
                          <span className="w-5 text-center font-black">{it.quantity}</span>
                          <button onClick={() => handlePOSUpdateQty(idx, 1)} className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold cursor-pointer">
                            +
                          </button>
                        </div>
                        <span className="font-mono font-black text-rose-700 w-24 text-right">
                          {new Intl.NumberFormat('vi-VN').format(it.product.price * itemQty(it))}₫
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Totals & Actions */}
              <div className="border-t border-stone-200 pt-3 space-y-2.5 text-xs">
                {/* Trade-in & VIP Points Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 cursor-pointer font-bold text-emerald-900 text-[11px]">
                    <input
                      type="checkbox"
                      checked={posTradeInBonus}
                      onChange={(e) => setPosTradeInBonus(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Thu cũ đổi mới (-3.000.000₫)</span>
                  </label>

                  {matchedPOSCustomer && matchedPOSCustomer.points > 0 && (
                    <label className="flex items-center gap-1.5 p-2 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer font-bold text-amber-900 text-[11px]">
                      <input
                        type="checkbox"
                        checked={posUsePoints}
                        onChange={(e) => setPosUsePoints(e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span>Dùng {matchedPOSCustomer.points} điểm (-{new Intl.NumberFormat('vi-VN').format(matchedPOSCustomer.points * 1000)}₫)</span>
                    </label>
                  )}
                </div>

                <div className="space-y-1 bg-white p-3 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-stone-600">
                    <span>Tổng tiền máy niêm yết:</span>
                    <span className="font-mono font-bold">{new Intl.NumberFormat('vi-VN').format(posSubtotal)}₫</span>
                  </div>
                  {tradeInDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Trợ giá Thu Cũ Lên Đời:</span>
                      <span className="font-mono">-3.000.000₫</span>
                    </div>
                  )}
                  {posPointsDiscount > 0 && (
                    <div className="flex justify-between text-amber-700 font-bold">
                      <span>Khấu trừ điểm VIP:</span>
                      <span className="font-mono">-{new Intl.NumberFormat('vi-VN').format(posPointsDiscount)}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline font-black text-base text-rose-700 pt-1.5 border-t border-stone-200">
                    <span>Khách cần thanh toán:</span>
                    <span className="font-mono text-lg">{new Intl.NumberFormat('vi-VN').format(posFinalTotal)}₫</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('VIETQR')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      posPaymentMethod === 'VIETQR' ? 'bg-[#1e1d1a] text-[#e5c9a3] border-[#c5a880]' : 'border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    Quét VietQR Napas 24/7
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('CASH')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      posPaymentMethod === 'CASH' ? 'bg-emerald-700 text-white border-emerald-700' : 'border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    Tiền Mặt Tại Quầy
                  </button>
                </div>

                {posPaymentMethod === 'CASH' && (
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-bold">Tiền khách đưa (VNĐ):</span>
                      <input
                        type="number"
                        step={500000}
                        value={posCashReceived}
                        onChange={(e) => setPosCashReceived(Number(e.target.value))}
                        className="w-36 p-1 text-right border border-stone-300 rounded bg-stone-50 font-mono font-bold"
                      />
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span>Tiền thối lại khách:</span>
                      <strong className="font-mono text-emerald-700">{new Intl.NumberFormat('vi-VN').format(posChange)}₫</strong>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePOSCompleteOrder}
                  className="w-full py-3 bg-gradient-to-r from-[#d4b996] to-[#b89768] hover:brightness-105 text-[#1e1d1a] rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer size={16} />
                  <span>Thanh Toán & Xuất Phiếu Bảo Hành Apple</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: QUẢN LÝ KHÁCH HÀNG CRM & ĐIỂM THƯỞNG VIP (UC03)
           ========================================================================= */}
        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#d4b996]/60 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Tìm hội viên theo Tên, SĐT, Email..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex gap-1 text-xs font-bold">
                  {['ALL', 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        selectedTier === tier
                          ? 'bg-[#1e1d1a] text-[#e5c9a3] border-[#c5a880]'
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {tier === 'ALL' ? 'Tất cả hạng' : tier}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddCustomerOpen(true)}
                  className="px-3.5 py-1.5 bg-[#1e1d1a] text-[#e5c9a3] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  + Mở Thẻ Hội Viên Mới
                </button>
              </div>
            </div>

            <div className="bg-[#faf8f5] rounded-2xl border border-[#d4b996]/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-200/70 text-stone-700 border-b border-stone-300 uppercase font-black tracking-wider text-[11px]">
                      <th className="p-4">Khách Hàng Hội Viên</th>
                      <th className="p-4">Số Điện Thoại & Địa Chỉ</th>
                      <th className="p-4">Hạng Thẻ Titan</th>
                      <th className="p-4">Điểm Tích Lũy</th>
                      <th className="p-4">Tổng Chi Tiêu Mua iPhone</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-stone-100/80 transition-colors">
                        <td className="p-4">
                          <strong className="text-stone-900 block font-black text-xs">{cust.name}</strong>
                          <span className="text-stone-500 text-[10px] font-mono">{cust.id} • Ngày mở thẻ: {cust.createdAt}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-stone-800 block font-bold">{cust.phone}</span>
                          <span className="text-stone-500 text-[11px] block">{cust.address}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                            ★ {cust.tier}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-black text-[#8c6f46] text-sm">
                          {cust.points} Điểm
                        </td>
                        <td className="p-4 font-mono font-black text-rose-700">
                          {new Intl.NumberFormat('vi-VN').format(cust.totalSpent)}₫
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedCustomerForPoints(cust)}
                            className="px-3 py-1.5 bg-[#1e1d1a] text-[#e5c9a3] rounded-xl font-bold text-xs cursor-pointer"
                          >
                            Cộng / Trừ Điểm VIP
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: XỬ LÝ ĐỔI TRẢ & BẢO HÀNH 1-ĐỔI-1 (UC10)
           ========================================================================= */}
        {activeTab === 'RETURNS' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#faf8f5] rounded-2xl border border-[#d4b996]/60 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-100/70">
                <div>
                  <h3 className="font-black text-sm text-stone-900">Danh Sách Hồ Sơ Đổi Máy Nâng Cấp Dung Lượng / Bảo Hành 1-Đổi-1 (UC10)</h3>
                  <p className="text-xs text-stone-500">Sau khi Nhân viên Bán hàng duyệt đổi trả, máy sẽ tự động chuyển sang Bộ phận Kho để kiểm định IMEI/Seal</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-200/70 text-stone-700 border-b border-stone-300 uppercase font-black tracking-wider text-[11px]">
                      <th className="p-4">Mã Hồ Sơ & Đơn</th>
                      <th className="p-4">Khách Hàng</th>
                      <th className="p-4">Mẫu Máy iPhone & Lý Do</th>
                      <th className="p-4">Giá Trị Hoàn / Đổi</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Nghiệp Vụ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    {filteredReturnRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-stone-100/80 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-black text-rose-700 block">{req.id}</span>
                          <span className="font-mono text-stone-600 text-[11px]">#{req.orderId}</span>
                        </td>
                        <td className="p-4">
                          <strong className="text-stone-900 block font-bold">{req.customerName}</strong>
                          <span className="text-stone-500 font-mono text-[11px]">{req.customerPhone}</span>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-stone-900">
                            {req.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                          </div>
                          <div className="mt-1 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                            <strong>Yêu cầu:</strong> {req.reason}
                          </div>
                        </td>
                        <td className="p-4 font-black text-rose-700 font-mono">
                          {new Intl.NumberFormat('vi-VN').format(req.refundAmount)}₫
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-[10px]">
                            {req.status === 'PENDING' ? 'Chờ duyệt đổi máy' : req.status === 'APPROVED' ? 'Đã chuyển Kho kiểm định' : 'Đã hoàn tất'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {req.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onProcessReturn(req.id, 'APPROVE')}
                                className="px-3 py-1.5 bg-[#1e1d1a] text-[#e5c9a3] rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Duyệt Đổi Máy 1-1
                              </button>
                              <button
                                onClick={() => onProcessReturn(req.id, 'REFUND_AND_CLAWBACK')}
                                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Hoàn Tiền Ngay
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-bold">Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: TRA CỨU GIAO HÀNG HỎA TỐC 2H APPLE EXPRESS (UC06)
           ========================================================================= */}
        {activeTab === 'TRACKING' && (
          <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
            <div className="bg-[#faf8f5] rounded-2xl shadow-sm border border-[#d4b996]/60 p-6">
              <form onSubmit={handleSearchTracking} className="space-y-3">
                <label className="block text-xs font-black text-stone-800 uppercase tracking-wide">
                  Tra Cứu Vận Đơn Giao Hỏa Tốc 2h — Thế Giới iPhone Express (UC06)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="Nhập mã đơn (VD: DH-20260908-01)..."
                    className="flex-1 px-4 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none font-bold"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1e1d1a] text-[#e5c9a3] font-black text-xs rounded-xl cursor-pointer"
                  >
                    Tra Cứu Ngay
                  </button>
                </div>
              </form>
            </div>

            {trackingResult && (
              <div className="bg-[#faf8f5] rounded-2xl shadow-sm border border-[#d4b996]/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-stone-900">
                      Hành Trình Đơn Máy: #{trackingQuery}
                    </h4>
                    <span className="text-xs text-stone-500">Đơn vị vận chuyển: Thế Giới iPhone Express 2h (Có bảo hiểm máy 100%)</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    Đang giao hỏa tốc
                  </span>
                </div>

                <div className="pl-4 border-l-2 border-[#8c6f46] space-y-4 text-xs ml-2">
                  {trackingResult.map((st: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-[#1e1d1a] border-2 border-[#d4b996]"></div>
                      <h5 className="font-bold text-stone-900">{st.description}</h5>
                      <span className="text-[10px] text-stone-500 font-mono">{st.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Điều Chỉnh Điểm */}
      {selectedCustomerForPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#faf8f5] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#d4b996] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h4 className="font-black text-stone-900 text-sm">Điều Chỉnh Điểm Thưởng VIP</h4>
              <button onClick={() => setSelectedCustomerForPoints(null)} className="text-stone-400 hover:text-stone-700">
                <X size={16} />
              </button>
            </div>
            <input
              type="number"
              value={pointDeltaInput}
              onChange={(e) => setPointDeltaInput(Number(e.target.value))}
              className="w-full p-2.5 text-sm bg-white border border-stone-300 rounded-xl font-mono font-bold outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setSelectedCustomerForPoints(null)} className="flex-1 py-2 bg-stone-200 rounded-xl font-bold text-xs">Hủy</button>
              <button onClick={handleApplyPointChange} className="flex-1 py-2 bg-[#1e1d1a] text-[#e5c9a3] rounded-xl font-bold text-xs">Xác Nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Khách Mới */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <form onSubmit={handleSaveNewCustomer} className="bg-[#faf8f5] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d4b996] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h4 className="font-black text-stone-900 text-sm">Mở Thẻ Hội Viên Thế Giới iPhone</h4>
              <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <input type="text" required value={newCustName} onChange={(e) => setNewCustName(e.target.value)} placeholder="Họ và tên khách hàng *" className="w-full p-2.5 bg-white border border-stone-300 rounded-xl" />
              <input type="text" required value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} placeholder="Số điện thoại *" className="w-full p-2.5 bg-white border border-stone-300 rounded-xl" />
              <input type="text" value={newCustAddress} onChange={(e) => setNewCustAddress(e.target.value)} placeholder="Địa chỉ nhận hàng" className="w-full p-2.5 bg-white border border-stone-300 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="flex-1 py-2 bg-stone-200 rounded-xl font-bold text-xs">Hủy</button>
              <button type="submit" className="flex-1 py-2 bg-[#1e1d1a] text-[#e5c9a3] rounded-xl font-bold text-xs">Tạo Hội Viên</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

function itemQty(item: { quantity: number }) {
  return item.quantity;
}

export default CSKHPortalPage;
