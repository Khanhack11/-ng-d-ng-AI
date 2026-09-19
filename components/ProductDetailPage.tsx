import React, { useState, useRef, useEffect } from 'react';
import { SanPhamService, SanPhamAdminService, enrichProduct } from '../services'; // Sử dụng Service
import { 
  Star, ShoppingCart, Minus, Plus, Play, User, Search, Truck, 
  ChevronRight, CheckCircle, LogOut, FileText, LayoutDashboard, 
  Settings, Loader2, ShieldCheck, RotateCcw, Award, Sparkles, 
  Ticket, Ruler, X, Check, ArrowRight, Zap, Copy, Heart, CheckSquare, Tag
} from 'lucide-react';
import { CartItem, UserRole, ProductDetail } from '../types';
import Header from './ZShop/Header';

interface ProductDetailPageProps {
  productId: string;
  onBuyNow: () => void;
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
  cartItemCount: number;
  userRole: UserRole;
  onLogin: () => void;
  onLogout: () => void;
  onViewOrders: () => void;
  onGoToAdmin: () => void;
  onBackToHome: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
  onOpenPOS?: () => void;
  onOpenChangePassword?: () => void;
  onOpenLoyaltyModal?: () => void;
  onGoToWarehouse?: () => void;
  onGoToCustomers?: () => void;
  onGoToReturns?: () => void;
  customerPoints?: number;
  customerTier?: string;
  currentUser?: { name?: string; email?: string; role?: string } | null;
  pendingReturnsCount?: number;
  pendingSellersCount?: number;
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
  onNavigateSeller?: (tab?: 'overview' | 'products' | 'orders' | 'profile') => void;
  onSwitchRole?: (role: any) => void;
  onSwitchWorkspace?: (workspace: any) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
    productId,
    onBuyNow, 
    onAddToCart, 
    onOpenCart, 
    cartItemCount,
    userRole,
    currentUser,
    onLogin,
    onLogout,
    onViewOrders,
    onGoToAdmin,
    onBackToHome,
    onOpenRegister,
    onOpenSellerChannel,
    onBecomeSeller,
    onProductClick,
    onOpenPOS,
    onOpenChangePassword,
    onOpenLoyaltyModal,
    onGoToWarehouse,
    onGoToCustomers,
    onGoToReturns,
    customerPoints,
    customerTier,
    pendingReturnsCount,
    pendingSellersCount,
    onNavigateAdminTab,
    onNavigateCSKH,
    onNavigateSeller,
    onSwitchRole,
    onSwitchWorkspace
}) => {
  // Data Layer
  const [product, setProduct] = useState<ProductDetail | null>(null);
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Animation & Menu state
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false); // New state for Buy Now animation
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Smart Sizing AI state (Master Fit Ken)
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [fitHeight, setFitHeight] = useState(172);
  const [fitWeight, setFitWeight] = useState(65);
  const [fitFit, setFitFit] = useState<'regular' | 'tight' | 'loose'>('regular');
  const [savedFitResult, setSavedFitResult] = useState<string | null>(null);

  // Voucher state
  const [savedVouchers, setSavedVouchers] = useState<string[]>(['FREESHIPMAX']);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  const calculateQuickSize = (h: number, w: number, f: 'regular' | 'tight' | 'loose') => {
    let size = 'M';
    if (w < 53 || h < 162) size = 'S';
    else if (w <= 63 && h <= 170) size = 'M';
    else if (w <= 73 || h <= 177) size = 'L';
    else if (w <= 83 || h <= 184) size = 'XL';
    else size = 'XXL';

    if (f === 'loose') {
      const order = ['S', 'M', 'L', 'XL', 'XXL'];
      const idx = order.indexOf(size);
      if (idx < order.length - 1) size = order[idx + 1];
    }
    return size;
  };

  const handleApplyQuickSize = () => {
    const recommended = calculateQuickSize(fitHeight, fitWeight, fitFit);
    setSelectedSize(recommended);
    setSavedFitResult(`Khuyên dùng Size ${recommended} (${fitHeight}cm - ${fitWeight}kg • Chuẩn 96%)`);
    setIsSizeModalOpen(false);
  };

  const handleToggleSaveVoucher = (code: string) => {
    if (savedVouchers.includes(code)) {
      setSavedVouchers(prev => prev.filter(c => c !== code));
    } else {
      setSavedVouchers(prev => [...prev, code]);
      setCopiedVoucher(code);
      setTimeout(() => setCopiedVoucher(null), 2000);
    }
  };

  // Fetch real data when productId changes
  useEffect(() => {
      const loadProduct = async () => {
          try {
              const allProducts = await SanPhamAdminService.layTatCaSanPham();
              // API trả về mảng, tìm theo id
              const dbProduct = allProducts.find((p: any) => p.id.toString() === productId.toString());
              
              if (dbProduct) {
                  const enriched = enrichProduct(dbProduct);
                  const mappedProduct: ProductDetail = {
                      id: enriched.id.toString(),
                      name: enriched.name,
                      price: enriched.price,
                      originalPrice: enriched.originalPrice || Math.round(enriched.price * 1.25),
                      images: (enriched.images && enriched.images.length > 0) 
                          ? enriched.images 
                          : [enriched.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
                      description: enriched.description,
                      rating: enriched.rating || 4.9,
                      reviewCount: enriched.reviewCount || 128,
                      soldCount: enriched.soldCount || 340,
                      colors: enriched.colors,
                      sizes: enriched.sizes,
                      stock: enriched.stock || 100,
                      category: enriched.category || 'Thời trang',
                      shippingFee: enriched.shippingFee || 15000,
                      shippingEstimate: enriched.shippingEstimate || '2-3 ngày',
                      discountRate: enriched.discountRate || 20,
                      videoDuration: enriched.videoDuration || '00:30s'
                  };
                  setProduct(mappedProduct);
                  setSelectedColor(mappedProduct.colors[0] || 'Mặc định');
                  setSelectedSize(mappedProduct.sizes[0] || 'Freesize');
                  setActiveImage(mappedProduct.images[0]);
              } else {
                  // Fallback to MOCK
                  const rawFallback = SanPhamService.layChiTietSanPham(productId);
                  const fallback = enrichProduct(rawFallback);
                  setProduct(fallback);
                  if (fallback) {
                      setSelectedColor(fallback.colors[0] || 'Mặc định');
                      setSelectedSize(fallback.sizes[0] || 'Freesize');
                      setActiveImage(fallback.images[0]);
                  }
              }
          } catch (e) {
              console.error(e);
              const rawFallback = SanPhamService.layChiTietSanPham(productId);
              const fallback = enrichProduct(rawFallback);
              setProduct(fallback);
              if (fallback) {
                  setSelectedColor(fallback.colors[0] || 'Mặc định');
                  setSelectedSize(fallback.sizes[0] || 'Freesize');
                  setActiveImage(fallback.images[0]);
              }
          }
          window.scrollTo(0, 0);
          setQuantity(1);
      };
      
      loadProduct();
  }, [productId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuantityChange = (delta: number) => {
    if (product) {
       setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
    }
  };

  const handleAddToCart = () => {
    if (isAdding || isAdded) return;

    setIsAdding(true);

    setTimeout(() => {
        if (product) {
            const newItem: CartItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: product.name,
                price: product.price,
                image: activeImage,
                quantity: quantity,
                size: selectedSize
            };
            onAddToCart(newItem);
        }
        setIsAdding(false);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    }, 400);
  };

  const handleBuyNowClick = () => {
      if (isBuying || isAdding) return;
      setIsBuying(true);
      
      // Add to cart before navigating
      handleAddToCart();

      // Visual confirmation delay
      setTimeout(() => {
          onBuyNow();
          // Reset not strictly necessary as view changes, but good for cleanup
          setIsBuying(false); 
      }, 700);
  };

  if (!product) {
      return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 animate-fade-in relative">
      
      {/* Success Popup Toast */}
      <div className={`fixed top-24 right-4 z-[60] transform transition-all duration-500 ease-out ${isAdded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-start gap-3 max-w-sm">
            <div className="text-green-500 shrink-0 mt-0.5">
                <CheckCircle size={20} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-sm">Đã thêm vào giỏ!</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.name} ({selectedSize})</p>
                <button 
                    onClick={onOpenCart}
                    className="text-xs font-bold text-brand-600 mt-2 hover:underline uppercase"
                >
                    Xem giỏ hàng
                </button>
            </div>
        </div>
      </div>

      {/* Header */}
      <Header 
          onOpenCart={onOpenCart}
          cartItemCount={cartItemCount}
          onLogin={onLogin}
          userRole={userRole}
          currentUser={currentUser}
          onLogout={onLogout}
          onOpenRegister={onOpenRegister}
          onOpenSellerChannel={onOpenSellerChannel}
          onBecomeSeller={onBecomeSeller}
          onProductClick={onProductClick}
          onGoToAdmin={onGoToAdmin}
          onViewOrders={onViewOrders}
          onGoToWarehouse={onGoToWarehouse}
          onGoToCustomers={onGoToCustomers}
          onGoToReturns={onGoToReturns}
          onOpenPOS={onOpenPOS}
          onOpenChangePassword={onOpenChangePassword}
          onOpenLoyaltyModal={onOpenLoyaltyModal}
          customerPoints={customerPoints}
          customerTier={customerTier}
          pendingReturnsCount={pendingReturnsCount}
          pendingSellersCount={pendingSellersCount}
          onNavigateAdminTab={onNavigateAdminTab}
          onNavigateCSKH={onNavigateCSKH}
          onNavigateSeller={onNavigateSeller}
          onSwitchRole={onSwitchRole}
          onSwitchWorkspace={onSwitchWorkspace}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500 flex items-center gap-2">
            <span onClick={onBackToHome} className="cursor-pointer hover:text-brand-600 hover:underline">Trang chủ</span>
            <ChevronRight size={12} />
            <span>Thời trang nam</span>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Images & Video (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.discountRate}%
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded border-2 cursor-pointer overflow-hidden transition-all ${activeImage === img ? 'border-brand-600 ring-1 ring-brand-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Video Section */}
            {product.videoDuration && (
                <div className="border border-gray-300 rounded-lg p-1">
                    <div className="bg-black text-white text-xs font-bold text-center py-1 rounded-t-sm uppercase tracking-wider">
                        ^ Video thực tế ^
                    </div>
                    <div className="relative bg-gray-900 aspect-video rounded-sm overflow-hidden flex items-center justify-center group cursor-pointer mt-1">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                        <button className="relative z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/50 text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all group-hover:scale-105">
                            <Play size={16} fill="currentColor" />
                            <span className="text-xs font-bold">XEM VIDEO</span>
                        </button>
                        <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/60 px-1.5 rounded">
                            {product.videoDuration}
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Right Column: Info (7 cols) */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2 uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center text-brand-600 border-b border-brand-600 pb-0.5">
                <span className="font-bold underline mr-1">{product.rating}</span>
                <Star size={14} fill="currentColor" />
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-gray-600">
                <span className="font-bold underline text-gray-900 mr-1">{product.reviewCount}</span>
                đánh giá
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-gray-600">
                Đã bán <span className="font-bold text-gray-900">{product.soldCount >= 1000 ? `${(product.soldCount/1000).toFixed(1)}k` : product.soldCount}</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-4 rounded-2xl mb-4 flex items-baseline gap-3 border border-slate-200/60">
              <span className="text-3xl font-black text-rose-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              <span className="text-lg text-slate-400 line-through">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
              </span>
              <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                -{product.discountRate}% GIẢM
              </span>
            </div>

            {/* 🏷️ MÃ GIẢM GIÁ & VOUCHER CỦA SHOP */}
            <div className="bg-gradient-to-r from-rose-50/70 via-amber-50/40 to-orange-50/30 p-3.5 rounded-2xl border border-rose-200/80 mb-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                  <Ticket size={15} className="text-rose-600" /> Mã Giảm Giá & Voucher Áp Dụng
                </span>
                <span className="text-[10px] text-rose-700 font-bold bg-white px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                  Tiết kiệm tới 80.000đ
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'FREESHIPMAX', text: 'Giảm 30k ship' },
                  { code: 'ZSHOPNEW', text: 'Giảm 50k' },
                  { code: 'VIPGOLD10', text: 'Giảm 80k VIP' }
                ].map(v => {
                  const isSaved = savedVouchers.includes(v.code);
                  return (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => handleToggleSaveVoucher(v.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isSaved 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                          : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <Tag size={11} />
                      <span>{v.code}</span>
                      <span className="text-[10px] opacity-80 font-normal">({v.text})</span>
                      <span className="text-[10px] underline ml-0.5">{isSaved ? '✓ Đã lưu' : '+ Lưu mã'}</span>
                    </button>
                  );
                })}
              </div>
              {copiedVoucher && (
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 animate-fadeIn">
                  <Check size={12} /> Đã lưu mã <strong>{copiedVoucher}</strong>! Mã sẽ tự động điền khi bạn thanh toán.
                </p>
              )}
            </div>

            {/* Shipping */}
            <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                  <label className="w-24 text-sm text-gray-500 pt-0.5">Vận chuyển</label>
                  <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
                          <Truck size={16} />
                          <span>Vận chuyển tới: <span className="font-medium underline decoration-dotted">TP. Hồ Chí Minh & Toàn quốc</span></span>
                      </div>
                      <div className="text-sm text-gray-600 pl-6">
                          Phí vận chuyển: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.shippingFee)}</strong>
                          <span className="mx-2 text-gray-300">|</span>
                          Dự kiến: {product.shippingEstimate} (Hỗ trợ hỏa tốc 2H)
                      </div>
                  </div>
               </div>

               {/* Colors */}
               <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 pt-2">
                    <label className="text-sm font-medium text-gray-600 block">Màu sắc</label>
                    <span className="text-[11px] text-gray-400">({selectedColor})</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                      {product.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 text-xs sm:text-sm border rounded-lg hover:border-brand-600 transition-all font-medium ${
                              selectedColor === color 
                                ? 'border-brand-600 text-brand-700 font-bold ring-2 ring-brand-500/20 bg-brand-50 shadow-sm' 
                                : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                              {color}
                          </button>
                      ))}
                  </div>
               </div>

               {/* Sizes */}
               <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 pt-2">
                    <label className="text-sm font-medium text-gray-600 block">Kích thước</label>
                    <span className="text-[11px] text-brand-600 font-medium cursor-pointer hover:underline">({selectedSize})</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2.5">
                        {product.sizes.map(size => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`min-w-[3.5rem] px-3.5 py-2 text-xs sm:text-sm border rounded-lg hover:border-brand-600 transition-all font-medium uppercase ${
                                selectedSize === size 
                                  ? 'border-brand-600 text-brand-700 font-bold ring-2 ring-brand-500/20 bg-brand-50 shadow-sm' 
                                  : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                              }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {/* 📏 Nút AI Tư Vấn Size Chuẩn */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsSizeModalOpen(!isSizeModalOpen)}
                        className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Ruler size={13} className="text-emerald-600" />
                        <span>📏 AI Đo & Tư Vấn Size Chuẩn (Master Fit)</span>
                      </button>
                      {savedFitResult && (
                        <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-1 rounded-lg">
                          💡 {savedFitResult}
                        </span>
                      )}
                    </div>

                    {/* Mini Smart Size Calculator Modal */}
                    {isSizeModalOpen && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 animate-fadeIn shadow-sm">
                        <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                          <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                            <Ruler size={14} className="text-emerald-700" />
                            Master Fit Ken — Tính toán kích cỡ chuẩn xác 96%
                          </span>
                          <button onClick={() => setIsSizeModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                            <X size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-emerald-900 block mb-0.5">
                              Chiều cao: <strong>{fitHeight} cm</strong>
                            </label>
                            <input 
                              type="range" min={145} max={195} value={fitHeight} 
                              onChange={(e) => setFitHeight(Number(e.target.value))}
                              className="w-full accent-emerald-600"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-emerald-900 block mb-0.5">
                              Cân nặng: <strong>{fitWeight} kg</strong>
                            </label>
                            <input 
                              type="range" min={40} max={110} value={fitWeight} 
                              onChange={(e) => setFitWeight(Number(e.target.value))}
                              className="w-full accent-emerald-600"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex gap-1 text-[11px]">
                            <button 
                              type="button"
                              onClick={() => setFitFit('tight')}
                              className={`px-2 py-1 rounded-lg border font-medium ${fitFit === 'tight' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
                            >
                              Ôm sát
                            </button>
                            <button 
                              type="button"
                              onClick={() => setFitFit('regular')}
                              className={`px-2 py-1 rounded-lg border font-medium ${fitFit === 'regular' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
                            >
                              Vừa vặn
                            </button>
                            <button 
                              type="button"
                              onClick={() => setFitFit('loose')}
                              className={`px-2 py-1 rounded-lg border font-medium ${fitFit === 'loose' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
                            >
                              Rộng Oversize
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleApplyQuickSize}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition-colors"
                          >
                            Áp Dụng Size {calculateQuickSize(fitHeight, fitWeight, fitFit)}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
               </div>

               {/* Quantity */}
               <div className="flex gap-4 items-center">
                  <label className="w-24 text-sm text-gray-500">Số lượng</label>
                  <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-r border-gray-300"
                      >
                          <Minus size={14} />
                      </button>
                      <input 
                        type="text" 
                        value={quantity} 
                        readOnly
                        className="w-12 h-8 text-center text-sm font-medium focus:outline-none text-gray-900"
                      />
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l border-gray-300"
                      >
                          <Plus size={14} />
                      </button>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    Còn <span className="text-green-600 font-medium">{product.stock}</span> sản phẩm
                  </span>
               </div>

               {/* 🟢 BÁO CÁO KHO THỜI GIAN THỰC (UC07) */}
               <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
                 <span className="flex items-center gap-1.5 font-bold">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   Tình trạng: Còn <strong className="text-emerald-700 font-extrabold">{product.stock} sản phẩm</strong> sẵn sàng giao ngay tại Kho Tổng (Kệ A1-08)
                 </span>
                 <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                   Sẵn Sàng Giao
                 </span>
               </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded || isBuying}
                    className={`flex-1 max-w-[200px] h-12 border rounded font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95
                        ${isAdded 
                            ? 'border-green-500 text-green-600 bg-green-50' 
                            : 'border-brand-600 text-brand-600 bg-brand-50 hover:bg-brand-100'
                        }
                        ${isAdding ? 'opacity-70 cursor-wait' : ''}
                    `}
                >
                    {isAdding ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Đang thêm...</span>
                        </>
                    ) : isAdded ? (
                        <>
                            <CheckCircle size={20} className="animate-bounce" />
                            <span>Đã thêm!</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={20} />
                            <span>Thêm vào giỏ hàng</span>
                        </>
                    )}
                </button>
                <button 
                    onClick={handleBuyNowClick}
                    disabled={isAdding || isAdded || isBuying}
                    className={`flex-1 max-w-[200px] h-12 rounded font-bold flex items-center justify-center gap-2 transition-all duration-500 ease-out shadow-lg
                        ${isBuying 
                            ? 'bg-green-600 text-white scale-105 shadow-green-300 ring-2 ring-green-400 ring-offset-2' 
                            : 'bg-brand-700 text-white hover:bg-brand-800 hover:shadow-xl active:scale-95'
                        }
                    `}
                >
                    {isBuying ? (
                        <>
                            <CheckCircle size={20} className="animate-bounce" />
                            <span>Đang chuyển...</span>
                        </>
                    ) : (
                        "Đặt hàng ngay"
                    )}
                </button>
            </div>

            {/* ZShop Mall Trust Guarantee Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-t border-b border-gray-100 mb-6 text-xs text-gray-600 bg-gray-50/50 rounded-xl px-3 mt-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <div>
                        <p className="font-bold text-gray-800">100% Chính hãng</p>
                        <p className="text-[10px] text-gray-400">Cam kết nguồn gốc</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <RotateCcw size={18} className="text-blue-600 shrink-0" />
                    <div>
                        <p className="font-bold text-gray-800">Đổi trả 7 ngày</p>
                        <p className="text-[10px] text-gray-400">Đổi size miễn phí</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Truck size={18} className="text-brand-600 shrink-0" />
                    <div>
                        <p className="font-bold text-gray-800">Freeship 0Đ</p>
                        <p className="text-[10px] text-gray-400">Toàn quốc đơn từ 0đ</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Award size={18} className="text-amber-500 shrink-0" />
                    <div>
                        <p className="font-bold text-gray-800">Bảo hành ZShop</p>
                        <p className="text-[10px] text-gray-400">Kiểm tra khi nhận</p>
                    </div>
                </div>
            </div>

            {/* Chi tiết & Mô tả sản phẩm */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-5 bg-brand-600 rounded-full inline-block"></span>
                        <span>Mô Tả Sản Phẩm & Hướng Dẫn Chọn Size</span>
                    </h3>
                    <span className="text-[11px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200">
                        ZShop Mall Official
                    </span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-normal bg-gray-50/40 p-4 rounded-xl border border-gray-100/60">
                    {product.description}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase">Đánh Giá Sản Phẩm</h3>
                
                {/* AI Gợi Ý Sản Phẩm Tương Tự & Phối Đồ («extend») */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          🤖 AI Gợi Ý Sản Phẩm Tương Tự & Phối Đồ («extend»)
                        </h3>
                        <p className="text-xs text-slate-500">Phân tích thị hiếu & đề xuất mặt hàng tương đồng cùng tầm giá</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded-full w-fit">
                      Độ tương thích 96%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                    {[
                      {
                        id: 'DIOR-TSHIRT-001',
                        name: 'Áo Thun Cao Cấp DIOR In Chữ Nổi',
                        price: 890000,
                        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
                        reason: 'Cùng phong cách Streetwear cao cấp',
                        soldCount: 340
                      },
                      {
                        id: 'ZSHOP-POLO-002',
                        name: 'Áo Polo Thể Thao Nam ZShop Limited',
                        price: 450000,
                        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600',
                        reason: 'Chất liệu co giãn, thoáng khí tương tự',
                        soldCount: 210
                      },
                      {
                        id: 'SNEAKER-001',
                        name: 'Giày Sneaker Nam Retro Streetwear',
                        price: 1250000,
                        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
                        reason: 'Combo phối hoàn hảo theo AI Stylist',
                        soldCount: 520
                      }
                    ].filter(i => i.id !== product.id).slice(0, 2).map(rec => (
                      <div 
                        key={rec.id}
                        onClick={() => onProductClick && onProductClick(rec.id)}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex gap-3 items-center group"
                      >
                        <img src={rec.image} alt={rec.name} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200 group-hover:scale-105 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition truncate">{rec.name}</h4>
                          <p className="text-[10px] text-indigo-600 font-medium line-clamp-1 mt-0.5">✨ {rec.reason}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-red-600 font-mono">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rec.price)}
                            </span>
                            <span className="text-[10px] text-slate-400">Đã bán {rec.soldCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Overview */}
                <div className="bg-brand-50 p-6 rounded-lg border border-brand-100 flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-brand-600 mb-1">{product.rating || 4.8}<span className="text-xl text-gray-500 font-normal">/5</span></div>
                        <div className="flex text-brand-600 mb-2">
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} className="opacity-50" />
                        </div>
                        <div className="text-sm text-gray-500">{product.reviewCount || 120} đánh giá</div>
                    </div>
                    {/* Filter tags (mock) */}
                    <div className="flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                        <button className="px-4 py-1.5 border border-brand-600 text-brand-600 bg-white rounded hover:bg-brand-50">Tất cả</button>
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">5 Sao (120)</button>
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">4 Sao (15)</button>
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">Có hình ảnh / Video (45)</button>
                    </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                    {/* Mock Review 1 */}
                    <div className="border-b border-gray-100 pb-6">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
                                <img src="https://i.pravatar.cc/150?img=33" alt="user" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">nguyen_van_a123</p>
                                <div className="flex text-brand-600 mt-1 mb-2">
                                    <Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} />
                                </div>
                                <div className="text-xs text-gray-500 mb-3">Phân loại hàng: {selectedSize}, {selectedColor}</div>
                                <p className="text-sm text-gray-700 mb-3">Sản phẩm đẹp, chất lượng tuyệt vời. Shop đóng gói cẩn thận, giao hàng nhanh chóng. Sẽ còn tiếp tục ủng hộ!</p>
                                <div className="flex gap-2">
                                    <img src={activeImage} className="w-16 h-16 rounded object-cover cursor-pointer border border-gray-200" alt="review" />
                                </div>
                                <div className="text-xs text-gray-400 mt-3">2026-03-25 10:30</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mock Review 2 */}
                     <div className="border-b border-gray-100 pb-6">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
                                <img src="https://i.pravatar.cc/150?img=47" alt="user" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">tran_thi_b_99</p>
                                <div className="flex text-brand-600 mt-1 mb-2">
                                    <Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star size={12} className="text-gray-300" />
                                </div>
                                <div className="text-xs text-gray-500 mb-3">Phân loại hàng: {selectedSize}, {selectedColor}</div>
                                <p className="text-sm text-gray-700">Chất vải mát mẻ, form dáng ổn. Giao hàng hơi lâu một chút do vận chuyển nhưng nhìn chung là hài lòng.</p>
                                <div className="text-xs text-gray-400 mt-3">2026-03-22 14:15</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🚀 THANH CHỐT ĐƠN CỐ ĐỊNH KHI CUỘN TRANG (STICKY BOTTOM ACTION BAR) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={activeImage} alt={product.name} className="w-11 h-11 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
            <div className="min-w-0 hidden sm:block">
              <h4 className="font-bold text-xs text-slate-900 truncate max-w-sm">{product.name}</h4>
              <p className="text-[11px] text-slate-500">Đã chọn: <strong className="text-blue-600 font-bold">{selectedSize}</strong> • {selectedColor}</p>
            </div>
            <div className="font-black text-rose-600 text-base sm:text-lg">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded || isBuying}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Thêm vào giỏ</span>
            </button>
            <button
              onClick={handleBuyNowClick}
              disabled={isAdding || isAdded || isBuying}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-500/20 active:scale-98 flex items-center gap-1.5 uppercase tracking-wide"
            >
              <Zap size={15} />
              <span>Mua Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;