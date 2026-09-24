import React, { useState, useEffect } from 'react';
import { 
  Check, ChevronLeft, ChevronRight, ShieldCheck, MapPin, Truck, 
  CreditCard, QrCode, Banknote, Wallet, Tag, Ticket, AlertCircle, 
  Copy, RefreshCw, ShoppingBag, Plus, Minus, Trash2, Edit3, X, 
  Award, Smartphone, ThumbsUp, HelpCircle
} from 'lucide-react';
import { PaymentMethodType, CartItem, UserRole, CustomerProfile } from '../types';
import { DatHangService, ThanhToanService, AuthUserData, getProductVisualSync } from '../services';
import { MOCK_PRODUCTS_LIST } from '../constants';
import Header from './ZShop/Header';

interface CheckoutPageProps {
  cartItems: CartItem[];
  allCartItems?: CartItem[];
  onToggleSelectItem?: (id: string) => void;
  onBack: () => void;
  onPaymentSuccess: (orderInfo?: any) => void;
  onOpenCart?: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  currentUser?: AuthUserData | null;
  customerProfile?: CustomerProfile | null;
  onUpdatePoints?: (customerId: string, deltaPoints: number) => void;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
}

// Danh sách Voucher có sẵn
const AVAILABLE_VOUCHERS = [
  { code: 'FREESHIPMAX', discount: 30000, description: 'Miễn phí vận chuyển (Tối đa 30k)', minOrder: 0, tag: 'Freeship' },
  { code: 'ZSHOPNEW', discount: 50000, description: 'Giảm 50k cho đơn hàng từ 250k', minOrder: 250000, tag: 'Khách mới' },
  { code: 'VIPGOLD10', discount: 80000, description: 'Giảm 80k cho thành viên VIP từ 500k', minOrder: 500000, tag: 'Đặc quyền VIP' }
];

