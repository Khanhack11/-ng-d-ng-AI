import React, { useState } from 'react';
import { ChevronRight, CheckSquare, Square, Ticket, X, Check, Tag } from 'lucide-react';
import { CartItem, UserRole, OrderFormData } from '../types'; // Import CartItem
import Header from './ZShop/Header';
import { DatHangService } from '../services';

interface OrderConfirmationPageProps {
  cartItems: CartItem[]; // Accept cartItems prop
  onProceedToPayment: () => void;
  onBack: () => void;
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

// Mock Coupons
const AVAILABLE_COUPONS = [
    { code: 'SZWELCOME', discount: 20000, description: 'Giảm 20k cho đơn đầu tiên', minOrder: 0 },
    { code: 'FREESHIP', discount: 30000, description: 'Miễn phí vận chuyển (Tối đa 30k)', minOrder: 0 },
    { code: 'SALE50', discount: 50000, description: 'Giảm 50k cho đơn từ 1 triệu', minOrder: 1000000 },
];

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ 
  cartItems, 
  onProceedToPayment, 
  onBack,
  onOpenCart,
  cartItemCount,
  userRole,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick
}) => {
  const [agreed, setAgreed] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Discount State
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  // Form State - Mapping to UI_DatHang responsibilities
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: 'Nguyễn Quốc Khánh',
    phone: '0829999456',
    city: 'Thái Nguyên',
    district: 'Phổ yên',
    address: 'Số 123, Đường Xuân Thủy',
    note: 'Giao hàng giờ hành chính'
  });

  // Business Logic call using real cartItems
  const subtotal = DatHangService.tinhTongTienGioHang(cartItems);
  const shippingFee = 30000;
  const total = Math.max(0, subtotal + shippingFee - appliedDiscount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (codeToApply: string) => {
      const codeUpper = codeToApply.toUpperCase().trim();
      const coupon = AVAILABLE_COUPONS.find(c => c.code === codeUpper);

      if (!coupon) {
          setAppliedDiscount(0);
          setFeedbackMsg({ type: 'error', text: 'Mã giảm giá không tồn tại!' });
          return;
      }

      if (subtotal < coupon.minOrder) {
          setAppliedDiscount(0);
          setFeedbackMsg({ type: 'error', text: `Đơn hàng chưa đủ điều kiện (Tối thiểu ${new Intl.NumberFormat('vi-VN').format(coupon.minOrder)}đ)` });
          return;
      }

      setDiscountCode(codeUpper);
      setAppliedDiscount(coupon.discount);
      setFeedbackMsg({ type: 'success', text: `Đã áp dụng: -${new Intl.NumberFormat('vi-VN').format(coupon.discount)}đ` });
      setIsCouponOpen(false); // Close list on success
  };

  const removeCoupon = () => {
      setDiscountCode('');
      setAppliedDiscount(0);
      setFeedbackMsg(null);
  };

  const handleConfirm = async () => {
    setIsCreatingOrder(true);
    try {
        await DatHangService.taoDonHangNhap(cartItems, formData);
        onProceedToPayment();
    } catch (error) {
        console.error("Lỗi tạo đơn:", error);
        onProceedToPayment();
    } finally {
        setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* 1. Standard Global Header */}
      <Header 
        onOpenCart={onOpenCart || (() => {})}
        cartItemCount={cartItemCount || 0}
        onLogin={onLogin || (() => {})}
        userRole={userRole || UserRole.GUEST}
        onLogout={onLogout || (() => {})}
        onOpenRegister={onOpenRegister}
        onOpenSellerChannel={onOpenSellerChannel}
        onBecomeSeller={onBecomeSeller}
        onProductClick={onProductClick}
      />
      {/* View Indicator */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-end text-sm gap-2 text-gray-500">
            <span className="cursor-pointer hover:text-black">1. Giỏ hàng</span>
            <ChevronRight size={14} />
            <span className="font-bold text-black border-b-2 border-black pb-0.5">2. Đặt hàng & Địa chỉ</span>
            <ChevronRight size={14} />
            <span>3. Thanh toán</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-gray-300 shadow-sm rounded-sm bg-white overflow-hidden">
            
            {/* LEFT COLUMN: Delivery Information (Match Layout) */}
            <div className="lg:col-span-7 p-6 lg:border-r border-gray-200">
                <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                    1. Thông tin giao hàng
                </h2>
                
                <div className="mb-6 text-sm">
                    <span className="text-gray-500">Login? </span>
                    <a href="#" className="text-blue-600 hover:underline">[ Đăng nhập để tự động điền thông tin ]</a>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên người nhận:*</label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border-b-2 border-gray-300 bg-gray-50 px-3 py-2 focus:border-black focus:outline-none transition-colors font-medium text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:*</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border-b-2 border-gray-300 bg-gray-50 px-3 py-2 focus:border-black focus:outline-none transition-colors font-medium text-gray-900"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố:*</label>
                            <div className="relative">
                                <select 
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 appearance-none focus:ring-1 focus:ring-black focus:border-black bg-white font-medium text-gray-900"
                                >
                                    <option>Thái Nguyên</option>
                                    <option>Hà Nội</option>
                                    <option>Hồ Chí Minh</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none">▼</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện:*</label>
                            <div className="relative">
                                <select 
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 appearance-none focus:ring-1 focus:ring-black focus:border-black bg-white font-medium text-gray-900"
                                >
                                    <option>Phổ yên</option>
                                    <option>Sông Công</option>
                                    <option>TP. Thái Nguyên</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none">▼</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết (Số nhà, đường...):*</label>
                        <input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border-b-2 border-gray-300 bg-gray-50 px-3 py-2 focus:border-black focus:outline-none transition-colors font-medium text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho Shipper:</label>
                        <input 
                            type="text" 
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            className="w-full border-b-2 border-gray-300 bg-gray-50 px-3 py-2 focus:border-black focus:outline-none transition-colors font-medium text-gray-900"
                        />
                    </div>
                </form>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="lg:col-span-5 p-6 bg-gray-50/50 flex flex-col h-full">
                <h2 className="text-lg font-bold mb-4">
                    2. Đơn hàng của bạn ({cartItems.length} sản phẩm)
                </h2>

                <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                            <div className="w-14 h-14 border border-gray-300 rounded-md overflow-hidden shrink-0 bg-white">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-sm">
                                <div className="font-medium text-gray-900 line-clamp-1">{item.name}</div>
                                <div className="text-gray-500 mt-0.5">Size: {item.size} x{item.quantity}</div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                {/* Coupon Section */}
                <div className="mb-4">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                             <Ticket size={16} /> Mã giảm giá / Voucher
                        </span>
                        {!isCouponOpen && appliedDiscount === 0 && (
                             <button 
                                onClick={() => setIsCouponOpen(true)}
                                className="text-xs text-brand-600 hover:underline font-bold"
                             >
                                 Chọn mã
                             </button>
                        )}
                     </div>
                     
                     {isCouponOpen || appliedDiscount > 0 ? (
                        <div className="bg-white border border-gray-200 rounded p-3 shadow-sm animate-fade-in">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Nhập mã..."
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                    disabled={appliedDiscount > 0}
                                    className={`flex-1 border rounded px-2 py-1.5 text-sm uppercase font-bold outline-none focus:ring-1 focus:ring-black ${appliedDiscount > 0 ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                                />
                                {appliedDiscount > 0 ? (
                                    <button 
                                        onClick={removeCoupon}
                                        className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleApplyCoupon(discountCode)}
                                        className="bg-black text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Áp dụng
                                    </button>
                                )}
                            </div>
                            
                            {/* Feedback Message */}
                            {feedbackMsg && (
                                <div className={`text-xs mt-2 flex items-center gap-1 font-medium ${feedbackMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {feedbackMsg.type === 'success' ? <Check size={12}/> : <X size={12}/>}
                                    {feedbackMsg.text}
                                </div>
                            )}

                            {/* Suggestion List */}
                            {appliedDiscount === 0 && (
                                <div className="mt-3 space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Mã có sẵn</div>
                                    {AVAILABLE_COUPONS.map(c => {
                                        const isDisabled = subtotal < c.minOrder;
                                        return (
                                            <div 
                                                key={c.code} 
                                                onClick={() => !isDisabled && handleApplyCoupon(c.code)}
                                                className={`flex items-start gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${isDisabled ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' : 'bg-brand-50 border-brand-100 hover:border-brand-300'}`}
                                            >
                                                <div className="bg-white border border-gray-200 p-1 rounded shrink-0">
                                                    <Tag size={12} className={isDisabled ? 'text-gray-400' : 'text-brand-600'} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <span className="font-bold text-gray-900">{c.code}</span>
                                                        {!isDisabled && <span className="text-brand-600 font-bold">-{c.discount/1000}k</span>}
                                                    </div>
                                                    <div className="text-gray-500 line-clamp-1">{c.description}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <button onClick={() => setIsCouponOpen(false)} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-1">Đóng danh sách</button>
                                </div>
                            )}
                        </div>
                     ) : (
                         <div className="text-xs text-gray-500 italic">Chưa áp dụng mã giảm giá</div>
                     )}
                </div>

                <div className="space-y-2 text-sm text-gray-700 mt-auto">
                    <div className="flex justify-between">
                        <span>Tạm tính: . . . . . . . . . . . . .</span>
                        <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phí vận chuyển: . . . . . . . .</span>
                        <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                        <div className="flex justify-between text-green-600 animate-fade-in">
                            <span>Giảm giá: . . . . . . . . . . . .</span>
                            <span className="font-bold">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedDiscount)}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-end mt-6 mb-4">
                    <span className="text-lg font-bold text-gray-800 uppercase">TỔNG CỘNG: . . . . . . .</span>
                    <span className="text-2xl font-bold text-red-600">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                    </span>
                </div>

                <div 
                    className="flex items-center gap-2 mb-6 cursor-pointer select-none"
                    onClick={() => setAgreed(!agreed)}
                >
                    {agreed ? (
                        <CheckSquare className="text-sky-600" size={20} />
                    ) : (
                        <Square className="text-gray-400" size={20} />
                    )}
                    <span className="text-sm text-gray-700">Tôi đồng ý với điều khoản mua hàng</span>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!agreed || isCreatingOrder}
                    className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all
                        ${(agreed && !isCreatingOrder)
                            ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 active:scale-[0.99]' 
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }
                    `}
                >
                    {isCreatingOrder ? 'ĐANG KHỞI TẠO ĐƠN HÀNG...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;