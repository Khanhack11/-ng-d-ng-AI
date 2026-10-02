import React, { useState } from 'react';
import { 
  ShoppingBag, ChevronLeft, Search, Package, Truck, CheckCircle, 
  RotateCcw, Star, X, Eye, ShieldCheck, Clock, 
  AlertCircle, QrCode, FileText, 
  Sparkles, RefreshCw, Phone, Camera, Info
} from 'lucide-react';
import { CustomerOrder, CustomerOrderItem, CustomerReview, OrderStatus, CustomerProfile, UserRole } from '../types';
import Header from './ZShop/Header';

interface MyOrdersPageProps {
  orders: CustomerOrder[];
  onBackToHome: () => void;
  onReOrder: (items: CustomerOrderItem[]) => void;
  onCancelOrder: (orderId: string) => void;
  onRequestReturn: (orderId: string, item: CustomerOrderItem, returnType: 'EXCHANGE_SIZE' | 'REFUND', reason: string, exchangeSize?: string, refundBankInfo?: string) => void;
  onSubmitReview: (orderId: string, review: CustomerReview) => void;
  customerProfile?: CustomerProfile | null;
  onOpenCart: () => void;
  cartItemCount: number;
  userRole: UserRole;
  onLogin: () => void;
  onLogout: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
  onGoToAdmin?: () => void;
  onGoToWarehouse?: () => void;
  onGoToCustomers?: () => void;
  onGoToReturns?: () => void;
  onOpenPOS?: () => void;
  onOpenChangePassword?: () => void;
  onOpenLoyaltyModal?: () => void;
  pendingReturnsCount?: number;
  pendingSellersCount?: number;
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
  onNavigateSeller?: (tab?: 'overview' | 'products' | 'orders' | 'profile') => void;
  onSwitchRole?: (role: any) => void;
  onSwitchWorkspace?: (workspace: any) => void;
}