export default function CheckoutPage({
  cartItems,
  allCartItems,
  onToggleSelectItem,
  onBack,
  onPaymentSuccess,
  onOpenCart,
  cartItemCount,
  userRole = UserRole.CUSTOMER,
  currentUser,
  customerProfile,
  onUpdatePoints,
  onUpdateQuantity,
  onRemoveFromCart,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick
}: CheckoutPageProps) {
  // 1. Quản lý Địa chỉ giao hàng
  const [recipientName, setRecipientName] = useState<string>(customerProfile?.name || currentUser?.name || 'Nguyễn Quốc Khánh');
  const [recipientPhone, setRecipientPhone] = useState<string>(customerProfile?.phone || '0901234567');
  const [recipientAddress, setRecipientAddress] = useState<string>(customerProfile?.address || '12 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh');
  const [orderNote, setOrderNote] = useState<string>('');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);

  // 2. Phương thức vận chuyển (Shipping)
  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const shippingFee = shippingMethod === 'STANDARD' ? 30000 : 50000;

  // 3. Phương thức thanh toán (Payment Method)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(PaymentMethodType.QR_CODE);

  // 4. Voucher & Mã giảm giá
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>({
    code: 'FREESHIPMAX',
    discount: 30000
  });
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // 5. Điểm thưởng VIP Loyalty (UC03)
  const userPoints = customerProfile?.points || 450;
  const pointEquivalentVND = userPoints * 100; // 1 điểm = 100đ
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);

  // 6. Xử lý thanh toán & Mã đơn
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderId] = useState<string>(() => `DH-${Math.floor(100000 + Math.random() * 900000)}`);

  // Tính toán tổng tiền
  const subtotal = DatHangService.tinhTongTienGioHang(cartItems);
  const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
  const loyaltyDiscount = useLoyaltyPoints ? pointEquivalentVND : 0;
  const totalDiscount = voucherDiscount + loyaltyDiscount;
  const finalTotal = Math.max(0, subtotal + shippingFee - totalDiscount);

  // Sao chép thông tin VietQR
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Áp dụng Voucher
  const handleApplyVoucherCode = (codeToApply: string) => {
    const codeUpper = codeToApply.toUpperCase().trim();
    const found = AVAILABLE_VOUCHERS.find(v => v.code === codeUpper);
    if (!found) {
      setVoucherError('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
      return;
    }
    if (subtotal < found.minOrder) {
      setVoucherError(`Đơn hàng cần đạt tối thiểu ${new Intl.NumberFormat('vi-VN').format(found.minOrder)}đ.`);
      return;
    }
    setAppliedVoucher({ code: found.code, discount: found.discount });
    setVoucherInput('');
    setVoucherError(null);
  };

  // Gỡ bỏ Voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError(null);
  };

  // Thực hiện Đặt hàng
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderFormData = {
        fullName: recipientName,
        phone: recipientPhone,
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        address: recipientAddress,
        note: orderNote
      };

      // Tạo đơn hàng qua Service
      await DatHangService.taoDonHangNhap(cartItems, orderFormData);

      // Trừ điểm thưởng nếu có dùng
      if (useLoyaltyPoints && customerProfile && onUpdatePoints) {
        onUpdatePoints(customerProfile.id, -userPoints);
      }

      // Xử lý thanh toán
      await ThanhToanService.xuLyThanhToan(orderId, finalTotal, selectedMethod);

      setTimeout(() => {
        setIsProcessing(false);
        onPaymentSuccess({
          orderId,
          totalAmount: finalTotal,
          recipientName,
          recipientPhone,
          recipientAddress,
          paymentMethod: selectedMethod,
          shippingMethod
        });
      }, 900);
    } catch (error) {
      setIsProcessing(false);
      onPaymentSuccess({
        orderId,
        totalAmount: finalTotal,
        recipientName,
        recipientPhone,
        recipientAddress,
        paymentMethod: selectedMethod,
        shippingMethod
      });
    }
  };

  // Link ảnh VietQR động
  const vietQrDynamicUrl = `https://img.vietqr.io/image/MB-0901234567-compact2.png?amount=${finalTotal}&addInfo=${orderId}&accountName=ZSHOP%20VIETNAM`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans antialiased">
      {/* 1. Global Header */}
      <Header 
        onOpenCart={onOpenCart || (() => {})}
        cartItemCount={cartItemCount || 0}
        onLogin={onLogin || (() => {})}
        userRole={userRole}
        onLogout={onLogout || (() => {})}
        onOpenRegister={onOpenRegister}
        onOpenSellerChannel={onOpenSellerChannel}
        onBecomeSeller={onBecomeSeller}
        onProductClick={onProductClick}
      />

      {/* 2. Stepper Thanh Tiến Trình (One-Page Checkout Stepper) */}
      <div className="bg-white border-b border-slate-200 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900 flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft size={16} /> Quay lại mua sắm
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <h1 className="text-base sm:text-lg font-black text-slate-900 hidden sm:block tracking-tight">
              ĐẶT HÀNG & THANH TOÁN
            </h1>
          </div>

          {/* 3-Step Progress Indicators */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-black">
                <Check size={12} strokeWidth={3} />
              </span>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
            <div className="flex items-center gap-1.5 text-blue-600">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                2
              </span>
              <span className="font-extrabold">Thanh toán</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[11px] font-black">
                3
              </span>
              <span className="hidden sm:inline">Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Checkout Grid (2 Cột Hợp Nhất 65% : 35%) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* =========================================================================
              CỘT TRÁI (7/12 - 60%): ĐỊA CHỈ, SẢN PHẨM, VẬN CHUYỂN, PHƯƠNG THỨC THANH TOÁN
             ========================================================================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* KHỐI 1: 📍 ĐỊA CHỈ NHẬN HÀNG */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <span>Địa Chỉ Nhận Hàng</span>
                </div>

                {!isEditingAddress && (
                  <button 
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 size={13} /> Thay đổi
                  </button>
                )}
              </div>

              {isEditingAddress ? (
                /* Form chỉnh sửa địa chỉ nhanh */
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Họ và tên người nhận</label>
                      <input 
                        type="text" 
                        value={recipientName} 
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
                      <input 
                        type="text" 
                        value={recipientPhone} 
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Địa chỉ chi tiết (Số nhà, tên đường, phường/xã, quận/huyện)</label>
                    <input 
                      type="text" 
                      value={recipientAddress} 
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {/* Sổ địa chỉ mẫu gợi ý chọn nhanh */}
                  <div className="pt-1 flex flex-wrap gap-2">
                    <span className="text-[11px] text-slate-500 self-center">Gợi ý nhanh:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientAddress('12 Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh');
                        setRecipientName('Nguyễn Quốc Khánh');
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      🏠 Nhà riêng (Q.1)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientAddress('Tòa nhà Bitexco, Số 2 Hải Triều, P. Bến Nghé, Q.1, TP.HCM');
                        setRecipientName('Nguyễn Quốc Khánh (Văn phòng)');
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      🏢 Văn phòng (Bitexco)
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Hủy
                    </button>
                    <button 
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                    >
                      Lưu địa chỉ này
                    </button>
                  </div>
                </div>
              ) : (
                /* Hiển thị địa chỉ đã chọn */
                <div className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{recipientName}</strong>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-700 font-semibold font-mono">{recipientPhone}</span>
                      <span className="text-[10px] uppercase font-extrabold bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-200/60">
                        Mặc định
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">{recipientAddress}</p>
                  </div>
                </div>
              )}

              {/* Ghi chú đơn hàng */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Lưu ý cho người bán / Shipper (VD: Giao giờ hành chính, gọi trước 15 phút...)"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* KHỐI 2: 🛍️ DANH SÁCH SẢN PHẨM ĐÃ CHỌN TRONG ĐƠN */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
                  <div className="w-7 h-7 rounded-lg bg-[#faf6f0] border border-[#e5dfd3] text-[#8c6f46] flex items-center justify-center">
                    <ShoppingBag size={16} />
                  </div>
                  <span>Sản Phẩm Đã Chọn Thanh Toán ({cartItems.length}{allCartItems && allCartItems.length > cartItems.length ? `/${allCartItems.length} món trong giỏ` : ''})</span>
                </div>
                <div className="flex items-center gap-2">
                  {allCartItems && allCartItems.length > cartItems.length && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      ✓ Giữ lại {allCartItems.length - cartItems.length} món chưa mua trong giỏ
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    Tạm tính: <strong className="text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</strong>
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const visual = getProductVisualSync(item, MOCK_PRODUCTS_LIST);
                  return (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${visual.studioBg} p-1.5 border border-stone-300 shrink-0 relative flex items-center justify-center shadow-2xs`}>
                        <div className="bg-white/95 rounded-lg w-full h-full flex items-center justify-center p-1">
                          <img 
                            src={visual.image} 
                            alt={item.name} 
                            style={{ filter: visual.imgFilter }}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span
                          className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: visual.swatchHex }}
                          title={visual.colorLabel}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-stone-800 bg-[#faf6f0] border border-[#e5dfd3] px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: visual.swatchHex }} />
                            <span>Phân loại: {item.size}</span>
                          </span>
                          <span className="text-xs font-black text-rose-600 font-mono">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </span>
                        </div>
                      </div>

                      {/* Bộ điều khiển số lượng */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Giảm số lượng"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Tăng số lượng"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {onRemoveFromCart && (
                          <button
                            onClick={() => onRemoveFromCart(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Xóa món này"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KHỐI 3: 🚚 PHƯƠNG THỨC VẬN CHUYỂN */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-100 pb-3 mb-3.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Truck size={16} />
                </div>
                <span>Phương Thức Vận Chuyển</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Giao tiêu chuẩn */}
                <div 
                  onClick={() => setShippingMethod('STANDARD')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    shippingMethod === 'STANDARD'
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === 'STANDARD'} 
                      onChange={() => setShippingMethod('STANDARD')}
                      className="mt-1 accent-blue-600"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                        <span>Giao Nhanh Tiêu Chuẩn</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Nhận hàng sau 2-3 ngày (ZShop Express)</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 shrink-0">30.000đ</span>
                </div>

                {/* Hỏa tốc */}
                <div 
                  onClick={() => setShippingMethod('EXPRESS')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    shippingMethod === 'EXPRESS'
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === 'EXPRESS'} 
                      onChange={() => setShippingMethod('EXPRESS')}
                      className="mt-1 accent-blue-600"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                        <span>Hỏa Tốc Z-Fast 2H</span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-1.5 py-0.2 rounded">
                          Siêu Tốc
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Nhận hàng trong 2 giờ tại nội thành</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 shrink-0">50.000đ</span>
                </div>
              </div>
            </div>

            {/* KHỐI 4: 💳 PHƯƠNG THỨC THANH TOÁN (Gom 4 nhóm rõ ràng) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <span>Phương Thức Thanh Toán</span>
                </div>
                <span className="text-[11px] text-slate-400">An toàn & Bảo mật 100%</span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Chuyển khoản VietQR */}
                <div 
                  onClick={() => setSelectedMethod(PaymentMethodType.QR_CODE)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedMethod === PaymentMethodType.QR_CODE
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        checked={selectedMethod === PaymentMethodType.QR_CODE}
                        onChange={() => setSelectedMethod(PaymentMethodType.QR_CODE)}
                        className="accent-blue-600"
                      />
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <QrCode size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                          <span>Chuyển Khoản VietQR Napas 24/7</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                            <ThumbsUp size={10} /> Khuyên dùng
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Mở app ngân hàng bất kỳ quét mã là thanh toán tức thì</p>
                      </div>
                    </div>
                  </div>

                  {/* KHỐI VIETQR ĐỘNG HIỂN THỊ TRỰC TIẾP NGAY TẠI ĐÂY KHI CHỌN */}
                  {selectedMethod === PaymentMethodType.QR_CODE && (
                    <div className="mt-4 pt-4 border-t border-blue-100 bg-white p-4 rounded-xl border border-blue-200 shadow-sm animate-fadeIn">
                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        {/* Ảnh QR */}
                        <div className="relative p-2 bg-white rounded-xl border border-slate-200 shadow-inner shrink-0 text-center">
                          <img 
                            src={vietQrDynamicUrl} 
                            alt="Mã VietQR Thanh Toán"
                            className="w-44 h-44 object-contain rounded-lg mx-auto"
                            onError={(e: any) => {
                              // Fallback nếu mất mạng
                              e.target.src = 'components/img_QR/QR_NQK.png';
                            }}
                          />
                          <div className="text-[10px] font-bold text-slate-500 mt-1 flex items-center justify-center gap-1">
                            <Smartphone size={11} /> Quét bằng mọi App Ngân hàng
                          </div>
                        </div>

                        {/* Thông tin chuyển khoản chi tiết */}
                        <div className="flex-1 space-y-2 text-xs w-full">
                          <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5 border border-slate-100">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Ngân hàng thụ hưởng:</span>
                              <strong className="text-slate-900 font-bold">MB Bank (Quân Đội)</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Tên chủ tài khoản:</span>
                              <strong className="text-slate-900 font-bold uppercase">ZSHOP VIETNAM CO LTD</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Số tài khoản:</span>
                              <div className="flex items-center gap-1 font-mono font-bold text-blue-700">
                                <span>0901234567</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCopy('0901234567', 'stk'); }}
                                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                  title="Sao chép STK"
                                >
                                  {copiedField === 'stk' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Số tiền thanh toán:</span>
                              <div className="flex items-center gap-1 font-bold text-rose-600">
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCopy(finalTotal.toString(), 'amount'); }}
                                  className="p-1 hover:bg-rose-100 rounded text-rose-600"
                                  title="Sao chép số tiền"
                                >
                                  {copiedField === 'amount' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Nội dung chuyển khoản:</span>
                              <div className="flex items-center gap-1 font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                <span>{orderId}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCopy(orderId, 'content'); }}
                                  className="p-1 hover:bg-slate-100 rounded text-blue-600"
                                  title="Sao chép nội dung"
                                >
                                  {copiedField === 'content' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span>Hệ thống tự động xác nhận sau khi quét mà không cần tải biên lai!</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Thanh toán khi nhận hàng COD */}
                <div 
                  onClick={() => setSelectedMethod(PaymentMethodType.COD)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedMethod === PaymentMethodType.COD
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={selectedMethod === PaymentMethodType.COD}
                      onChange={() => setSelectedMethod(PaymentMethodType.COD)}
                      className="accent-blue-600"
                    />
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Banknote size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                        Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                      </div>
                      <p className="text-[11px] text-slate-500">Được đồng kiểm bóc kiện xem hàng trước khi trả tiền cho shipper</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Miễn phí thu hộ
                  </span>
                </div>

                {/* 3. Ví điện tử MoMo */}
                <div 
                  onClick={() => setSelectedMethod(PaymentMethodType.MOMO)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedMethod === PaymentMethodType.MOMO
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={selectedMethod === PaymentMethodType.MOMO}
                      onChange={() => setSelectedMethod(PaymentMethodType.MOMO)}
                      className="accent-blue-600"
                    />
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                        Ví Điện Tử MoMo / ZaloPay
                      </div>
                      <p className="text-[11px] text-slate-500">Xác thực vân tay hoặc FaceID tức thì qua ứng dụng ví</p>
                    </div>
                  </div>
                </div>

                {/* 4. Thẻ Quốc Tế (Visa / Master) */}
                <div 
                  onClick={() => setSelectedMethod(PaymentMethodType.DOMESTIC_CARD)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedMethod === PaymentMethodType.DOMESTIC_CARD
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={selectedMethod === PaymentMethodType.DOMESTIC_CARD}
                      onChange={() => setSelectedMethod(PaymentMethodType.DOMESTIC_CARD)}
                      className="accent-blue-600"
                    />
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                        Thẻ Tín Dụng / Ghi Nợ Quốc Tế (Visa, Master, JCB)
                      </div>
                      <p className="text-[11px] text-slate-500">Chuẩn bảo mật quốc tế PCI-DSS & 3D-Secure 2.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CỘT PHẢI (5/12 - 40%): TÓM TẮT TIỀN, VOUCHER, ĐIỂM VIP & NÚT ĐẶT HÀNG (STICKY)
             ========================================================================= */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            
            {/* THẺ TỔNG KẾT THANH TOÁN (Order Summary Card) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md space-y-4">
              <h2 className="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Chi Tiết Thanh Toán</span>
                <span className="text-xs font-mono font-bold text-slate-400">#{orderId}</span>
              </h2>

              {/* 🏷️ KHỐI MÃ GIẢM GIÁ & VOUCHER */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Ticket size={14} className="text-blue-600" /> Mã Giảm Giá / Voucher ZShop
                </label>

                {appliedVoucher ? (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        {appliedVoucher.code}
                      </span>
                      <span className="font-bold text-emerald-700">
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discount)}
                      </span>
                    </div>
                    <button 
                      onClick={handleRemoveVoucher}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Gỡ mã giảm giá"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      value={voucherInput} 
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      placeholder="Nhập mã voucher (vd: FREESHIPMAX)"
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                    />
                    <button
                      onClick={() => handleApplyVoucherCode(voucherInput)}
                      disabled={!voucherInput.trim()}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}

                {voucherError && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {voucherError}
                  </p>
                )}

                {/* Gợi ý mã có sẵn */}
                {!appliedVoucher && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {AVAILABLEVOUCHERS_SLICE(AVAILABLE_VOUCHERS, subtotal).map(v => (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleApplyVoucherCode(v.code)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center gap-1"
                      >
                        <Tag size={10} /> {v.code} (-{(v.discount / 1000)}k)
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 👑 KHỐI ĐIỂM THƯỞNG KHÁCH HÀNG THÂN THIẾT (UC03 LOYALTY INTEGRATION) */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award size={15} className="text-amber-600" />
                    <span className="text-xs font-extrabold text-amber-950">
                      Điểm Thưởng VIP ZShop
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    ★ Hạng {customerProfile?.tier || 'Vàng'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-900">
                    Khả dụng: <strong>{userPoints} điểm</strong> (= {(pointEquivalentVND).toLocaleString('vi-VN')}đ)
                  </span>
                  
                  {/* Switch Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useLoyaltyPoints} 
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              {/* BẢNG TÍNH TIỀN MINH BẠCH */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                <div className="flex justify-between">
                  <span>Tiền hàng (Tạm tính):</span>
                  <span className="font-semibold text-slate-800">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-slate-800">
                    +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}
                  </span>
                </div>

                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Giảm giá Voucher ({appliedVoucher.code}):</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discount)}</span>
                  </div>
                )}

                {useLoyaltyPoints && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Khấu trừ điểm VIP ({userPoints} điểm):</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointEquivalentVND)}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block">TỔNG THANH TOÁN:</span>
                    <span className="text-[10px] text-slate-400">(Đã gồm VAT & Phí kiểm hàng)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-rose-600 leading-tight">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                    </span>
                    {totalDiscount > 0 && (
                      <div className="text-[11px] text-emerald-600 font-bold">
                        Tiết kiệm {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDiscount)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* NÚT HÀNH ĐỘNG ĐẶT HÀNG CHÍNH (PRIMARY CTA) */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${
                  isProcessing
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-500/25 active:scale-98'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang khởi tạo đơn hàng...
                  </>
                ) : (
                  `🚀 ĐẶT HÀNG NGAY (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)})`
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 leading-tight">
                Bằng việc bấm Đặt hàng, bạn đồng ý với Điều khoản mua sắm và Chính sách đổi trả 7 ngày của ZShop.
              </p>
            </div>

            {/* 🛡️ 4 HUY HIỆU BẢO CHỨNG AN TÂM (TRUST BADGES) */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <ShieldCheck size={18} className="text-emerald-600 mx-auto mb-1" />
                <strong className="text-slate-800 text-[11px] block font-bold">100% Chính Hãng</strong>
                <span className="text-[10px] text-slate-500">Cam kết hoàn tiền 200%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <RefreshCw size={18} className="text-blue-600 mx-auto mb-1" />
                <strong className="text-slate-800 text-[11px] block font-bold">Đổi Trả 7 Ngày</strong>
                <span className="text-[10px] text-slate-500">Miễn phí thu hồi tận nơi</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <Truck size={18} className="text-indigo-600 mx-auto mb-1" />
                <strong className="text-slate-800 text-[11px] block font-bold">Đồng Kiểm Khi Nhận</strong>
                <span className="text-[10px] text-slate-500">Mở hộp kiểm tra trước</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <Award size={18} className="text-amber-600 mx-auto mb-1" />
                <strong className="text-slate-800 text-[11px] block font-bold">Bảo Mật PCI-DSS</strong>
                <span className="text-[10px] text-slate-500">Mã hóa an toàn 256-bit</span>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

// Lọc voucher phù hợp theo giá trị đơn
function AVAILABLEVOUCHERS_SLICE(vouchers: typeof AVAILABLE_VOUCHERS, subtotal: number) {
  return vouchers.filter(v => subtotal >= v.minOrder);
}