import React, { useState, useRef, useEffect } from 'react';
import { SanPhamService, SanPhamAdminService, enrichProduct } from '../services'; // Sử dụng Service
import { 
  Star, ShoppingCart, Minus, Plus, Truck, 
  ChevronRight, CheckCircle, 
  Loader2, ShieldCheck, RotateCcw, Award, Sparkles, 
  Ticket, X, Check, Zap, Tag
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
  products?: ProductDetail[];
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
  onNavigateSeller?: (tab?: 'overview' | 'products' | 'orders' | 'profile') => void;
  onSwitchRole?: (role: any) => void;
  onSwitchWorkspace?: (workspace: any) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
    productId,
    products,
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

  // Apple Storage & Technical Guidance state
  const [isStorageGuideOpen, setIsStorageGuideOpen] = useState(false);
  const [selectedStorageUsage, setSelectedStorageUsage] = useState<string | null>(null);

  // Voucher state
  const [savedVouchers, setSavedVouchers] = useState<string[]>(['FREESHIPMAX']);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  const handleToggleSaveVoucher = (code: string) => {
    if (savedVouchers.includes(code)) {
      setSavedVouchers(prev => prev.filter(c => c !== code));
    } else {
      setSavedVouchers(prev => [...prev, code]);
      setCopiedVoucher(code);
      setTimeout(() => setCopiedVoucher(null), 2000);
    }
  };

  // Fetch real data when productId or products prop changes
  useEffect(() => {
      const loadProduct = async () => {
          // 1. Kiểm tra state sản phẩm tập trung (products) trước để đồng bộ tức thì tồn kho
          if (products && products.length > 0) {
              const liveProd = products.find(p => p.id === productId || String(p.id) === String(productId));
              if (liveProd) {
                  const enriched = enrichProduct(liveProd);
                  setProduct(enriched);
                  setSelectedColor(enriched.colors[0] || 'Chính hãng');
                  setSelectedSize(enriched.sizes[0] || '128GB');
                  setActiveImage(enriched.images[0]);
                  setQuantity(enriched.stock > 0 ? 1 : 0);
                  window.scrollTo(0, 0);
                  return;
              }
          }

          try {
              const allProducts = await SanPhamAdminService.layTatCaSanPham();
              // API trả về mảng, tìm theo id
              const dbProduct = allProducts.find((p: any) => p.id.toString() === productId.toString());
              
              if (dbProduct) {
                  const enriched = enrichProduct(dbProduct);
                  const validStock = typeof dbProduct.stock === 'number' ? dbProduct.stock : (typeof enriched.stock === 'number' ? enriched.stock : 30);
                  const mappedProduct: ProductDetail = {
                      id: enriched.id.toString(),
                      name: enriched.name,
                      price: enriched.price,
                      originalPrice: enriched.originalPrice || Math.round(enriched.price * 1.25),
                      images: (enriched.images && enriched.images.length > 0) 
                          ? enriched.images 
                          : [enriched.image_url || 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb.png'],
                      description: enriched.description,
                      rating: enriched.rating || 4.9,
                      reviewCount: enriched.reviewCount || 128,
                      soldCount: enriched.soldCount || 340,
                      colors: enriched.colors,
                      sizes: enriched.sizes,
                      stock: validStock,
                      category: enriched.category || 'Điện thoại iPhone',
                      shippingFee: enriched.shippingFee || 0,
                      shippingEstimate: enriched.shippingEstimate || 'Hỏa tốc 2h - 48h',
                      discountRate: enriched.discountRate || 15,
                      videoDuration: ''
                  };
                  setProduct(mappedProduct);
                  setSelectedColor(mappedProduct.colors[0] || 'Chính hãng');
                  setSelectedSize(mappedProduct.sizes[0] || '128GB');
                  setActiveImage(mappedProduct.images[0]);
                  setQuantity(validStock > 0 ? 1 : 0);
              } else {
                  // Fallback to MOCK
                  const rawFallback = SanPhamService.layChiTietSanPham(productId);
                  const fallback = enrichProduct(rawFallback);
                  setProduct(fallback);
                  if (fallback) {
                      setSelectedColor(fallback.colors[0] || 'Chính hãng');
                      setSelectedSize(fallback.sizes[0] || '128GB');
                      setActiveImage(fallback.images[0]);
                      setQuantity(fallback.stock > 0 ? 1 : 0);
                  }
              }
          } catch (e) {
              console.error(e);
              const rawFallback = SanPhamService.layChiTietSanPham(productId);
              const fallback = enrichProduct(rawFallback);
              setProduct(fallback);
              if (fallback) {
                  setSelectedColor(fallback.colors[0] || 'Chính hãng');
                  setSelectedSize(fallback.sizes[0] || '128GB');
                  setActiveImage(fallback.images[0]);
                  setQuantity(fallback.stock > 0 ? 1 : 0);
              }
          }
          window.scrollTo(0, 0);
      };
      
      loadProduct();
  }, [productId, products]);

  const handleQuantityChange = (delta: number) => {
    if (product) {
       if (product.stock <= 0) {
         setQuantity(0);
         return;
       }
       if (delta > 0 && quantity >= product.stock) {
         alert(`⚠️ CHẶN BÁN VƯỢT TỒN KHO (TC14):\nSản phẩm "${product.name}" hiện chỉ còn tối đa ${product.stock} máy trong kho!`);
         return;
       }
       setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
    }
  };

  // Đồng bộ dữ liệu Màu Máy & Hình Ảnh chuẩn Apple.com Studio (2026)
  const getAppleColorStudioStyle = (colorName: string = '') => {
    const lower = colorName.toLowerCase();
    if (lower.includes('burgundy') || lower.includes('rượu vang') || lower.includes('đỏ')) {
      return {
        swatchHex: '#7A1C2E',
        ringColor: '#BE123C',
        studioBg: 'from-[#2B0911] via-[#5E1526] to-[#881337]',
        glowOrb: 'bg-[#F43F5E]/30',
        imgFilter: 'hue-rotate(-28deg) saturate(1.42) brightness(0.9) contrast(1.06)'
      };
    }
    if (lower.includes('glacier') || lower.includes('băng hà') || lower.includes('băng giá') || lower.includes('sierra') || lower.includes('sky')) {
      return {
        swatchHex: '#5B8FA8',
        ringColor: '#0284C7',
        studioBg: 'from-[#0C2536] via-[#1B4965] to-[#2C6E91]',
        glowOrb: 'bg-[#38BDF8]/30',
        imgFilter: 'hue-rotate(175deg) saturate(1.28) brightness(0.98) contrast(1.04)'
      };
    }
    if (lower.includes('mocha') || lower.includes('cà phê') || lower.includes('đồng') || lower.includes('amber')) {
      return {
        swatchHex: '#5C4338',
        ringColor: '#78350F',
        studioBg: 'from-[#231712] via-[#4A332A] to-[#6E4D40]',
        glowOrb: 'bg-[#D97706]/25',
        imgFilter: 'sepia(0.38) hue-rotate(-12deg) saturate(1.25) brightness(0.92) contrast(1.05)'
      };
    }
    if (lower.includes('emerald') || lower.includes('lục bảo') || lower.includes('rừng') || lower.includes('alpine') || lower.includes('matcha') || lower.includes('sage') || lower.includes('xanh lá') || lower.includes('bạc hà')) {
      return {
        swatchHex: '#047857',
        ringColor: '#059669',
        studioBg: 'from-[#082B22] via-[#135745] to-[#20856A]',
        glowOrb: 'bg-[#34D399]/30',
        imgFilter: 'hue-rotate(122deg) saturate(1.32) brightness(0.94)'
      };
    }
    if (lower.includes('cobalt') || lower.includes('ultramarine') || lower.includes('lưu ly') || lower.includes('xanh lam') || lower.includes('xanh dương') || lower.includes('pacific') || lower.includes('teal') || lower.includes('mòng két')) {
      return {
        swatchHex: '#1D4ED8',
        ringColor: '#2563EB',
        studioBg: 'from-[#0C192E] via-[#1C3B6B] to-[#2C5FA6]',
        glowOrb: 'bg-[#60A5FA]/30',
        imgFilter: 'hue-rotate(192deg) saturate(1.35) brightness(0.95)'
      };
    }
    if (lower.includes('tím') || lower.includes('purple') || lower.includes('lavender') || lower.includes('oải hương')) {
      return {
        swatchHex: '#6D28D9',
        ringColor: '#7C3AED',
        studioBg: 'from-[#24123E] via-[#462478] to-[#6838B0]',
        glowOrb: 'bg-[#C4B5FD]/30',
        imgFilter: 'hue-rotate(245deg) saturate(1.28) brightness(0.94)'
      };
    }
    if (lower.includes('hồng') || lower.includes('pink') || lower.includes('rose') || lower.includes('san hô')) {
      return {
        swatchHex: '#EC4899',
        ringColor: '#DB2777',
        studioBg: 'from-[#3B0F26] via-[#701D49] to-[#9D2B67]',
        glowOrb: 'bg-[#F472B6]/30',
        imgFilter: 'hue-rotate(295deg) saturate(1.22) brightness(0.98)'
      };
    }
    if (lower.includes('đen') || lower.includes('black') || lower.includes('midnight') || lower.includes('xám') || lower.includes('graphite')) {
      return {
        swatchHex: '#1E293B',
        ringColor: '#334155',
        studioBg: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
        glowOrb: 'bg-[#94A3B8]/25',
        imgFilter: 'grayscale(0.9) brightness(0.84) contrast(1.12)'
      };
    }
    if (lower.includes('bạc') || lower.includes('trắng') || lower.includes('silver') || lower.includes('platinum') || lower.includes('starlight')) {
      return {
        swatchHex: '#E2E8F0',
        ringColor: '#64748B',
        studioBg: 'from-[#1E293B] via-[#334155] to-[#475569]',
        glowOrb: 'bg-[#F8FAFC]/30',
        imgFilter: 'grayscale(0.88) brightness(1.08) contrast(1.04)'
      };
    }
    // Mặc định Vàng Sa Mạc / Gold / Natural Titanium
    return {
      swatchHex: '#C5A880',
      ringColor: '#8C6F46',
      studioBg: 'from-[#2B2218] via-[#5E4B34] to-[#9E8058]',
      glowOrb: 'bg-[#E5C9A3]/30',
      imgFilter: 'sepia(0.18) saturate(1.2) brightness(1.01)'
    };
  };

  const activeColorStyle = getAppleColorStudioStyle(selectedColor);

  const handleSelectColorOption = (color: string, idx: number) => {
    setSelectedColor(color);
    if (product && product.images && product.images.length > 0) {
      setActiveImage(product.images[idx % product.images.length]);
    }
  };

  const handleAddToCart = () => {
    if (isAdding || isAdded) return;
    if (!product || product.stock <= 0) {
      alert(`⚠️ Sản phẩm "${product?.name || ''}" hiện đã hết hàng trong kho!`);
      return;
    }
    if (quantity > product.stock) {
      alert(`⚠️ CHẶN ĐẶT HÀNG (TC14 - Anti-Overselling):\nSản phẩm "${product.name}" chỉ còn ${product.stock} máy trong kho (bạn đang chọn ${quantity} máy).`);
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
        if (product) {
            const cleanColor = selectedColor.replace(/\s*\(Mới\)/gi, '').trim();
            const cStyle = getAppleColorStudioStyle(selectedColor);
            const newItem: CartItem = {
                id: `${product.id}-${selectedSize}-${cleanColor}-${Date.now()}`,
                productId: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: activeImage,
                quantity: quantity,
                size: cleanColor ? `${selectedSize} - ${cleanColor}` : selectedSize,
                color: cleanColor,
                category: product.category,
                selected: true,
                imgFilter: cStyle.imgFilter,
                studioBg: cStyle.studioBg,
                swatchHex: cStyle.swatchHex,
                stock: product.stock
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
      if (!product || product.stock <= 0) {
        alert(`⚠️ Sản phẩm "${product?.name || ''}" hiện đã hết hàng trong kho!`);
        return;
      }
      if (quantity > product.stock) {
        alert(`⚠️ CHẶN ĐẶT HÀNG (TC14 - Anti-Overselling):\nSản phẩm "${product.name}" chỉ còn ${product.stock} máy trong kho (bạn đang chọn ${quantity} máy).`);
        return;
      }
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
            <span>Điện thoại iPhone Chính Hãng</span>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Studio Product Images (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image — Đồng bộ Studio & Màu Máy chuẩn Apple.com */}
            <div className={`h-72 sm:h-80 w-full bg-gradient-to-br ${activeColorStyle.studioBg} rounded-2xl overflow-hidden border border-[#e5dfd3] relative group flex items-center justify-center p-6 shadow-md transition-all duration-500`}>
              <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full ${activeColorStyle.glowOrb} blur-2xl pointer-events-none transition-all duration-500`} />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 h-full w-4/5 flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.28)] border border-white/60">
                <img 
                  src={activeImage} 
                  alt={`${product.name} - ${selectedColor}`} 
                  style={{ filter: activeColorStyle.imgFilter }}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(28,27,24,0.16)] transition-all duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="absolute top-3 left-3 bg-[#8c6f46] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                -{product.discountRate}%
              </div>
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0" style={{ backgroundColor: activeColorStyle.swatchHex }} />
                <span className="truncate max-w-[175px]">{selectedColor.replace(/\s*\(Mới\)/gi, '')}</span>
                {selectedColor.includes('(Mới)') && (
                  <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">Mới</span>
                )}
              </div>
              <div className="absolute bottom-3 right-3 bg-[#1c1b18]/90 backdrop-blur-sm text-[#e5c9a3] border border-[#c5a880]/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                Apple Studio Sync • Chính hãng VN/A
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`h-20 rounded-xl border-2 cursor-pointer overflow-hidden bg-slate-50 p-1.5 flex items-center justify-center transition-all ${activeImage === img ? 'border-brand-600 ring-1 ring-brand-600 bg-white' : 'border-slate-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} style={{ filter: activeColorStyle.imgFilter }} className="max-h-full max-w-full object-contain transition-all duration-300" />
                </div>
              ))}
            </div>
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

               {/* Colors — Đồng bộ bảng màu Apple.com & 2-3 màu mới nhất của hãng */}
               <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 pt-2">
                    <label className="text-sm font-bold text-gray-800 block">Màu sắc</label>
                    <span className="text-[11px] text-rose-700 font-semibold block mt-0.5 leading-snug">
                      {selectedColor.replace(/\s*\(Mới\)/gi, '')}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Chuẩn Apple.com</span>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {product.colors.map((color, idx) => {
                            const cStyle = getAppleColorStudioStyle(color);
                            const isNewColor = color.includes('(Mới)');
                            const cleanLabel = color.replace(/\s*\(Mới\)/gi, '');
                            const isSelected = selectedColor === color;
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => handleSelectColorOption(color, idx)}
                                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl transition-all text-left relative ${
                                  isSelected 
                                    ? 'border-[#8c6f46] text-stone-900 font-bold ring-2 ring-[#8c6f46]/25 bg-[#faf6f0] shadow-xs' 
                                    : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 font-medium'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className="w-5 h-5 rounded-full border border-black/20 shadow-inner shrink-0 flex items-center justify-center"
                                    style={{ backgroundColor: cStyle.swatchHex }}
                                  >
                                    {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-xs" />}
                                  </span>
                                  <span className="truncate">{cleanLabel}</span>
                                </div>
                                {isNewColor && (
                                  <span className="shrink-0 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                                    Mới
                                  </span>
                                )}
                              </button>
                            );
                        })}
                    </div>
                  </div>
               </div>

               {/* Storage / Version */}
               <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 pt-2">
                    <label className="text-sm font-medium text-gray-600 block">Dung lượng</label>
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

                    {/* 💡 Nút AI Tư Vấn Dung Lượng Chuẩn Apple */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsStorageGuideOpen(!isStorageGuideOpen)}
                        className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Sparkles size={13} className="text-blue-600" />
                        <span>💡 AI Cố Vấn Chọn Bộ Nhớ & Tương Thích Apple</span>
                      </button>
                      {selectedStorageUsage && (
                        <span className="text-xs text-blue-800 font-bold bg-blue-100 px-2 py-1 rounded-lg">
                          Đã chọn: {selectedStorageUsage}
                        </span>
                      )}
                    </div>

                    {/* Mini Storage Advisor Modal */}
                    {isStorageGuideOpen && (
                      <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2.5 animate-fadeIn shadow-sm">
                        <div className="flex items-center justify-between border-b border-blue-200/80 pb-1.5">
                          <span className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-blue-700" />
                            Cố vấn cấu hình Apple ZShop — Lựa chọn tối ưu nhu cầu
                          </span>
                          <button onClick={() => setIsStorageGuideOpen(false)} className="text-slate-400 hover:text-slate-700">
                            <X size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div 
                            onClick={() => { setSelectedSize('128GB'); setSelectedStorageUsage('128GB (Phổ thông)'); }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${selectedSize === '128GB' ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-500/30' : 'bg-white/70 border-blue-100 hover:bg-white'}`}
                          >
                            <div className="font-bold text-slate-900">128GB - Phổ thông</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Lưu ~30.000 ảnh, ứng dụng MXH, Tik Tok, game nhẹ.</p>
                          </div>
                          <div 
                            onClick={() => { setSelectedSize('256GB'); setSelectedStorageUsage('256GB (Khuyên dùng ⭐)'); }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${selectedSize === '256GB' ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-500/30' : 'bg-white/70 border-blue-100 hover:bg-white'}`}
                          >
                            <div className="font-bold text-slate-900">256GB - Khuyên dùng ⭐</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Quay 4K 60fps, game nặng đồ họa cao, lưu trữ 3-4 năm.</p>
                          </div>
                          <div 
                            onClick={() => { const s = product.sizes.includes('512GB') ? '512GB' : (product.sizes.includes('1TB') ? '1TB' : product.sizes[product.sizes.length - 1]); setSelectedSize(s); setSelectedStorageUsage(`${s} (Chuyên nghiệp)`); }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${selectedSize === '512GB' || selectedSize === '1TB' ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-500/30' : 'bg-white/70 border-blue-100 hover:bg-white'}`}
                          >
                            <div className="font-bold text-slate-900">512GB / 1TB - Pro</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Quay Apple ProRes Log, sáng tạo nội dung không giới hạn.</p>
                          </div>
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
                        disabled={quantity <= 1 || product.stock <= 0}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-r border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Giảm số lượng"
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
                        disabled={quantity >= product.stock || product.stock <= 0}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title={quantity >= product.stock ? `Đã đạt tối đa tồn kho (${product.stock} máy)` : "Tăng số lượng"}
                      >
                          <Plus size={14} />
                      </button>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.stock <= 0 ? (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">⚠️ Hết hàng</span>
                    ) : (
                      <span>Còn <span className="text-green-600 font-medium">{product.stock}</span> sản phẩm</span>
                    )}
                  </span>
               </div>

               {/* 🟢 BÁO CÁO KHO THỜI GIAN THỰC (UC07) */}
               {product.stock > 0 ? (
                 <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
                   <span className="flex items-center gap-1.5 font-bold">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     Tình trạng: Còn <strong className="text-emerald-700 font-extrabold">{product.stock} sản phẩm</strong> sẵn sàng giao ngay tại Kho Tổng (Kệ A1-08)
                   </span>
                   <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                     Sẵn Sàng Giao
                   </span>
                 </div>
               ) : (
                 <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900 shadow-2xs">
                   <span className="flex items-center gap-1.5 font-bold">
                     <span className="w-2 h-2 rounded-full bg-rose-500" />
                     Tình trạng: <strong className="text-rose-700 font-extrabold">Tạm hết hàng</strong> tại Kho Tổng (Vui lòng liên hệ Hotline hoặc CSKH)
                   </span>
                   <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                     Hết Hàng
                   </span>
                 </div>
               )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded || isBuying || product.stock <= 0}
                    className={`flex-1 max-w-[200px] h-12 border rounded font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95
                        ${product.stock <= 0 
                            ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-not-allowed' 
                            : isAdded 
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
                    ) : product.stock <= 0 ? (
                        <span>Hết Hàng</span>
                    ) : (
                        <>
                            <ShoppingCart size={20} />
                            <span>Thêm vào giỏ hàng</span>
                        </>
                    )}
                </button>
                <button 
                    onClick={handleBuyNowClick}
                    disabled={isAdding || isAdded || isBuying || product.stock <= 0}
                    className={`flex-1 max-w-[200px] h-12 rounded font-bold flex items-center justify-center gap-2 transition-all duration-500 ease-out shadow-lg
                        ${product.stock <= 0
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : isBuying 
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
                    ) : product.stock <= 0 ? (
                        "Tạm Hết Hàng"
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
                        <p className="font-bold text-gray-800">1 Đổi 1 30 Ngày</p>
                        <p className="text-[10px] text-gray-400">Lỗi nhà sản xuất</p>
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
                    <Award size={18} className="text-[#b89768] shrink-0" />
                    <div>
                        <p className="font-bold text-gray-800">Bảo hành Thế Giới iPhone</p>
                        <p className="text-[10px] text-gray-400">Kiểm tra khi nhận</p>
                    </div>
                </div>
            </div>

            {/* Chi tiết & Mô tả sản phẩm */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-5 bg-brand-600 rounded-full inline-block"></span>
                        <span>Thông Số Kỹ Thuật & Chi Tiết Sản Phẩm Apple</span>
                    </h3>
                    <span className="text-[11px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200">
                        Thế Giới iPhone Authorized
                    </span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-normal bg-gray-50/40 p-4 rounded-xl border border-gray-100/60">
                    {product.description}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase">Đánh Giá Sản Phẩm</h3>
                
                {/* Gợi Ý Các Dòng iPhone Khác Tại Shop */}
                <div className="bg-white p-5 rounded-2xl border border-[#e5dfd3] shadow-sm mb-8 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#1c1b18] text-[#e5c9a3] flex items-center justify-center shadow-sm">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-stone-900">
                          📱 Gợi Ý Các Dòng iPhone Nổi Bật Khác Tại Thế Giới iPhone
                        </h3>
                        <p className="text-xs text-stone-500">Mỗi dòng máy 1 màu sắc độc bản — Chính hãng VN/A & Sưu tầm nguyên zin</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {[
                      {
                        id: 'ip-18-promax',
                        name: 'iPhone 18 Pro Max 256GB Chính Hãng VN/A',
                        price: 38990000,
                        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg',
                        reason: 'Đỏ Burgundy & Xanh Glacier Titan • Chip A20 Pro 2nm',
                        soldCount: 410
                      },
                      {
                        id: 'ip-17-promax',
                        name: 'iPhone 17 Pro Max 256GB Chính Hãng VN/A',
                        price: 33990000,
                        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3.jpg',
                        reason: '3 Camera 48MP ProRAW, Pin 4900mAh siêu trâu',
                        soldCount: 820
                      },
                      {
                        id: 'ip-16-promax',
                        name: 'iPhone 16 Pro Max 256GB Chính Hãng VN/A',
                        price: 29990000,
                        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
                        reason: 'Khung Titan Cấp 5, Nút Camera Control thông minh',
                        soldCount: 1540
                      }
                    ].filter(i => i.id !== product.id).slice(0, 2).map(rec => (
                      <div 
                        key={rec.id}
                        onClick={() => onProductClick && onProductClick(rec.id)}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex gap-3 items-center group"
                      >
                        <img src={rec.image} alt={rec.name} className="w-14 h-14 object-contain bg-white p-1 rounded-lg shrink-0 border border-slate-200 group-hover:scale-105 transition-transform" />
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
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">Có hình ảnh thực tế (45)</button>
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
                                <p className="text-sm text-gray-700">Máy nguyên bản likenew 99%, pin 98% chuẩn cam kết. Màn hình sắc nét mượt mà, camera quay video đỉnh cao. Rất hài lòng với ZShop!</p>
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
              disabled={isAdding || isAdded || isBuying || product.stock <= 0}
              className={`px-4 py-2 ${product.stock <= 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'} font-bold text-xs rounded-xl transition-all flex items-center gap-1.5`}
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">{product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}</span>
            </button>
            <button
              onClick={handleBuyNowClick}
              disabled={isAdding || isAdded || isBuying || product.stock <= 0}
              className={`px-6 py-2.5 ${product.stock <= 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 active:scale-98'} font-black text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 uppercase tracking-wide`}
            >
              <Zap size={15} />
              <span>{product.stock <= 0 ? 'Tạm Hết' : 'Mua Ngay'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;