import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Minus, Plus, Sparkles, 
  Ticket, Check, Tag, Truck, ShieldCheck, AlertCircle, 
  RotateCcw, CheckSquare, Square, Layers, Zap
} from 'lucide-react';
import { CartItem } from '../types';
import { MOCK_PRODUCTS_LIST } from '../constants';
import { getProductVisualSync } from '../services';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products?: any[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onAddToCart?: (item: CartItem) => void;
  onClearCart?: () => void;
  onToggleSelectItem?: (id: string) => void;
  onSelectAllItems?: (selectAll: boolean) => void;
  onSelectCartGroup?: (groupKey: 'ALL' | 'FLAGSHIP_18_17' | 'PRO_16_15_14' | 'CLASSIC_OTHER') => void;
  onBuySingleItem?: (id: string) => void;
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
  products,
  onRemoveItem, 
  onUpdateQuantity, 
  onCheckout, 
  onContinueShopping, 
  onAddToCart,
  onClearCart,
  onToggleSelectItem,
  onSelectAllItems,
  onSelectCartGroup,
  onBuySingleItem
}) => {
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>({
    code: 'FREESHIPMAX',
    discount: 30000
  });
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeCartCategoryTab, setActiveCartCategoryTab] = useState<'ALL' | 'FLAGSHIP_18_17' | 'PRO_16_15_14' | 'CLASSIC_OTHER'>('ALL');

  // Helper xác định tồn kho thực tế cho sản phẩm trong giỏ (TC14)
  const getItemStock = (item: CartItem): number => {
    const matched = (products || []).find((p: any) => 
      p.id === item.productId || 
      p.id === item.id || 
      p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    ) || MOCK_PRODUCTS_LIST.find(p => 
      p.id === item.productId || 
      p.id === item.id || 
      p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    );
    return matched ? matched.stock : (item.stock ?? 30);
  };

  // Phân loại các món trong giỏ theo nhóm mục sản phẩm
  const enrichedCart = cartItems.map(item => ({
    item,
    visual: getProductVisualSync(item, MOCK_PRODUCTS_LIST)
  }));

  const countByGroup = {
    ALL: enrichedCart.length,
    FLAGSHIP_18_17: enrichedCart.filter(x => x.visual.categoryGroup === 'FLAGSHIP_18_17').length,
    PRO_16_15_14: enrichedCart.filter(x => x.visual.categoryGroup === 'PRO_16_15_14').length,
    CLASSIC_OTHER: enrichedCart.filter(x => x.visual.categoryGroup === 'CLASSIC_OTHER').length
  };

  const visibleEnrichedCart = enrichedCart.filter(x =>
    activeCartCategoryTab === 'ALL' ? true : x.visual.categoryGroup === activeCartCategoryTab
  );

  // Tính toán tiền CHỈ TRÊN CÁC MÓN ĐƯỢC TÍCH CHỌN MUA (selected !== false)
  const selectedItems = cartItems.filter(item => item.selected !== false);
  const unselectedCount = cartItems.length - selectedItems.length;
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  // TC14: Anti-Overselling check on selected checkout items
  const overstockSelectedItem = selectedItems.find(item => {
    const avail = getItemStock(item);
    return item.quantity > avail || avail <= 0;
  });

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) return;
    for (const item of selectedItems) {
      const avail = getItemStock(item);
      if (avail <= 0) {
        alert(`⚠️ SẢN PHẨM HẾT HÀNG (TC14):\nSản phẩm "${item.name}" hiện đã hết hàng trong kho.\nVui lòng bỏ chọn hoặc xóa khỏi giỏ.`);
        return;
      }
      if (item.quantity > avail) {
        alert(`⚠️ CHẶN ĐẶT HÀNG (TC14 - Anti-Overselling):\nSản phẩm "${item.name}" trong kho chỉ còn ${avail} máy (bạn đang chọn ${item.quantity} máy).\nVui lòng điều chỉnh số lượng trước khi tiếp tục!`);
        return;
      }
    }
    onCheckout();
  };

  const selectedItemQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedVoucher && selectedItems.length > 0 ? appliedVoucher.discount : 0;
  const isFreeshipEligible = subtotal >= FREESHIP_THRESHOLD || appliedVoucher?.code === 'FREESHIPMAX';
  const shippingFee = selectedItems.length === 0 ? 0 : (isFreeshipEligible ? 0 : 30000);
  const finalTotal = selectedItems.length === 0 ? 0 : Math.max(0, subtotal + shippingFee - (appliedVoucher?.code === 'FREESHIPMAX' ? 0 : discountAmount));

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
        text: `Các món đã chọn cần tối thiểu ${new Intl.NumberFormat('vi-VN').format(found.minSpend)}đ để dùng mã này.` 
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
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[490px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* --- HEADER --- */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between bg-[#1c1b18] text-white shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4b996] to-[#8c6f46] text-[#1c1b18] flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>Giỏ Hàng Thông Minh</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d4b996]/20 text-[#e5c9a3] border border-[#d4b996]/40">
                  Đã chọn {selectedItems.length}/{cartItems.length} món
                </span>
              </h2>
              <p className="text-[10px] text-stone-300">Tích chọn món muốn mua • Giữ lại các món chưa mua trong giỏ</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="text-xs font-semibold text-stone-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                title="Làm trống toàn bộ giỏ hàng"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Xóa hết</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Đóng giỏ hàng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* --- BỘ CHIA MỤC CHỌN MUA SẢN PHẨM TRONG GIỎ HÀNG (MULTI-CATEGORY CART SELECTOR) --- */}
        {cartItems.length > 0 && (
          <div className="bg-[#faf8f5] px-4 py-2.5 border-b border-[#e5dfd3] shrink-0 space-y-2">
            {/* Các tab chia mục sản phẩm */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { key: 'ALL' as const, label: `Tất cả (${countByGroup.ALL})` },
                { key: 'FLAGSHIP_18_17' as const, label: `🔥 Flagship 18/17 (${countByGroup.FLAGSHIP_18_17})` },
                { key: 'PRO_16_15_14' as const, label: `📱 iPhone 16/15/14 (${countByGroup.PRO_16_15_14})` },
                { key: 'CLASSIC_OTHER' as const, label: `💎 Sưu tầm (${countByGroup.CLASSIC_OTHER})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveCartCategoryTab(tab.key);
                    if (tab.key !== 'ALL' && onSelectCartGroup) {
                      onSelectCartGroup(tab.key);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    activeCartCategoryTab === tab.key
                      ? 'bg-[#1c1b18] text-[#e5c9a3] border-[#8c6f46] shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Thanh điều khiển Chọn tất cả / Chỉ chọn mục này */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={() => onSelectAllItems && onSelectAllItems(!isAllSelected)}
                className="flex items-center gap-1.5 font-bold text-stone-800 hover:text-[#8c6f46] cursor-pointer"
              >
                {isAllSelected ? (
                  <CheckSquare size={16} className="text-rose-600 fill-rose-50" />
                ) : (
                  <Square size={16} className="text-stone-400" />
                )}
                <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
              </button>

              <div className="flex items-center gap-2">
                {activeCartCategoryTab !== 'ALL' && onSelectCartGroup && (
                  <button
                    type="button"
                    onClick={() => onSelectCartGroup(activeCartCategoryTab)}
                    className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                  >
                    <Layers size={11} /> Chỉ mua mục này
                  </button>
                )}
                {selectedItems.length > 0 && selectedItems.length < cartItems.length && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Giữ lại {unselectedCount} món trong giỏ
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- DANH SÁCH SẢN PHẨM (ITEMS LIST VỚI CHECKBOX CHỌN LẺ & ẢNH STUDIO ĐỒNG BỘ) --- */}
        <div className="flex-1 overflow-y-auto px-4 py-3.5 bg-slate-50/70 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16 space-y-4 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-[#faf6f0] border border-[#e5dfd3] flex items-center justify-center text-[#8c6f46] shadow-inner">
                <ShoppingBag size={42} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Giỏ hàng của bạn đang trống</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Chưa có mẫu iPhone nào trong giỏ. Hãy chọn màu máy và dung lượng ưng ý nhất hôm nay nhé!
                </p>
              </div>
              <button 
                onClick={onContinueShopping} 
                className="px-6 py-2.5 bg-[#1c1b18] hover:bg-[#332e27] text-[#e5c9a3] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Khám Phá 45 Mẫu iPhone Ngay
              </button>
            </div>
          ) : visibleEnrichedCart.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
              <p className="text-xs font-bold text-stone-700">Chưa có sản phẩm nào thuộc mục này trong giỏ hàng.</p>
              <button
                type="button"
                onClick={() => setActiveCartCategoryTab('ALL')}
                className="px-3 py-1.5 bg-[#1c1b18] text-[#e5c9a3] rounded-lg text-xs font-bold cursor-pointer"
              >
                Xem tất cả ({cartItems.length} món)
              </button>
            </div>
          ) : (
            visibleEnrichedCart.map(({ item, visual }) => {
              const isSelected = item.selected !== false;
              return (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 relative group ${
                    isSelected
                      ? 'bg-white border-[#8c6f46] ring-1 ring-[#8c6f46]/25 shadow-xs'
                      : 'bg-white/70 border-slate-200/80 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Checkbox tích chọn món muốn mua */}
                  <button
                    type="button"
                    onClick={() => onToggleSelectItem && onToggleSelectItem(item.id)}
                    className="shrink-0 p-1 -ml-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                    title={isSelected ? 'Bỏ chọn món này (Giữ lại trong giỏ)' : 'Tích chọn để mua món này'}
                  >
                    {isSelected ? (
                      <CheckSquare size={19} className="text-rose-600 fill-rose-50" />
                    ) : (
                      <Square size={19} className="text-slate-300" />
                    )}
                  </button>

                  {/* Product Studio Thumbnail — Đồng bộ 100% như ngoài mục sản phẩm (ProductCard) */}
                  <div
                    onClick={() => onToggleSelectItem && onToggleSelectItem(item.id)}
                    className={`w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br ${visual.studioBg} p-1.5 border border-stone-300/80 relative flex flex-col items-center justify-center cursor-pointer shadow-xs`}
                  >
                    <div className="bg-white/95 rounded-lg w-full h-full flex items-center justify-center p-1 shadow-inner">
                      <img 
                        src={visual.image} 
                        alt={item.name} 
                        style={{ filter: visual.imgFilter }}
                        className="max-w-full max-h-full object-contain group-hover:scale-108 transition-transform duration-300" 
                      />
                    </div>
                    <span
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: visual.swatchHex }}
                      title={visual.colorLabel}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col min-w-0 justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h4
                          onClick={() => onToggleSelectItem && onToggleSelectItem(item.id)}
                          className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-[#8c6f46]"
                        >
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1 -mr-1 -mt-1 cursor-pointer shrink-0"
                          title="Xóa khỏi giỏ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      {/* Variant & Color Sync tags */}
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className="text-[10px] font-bold text-stone-800 bg-[#faf6f0] border border-[#e5dfd3] px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: visual.swatchHex }} />
                          <span className="truncate max-w-[165px]">{item.size}</span>
                        </span>
                        <span className="text-[9px] font-bold text-[#8c6f46] bg-amber-50/80 px-1.5 py-0.5 rounded">
                          {visual.categoryGroupLabel}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper, Buy Single Item & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 gap-1">
                      <div className="flex items-center gap-1.5">
                        {onUpdateQuantity ? (() => {
                          const itemStock = getItemStock(item);
                          const isAtMax = item.quantity >= itemStock;
                          return (
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Giảm số lượng"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className={`font-mono font-bold text-xs px-2 select-none ${item.quantity > itemStock ? 'text-rose-600 bg-rose-50' : 'text-slate-900'}`}>
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => {
                                    if (isAtMax) {
                                      alert(`⚠️ CHẶN BÁN VƯỢT TỒN KHO (TC14):\nSản phẩm "${item.name}" trong kho chỉ còn tối đa ${itemStock} máy.`);
                                      return;
                                    }
                                    onUpdateQuantity(item.id, item.quantity + 1);
                                  }}
                                  disabled={isAtMax}
                                  className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={isAtMax ? `Đã đạt tồn kho tối đa (${itemStock} máy)` : "Tăng số lượng"}
                                >
                                  <Plus size={11} />
                                </button>
                              </div>
                              <span className={`text-[10px] ${item.quantity > itemStock ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                                {item.quantity > itemStock ? `Vượt tồn (${itemStock})` : `Kho: ${itemStock}`}
                              </span>
                            </div>
                          );
                        })() : (
                          <span className="text-xs text-slate-500 font-medium">SL: {item.quantity}</span>
                        )}

                        {onBuySingleItem && cartItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onBuySingleItem(item.id)}
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-[10px] font-black transition-all cursor-pointer flex items-center gap-0.5"
                            title="Chỉ thanh toán riêng món hàng này (Các món khác giữ nguyên trong giỏ)"
                          >
                            <Zap size={10} /> Mua riêng
                          </button>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-mono font-black text-rose-600 text-xs sm:text-sm">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Gợi ý mua kèm iPhone Chính hãng */}
          {cartItems.length > 0 && (
            <div className="pt-2 border-t border-slate-200 mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Gợi Ý Thêm Vào Giỏ Để So Sánh & Chọn Mua
                </span>
                <span className="text-[10px] text-[#8c6f46] font-extrabold bg-[#faf6f0] px-2 py-0.5 rounded-md border border-[#e5dfd3]">
                  Chuẩn Apple VN/A
                </span>
              </div>

              <div className="space-y-1.5">
                {MOCK_PRODUCTS_LIST.slice(0, 2).map(rec => {
                  const recVisual = getProductVisualSync(rec, MOCK_PRODUCTS_LIST);
                  return (
                    <div key={rec.id} className="p-2 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${recVisual.studioBg} p-1 shrink-0 flex items-center justify-center`}>
                        <img src={recVisual.image} alt={rec.name} style={{ filter: recVisual.imgFilter }} className="w-full h-full object-contain bg-white rounded p-0.5" />
                      </div>
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
                              id: `${rec.id}-${Date.now()}`,
                              productId: rec.id,
                              name: rec.name,
                              price: rec.price,
                              size: `${rec.sizes[0]} - ${rec.colors[0].replace(/\s*\(Mới\)/gi, '')}`,
                              color: rec.colors[0].replace(/\s*\(Mới\)/gi, ''),
                              quantity: 1,
                              image: recVisual.image,
                              selected: true,
                              imgFilter: recVisual.imgFilter,
                              studioBg: recVisual.studioBg,
                              swatchHex: recVisual.swatchHex
                            });
                          }
                        }}
                        className="px-2.5 py-1 bg-[#1c1b18] hover:bg-[#332e27] text-[#e5c9a3] rounded-lg text-[11px] font-bold shrink-0 transition-all shadow-xs cursor-pointer"
                      >
                        + Thêm
                      </button>
                    </div>
                  );
                })}
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

            {/* Price Details (Tính riêng cho các món đã chọn mua) */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-sans">
              <div className="flex justify-between">
                <span>Tiền hàng đã chọn ({selectedItems.length}/{cartItems.length} món • SL {selectedItemQuantity}):</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span className={`font-semibold font-mono ${isFreeshipEligible ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {selectedItems.length === 0 ? '0₫' : (isFreeshipEligible ? 'Miễn phí (Freeship)' : '30.000₫')}
                </span>
              </div>
              {appliedVoucher && appliedVoucher.code !== 'FREESHIPMAX' && selectedItems.length > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá Voucher ({appliedVoucher.code}):</span>
                  <span className="font-mono">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Tổng thanh toán món đã chọn:</span>
                  {unselectedCount > 0 && (
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      ✓ {unselectedCount} món chưa chọn sẽ được giữ lại trong giỏ
                    </span>
                  )}
                </div>
                <span className="text-xl font-black text-rose-600 font-mono">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                </span>
              </div>
            </div>

            {/* TC14: Cảnh báo tồn kho không đủ (Anti-Overselling Alert) */}
            {overstockSelectedItem && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-[11px] leading-snug">
                  <strong>CHẶN ĐẶT HÀNG (TC14):</strong> Sản phẩm "{overstockSelectedItem.name}" chỉ còn <strong>{getItemStock(overstockSelectedItem)} máy</strong> trong kho (bạn đang chọn {overstockSelectedItem.quantity} máy).
                </span>
              </div>
            )}

            {/* Checkout Button */}
            <button 
              onClick={handleCheckoutClick}
              disabled={selectedItems.length === 0 || !!overstockSelectedItem}
              className={`w-full py-3.5 ${
                overstockSelectedItem
                  ? 'bg-amber-800/90 text-amber-200 cursor-not-allowed border border-amber-600/40'
                  : 'bg-gradient-to-r from-[#1c1b18] via-[#2c251d] to-[#8c6f46] hover:from-[#2c251d] hover:to-[#a38254] text-[#e5c9a3] border border-[#d4b996]/40 cursor-pointer'
              } disabled:opacity-40 font-black text-sm rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 tracking-wide uppercase`}
            >
              <span>
                {selectedItems.length === 0
                  ? 'Hãy Tích Chọn Ít Nhất 1 Món Để Mua'
                  : overstockSelectedItem
                    ? `⚠️ Vượt Tồn Kho (${getItemStock(overstockSelectedItem)} Máy Còn Lại)`
                    : `Mua Ngay ${selectedItems.length}/${cartItems.length} Món Đã Chọn`}
              </span>
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