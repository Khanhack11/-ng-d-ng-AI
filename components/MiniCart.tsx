import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Minus, Plus, Sparkles, 
  Ticket, Check, Tag, Truck, ShieldCheck, AlertCircle, 
  RotateCcw, Shield, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CartItem } from '../types';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onAddToCart?: (item: CartItem) => void;
  onClearCart?: () => void;
}

const AVAILABLE_VOUCHERS = [
  { code: 'FREESHIPMAX', discount: 30000, minSpend: 0, text: 'Freeship đơn từ 0đ' },
  { code: 'ZSHOPNEW', discount: 50000, minSpend: 250000, text: 'Giảm 50k cho đơn từ 250k' },
  { code: 'VIPGOLD10', discount: 80000, minSpend: 500000, text: 'Đặc quyền VIP giảm 80k' }
];

const FREESHIP_THRESHOLD = 300000; // Đơn từ 300.000đ được miễn phí vận chuyển

export const MiniCart: React.FC<MiniCartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onCheckout, 
  onContinueShopping, 
  onAddToCart,
  onClearCart
}) => {
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>({
    code: 'FREESHIPMAX',
    discount: 30000
  });
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tính toán tiền
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const isFreeshipEligible = subtotal >= FREESHIP_THRESHOLD || appliedVoucher?.code === 'FREESHIPMAX';
  const shippingFee = isFreeshipEligible ? 0 : 30000;
  const finalTotal = Math.max(0, subtotal + shippingFee - (appliedVoucher?.code === 'FREESHIPMAX' ? 0 : discountAmount));

  // Tiến độ Freeship
  const freeshipProgress = Math.min(100, Math.round((subtotal / FREESHIP_THRESHOLD) * 100));
  const amountToFreeship = Math.max(0, FREESHIP_THRESHOLD - subtotal);

  const handleApplyVoucher = (codeToApply: string) => {
    const code = codeToApply.toUpperCase().trim();
    const found = AVAILABLE_VOUCHERS.find(v => v.code === code);
    if (!found) {
      setVoucherMsg({ type: 'error', text: 'Mã ưu đãi không hợp lệ hoặc đã hết lượt áp dụng.' });
      return;
    }
    if (subtotal < found.minSpend) {
      setVoucherMsg({ 
        type: 'error', 
        text: `Đơn hàng cần tối thiểu ${new Intl.NumberFormat('vi-VN').format(found.minSpend)}đ để dùng mã này.` 
      });
      return;
    }
    setAppliedVoucher({ code: found.code, discount: found.discount });
    setVoucherInput('');
    setVoucherMsg({ type: 'success', text: `Áp dụng thành công mã ${found.code} (-${new Intl.NumberFormat('vi-VN').format(found.discount)}đ)!` });
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherMsg(null);
  };

  const handleConfirmClearAll = () => {
    if (confirm('Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng không?')) {
      if (onClearCart) {
        onClearCart();
      } else {
        cartItems.forEach(it => onRemoveItem(it.id));
      }
    }
  };

  return (
    <div className={`fixed inset-0 z-[70] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[460px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* --- HEADER --- */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Giỏ Hàng Của Bạn</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {totalItemCount} món
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                title="Làm trống toàn bộ giỏ hàng"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Đóng giỏ hàng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* --- THANH TIẾN ĐỘ FREESHIP NỔI BẬT --- */}
        {cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-5 py-3 border-b border-emerald-100/80 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Truck size={15} className="text-emerald-600" />
                {amountToFreeship > 0 && !isFreeshipEligible ? (
                  <>Mua thêm <strong className="text-emerald-700 font-extrabold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amountToFreeship)}</strong> để Freeship</>
                ) : (
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Đơn hàng đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!
                  </span>
                )}
              </span>
              <span className="font-mono font-black text-[11px] text-emerald-700">{freeshipProgress}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full shadow-inner"
                style={{ width: `${isFreeshipEligible ? 100 : freeshipProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* --- DANH SÁCH SẢN PHẨM (ITEMS LIST) --- */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50/70 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16 space-y-4 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 shadow-inner">
                <ShoppingBag size={42} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Giỏ hàng của bạn đang trống</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Chưa có sản phẩm nào trong giỏ. Hãy chọn những món thời trang ưng ý nhất hôm nay nhé!
                </p>
              </div>
              <button 
                onClick={onContinueShopping} 
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-98 cursor-pointer"
              >
                Khám Phá Sản Phẩm Ngay
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex gap-3 relative group"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0 justify-between py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    {/* Variant tags */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        Phân loại: {item.size}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    {/* Stepper */}
                    {onUpdateQuantity ? (
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-mono font-bold text-xs px-2.5 text-slate-900 select-none">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">SL: {item.quantity}</span>
                    )}

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-mono font-black text-rose-600 text-xs sm:text-sm">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Gợi ý mua kèm (Deal sốc) */}
          {cartItems.length > 0 && (
            <div className="pt-2 border-t border-slate-200 mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Ưu Đãi Mua Kèm Deal Hot
                </span>
                <span className="text-[10px] text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Tiết Kiệm Thêm
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    id: 'REC-01',
                    name: 'Vớ Dệt Kim Cổ Cao Thoáng Khí ZShop',
                    price: 29000,
                    size: 'FreeSize',
                    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300'
                  },
                  {
                    id: 'REC-02',
                    name: 'Nón Lưỡi Trai Phong Cách Thể Thao Nam',
                    price: 69000,
                    size: 'FreeSize',
                    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300'
                  }
                ].map(rec => (
                  <div key={rec.id} className="p-2 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
                    <img src={rec.image} alt={rec.name} className="w-10 h-10 object-cover rounded-lg shrink-0 bg-slate-50 border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">{rec.name}</h4>
                      <p className="text-[10px] text-rose-600 font-extrabold font-mono">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rec.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddToCart) {
                          onAddToCart({
                            id: `rec-${rec.id}-${Date.now()}`,
                            name: rec.name,
                            price: rec.price,
                            size: rec.size,
                            quantity: 1,
                            image: rec.image
                          });
                        }
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold shrink-0 transition-all shadow-xs cursor-pointer"
                    >
                      + Thêm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER: VOUCHER & CHECKOUT --- */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] shrink-0 space-y-3">
            
            {/* Voucher Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Ticket size={14} className="text-brand-600" /> Mã Giảm Giá / Voucher ZShop
                </span>
                {appliedVoucher && (
                  <button 
                    onClick={handleRemoveVoucher}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                  >
                    Gỡ bỏ mã
                  </button>
                )}
              </div>

              {appliedVoucher ? (
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono">
                      {appliedVoucher.code}
                    </span>
                    <span className="font-bold text-emerald-700">
                      -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discount)}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <Check size={12} /> Đã áp dụng
                  </span>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={voucherInput} 
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="Nhập mã ưu đãi (vd: FREESHIPMAX)"
                    className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono uppercase"
                  />
                  <button
                    onClick={() => handleApplyVoucher(voucherInput)}
                    disabled={!voucherInput.trim()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
              )}

              {voucherMsg && (
                <p className={`text-[11px] font-medium flex items-center gap-1 ${
                  voucherMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  <AlertCircle size={11} /> {voucherMsg.text}
                </p>
              )}

              {/* Quick voucher buttons */}
              {!appliedVoucher && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {AVAILABLE_VOUCHERS.map(v => (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => handleApplyVoucher(v.code)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Tag size={9} /> {v.code} (-{(v.discount / 1000)}k)
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Details */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-sans">
              <div className="flex justify-between">
                <span>Tiền hàng ({totalItemCount} sản phẩm):</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span className={`font-semibold font-mono ${isFreeshipEligible ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {isFreeshipEligible ? 'Miễn phí (Freeship)' : '30.000₫'}
                </span>
              </div>
              {appliedVoucher && appliedVoucher.code !== 'FREESHIPMAX' && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá Voucher ({appliedVoucher.code}):</span>
                  <span className="font-mono">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="text-xl font-black text-rose-600 font-mono">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={onCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer uppercase"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight size={16} />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <RotateCcw size={11} className="text-slate-400" /> Đổi size 15 ngày
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck size={11} className="text-slate-400" /> Giao hàng 24/7
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={11} className="text-slate-400" /> 100% Chính hãng
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;