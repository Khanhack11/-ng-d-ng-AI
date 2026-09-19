import React, { useState } from 'react';
import { 
  RotateCcw, Users, ShoppingCart, Truck, Search, 
  CheckCircle, XCircle, DollarSign, Star, Award, 
  Plus, Minus, Trash2, ArrowLeft, Phone, Mail, 
  MapPin, ShieldCheck, Clock, ExternalLink, QrCode, 
  Printer, Sparkles, Filter, X, Eye, AlertCircle, RefreshCw
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
}

type CSKHTab = 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING';

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
  initialTab = 'RETURNS'
}) => {
  const [activeTab, setActiveTab] = useState<CSKHTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // ==========================================
  // TAB 1: STATE FOR RETURN MANAGEMENT (UC10)
  // ==========================================
  const [returnStatusFilter, setReturnStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REFUNDED' | 'REJECTED'>('ALL');
  const [returnSearchTerm, setReturnSearchTerm] = useState('');

  const filteredReturnRequests = returnRequests.filter(req => {
    const matchStatus = returnStatusFilter === 'ALL' || req.status === returnStatusFilter;
    const matchSearch = req.orderId.toLowerCase().includes(returnSearchTerm.toLowerCase()) || 
                        req.customerName.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
                        req.id.toLowerCase().includes(returnSearchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingReturnsCount = returnRequests.filter(r => r.status === 'PENDING').length;

  // ==========================================
  // TAB 2: STATE FOR CUSTOMER CRM (UC03)
  // ==========================================
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<CustomerProfile | null>(null);
  const [pointDeltaInput, setPointDeltaInput] = useState<number>(50);

  // New customer form
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchTier = selectedTier === 'ALL' || c.tier === selectedTier;
    const matchSearch = c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
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
      email: newCustEmail || `${newCustPhone}@zshop.user`,
      address: newCustAddress || 'TP. Hồ Chí Minh',
      points: 100, // Điểm thưởng chào mừng thành viên mới
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
    alert(`Đã thêm thành công khách hàng ${created.name} (+100 điểm thưởng chào mừng)!`);
  };

  const handleApplyPointChange = () => {
    if (!selectedCustomerForPoints) return;
    onUpdateCustomerPoints(selectedCustomerForPoints.id, pointDeltaInput, 0);
    alert(`Đã ${pointDeltaInput >= 0 ? 'cộng' : 'trừ'} ${Math.abs(pointDeltaInput)} điểm cho khách hàng ${selectedCustomerForPoints.name}!`);
    setSelectedCustomerForPoints(null);
  };

  // ==========================================
  // TAB 3: STATE FOR RETAIL POS (UC04)
  // ==========================================
  const [posCart, setPosCart] = useState<{ product: ProductDetail; size: string; quantity: number }[]>([]);
  const [posSearch, setPosSearch] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('0901234567');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'CASH' | 'VIETQR'>('VIETQR');
  const [posUsePoints, setPosUsePoints] = useState(false);
  const [posCashReceived, setPosCashReceived] = useState<number>(500000);

  const matchedPOSCustomer = customers.find(c => c.phone === posCustomerPhone);

  const posFilteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(posSearch.toLowerCase()) || 
    p.id.toLowerCase().includes(posSearch.toLowerCase())
  );

  const handlePOSAddToCart = (product: ProductDetail) => {
    const defaultSize = product.sizes?.[0] || 'M';
    setPosCart(prev => {
      const exist = prev.find(item => item.product.id === product.id && item.size === defaultSize);
      if (exist) {
        return prev.map(item => item.product.id === product.id && item.size === defaultSize 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { product, size: defaultSize, quantity: 1 }];
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
  const posPointsDiscount = (posUsePoints && matchedPOSCustomer) ? Math.min(posSubtotal, matchedPOSCustomer.points * 100) : 0;
  const posFinalTotal = Math.max(0, posSubtotal - posPointsDiscount);
  const posChange = Math.max(0, posCashReceived - posFinalTotal);

  const handlePOSCompleteOrder = () => {
    if (posCart.length === 0) {
      alert('Vui lòng thêm sản phẩm vào đơn POS!');
      return;
    }
    if (posUsePoints && matchedPOSCustomer) {
      const usedPoints = Math.round(posPointsDiscount / 100);
      onUpdateCustomerPoints(matchedPOSCustomer.id, -usedPoints, posFinalTotal);
    } else if (matchedPOSCustomer) {
      // Tích 1% điểm cho đơn mua tại quầy
      const earnedPoints = Math.round(posFinalTotal / 100000);
      onUpdateCustomerPoints(matchedPOSCustomer.id, earnedPoints, posFinalTotal);
    }
    alert(`🎉 Thanh toán POS thành công!\n- Tổng tiền: ${new Intl.NumberFormat('vi-VN').format(posFinalTotal)}đ\n- Phương thức: ${posPaymentMethod === 'VIETQR' ? 'VietQR Napas 24/7' : 'Tiền mặt'}\n- Đã in biên lai thu ngân showroom.`);
    setPosCart([]);
  };

  // ==========================================
  // TAB 4: STATE FOR TRACKING LOOKUP (UC06)
  // ==========================================
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    const res = DatHangService.traCuuDonHang(trackingQuery.trim());
    setTrackingResult(res || [
      { status: OrderStatus.SHIPPING, date: '08/09/2026 13:15', description: 'Shipper Nguyễn Văn Hùng đang trên đường giao hàng tại Q.1', completed: true },
      { status: OrderStatus.PROCESSING, date: '07/09/2026 21:00', description: 'Kiện hàng đã xuất kho trung chuyển Tân Bình', completed: true },
      { status: OrderStatus.PAID, date: '07/09/2026 14:00', description: 'Đã thanh toán VietQR Napas 24/7 & Kho đã đóng gói', completed: true }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. Global Portal Top Bar */}
      <PortalTopBar
        currentWorkspace="CSKH"
        onSwitchWorkspace={onSwitchWorkspace}
        currentUser={currentUser}
        pendingReturnsCount={pendingReturnsCount}
      />

      {/* 2. CSKH Workspace Header */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToHome}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Quay lại sàn mua sắm"
          >
            <ArrowLeft size={16} /> Thoát Cổng CSKH
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white">
                  CỔNG CHĂM SÓC KHÁCH HÀNG & BÁN HÀNG TẠI QUẦY
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                  CSKH & Sales Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Xử lý khiếu nại đổi trả, quản lý hội viên CRM, thanh toán POS thu ngân & điều phối vận đơn
              </p>
            </div>
          </div>
        </div>

        {/* CSKH Navigation Tabs */}
        <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('RETURNS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'RETURNS'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <RotateCcw size={14} />
            <span>1. Xử Lý Đổi Trả (UC10)</span>
            {pendingReturnsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                {pendingReturnsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'CUSTOMERS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users size={14} />
            <span>2. Khách Hàng CRM (UC03)</span>
          </button>

          <button
            onClick={() => setActiveTab('POS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'POS'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShoppingCart size={14} />
            <span>3. Bán Hàng POS (UC04)</span>
          </button>

          <button
            onClick={() => setActiveTab('TRACKING')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'TRACKING'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Truck size={14} />
            <span>4. Tra Cứu Đơn (UC06)</span>
          </button>
        </div>
      </header>

      {/* 3. Tab Body Container */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        
        {/* =========================================================================
            TAB 1: XỬ LÝ ĐỔI TRẢ & HOÀN TIỀN (UC10)
           ========================================================================= */}
        {activeTab === 'RETURNS' && (
          <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Tổng hồ sơ đổi trả</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{returnRequests.length} đơn</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RotateCcw size={20} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-800 font-bold">Chờ CSKH thẩm định</span>
                  <h3 className="text-2xl font-black text-amber-900 mt-0.5">{pendingReturnsCount} yêu cầu</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  {pendingReturnsCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-bold">Đã bồi hoàn thành công</span>
                  <h3 className="text-2xl font-black text-emerald-900 mt-0.5">
                    {new Intl.NumberFormat('vi-VN').format(returnRequests.filter(r => r.status === 'REFUNDED').reduce((sum, r) => sum + r.refundAmount, 0))}đ
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={returnSearchTerm}
                  onChange={(e) => setReturnSearchTerm(e.target.value)}
                  placeholder="Tìm theo Mã hồ sơ, Mã đơn, Tên khách..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-1.5 text-xs font-bold overflow-x-auto w-full sm:w-auto">
                {(['ALL', 'PENDING', 'APPROVED', 'REFUNDED', 'REJECTED'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setReturnStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      returnStatusFilter === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'ALL' && 'Tất cả'}
                    {st === 'PENDING' && 'Chờ thẩm định'}
                    {st === 'APPROVED' && 'Đã duyệt thu hồi'}
                    {st === 'REFUNDED' && 'Đã hoàn tiền'}
                    {st === 'REJECTED' && 'Đã từ chối'}
                  </button>
                ))}
              </div>
            </div>

            {/* Return Requests Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-black tracking-wider text-[11px]">
                      <th className="p-4">Hồ sơ & Mã đơn</th>
                      <th className="p-4">Khách hàng</th>
                      <th className="p-4">Sản phẩm & Lý do</th>
                      <th className="p-4">Tiền hoàn & Thu hồi điểm</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác nghiệp vụ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReturnRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Không có yêu cầu đổi trả nào trong danh mục này.
                        </td>
                      </tr>
                    ) : (
                      filteredReturnRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 align-top">
                            <span className="font-mono font-bold text-rose-600 block">{req.id}</span>
                            <span className="font-mono text-slate-700 text-[11px]">#{req.orderId}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{req.requestedAt}</span>
                          </td>

                          <td className="p-4 align-top">
                            <strong className="text-slate-900 block font-bold">{req.customerName}</strong>
                            <span className="text-slate-500 font-mono flex items-center gap-1 text-[11px] mt-0.5">
                              <Phone size={11} /> {req.customerPhone}
                            </span>
                          </td>

                          <td className="p-4 align-top max-w-xs">
                            <div className="font-medium text-slate-800">
                              {req.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                            </div>
                            <div className="mt-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-100 p-1.5 rounded-lg">
                              <strong>Lý do:</strong> {req.reason}
                            </div>
                          </td>

                          <td className="p-4 align-top">
                            <div className="font-black text-slate-900 font-mono">
                              {new Intl.NumberFormat('vi-VN').format(req.refundAmount)}đ
                            </div>
                            {req.pointsToDeduct > 0 && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold block mt-1">
                                Thu hồi: -{req.pointsToDeduct} điểm VIP
                              </span>
                            )}
                          </td>

                          <td className="p-4 align-top">
                            {req.status === 'PENDING' && (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                <Clock size={11} /> Chờ thẩm định
                              </span>
                            )}
                            {req.status === 'APPROVED' && (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                <Truck size={11} /> Đã duyệt thu hồi
                              </span>
                            )}
                            {req.status === 'REFUNDED' && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle size={11} /> Đã hoàn tiền
                              </span>
                            )}
                            {req.status === 'REJECTED' && (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                <XCircle size={11} /> Đã từ chối
                              </span>
                            )}
                          </td>

                          <td className="p-4 align-top text-right space-y-1.5">
                            {req.status === 'PENDING' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onProcessReturn(req.id, 'APPROVE')}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                                  title="Duyệt đổi size / điều shipper thu hồi hàng"
                                >
                                  Duyệt Đổi Hàng
                                </button>
                                <button
                                  onClick={() => onProcessReturn(req.id, 'REFUND_AND_CLAWBACK')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                                  title="Hoàn tiền ngay & thu hồi điểm tích lũy"
                                >
                                  Hoàn Tiền (UC10)
                                </button>
                                <button
                                  onClick={() => onProcessReturn(req.id, 'REJECT')}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Từ chối yêu cầu"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            )}
                            {req.status === 'APPROVED' && (
                              <button
                                onClick={() => onProcessReturn(req.id, 'REFUND_AND_CLAWBACK')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Xác nhận Đã Nhận Hàng ➔ Hoàn Tiền
                              </button>
                            )}
                            {(req.status === 'REFUNDED' || req.status === 'REJECTED') && (
                              <span className="text-[11px] text-slate-400 italic">
                                Hồ sơ đã đóng
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: QUẢN LÝ KHÁCH HÀNG CRM & ĐIỂM THƯỞNG VIP (UC03)
           ========================================================================= */}
        {activeTab === 'CUSTOMERS' && (
          <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Tìm theo Tên, SĐT, Email..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
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
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tier === 'ALL' ? 'Tất cả hạng' : tier}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddCustomerOpen(true)}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus size={15} /> Thêm Khách
                </button>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-black tracking-wider text-[11px]">
                      <th className="p-4">Khách hàng</th>
                      <th className="p-4">Liên hệ & Địa chỉ</th>
                      <th className="p-4">Hạng Hội Viên</th>
                      <th className="p-4">Điểm Tích Lũy</th>
                      <th className="p-4">Tổng Chi Tiêu</th>
                      <th className="p-4 text-right">Điều Chỉnh Điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <strong className="text-slate-900 block font-bold text-xs">{cust.name}</strong>
                          <span className="text-slate-400 text-[10px] font-mono">{cust.id} • Ngày tạo: {cust.createdAt}</span>
                        </td>

                        <td className="p-4">
                          <span className="font-mono text-slate-700 block font-bold">{cust.phone}</span>
                          <span className="text-slate-400 text-[11px] block">{cust.email}</span>
                          <span className="text-slate-500 text-[10px] truncate block max-w-xs">{cust.address}</span>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            cust.tier === 'Kim Cương' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            cust.tier === 'Vàng' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            cust.tier === 'Bạc' ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                            'bg-orange-100 text-orange-800 border border-orange-200'
                          }`}>
                            ★ {cust.tier}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-black text-amber-600 text-sm">
                          {cust.points} Điểm
                          <span className="text-[10px] text-slate-400 font-normal block font-sans">
                            (= {new Intl.NumberFormat('vi-VN').format(cust.points * 100)}đ)
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-slate-800">
                          {new Intl.NumberFormat('vi-VN').format(cust.totalSpent)}đ
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedCustomerForPoints(cust)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                          >
                            Tặng / Trừ Điểm VIP
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Điều Chỉnh Điểm */}
            {selectedCustomerForPoints && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-sm">Điều Chỉnh Điểm Thưởng VIP</h4>
                    <button onClick={() => setSelectedCustomerForPoints(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Khách hàng: <strong className="text-slate-900">{selectedCustomerForPoints.name}</strong></p>
                    <p>Điểm hiện tại: <strong className="text-amber-600 font-mono">{selectedCustomerForPoints.points} Điểm</strong></p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điểm thay đổi (+ để cộng, - để trừ):
                    </label>
                    <input
                      type="number"
                      value={pointDeltaInput}
                      onChange={(e) => setPointDeltaInput(Number(e.target.value))}
                      className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedCustomerForPoints(null)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleApplyPointChange}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm"
                    >
                      Xác Nhận Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Thêm Khách Mới */}
            {isAddCustomerOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                <form onSubmit={handleSaveNewCustomer} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-sm">Thêm Khách Hàng Mới (CRM)</h4>
                    <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="VD: Trần Văn Bình"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                      <input
                        type="text"
                        required
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        placeholder="VD: 0987654321"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email liên hệ</label>
                      <input
                        type="email"
                        value={newCustEmail}
                        onChange={(e) => setNewCustEmail(e.target.value)}
                        placeholder="VD: binh.tran@gmail.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Địa chỉ giao hàng</label>
                      <input
                        type="text"
                        value={newCustAddress}
                        onChange={(e) => setNewCustAddress(e.target.value)}
                        placeholder="VD: 120 Hai Bà Trưng, Q.1, TP.HCM"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddCustomerOpen(false)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-sm"
                    >
                      Tạo Khách Hàng
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: BÁN HÀNG POS & THU NGÂN TẠI QUẦY (UC04)
           ========================================================================= */}
        {activeTab === 'POS' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
            {/* Left: Product Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    placeholder="Quét mã vạch hoặc gõ tên sản phẩm showroom..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
                <span className="text-xs text-slate-400 font-bold shrink-0">
                  {posFilteredProducts.length} mặt hàng
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
                {posFilteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePOSAddToCart(p)}
                    className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <img 
                      src={p.images?.[0] || 'https://via.placeholder.com/150'} 
                      alt={p.name} 
                      className="w-full h-28 object-cover rounded-xl bg-slate-50 mb-2"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-2">{p.name}</h5>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-mono font-black text-rose-600">
                          {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                        </span>
                        <span className="text-[10px] text-slate-400">Kho: {p.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cashier Receipt & Payment (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                    <ShoppingCart size={16} className="text-amber-600" />
                    Đơn Hàng Thu Ngân POS
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Customer Phone Input for loyalty */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3 text-xs space-y-2">
                  <label className="font-bold text-slate-700 block">SĐT Khách Hàng (Tích điểm):</label>
                  <input
                    type="text"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    placeholder="Nhập SĐT khách hàng..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-mono font-bold"
                  />
                  {matchedPOSCustomer ? (
                    <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                      <span>★ {matchedPOSCustomer.name} ({matchedPOSCustomer.tier})</span>
                      <strong>{matchedPOSCustomer.points} Điểm</strong>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">Khách vãng lai chưa có hồ sơ CRM</p>
                  )}
                </div>

                {/* POS Items List */}
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {posCart.length === 0 ? (
                    <p className="text-center py-8 text-slate-400">Chưa chọn món nào vào đơn</p>
                  ) : (
                    posCart.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{it.product.name}</p>
                          <span className="text-[11px] text-slate-400">{new Intl.NumberFormat('vi-VN').format(it.product.price)}đ</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handlePOSUpdateQty(idx, -1)} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold">
                            -
                          </button>
                          <span className="w-6 text-center font-bold">{it.quantity}</span>
                          <button onClick={() => handlePOSUpdateQty(idx, 1)} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold">
                            +
                          </button>
                        </div>
                        <span className="font-mono font-bold text-slate-900 w-20 text-right">
                          {new Intl.NumberFormat('vi-VN').format(it.product.price * it.quantity)}đ
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Totals & Actions */}
              <div className="border-t border-slate-100 pt-3 space-y-3 text-xs">
                {matchedPOSCustomer && matchedPOSCustomer.points > 0 && (
                  <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-900">
                      <input
                        type="checkbox"
                        checked={posUsePoints}
                        onChange={(e) => setPosUsePoints(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Trừ điểm VIP ({matchedPOSCustomer.points}đ = {new Intl.NumberFormat('vi-VN').format(matchedPOSCustomer.points * 100)}đ)</span>
                    </label>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-mono">{new Intl.NumberFormat('vi-VN').format(posSubtotal)}đ</span>
                  </div>
                  {posPointsDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Khấu trừ điểm VIP:</span>
                      <span className="font-mono">-{new Intl.NumberFormat('vi-VN').format(posPointsDiscount)}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline font-black text-base text-rose-600 pt-1 border-t border-slate-100">
                    <span>Tổng thanh toán:</span>
                    <span className="font-mono text-lg">{new Intl.NumberFormat('vi-VN').format(posFinalTotal)}đ</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('VIETQR')}
                    className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      posPaymentMethod === 'VIETQR' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Mã VietQR 24/7
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('CASH')}
                    className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      posPaymentMethod === 'CASH' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Tiền Mặt
                  </button>
                </div>

                {posPaymentMethod === 'CASH' && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-bold">Tiền khách đưa:</span>
                      <input
                        type="number"
                        value={posCashReceived}
                        onChange={(e) => setPosCashReceived(Number(e.target.value))}
                        className="w-32 p-1 text-right border rounded bg-white font-mono font-bold"
                      />
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Tiền thối lại:</span>
                      <strong className="font-mono text-emerald-700">{new Intl.NumberFormat('vi-VN').format(posChange)}đ</strong>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePOSCompleteOrder}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer size={16} />
                  <span>Xác Nhận Thanh Toán & In Bill</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: TRA CỨU & ĐIỀU PHỐI VẬN ĐƠN (UC06)
           ========================================================================= */}
        {activeTab === 'TRACKING' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
              <form onSubmit={handleSearchTracking} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Tra Cứu Tiến Trình Vận Đơn Tức Thì (UC06)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={trackingQuery}
                      onChange={(e) => setTrackingQuery(e.target.value)}
                      placeholder="Nhập mã đơn (VD: DH-20260908-01) hoặc Mã VĐ (ZSE-...)"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Search size={16} />
                    Tra cứu
                  </button>
                </div>
              </form>
            </div>

            {/* Tracking Result */}
            {trackingResult && (
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      Lộ Trình Vận Đơn: #{trackingQuery || 'DH-20260908-01'}
                    </h4>
                    <span className="text-xs text-slate-500">Đơn vị: ZShop Express Fast 24/7</span>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">
                    Đang lưu thông
                  </span>
                </div>

                <div className="pl-4 border-l-2 border-sky-300 space-y-5 text-xs ml-2">
                  {trackingResult.map((st: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-xs"></div>
                      <h5 className="font-bold text-slate-900">{st.description}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{st.date}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>Tài xế giao hàng: <strong>Nguyễn Văn Hùng (0988.776.655)</strong></span>
                  </div>
                  <a
                    href="tel:0988776655"
                    className="px-3 py-1 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Gọi Hỗ Trợ
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default CSKHPortalPage;