type OrderTab = 'ALL' | 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'RETURNS' | 'CANCELLED';

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  orders,
  onBackToHome,
  onReOrder,
  onCancelOrder,
  onRequestReturn,
  onSubmitReview,
  customerProfile,
  onOpenCart,
  cartItemCount,
  userRole,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick,
  onGoToAdmin,
  onGoToWarehouse,
  onGoToCustomers,
  onGoToReturns,
  onOpenPOS,
  onOpenChangePassword,
  onOpenLoyaltyModal,
  pendingReturnsCount,
  pendingSellersCount,
  onNavigateAdminTab,
  onNavigateCSKH,
  onNavigateSeller,
  onSwitchRole,
  onSwitchWorkspace
}) => {
  const [activeTab, setActiveTab] = useState<OrderTab>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Modals state
  const [trackingModalOrder, setTrackingModalOrder] = useState<CustomerOrder | null>(null);
  const [reviewModalData, setReviewModalData] = useState<{ order: CustomerOrder; item: CustomerOrderItem } | null>(null);
  const [returnModalData, setReturnModalData] = useState<{ order: CustomerOrder; item: CustomerOrderItem } | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<CustomerOrder | null>(null);
  const [refundStatusModalOrder, setRefundStatusModalOrder] = useState<CustomerOrder | null>(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewFit, setReviewFit] = useState<'tight' | 'fit' | 'loose'>('fit');
  const [reviewQuality, setReviewQuality] = useState<'good' | 'normal' | 'poor'>('good');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewHasPhoto, setReviewHasPhoto] = useState<boolean>(true);

  // Return Form state
  const [returnType, setReturnType] = useState<'EXCHANGE_SIZE' | 'REFUND'>('EXCHANGE_SIZE');
  const [exchangeSize, setExchangeSize] = useState<string>('XL');
  const [returnReason, setReturnReason] = useState<string>('Không vừa size, muốn đổi size khác');
  const [refundBankInfo, setRefundBankInfo] = useState<string>('MBBank - 0901234567 - NGUYEN QUOC KHANH');
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string | null>(null);

  // Lọc danh sách đơn hàng theo Tab và Từ khóa
  const filteredOrders = orders.filter(order => {
    // 1. Lọc theo Tab
    let matchTab = true;
    if (activeTab === 'PENDING') {
      matchTab = order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID || order.status === OrderStatus.PROCESSING;
    } else if (activeTab === 'SHIPPING') {
      matchTab = order.status === OrderStatus.SHIPPING;
    } else if (activeTab === 'DELIVERED') {
      matchTab = order.status === OrderStatus.DELIVERED;
    } else if (activeTab === 'RETURNS') {
      matchTab = order.status === OrderStatus.RETURN_REQUESTED || order.status === OrderStatus.RETURNED;
    } else if (activeTab === 'CANCELLED') {
      matchTab = order.status === OrderStatus.CANCELLED;
    }

    // 2. Lọc theo Từ khóa tìm kiếm
    const query = searchKeyword.toLowerCase().trim();
    let matchKeyword = true;
    if (query) {
      const matchId = order.id.toLowerCase().includes(query);
      const matchItem = order.items.some(it => it.name.toLowerCase().includes(query));
      const matchCarrier = order.trackingCode?.toLowerCase().includes(query);
      matchKeyword = matchId || matchItem || !!matchCarrier;
    }

    return matchTab && matchKeyword;
  });

  // Số lượng đếm cho từng Tab
  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PAID || o.status === OrderStatus.PROCESSING).length,
    SHIPPING: orders.filter(o => o.status === OrderStatus.SHIPPING).length,
    DELIVERED: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    RETURNS: orders.filter(o => o.status === OrderStatus.RETURN_REQUESTED || o.status === OrderStatus.RETURNED).length,
    CANCELLED: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
  };

  // Mở ChatBot với Trợ lý Alex Logistics về đơn này
  const handleAskAIAboutOrder = (order: CustomerOrder) => {
    window.dispatchEvent(new CustomEvent('zshop:open-chatbot', {
      detail: {
        persona: 'ORDERS',
        prompt: `Kiểm tra tình trạng đơn hàng ${order.id} giúp tôi, hiện đang ở đâu rồi?`
      }
    }));
  };

  // Submit Review Form
  const handleSaveReview = () => {
    if (!reviewModalData) return;
    const newReview: CustomerReview = {
      id: `REV-${Date.now()}`,
      orderId: reviewModalData.order.id,
      productId: reviewModalData.item.id,
      productName: reviewModalData.item.name,
      rating: reviewRating,
      fitRating: reviewFit,
      qualityRating: reviewQuality,
      comment: reviewComment || 'Sản phẩm chất lượng tuyệt vời, đường may sắc nét, form mặc rất đẹp!',
      customerName: customerProfile?.name || 'Nguyễn Quốc Khánh',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      vipPointsEarned: 50,
      photos: reviewHasPhoto ? [reviewModalData.item.image] : []
    };

    onSubmitReview(reviewModalData.order.id, newReview);
    setReviewModalData(null);
    setReviewComment('');
  };

  // Submit Return Form
  const handleSaveReturn = () => {
    if (!returnModalData) return;
    onRequestReturn(
      returnModalData.order.id,
      returnModalData.item,
      returnType,
      returnReason,
      returnType === 'EXCHANGE_SIZE' ? exchangeSize : undefined,
      returnType === 'REFUND' ? refundBankInfo : undefined
    );
    setReturnSuccessMsg('Yêu cầu của bạn đã được gửi thành công đến bộ phận CSKH ZShop. Shipper sẽ liên hệ trong 24h!');
    setTimeout(() => {
      setReturnModalData(null);
      setReturnSuccessMsg(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* Header dùng chung của sàn */}
      <Header
        onOpenCart={onOpenCart}
        cartItemCount={cartItemCount}
        userRole={userRole}
        currentUser={customerProfile ? { name: customerProfile.name, email: customerProfile.email, role: userRole } : null}
        onLogin={onLogin}
        onLogout={onLogout}
        onOpenRegister={onOpenRegister}
        onOpenSellerChannel={onOpenSellerChannel}
        onBecomeSeller={onBecomeSeller}
        onProductClick={onProductClick}
        onGoToAdmin={onGoToAdmin}
        onGoToWarehouse={onGoToWarehouse}
        onGoToCustomers={onGoToCustomers}
        onGoToReturns={onGoToReturns}
        onOpenPOS={onOpenPOS}
        onOpenChangePassword={onOpenChangePassword}
        onOpenLoyaltyModal={onOpenLoyaltyModal}
        customerPoints={customerProfile?.points || 450}
        customerTier={customerProfile?.tier || 'Vàng'}
        pendingReturnsCount={pendingReturnsCount}
        pendingSellersCount={pendingSellersCount}
        onNavigateAdminTab={onNavigateAdminTab}
        onNavigateCSKH={onNavigateCSKH}
        onNavigateSeller={onNavigateSeller}
        onSwitchRole={onSwitchRole}
        onSwitchWorkspace={onSwitchWorkspace}
      />

      {/* Hero Sub-header */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white py-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBackToHome}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-sm"
                title="Quay lại mua sắm"
              >
                <ChevronLeft size={22} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <ShoppingBag className="text-brand-400" size={24} />
                    Đơn Mua Của Tôi
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                    {orders.length} đơn hàng
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Theo dõi hành trình đơn hàng, yêu cầu đổi size tận nhà & đánh giá nhận thưởng điểm VIP
                </p>
              </div>
            </div>

            {/* VIP Customer Profile Tag */}
            {customerProfile && (
              <div 
                onClick={onOpenLoyaltyModal}
                className="cursor-pointer bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:border-amber-400/60 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-lg">
                  ★
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <span>Hội viên {customerProfile.tier}</span>
                    <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                    <span className="text-white">{customerProfile.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <span>Khả dụng:</span>
                    <strong className="text-amber-400 font-mono font-black">{customerProfile.points} Điểm</strong>
                    <span className="text-slate-400 text-[10px]">(= {new Intl.NumberFormat('vi-VN').format(customerProfile.points * 100)}đ)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        {/* Search & Action Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo Mã đơn, Tên sản phẩm..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
            {searchKeyword && (
              <button 
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Đổi size miễn phí tận nhà trong 7 ngày • 100% Chính hãng</span>
          </div>
        </div>

        {/* Tab Navigation (Shopee-style) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 text-xs sm:text-sm font-bold text-slate-600">
            <button 
              onClick={() => setActiveTab('ALL')}
              className={`px-4 sm:px-6 py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeTab === 'ALL' ? 'border-brand-600 text-brand-600 bg-brand-50/40' : 'border-transparent hover:text-slate-900'}`}
            >
              <span>Tất cả</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'ALL' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{counts.ALL}</span>
            </button>

            <button 
              onClick={() => setActiveTab('PENDING')}
              className={`px-4 sm:px-6 py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeTab === 'PENDING' ? 'border-amber-500 text-amber-700 bg-amber-50/40' : 'border-transparent hover:text-slate-900'}`}
            >
              <span>Chờ xác nhận</span>
              {counts.PENDING > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white">{counts.PENDING}</span>}
            </button>

            <button 
              onClick={() => setActiveTab('SHIPPING')}
              className={`px-4 sm:px-6 py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeTab === 'SHIPPING' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40' : 'border-transparent hover:text-slate-900'}`}
            >
              <span>Đang vận chuyển</span>
              {counts.SHIPPING > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-600 text-white">{counts.SHIPPING}</span>}
            </button>

            <button 
              onClick={() => setActiveTab('DELIVERED')}
              className={`px-4 sm:px-6 py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeTab === 'DELIVERED' ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40' : 'border-transparent hover:text-slate-900'}`}
            >
              <span>Đã giao</span>
              {counts.DELIVERED > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-600 text-white">{counts.DELIVERED}</span>}
            </button>

            <button 
              onClick={() => setActiveTab('RETURNS')}
              className={`px-4 sm:px-6 py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeTab === 'RETURNS' ? 'border-rose-600 text-rose-700 bg-rose-50/40' : 'border-transparent hover:text-slate-900'}`}
            >
              <span>Đổi trả / Hoàn tiền</span>
              {counts.RETURNS > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-600 text-white">{counts.RETURNS}</span>}
            </button>

            <button 
              onClick={() => setActiveTab('CANCELLED')}
              className={`px-4 sm:px-6 py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeTab === 'CANCELLED' ? 'border-slate-500 text-slate-700 bg-slate-100' : 'border-transparent hover:text-slate-900'}`}
            >
              <span>Đã hủy</span>
              {counts.CANCELLED > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-400 text-white">{counts.CANCELLED}</span>}
            </button>
          </div>
        </div>

        {/* Danh Sách Các Đơn Hàng */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
              <Package size={32} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchKeyword ? `Không có đơn hàng nào khớp với từ khóa "${searchKeyword}".` : 'Bạn chưa có đơn hàng nào trong danh mục trạng thái này.'}
            </p>
            <button 
              onClick={onBackToHome}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-500/20"
            >
              Tiếp tục mua sắm tại ZShop
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === OrderStatus.DELIVERED;
              const isShipping = order.status === OrderStatus.SHIPPING;
              const isPending = order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID || order.status === OrderStatus.PROCESSING;
              const isReturning = order.status === OrderStatus.RETURN_REQUESTED || order.status === OrderStatus.RETURNED;
              const isCancelled = order.status === OrderStatus.CANCELLED;

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={16} className="text-brand-600" />
                        <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                          ZShop Official Store
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({order.createdAt})
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isDelivered && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                          <CheckCircle size={14} className="text-emerald-600" /> GIAO HÀNG THÀNH CÔNG
                        </span>
                      )}
                      {isShipping && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold animate-pulse">
                          <Truck size={14} className="text-indigo-600" /> ĐANG VẬN CHUYỂN
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                          <Clock size={14} className="text-amber-600" /> CHỜ XÁC NHẬN & ĐÓNG GÓI
                        </span>
                      )}
                      {isReturning && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
                          <RotateCcw size={14} className="text-rose-600" /> 
                          {order.status === OrderStatus.RETURN_REQUESTED ? 'ĐANG YÊU CẦU ĐỔI TRẢ' : 'ĐÃ HOÀN TRẢ HÀNG'}
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                          <AlertCircle size={14} className="text-slate-500" /> ĐÃ HỦY ĐƠN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-start sm:items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => onProductClick && onProductClick(item.id)}
                            className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 hover:text-brand-600 cursor-pointer transition-colors"
                          >
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                              Size: <strong>{item.size}</strong>
                            </span>
                            {item.color && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                                Màu: <strong>{item.color}</strong>
                              </span>
                            )}
                            <span>Số lượng: <strong className="text-slate-900">x{item.quantity}</strong></span>
                          </div>
                          
                          {/* Item return/exchange banner if active */}
                          {order.returnReason && (
                            <div className="mt-2 text-[11px] p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 flex items-center gap-1.5">
                              <Info size={13} className="shrink-0" />
                              <span>
                                {order.returnType === 'EXCHANGE_SIZE' ? `Yêu cầu đổi sang size ${order.exchangeSize}: ` : 'Lý do hoàn trả: '}
                                <strong>{order.returnReason}</strong>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                            {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-slate-400">
                              Tổng: {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Price Summary */}
                  <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-slate-500">
                      <span>Thanh toán: <strong className="text-slate-800">{order.paymentMethod}</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Vận chuyển: <strong className="text-slate-800">{order.carrierName || 'ZShop Express 247'}</strong></span>
                      {order.trackingCode && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            Mã VĐ: {order.trackingCode}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 justify-end">
                      <span className="text-slate-500">Tổng thanh toán:</span>
                      <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                        {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ
                      </span>
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                    {/* Left helper info */}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      {isDelivered && (
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                          <CheckCircle size={12} /> Đã kiểm hàng & thanh toán đầy đủ
                        </span>
                      )}
                      {isShipping && (
                        <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1">
                          <Truck size={12} /> Dự kiến giao: {order.estimatedDelivery || 'Hôm nay trước 18:00'}
                        </span>
                      )}
                      {isPending && (
                        <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                          <Clock size={12} /> Đơn đang chuẩn bị, bạn có thể hủy trước khi xuất kho
                        </span>
                      )}
                    </div>

                    {/* Right buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      {/* DELIVERED ACTIONS */}
                      {isDelivered && (
                        <>
                          {/* Review Button */}
                          {order.review ? (
                            <div className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1">
                              <Star size={13} className="text-amber-500 fill-amber-500" />
                              <span>Đã đánh giá ({order.review.rating}★ +50đ VIP)</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReviewModalData({ order, item: order.items[0] })}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <Star size={14} className="fill-white" />
                              <span>Đánh Giá (+50đ VIP)</span>
                            </button>
                          )}

                          {/* Return / Size Exchange Button */}
                          <button
                            onClick={() => setReturnModalData({ order, item: order.items[0] })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw size={13} />
                            <span>Đổi Size / Trả Hàng</span>
                          </button>

                          {/* Re-order 1-Click Button */}
                          <button
                            onClick={() => onReOrder(order.items)}
                            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={13} />
                            <span>Mua Lại</span>
                          </button>

                          {/* E-Warranty & Invoice */}
                          <button
                            onClick={() => setInvoiceModalOrder(order)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            title="Xem Hóa đơn & Bảo hành điện tử"
                          >
                            <FileText size={16} />
                          </button>
                        </>
                      )}

                      {/* SHIPPING ACTIONS */}
                      {isShipping && (
                        <>
                          <button
                            onClick={() => setTrackingModalOrder(order)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck size={14} />
                            <span>Xem Vận Trình</span>
                          </button>

                          <button
                            onClick={() => handleAskAIAboutOrder(order)}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Hỏi AI Logistics Alex về lộ trình đơn hàng"
                          >
                            <Sparkles size={13} className="text-purple-600" />
                            <span>Hỏi AI Alex Về Đơn</span>
                          </button>
                        </>
                      )}

                      {/* PENDING ACTIONS */}
                      {isPending && (
                        <>
                          <button
                            onClick={() => onCancelOrder(order.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <X size={14} />
                            <span>Hủy Đơn</span>
                          </button>

                          <button
                            onClick={() => setTrackingModalOrder(order)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={14} />
                            <span>Chi Tiết</span>
                          </button>
                        </>
                      )}

                      {/* RETURN ACTIONS */}
                      {isReturning && (
                        <button
                          onClick={() => setRefundStatusModalOrder(order)}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>Tiến Độ Đổi Trả</span>
                        </button>
                      )}

                      {/* CANCELLED ACTIONS */}
                      {isCancelled && (
                        <button
                          onClick={() => onReOrder(order.items)}
                          className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={13} />
                          <span>Đặt Lại Đơn Này</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ĐÁNH GIÁ 5 SAO & NHẬN THƯỞNG ĐIỂM VIP (GAMIFIED REVIEW MODAL) */}
      {/* ========================================================================= */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Star size={20} className="fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Đánh Giá Sản Phẩm</h3>
                  <p className="text-[11px] text-slate-500">Đơn hàng #{reviewModalData.order.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setReviewModalData(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img 
                src={reviewModalData.item.image} 
                alt={reviewModalData.item.name} 
                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{reviewModalData.item.name}</h4>
                <p className="text-[11px] text-slate-500">Phân loại: Size {reviewModalData.item.size}</p>
              </div>
            </div>

            {/* Reward Notification Banner */}
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-300 rounded-2xl flex items-center gap-2.5 text-amber-900 text-xs">
              <Sparkles size={18} className="text-amber-600 shrink-0 animate-bounce" />
              <span>
                <strong>Quà tặng độc quyền:</strong> Bạn sẽ nhận được <strong>+50 Điểm thưởng VIP</strong> ngay sau khi gửi đánh giá!
              </span>
            </div>

            {/* Star Rating Selector */}
            <div className="text-center py-2">
              <label className="block text-xs font-bold text-slate-600 mb-2">Độ hài lòng chung</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star 
                      size={32} 
                      className={`${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-600 mt-1">
                {reviewRating === 5 && '😍 Tuyệt vời, vượt ngoài mong đợi!'}
                {reviewRating === 4 && '😊 Rất hài lòng'}
                {reviewRating === 3 && '😐 Sản phẩm bình thường'}
                {reviewRating === 2 && '🙁 Không được ưng ý lắm'}
                {reviewRating === 1 && '😡 Rất thất vọng'}
              </p>
            </div>

            {/* Fit Feedback (Chuyên thời trang) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Độ vừa vặn thực tế khi mặc:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tight', label: 'Hơi chật' },
                  { id: 'fit', label: 'Chuẩn size vừa vặn' },
                  { id: 'loose', label: 'Rộng thoải mái' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReviewFit(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      reviewFit === item.id 
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Chất liệu vải & Gia công:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'good', label: 'Dày dặn cao cấp' },
                  { id: 'normal', label: 'Mát mẻ, thoáng khí' },
                  { id: 'poor', label: 'Cần cải thiện thêm' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReviewQuality(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      reviewQuality === item.id 
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cảm nhận chi tiết:</label>
              <textarea 
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Áo mặc lên form rất tôn dáng, vải sờ mịn tay, giao hàng siêu nhanh đóng gói cẩn thận..."
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Photo upload toggle simulation */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-brand-600" />
                <span className="font-medium text-slate-700">Đính kèm ảnh chụp thực tế (+20 điểm thưởng)</span>
              </div>
              <input 
                type="checkbox"
                checked={reviewHasPhoto}
                onChange={(e) => setReviewHasPhoto(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Gửi Đánh Giá & Nhận 50đ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ĐỔI SIZE THẦN TỐC & YÊU CẦU HOÀN TIỀN (UC10 - BUYER MODAL) */}
      {/* ========================================================================= */}
      {returnModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Yêu Cầu Đổi Size & Trả Hàng</h3>
                  <p className="text-[11px] text-slate-500">Đơn hàng #{returnModalData.order.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setReturnModalData(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {returnSuccessMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle size={36} className="text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Đã Gửi Yêu Cầu Thành Công!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">{returnSuccessMsg}</p>
              </div>
            ) : (
              <>
                {/* 2 Options Switch */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReturnType('EXCHANGE_SIZE')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      returnType === 'EXCHANGE_SIZE'
                        ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-brand-700">
                      <RefreshCw size={14} />
                      <span>Đổi Size Tận Nhà (0đ)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      Shipper mang size mới tới đổi trực tiếp size cũ, không tốn phí ship.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnType('REFUND')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      returnType === 'REFUND'
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
                      <RotateCcw size={14} />
                      <span>Trả Hàng & Hoàn Tiền</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      Hoàn tiền 100% về tài khoản/ví khi hàng lỗi hoặc không đúng mô tả.
                    </p>
                  </button>
                </div>

                {/* Product being returned */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <img 
                    src={returnModalData.item.image} 
                    alt={returnModalData.item.name} 
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-900 truncate">{returnModalData.item.name}</p>
                    <p className="text-slate-500">Size hiện tại: <strong className="text-slate-700">{returnModalData.item.size}</strong> • Số lượng: 1</p>
                  </div>
                  <div className="font-mono font-bold text-rose-600 text-xs">
                    {new Intl.NumberFormat('vi-VN').format(returnModalData.item.price)}đ
                  </div>
                </div>

                {/* Specific Branch Form */}
                {returnType === 'EXCHANGE_SIZE' ? (
                  <div className="space-y-3 bg-brand-50/40 p-4 rounded-2xl border border-brand-100">
                    <label className="block text-xs font-bold text-slate-800">
                      Chọn kích thước (Size) bạn muốn đổi sang:
                    </label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setExchangeSize(sz)}
                          className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            exchangeSize === sz 
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-brand-700 flex items-center gap-1">
                      <CheckCircle size={13} />
                      <span>Kho ZShop còn <strong>58 sản phẩm</strong> sẵn sàng giao cho bạn.</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 bg-rose-50/40 p-4 rounded-2xl border border-rose-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Thông tin tài khoản nhận tiền hoàn:
                      </label>
                      <input 
                        type="text"
                        value={refundBankInfo}
                        onChange={(e) => setRefundBankInfo(e.target.value)}
                        placeholder="VD: MBBank - 0901234567 - NGUYEN QUOC KHANH"
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      * Tiền sẽ được hoàn tự động trong 24 giờ sau khi nhân viên thẩm định kiện hàng theo quy định đổi trả.
                    </p>
                  </div>
                )}

                {/* Reason Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Lý do chi tiết:</label>
                  <select 
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
                  >
                    <option value="Không vừa size, muốn đổi size khác">Không vừa size, muốn đổi size khác</option>
                    <option value="Hàng không giống hình ảnh mô tả">Hàng không giống hình ảnh mô tả</option>
                    <option value="Hàng bị lỗi vải / chỉ may / sứt nút">Hàng bị lỗi vải / chỉ may / sứt nút</option>
                    <option value="Giao nhầm màu sắc / sai sản phẩm">Giao nhầm màu sắc / sai sản phẩm</option>
                    <option value="Đổi ý, không còn nhu cầu sử dụng">Đổi ý, không còn nhu cầu sử dụng</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnModalData(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReturn}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={15} />
                    <span>Xác Nhận Gửi Yêu Cầu</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CHI TIẾT VẬN TRÌNH & TIMELINE (TRACKING TIMELINE MODAL) */}
      {/* ========================================================================= */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Vận Trình Đơn Hàng</h3>
                  <p className="text-[11px] text-slate-500">Mã VĐ: {trackingModalOrder.trackingCode || 'ZSE-998822VN'}</p>
                </div>
              </div>
              <button 
                onClick={() => setTrackingModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Shipper info card */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  ZSE
                </div>
                <div>
                  <h5 className="font-bold text-indigo-950">ZShop Express Fast 24/7</h5>
                  <p className="text-[11px] text-indigo-700">Tài xế: Nguyễn Văn Hùng • 0988.776.655</p>
                </div>
              </div>
              <a 
                href="tel:0988776655"
                className="p-2 bg-white rounded-xl text-indigo-600 shadow-xs hover:bg-indigo-600 hover:text-white transition-colors"
                title="Gọi cho tài xế"
              >
                <Phone size={16} />
              </a>
            </div>

            {/* Step Timeline */}
            <div className="py-2 pl-4 space-y-6 border-l-2 border-indigo-200 ml-3">
              <div className="relative">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
                <h5 className="text-xs font-bold text-slate-900">Đã giao hàng thành công</h5>
                <p className="text-[11px] text-slate-500">Người nhận: Nguyễn Quốc Khánh (Đã đồng kiểm an tâm)</p>
                <span className="text-[10px] text-slate-400 font-mono">08/09/2026 - 15:30</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs"></div>
                <h5 className="text-xs font-bold text-slate-900">Shipper đang trên đường giao tới bạn</h5>
                <p className="text-[11px] text-slate-500">Khu vực: P. Bến Nghé, Quận 1, TP.HCM</p>
                <span className="text-[10px] text-slate-400 font-mono">08/09/2026 - 13:15</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <h5 className="text-xs font-bold text-slate-700">Xuất kho trung chuyển Miền Nam (Tân Bình)</h5>
                <span className="text-[10px] text-slate-400 font-mono">07/09/2026 - 21:00</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <h5 className="text-xs font-bold text-slate-700">Đơn hàng đã được tạo & Kho ZShop hoàn tất đóng gói</h5>
                <span className="text-[10px] text-slate-400 font-mono">07/09/2026 - 14:00</span>
              </div>
            </div>

            <button
              onClick={() => setTrackingModalOrder(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HÓA ĐƠN ĐIỆN TỬ VAT & THẺ BẢO HÀNH QR (E-WARRANTY) */}
      {/* ========================================================================= */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bảo Hành & Hóa Đơn Điện Tử</h3>
                  <p className="text-[11px] text-slate-500">Mã đơn: #{invoiceModalOrder.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setInvoiceModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* QR Card */}
            <div className="p-5 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white rounded-2xl text-center space-y-3">
              <div className="w-24 h-24 bg-white p-2 rounded-2xl mx-auto shadow-md flex items-center justify-center">
                <QrCode size={80} className="text-slate-900" />
              </div>
              <div>
                <span className="text-[10px] tracking-widest uppercase text-amber-400 font-mono font-bold">
                  ★ ZSHOP OFFICIAL E-WARRANTY ★
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Bảo Hành Chính Hãng 12 Tháng</h4>
                <p className="text-[11px] text-slate-300">Quét mã QR tại bất kỳ chi nhánh ZShop toàn quốc</p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Khách hàng:</span>
                <strong className="text-slate-900">{customerProfile?.name || 'Nguyễn Quốc Khánh'}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Ngày kích hoạt:</span>
                <span className="text-slate-700 font-mono">{invoiceModalOrder.createdAt}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hết hạn bảo hành:</span>
                <span className="text-emerald-600 font-bold font-mono">31/12/2027</span>
              </div>
              <div className="flex justify-between text-slate-500 border-t border-slate-200 pt-2">
                <span>Trạng thái VAT:</span>
                <span className="text-emerald-700 font-bold">Đã phát hành hóa đơn điện tử</span>
              </div>
            </div>

            <button
              onClick={() => setInvoiceModalOrder(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: TIẾN ĐỘ HOÀN TIỀN 4 BƯỚC (UC10 STATUS MODAL) */}
      {/* ========================================================================= */}
      {refundStatusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Tiến Độ Thẩm Định Đổi Trả</h3>
                  <p className="text-[11px] text-slate-500">Hồ sơ #{refundStatusModalOrder.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setRefundStatusModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* 4 Steps Stepper */}
            <div className="py-2 pl-4 space-y-5 border-l-2 border-rose-300 ml-3 text-xs">
              <div className="relative">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
                <h5 className="font-bold text-slate-900">1. Đã tiếp nhận yêu cầu đổi trả</h5>
                <p className="text-[11px] text-slate-500">Khách hàng gửi yêu cầu trực tuyến trên web</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-xs animate-pulse"></div>
                <h5 className="font-bold text-amber-900">2. Đang chờ nhân viên CSKH thẩm định</h5>
                <p className="text-[11px] text-slate-500">Kiểm tra video unboxing và tình trạng tem mác</p>
              </div>

              <div className="relative opacity-50">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <h5 className="font-bold text-slate-600">3. Shipper đến thu hồi hàng hoặc đổi size tận nơi</h5>
              </div>

              <div className="relative opacity-50">
                <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <h5 className="font-bold text-slate-600">4. Hoàn tiền về ví / tài khoản & cập nhật điểm thưởng</h5>
              </div>
            </div>

            <button
              onClick={() => setRefundStatusModalOrder(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
