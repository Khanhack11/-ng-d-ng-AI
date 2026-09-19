import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, Printer, QrCode, 
  DollarSign, ArrowLeft, User, Phone, CheckCircle2, RotateCcw, 
  Users, Package, Sparkles, Filter, X, ChevronRight, AlertCircle, 
  Clock, CreditCard, Send, ShieldCheck, Tag
} from 'lucide-react';
import { ProductDetail, CustomerProfile, OrderStatus } from '../types';

export interface POSOrderItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface POSOrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  items: POSOrderItem[];
  subtotal: number;
  discountPoints: number;
  discountAmount: number;
  finalTotal: number;
  paymentMethod: 'CASH' | 'VIETQR';
  cashGiven?: number;
  changeAmount?: number;
  cashierName: string;
  createdAt: string;
  pointsEarned: number;
}

export interface OnlineOrderManagementItem {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

interface POSPageProps {
  products: ProductDetail[];
  customers: CustomerProfile[];
  cashierName?: string;
  onBack: () => void;
  onDeductStock: (productId: string, quantity: number) => void;
  onUpdateCustomerPoints: (customerId: string, pointsDelta: number, spentDelta?: number) => void;
  onOpenCustomers: () => void;
  onOpenReturns: () => void;
}

export const POSPage: React.FC<POSPageProps> = ({
  products,
  customers,
  cashierName = 'Nguyễn Thu Ngân (NV Bán hàng POS)',
  onBack,
  onDeductStock,
  onUpdateCustomerPoints,
  onOpenCustomers,
  onOpenReturns
}) => {
  const [activeView, setActiveView] = useState<'POS' | 'ONLINE_ORDERS'>('POS');
  
  // Product Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Counter Cart
  const [cart, setCart] = useState<POSOrderItem[]>([]);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<ProductDetail | null>(null);
  const [tempSize, setTempSize] = useState('L');
  const [tempColor, setTempColor] = useState('Đen');

  // Customer Loyalty Lookup (UC03)
  const [customerPhoneSearch, setCustomerPhoneSearch] = useState('');
  const [matchedCustomer, setMatchedCustomer] = useState<CustomerProfile | null>(null);
  const [usePointsDiscount, setUsePointsDiscount] = useState(false);

  // Payment Calculation
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'VIETQR'>('CASH');
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [currentCompletedOrder, setCurrentCompletedOrder] = useState<POSOrderRecord | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Sample Online Orders for "Cập nhật trạng thái đơn hàng"
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrderManagementItem[]>([
    {
      id: 'DH-20241228-01',
      customerName: 'Nguyễn Quốc Khánh',
      customerPhone: '0901234567',
      shippingAddress: '12 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM',
      itemsCount: 2,
      totalAmount: 1470000,
      paymentMethod: 'VietQR Động',
      status: OrderStatus.PENDING,
      createdAt: '28/12/2024 10:20'
    },
    {
      id: 'DH-20241228-02',
      customerName: 'Trần Thị Hà My',
      customerPhone: '0918765432',
      shippingAddress: '45 Nguyễn Huệ, Q.1, TP.HCM',
      itemsCount: 1,
      totalAmount: 890000,
      paymentMethod: 'Thanh toán khi nhận (COD)',
      status: OrderStatus.PROCESSING,
      createdAt: '28/12/2024 09:15'
    },
    {
      id: 'DH-20241227-05',
      customerName: 'Lê Hoàng Nam',
      customerPhone: '0988112233',
      shippingAddress: '78 Hai Bà Trưng, Q.3, TP.HCM',
      itemsCount: 3,
      totalAmount: 2150000,
      paymentMethod: 'VietQR Động',
      status: OrderStatus.SHIPPING,
      createdAt: '27/12/2024 16:40'
    },
    {
      id: 'DH-20241226-03',
      customerName: 'Phạm Thuỳ Dung',
      customerPhone: '0977445566',
      shippingAddress: '102 CMT8, Q.10, TP.HCM',
      itemsCount: 1,
      totalAmount: 550000,
      paymentMethod: 'VietQR Động',
      status: OrderStatus.DELIVERED,
      createdAt: '26/12/2024 14:00'
    }
  ]);

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category || 'Thời trang')))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Handle Add To Counter Cart
  const handleSelectProduct = (prod: ProductDetail) => {
    if (prod.stock <= 0) {
      alert(`Sản phẩm [${prod.name}] hiện đã hết hàng trong kho!`);
      return;
    }

    if ((prod.sizes && prod.sizes.length > 1) || (prod.colors && prod.colors.length > 1)) {
      setSelectedProductForVariant(prod);
      setTempSize(prod.sizes?.[0] || 'FreeSize');
      setTempColor(prod.colors?.[0] || 'Mặc định');
    } else {
      addToCartWithVariant(prod, prod.sizes?.[0] || 'FreeSize', prod.colors?.[0] || 'Mặc định');
    }
  };

  const addToCartWithVariant = (prod: ProductDetail, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === prod.id && i.size === size && i.color === color);
      if (existing) {
        if (existing.quantity >= prod.stock) {
          alert(`Số lượng chọn đã đạt giới hạn tồn kho (${prod.stock})!`);
          return prev;
        }
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: prod.id,
        name: prod.name,
        size,
        color,
        price: prod.price,
        quantity: 1,
        image: prod.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
      }];
    });
    setSelectedProductForVariant(null);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const item = prev[index];
      const prod = products.find(p => p.id === item.productId);
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      if (prod && newQty > prod.stock) {
        alert(`Số lượng không được vượt quá tồn kho (${prod.stock})!`);
        return prev;
      }
      return prev.map((it, i) => i === index ? { ...it, quantity: newQty } : it);
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Customer Phone Search
  const handleSearchCustomer = (phoneInput: string) => {
    setCustomerPhoneSearch(phoneInput);
    if (phoneInput.trim().length >= 4) {
      const found = customers.find(c => c.phone.includes(phoneInput.trim()) || c.name.toLowerCase().includes(phoneInput.toLowerCase()));
      setMatchedCustomer(found || null);
    } else {
      setMatchedCustomer(null);
      setUsePointsDiscount(false);
    }
  };

  // Calculations
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  
  // Points calculation: 1 point = 100 VND
  const availablePoints = matchedCustomer?.points || 0;
  const maxPointsDiscount = availablePoints * 100;
  const actualDiscountAmount = usePointsDiscount ? Math.min(maxPointsDiscount, subtotal) : 0;
  const pointsUsed = usePointsDiscount ? Math.floor(actualDiscountAmount / 100) : 0;
  const finalPayable = Math.max(0, subtotal - actualDiscountAmount);
  
  // Earn 1% of final total as reward points
  const pointsEarned = Math.floor(finalPayable * 0.01 / 100);

  const changeDue = Math.max(0, cashGiven - finalPayable);

  // Process POS Checkout & Invoice Printing (UC04 + Include)
  const handleProcessCheckout = () => {
    if (cart.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm vào hóa đơn!');
      return;
    }

    if (paymentMethod === 'CASH' && cashGiven < finalPayable) {
      alert(`Tiền khách đưa (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cashGiven)}) chưa đủ để thanh toán tổng tiền (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPayable)})!`);
      return;
    }

    // 1. Deduct Stock for all items
    cart.forEach(item => {
      onDeductStock(item.productId, item.quantity);
    });

    // 2. Update Customer Points & Total Spent (UC03)
    if (matchedCustomer) {
      const deltaPoints = pointsEarned - pointsUsed;
      onUpdateCustomerPoints(matchedCustomer.id, deltaPoints, finalPayable);
    }

    // 3. Create completed invoice record
    const invoiceRecord: POSOrderRecord = {
      id: `POS-${Date.now().toString().slice(-6)}`,
      customerName: matchedCustomer?.name || 'Khách lẻ tại quầy',
      customerPhone: matchedCustomer?.phone || '090-Khách lẻ',
      items: [...cart],
      subtotal,
      discountPoints: pointsUsed,
      discountAmount: actualDiscountAmount,
      finalTotal: finalPayable,
      paymentMethod,
      cashGiven: paymentMethod === 'CASH' ? cashGiven : undefined,
      changeAmount: paymentMethod === 'CASH' ? changeDue : undefined,
      cashierName,
      createdAt: new Date().toLocaleString('vi-VN'),
      pointsEarned
    };

    setCurrentCompletedOrder(invoiceRecord);
    setIsInvoiceModalOpen(true);
    setCart([]);
    setCashGiven(0);
    setUsePointsDiscount(false);
  };

  // Update Order Status (Sales Role)
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOnlineOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navbar POS */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} /> Trang Chủ
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md">
              <ShoppingCart size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black tracking-wide text-white">ZShop POS Bán Hàng Tại Quầy (UC04)</h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">ONLINE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Thu ngân: <strong className="text-amber-400">{cashierName}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Action Tabs: POS vs Cập nhật đơn hàng online */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveView('POS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'POS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart size={14} /> Bán Hàng Tại Quầy (POS)
          </button>
          <button
            onClick={() => setActiveView('ONLINE_ORDERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'ONLINE_ORDERS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package size={14} /> Cập Nhật Trạng Thái Đơn Hàng ({onlineOrders.length})
          </button>
        </div>

        {/* Shortcut links to CRM and Returns */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCustomers}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            title="Tra cứu & Tích điểm KH (UC03)"
          >
            <Users size={14} /> CRM Khách Hàng
          </button>
          <button
            onClick={onOpenReturns}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            title="Xử lý đổi trả & hoàn tiền tại quầy (UC10)"
          >
            <RotateCcw size={14} /> Xử Lý Đổi Trả
          </button>
        </div>
      </header>

      {/* Main View Area */}
      {activeView === 'POS' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Product Catalogue & Quick Search */}
          <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden bg-slate-900/50">
            {/* Search & Category Filter Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Quét mã vạch barcode hoặc tìm theo tên / mã SP (VD: DIOR, Áo, Giày, SNEAKER)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                  autoFocus
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      selectedCategory === cat 
                        ? 'bg-brand-600 text-white shadow-sm' 
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tất Cả Hàng' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map(product => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <div
                      key={product.id}
                      onClick={() => !isOutOfStock && handleSelectProduct(product)}
                      className={`bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 p-3 flex flex-col justify-between transition-all cursor-pointer group shadow-sm hover:shadow-brand-500/10 hover:border-brand-500/50 ${
                        isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                      }`}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 mb-2">
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[10px] font-mono font-bold rounded-md text-amber-300">
                          Kho: {product.stock}
                        </span>
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-rose-400 font-bold text-xs uppercase tracking-wider">
                            Hết Hàng
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-brand-400 transition">
                          {product.name}
                        </h4>
                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-xs font-black text-amber-400">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {product.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Counter Cart & Payment Bill (UC04) */}
          <div className="w-96 lg:w-[440px] bg-slate-950 flex flex-col shrink-0 border-l border-slate-800 shadow-2xl">
            {/* Customer CRM Lookup Header (UC03) */}
            <div className="p-3.5 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} className="text-indigo-400" /> Tra Cứu Khách Hàng (UC03)
                </span>
                {matchedCustomer && (
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded text-[10px] font-bold">
                    Hạng {matchedCustomer.tier}
                  </span>
                )}
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={customerPhoneSearch}
                  onChange={(e) => handleSearchCustomer(e.target.value)}
                  placeholder="Nhập SĐT khách hàng để tích / đổi điểm (VD: 0901234567)..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {matchedCustomer ? (
                <div className="mt-2 p-2 bg-indigo-950/40 border border-indigo-500/30 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-white font-bold">{matchedCustomer.name}</strong>
                    <p className="text-[10px] text-slate-400">
                      Điểm tích lũy: <span className="text-amber-400 font-bold">{matchedCustomer.points} điểm</span> (= {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(matchedCustomer.points * 100)})
                    </p>
                  </div>
                  {matchedCustomer.points > 0 && subtotal > 0 && (
                    <label className="flex items-center gap-1.5 text-xs text-indigo-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={usePointsDiscount}
                        onChange={(e) => setUsePointsDiscount(e.target.checked)}
                        className="rounded border-slate-700 text-brand-600 focus:ring-0"
                      />
                      <span className="font-bold">Dùng điểm</span>
                    </label>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Chưa chọn khách: Mặc định tính là khách lẻ vãng lai.
                </p>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                    <ShoppingCart size={28} className="text-slate-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Hóa đơn quầy chưa có sản phẩm</p>
                  <p className="text-[11px] text-slate-600 mt-1">Chọn sản phẩm bên trái hoặc quét mã vạch để thêm</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div 
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded-lg bg-slate-950 shrink-0 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded font-mono">Size: {item.size}</span>
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded font-mono">{item.color}</span>
                        <span className="text-amber-400 font-bold">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(index, -1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(index, 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Xóa món"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Payment Checkout Section */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3 shrink-0">
              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
                  <span className="text-white font-mono">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                </div>

                {usePointsDiscount && actualDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Giảm từ điểm tích lũy ({pointsUsed} điểm):</span>
                    <span className="font-mono">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(actualDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300 font-bold pt-1 border-t border-slate-800 text-sm">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-amber-400 font-mono text-base font-black">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPayable)}
                  </span>
                </div>

                {matchedCustomer && finalPayable > 0 && (
                  <div className="flex justify-between text-[11px] text-indigo-300">
                    <span>Điểm tích lũy cộng thêm (+1%):</span>
                    <span className="font-bold">+{pointsEarned} điểm</span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Phương thức thanh toán
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('CASH')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'CASH' 
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <DollarSign size={15} /> Tiền Mặt
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('VIETQR');
                      setIsQRModalOpen(true);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'VIETQR' 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode size={15} /> VietQR Động
                  </button>
                </div>
              </div>

              {/* Cash input & Change calculation if CASH */}
              {paymentMethod === 'CASH' && finalPayable > 0 && (
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Tiền khách đưa:</span>
                    <input
                      type="number"
                      value={cashGiven || ''}
                      onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-32 text-right px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Quick cash pills */}
                  <div className="flex gap-1 justify-end text-[10px]">
                    <button 
                      onClick={() => setCashGiven(finalPayable)} 
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                    >
                      Đủ tiền
                    </button>
                    {[100000, 200000, 500000].map(val => (
                      <button 
                        key={val}
                        onClick={() => setCashGiven(val)} 
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                      >
                        {val / 1000}k
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400 font-medium">Tiền thừa trả khách:</span>
                    <span className={`font-mono font-black ${changeDue > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(changeDue)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn hủy đơn quầy hiện tại?')) {
                      setCart([]);
                      setCashGiven(0);
                    }
                  }}
                  disabled={cart.length === 0}
                  className="px-3 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-bold disabled:opacity-40"
                >
                  Hủy Đơn
                </button>

                <button
                  onClick={handleProcessCheckout}
                  disabled={cart.length === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 disabled:opacity-40 active:scale-95"
                >
                  <Printer size={16} /> Thanh Toán & In Hóa Đơn (UC04)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Online Order Management View (Cập nhật trạng thái đơn hàng) */
        <div className="flex-1 p-6 overflow-y-auto bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Quản Lý & Cập Nhật Trạng Thái Đơn Hàng</h2>
              <p className="text-xs text-slate-400">Xem và cập nhật tiến trình đơn hàng trực tuyến của khách</p>
            </div>
            <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Tổng số đơn: <strong className="text-white">{onlineOrders.length}</strong>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-bold">Mã Đơn</th>
                    <th className="px-4 py-3 font-bold">Khách Hàng & Địa Chỉ</th>
                    <th className="px-4 py-3 font-bold">Tổng Tiền</th>
                    <th className="px-4 py-3 font-bold">Thanh Toán</th>
                    <th className="px-4 py-3 font-bold">Trạng Thái Hiện Tại</th>
                    <th className="px-4 py-3 font-bold text-right">Cập Nhật Tiến Độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {onlineOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-750/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-brand-400">
                        {order.id}
                        <div className="text-[10px] text-slate-400 font-normal">{order.createdAt}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{order.shippingAddress}</div>
                      </td>
                      <td className="px-4 py-3.5 font-bold font-mono text-amber-400">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        <div className="text-[10px] text-slate-400 font-normal">{order.itemsCount} sản phẩm</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                          order.status === OrderStatus.PENDING ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                          order.status === OrderStatus.PROCESSING ? 'bg-blue-400/20 text-blue-300 border border-blue-400/40' :
                          order.status === OrderStatus.SHIPPING ? 'bg-purple-400/20 text-purple-300 border border-purple-400/40' :
                          order.status === OrderStatus.DELIVERED ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40' :
                          'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                        }`}>
                          {order.status === OrderStatus.PENDING ? 'Chờ Duyệt' :
                           order.status === OrderStatus.PROCESSING ? 'Đang Xử Lý' :
                           order.status === OrderStatus.SHIPPING ? 'Đang Giao Hàng' :
                           order.status === OrderStatus.DELIVERED ? 'Đã Giao Thành Công' : 'Đã Hủy'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === OrderStatus.PENDING && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.PROCESSING)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold transition"
                            >
                              Xác Nhận Đơn
                            </button>
                          )}
                          {order.status === OrderStatus.PROCESSING && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.SHIPPING)}
                              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-bold transition"
                            >
                              Giao ĐVVC
                            </button>
                          )}
                          {order.status === OrderStatus.SHIPPING && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition"
                            >
                              Đã Giao Xong
                            </button>
                          )}
                          {order.status === OrderStatus.DELIVERED && (
                            <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1 justify-end">
                              <CheckCircle2 size={14} /> Hoàn tất
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {selectedProductForVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold">{selectedProductForVariant.name}</h3>
                <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProductForVariant.price)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedProductForVariant(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Size selection */}
            {selectedProductForVariant.sizes && selectedProductForVariant.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Chọn kích cỡ (Size):</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProductForVariant.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setTempSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        tempSize === sz 
                          ? 'bg-brand-600 border-brand-500 text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {selectedProductForVariant.colors && selectedProductForVariant.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Chọn màu sắc:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProductForVariant.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setTempColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        tempColor === col 
                          ? 'bg-brand-600 border-brand-500 text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedProductForVariant(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:bg-slate-800"
              >
                Hủy
              </button>
              <button
                onClick={() => addToCartWithVariant(selectedProductForVariant, tempSize, tempColor)}
                className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md shadow-brand-500/20"
              >
                Thêm Vào Hóa Đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic VietQR Modal («extend» Thanh toán mã QR) */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">VietQR Động (Extend)</span>
              <button onClick={() => setIsQRModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-indigo-700 p-3 rounded-2xl text-white">
              <p className="text-[11px] font-medium opacity-90">Hệ Thống ZShop POS</p>
              <p className="text-lg font-black">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPayable)}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`2|99|0901234567|ZSHOP-POS|${finalPayable}|POS-QUAY`)}`}
                alt="VietQR POS"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-xs text-slate-500">
              Quét mã bằng app Ngân hàng hoặc MoMo / VNPay để thanh toán tức thời tại quầy.
            </p>

            <button
              onClick={() => {
                setIsQRModalOpen(false);
                handleProcessCheckout();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} /> Đã Nhận Chuyển Khoản Thành Công
            </button>
          </div>
        </div>
      )}

      {/* Thermal Invoice Bill Modal («include» In Hóa Đơn Chuẩn Quầy 80mm) */}
      {isInvoiceModalOpen && currentCompletedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Printer size={16} className="text-brand-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Hóa Đơn Bán Lẻ Khổ Nhiệt 80mm</h3>
              </div>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Bill Preview Paper */}
            <div id="thermal-bill" className="flex-1 overflow-y-auto p-6 bg-amber-50/30 text-xs font-mono space-y-3">
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                <h2 className="text-base font-black tracking-tight text-slate-900 font-sans">HỆ THỐNG THỜI TRANG ZSHOP</h2>
                <p className="text-[11px] text-slate-600">Đ/C: 180 Cao Lỗ, P.4, Quận 8, TP. Hồ Chí Minh</p>
                <p className="text-[11px] text-slate-600">Hotline: 1900 6868 | MST: 0312984576</p>
                <div className="pt-2 text-sm font-black uppercase tracking-wider text-slate-800">
                  HÓA ĐƠN THANH TOÁN
                </div>
                <div className="text-[10px] text-slate-500">
                  Số HĐ: <strong>{currentCompletedOrder.id}</strong> | Ngày: {currentCompletedOrder.createdAt}
                </div>
              </div>

              {/* Cashier & Customer Info */}
              <div className="text-[11px] space-y-0.5 pb-2 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span>Thu ngân:</span>
                  <span className="font-bold">{currentCompletedOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Khách hàng:</span>
                  <span className="font-bold">{currentCompletedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Điện thoại:</span>
                  <span>{currentCompletedOrder.customerPhone}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300">
                <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                  <div className="col-span-6">Tên Hàng</div>
                  <div className="col-span-2 text-center">SL</div>
                  <div className="col-span-4 text-right">T.Tiền</div>
                </div>

                {currentCompletedOrder.items.map(item => (
                  <div key={item.productId} className="grid grid-cols-12 text-[11px] items-start">
                    <div className="col-span-6">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-slate-500">[{item.size}/{item.color}] @ {new Intl.NumberFormat('vi-VN').format(item.price)}</div>
                    </div>
                    <div className="col-span-2 text-center font-bold">{item.quantity}</div>
                    <div className="col-span-4 text-right font-bold font-mono">
                      {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-bold font-mono">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCompletedOrder.subtotal)}</span>
                </div>

                {currentCompletedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Khấu trừ điểm ({currentCompletedOrder.discountPoints}đ):</span>
                    <span className="font-bold font-mono">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCompletedOrder.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                  <span>THANH TOÁN:</span>
                  <span className="font-mono text-brand-700">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCompletedOrder.finalTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[10px] text-slate-600 pt-1">
                  <span>Hình thức:</span>
                  <span className="font-bold">{currentCompletedOrder.paymentMethod === 'CASH' ? 'Tiền Mặt' : 'VietQR Động'}</span>
                </div>

                {currentCompletedOrder.paymentMethod === 'CASH' && (
                  <>
                    <div className="flex justify-between text-[10px] text-slate-600">
                      <span>Tiền khách đưa:</span>
                      <span className="font-mono">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCompletedOrder.cashGiven || 0)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600">
                      <span>Tiền thừa trả:</span>
                      <span className="font-mono font-bold text-emerald-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCompletedOrder.changeAmount || 0)}</span>
                    </div>
                  </>
                )}

                {currentCompletedOrder.pointsEarned > 0 && (
                  <div className="flex justify-between text-[10px] text-indigo-700 pt-0.5">
                    <span>Điểm tích đơn này:</span>
                    <span className="font-bold">+{currentCompletedOrder.pointsEarned} điểm</span>
                  </div>
                )}
              </div>

              {/* Thank you note & Return policy */}
              <div className="text-center text-[10px] text-slate-500 space-y-1 pt-1">
                <p className="font-bold text-slate-700">Cảm ơn Quý khách & Hẹn gặp lại!</p>
                <p>Quý khách vui lòng giữ hóa đơn để đổi size/đổi trả trong vòng 7 ngày (UC10).</p>
                <p className="font-mono text-[9px] pt-1">|||| | | |||||| || | |||| |||||||| |||||||</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-white border-t border-slate-200 flex gap-3 shrink-0">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer size={15} /> In Bill Nhiệt (80mm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;
