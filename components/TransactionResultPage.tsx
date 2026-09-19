import React, { useState } from 'react';
import { 
  Check, Copy, ArrowRight, Home, Printer, Truck, MapPin, 
  CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, Clock, 
  Sparkles 
} from 'lucide-react';
import { UserRole, CustomerOrder } from '../types';
import Header from './ZShop/Header';

interface TransactionResultPageProps {
  lastOrder?: CustomerOrder | null;
  onViewOrder: () => void;
  onGoHome: () => void;
  onOpenCart?: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
}

const TransactionResultPage: React.FC<TransactionResultPageProps> = ({ 
  lastOrder,
  onViewOrder, 
  onGoHome,
  onOpenCart,
  cartItemCount = 0,
  userRole = UserRole.CUSTOMER,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick
}) => {
  const [isCopied, setIsCopied] = useState(false);

  // Dữ liệu dự phòng nếu reload trang trực tiếp
  const orderId = lastOrder?.id || 'DH-849201';
  const orderDate = lastOrder?.createdAt || new Date().toLocaleString('vi-VN');
  const totalAmount = lastOrder?.totalAmount || 350000;
  const paymentMethod = lastOrder?.paymentMethod || 'VietQR Napas 24/7 (Đã thanh toán)';
  const recipient = lastOrder?.shippingAddress || {
    fullName: 'Nguyễn Quốc Khánh',
    phone: '0901234567',
    address: '12 Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  };
  const items = lastOrder?.items || [];
  const trackingCode = lastOrder?.trackingCode || 'ZSE-88294719VN';
  const carrierName = lastOrder?.carrierName || 'ZShop Express Fast 24/7';
  const estimatedDelivery = lastOrder?.estimatedDelivery || 'Dự kiến giao ngày mai trước 18:00';

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Global Header */}
      <Header 
        onOpenCart={onOpenCart || (() => {})}
        cartItemCount={cartItemCount}
        onLogin={onLogin || (() => {})}
        userRole={userRole}
        onLogout={onLogout || (() => {})}
        onOpenRegister={onOpenRegister}
        onOpenSellerChannel={onOpenSellerChannel}
        onBecomeSeller={onBecomeSeller}
        onProductClick={onProductClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden animate-fadeIn">
          
          {/* Header Xanh Ngọc Tối Giản */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-8 text-white text-center relative overflow-hidden">
            {/* Họa tiết trang trí chìm */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Checkmark động đẹp mắt */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-3 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
                  <Check className="w-7 h-7 text-emerald-600 stroke-[3.5]" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                Đặt Hàng Thành Công!
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-md font-medium">
                Cảm ơn bạn đã tin chọn ZShop. Chúng tôi đang đóng gói và sẽ bàn giao đơn vị vận chuyển sớm nhất.
              </p>
            </div>
          </div>

          {/* Dải răng cưa hóa đơn thanh lịch */}
          <div className="relative h-4 bg-white -mt-2">
            <div className="absolute top-0 left-0 w-3 h-6 bg-slate-50 rounded-r-full -mt-3" />
            <div className="absolute top-0 right-0 w-3 h-6 bg-slate-50 rounded-l-full -mt-3" />
            <div className="border-b-2 border-dashed border-slate-200 mx-6 mt-[-1px]" />
          </div>

          {/* Phần Thân Hóa Đơn */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Khối Tổng Tiền & Mã Đơn */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tổng thanh toán
                </span>
                <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">MÃ ĐƠN HÀNG</span>
                  <span className="font-mono font-black text-slate-800 text-sm tracking-wide">
                    {orderId}
                  </span>
                </div>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                  title="Sao chép mã đơn"
                >
                  {isCopied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Thông tin Giao dịch & Vận chuyển */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              
              {/* Cột 1: Thông tin thanh toán */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                  <CreditCard size={16} className="text-blue-600" />
                  <span>Phương Thức Thanh Toán</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hình thức:</span>
                    <span className="font-semibold text-slate-800 text-right">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="font-mono text-slate-700">{orderDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Trạng thái:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 size={12} /> Đã tiếp nhận
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột 2: Thông tin giao nhận */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                  <Truck size={16} className="text-indigo-600" />
                  <span>Vận Chuyển & Nhận Hàng</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đơn vị:</span>
                    <span className="font-semibold text-slate-800">{carrierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã vận đơn:</span>
                    <span className="font-mono font-bold text-blue-600">{trackingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dự kiến giao:</span>
                    <span className="font-semibold text-emerald-700">{estimatedDelivery}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Địa chỉ người nhận */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3 text-xs sm:text-sm">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 font-bold">{recipient.fullName}</strong>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-700 font-mono font-semibold">{recipient.phone}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{recipient.address}</p>
              </div>
            </div>

            {/* Danh sách món hàng đã mua (nếu có) */}
            {items.length > 0 && (
              <div className="border border-slate-200/80 rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                    <ShoppingBag size={15} className="text-slate-700" />
                    <span>Sản phẩm trong đơn ({items.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Bảo hiểm trọn gói</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200/60"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[240px] sm:max-w-xs">{item.name}</p>
                          <span className="text-[11px] text-slate-400 font-medium">Size: {item.size} • SL: x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nút Hành Động Điều Hướng */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={onViewOrder}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-sm"
              >
                <span>Xem & Theo dõi đơn hàng</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onGoHome}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Home size={16} />
                  Tiếp tục mua sắm
                </button>

                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Printer size={16} />
                  In / Lưu biên lai
                </button>
              </div>
            </div>

          </div>

          {/* Footer Card An Tâm */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-around gap-3 text-slate-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Đổi trả miễn phí 7 ngày</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-blue-600" />
              <span>Hỗ trợ 24/7 qua Chatbot & CSKH</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>Tích điểm VIP ZShop</span>
            </div>
          </div>

        </div>

        {/* Chân trang bản quyền bảo mật */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Giao dịch được mã hóa 256-bit SSL & Bảo chứng an toàn bởi ZShop Payment Gateway © 2026
        </p>

      </main>
    </div>
  );
};

export default TransactionResultPage;