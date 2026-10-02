import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Bell, PackageOpen, ArrowRight, X } from 'lucide-react';
import { SanPhamAdminService, matchSearchKeyword, enrichProduct } from '../../services';
import { ProductDetail } from '../../types';
import PortalTopBar, { PortalWorkspace } from '../PortalTopBar';

interface HeaderProps {
  onOpenCart?: () => void;
  cartItemCount?: number;
  onLogin?: () => void;
  userRole?: string;
  currentUser?: { name?: string; email?: string; role?: string } | null;
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
  onOpenLanding3D?: () => void;
  onGoToAdmin?: () => void;
  onViewOrders?: () => void;
  onGoToWarehouse?: () => void;
  onGoToCustomers?: () => void;
  onGoToReturns?: () => void;
  onOpenPOS?: () => void;
  onOpenChangePassword?: () => void;
  onOpenLoyaltyModal?: () => void;
  customerPoints?: number;
  customerTier?: string;
  onSwitchWorkspace?: (workspace: PortalWorkspace) => void;
  pendingReturnsCount?: number;
  pendingSellersCount?: number;
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
  onNavigateSeller?: (tab?: 'overview' | 'products' | 'orders' | 'profile') => void;
  onSwitchRole?: (role: any) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenCart, 
  cartItemCount = 0, 
  onLogin, 
  userRole, 
  currentUser,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel: _onOpenSellerChannel,
  onBecomeSeller: _onBecomeSeller,
  onProductClick,
  onOpenLanding3D: _onOpenLanding3D,
  onGoToAdmin,
  onViewOrders,
  onGoToWarehouse,
  onGoToCustomers: _onGoToCustomers,
  onGoToReturns: _onGoToReturns,
  onOpenPOS: _onOpenPOS,
  onOpenChangePassword,
  onOpenLoyaltyModal,
  customerPoints,
  customerTier,
  onSwitchWorkspace,
  pendingReturnsCount = 0,
  pendingSellersCount = 0,
  onNavigateAdminTab,
  onNavigateCSKH,
  onNavigateSeller,
  onSwitchRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProductDetail[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
           setIsSearchFocused(false);
        }
        if (voucherRef.current && !voucherRef.current.contains(event.target as Node)) {
           setIsVoucherOpen(false);
        }
     };
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;
      setSearchTerm(keyword);
      if (keyword.trim()) {
          try {
              const allProducts = await SanPhamAdminService.layTatCaSanPham();
              const filtered = allProducts.filter((p: any) => 
                  matchSearchKeyword(p.name, keyword) || 
                  (p.category && matchSearchKeyword(p.category, keyword))
              );
              
              const mapped = filtered.map((p: any) => enrichProduct({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  images: (p.images && p.images.length > 0) ? p.images : [p.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
                  sizes: p.sizes,
                  colors: p.colors,
                  description: p.description,
                  rating: p.rating || 4.9,
                  soldCount: p.soldCount || 100,
                  category: p.category || 'iPhone 16 Series'
              })) as ProductDetail[];
              
              setSearchResults(mapped);
          } catch(error) {
              console.error("Lỗi tìm kiếm sản phẩm", error);
              setSearchResults([]);
          }
      } else {
          setSearchResults([]);
      }
  };

  const handleSearchSubmit = (query?: string) => {
      const term = (query !== undefined ? query : searchTerm).trim();
      if (!term) return;
      setSearchTerm(term);
      setIsSearchFocused(false);

      // Phát sự kiện tìm kiếm toàn hệ thống cho ProductGrid
      window.dispatchEvent(new CustomEvent('zshop:search', { detail: { keyword: term } }));

      // Cuộn mượt xuống khu vực Tất Cả Sản Phẩm
      setTimeout(() => {
          const el = document.getElementById('all-products');
          if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 50);
  };

  const handleClearSearch = () => {
      setSearchTerm('');
      setSearchResults([]);
      window.dispatchEvent(new CustomEvent('zshop:search', { detail: { keyword: '' } }));
  };

  return (
    <>
      {/* 1. Dedicated System Portal Switcher / Admin Control Bar (Tự động ẩn với Khách Hàng) */}
      <PortalTopBar
        userRole={userRole}
        currentUser={currentUser}
        pendingReturnsCount={pendingReturnsCount}
        currentWorkspace={userRole === 'ADMIN' ? 'ADMIN' : userRole === 'WAREHOUSE' ? 'WAREHOUSE' : (userRole === 'SALES' || userRole === 'SUPPORT') ? 'CSKH' : 'BUYER'}
        onSwitchWorkspace={onSwitchWorkspace}
        onNavigateAdminTab={onNavigateAdminTab}
        onNavigateCSKH={onNavigateCSKH}
        onNavigateSeller={onNavigateSeller}
        onNavigateWarehouse={onGoToWarehouse}
        onNavigateHome={() => window.scrollTo(0, 0)}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />

      {/* 2. Main E-Commerce Header — Luxury Titanium Gray & Desert Titanium Gold */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#1e1d1a] via-[#262420] to-[#2e2b26] border-b border-[#c5a880]/30 shadow-md text-stone-100">
        {/* Top Navbar */}
        <div className="container mx-auto px-4 py-1.5 flex justify-between text-xs sm:text-sm border-b border-white/5">
          <div className="flex space-x-4 items-center">

            {/* VAI TRÒ KHÁCH HÀNG (CUSTOMER): CHỈ HIỂN THỊ MUA SẮM & ĐIỂM VIP */}
            {userRole === 'CUSTOMER' && (
              <>
                <button onClick={onOpenLoyaltyModal} className="hover:text-amber-200 text-[#e5c9a3] font-bold flex items-center gap-1 bg-black/30 px-2.5 py-0.5 rounded-full border border-[#c5a880]/40 cursor-pointer">
                  ⭐ {customerPoints || 450} Điểm ({customerTier || 'Vàng Titan'})
                </button>
                <span className="hidden sm:inline text-stone-500">|</span>
                <button onClick={onViewOrders} className="hover:text-[#e5c9a3] font-medium flex items-center gap-1 cursor-pointer">
                  📦 Đơn Mua Của Tôi
                </button>
                <span className="hidden sm:inline text-stone-500">|</span>
              </>
            )}

            {/* VAI TRÒ KHÁCH VÃNG LAI (GUEST) */}
            {userRole === 'GUEST' && (
              <>
                <span className="inline-block px-2 text-[#e5c9a3] font-medium">
                  Chào mừng đến với Thế Giới iPhone — Luxury Titanium Boutique
                </span>
                <span className="hidden sm:inline text-stone-500">|</span>
              </>
            )}

            {/* VAI TRÒ ADMIN (CHỦ CỬA HÀNG): HUY HIỆU VÀO TRANG QUẢN TRỊ */}
            {(userRole === 'ADMIN' || currentUser?.role === 'ADMIN') && (
              <>
                <button onClick={onGoToAdmin} className="hover:text-amber-200 text-[#e5c9a3] font-bold flex items-center gap-1 bg-[#3a342b] px-2.5 py-0.5 rounded-md border border-[#c5a880]/40 cursor-pointer">
                  👑 Bàn Làm Việc Admin - Chủ Cửa Hàng
                </button>
                <span className="hidden sm:inline text-stone-500">|</span>
              </>
            )}

            {/* VAI TRÒ NHÂN VIÊN BÁN HÀNG (SALES) */}
            {(userRole === 'SALES' || userRole === 'SUPPORT') && (
              <>
                <button onClick={() => onSwitchWorkspace && onSwitchWorkspace('CSKH')} className="hover:text-amber-200 text-[#e5c9a3] font-bold flex items-center gap-1 bg-[#3a342b] px-2.5 py-0.5 rounded-md border border-[#c5a880]/40 cursor-pointer">
                  🎧 Bàn Làm Việc Nhân Viên Bán Hàng (POS & CSKH)
                </button>
                <span className="hidden sm:inline text-stone-500">|</span>
              </>
            )}

            {/* VAI TRÒ NHÂN VIÊN KHO (WAREHOUSE) */}
            {userRole === 'WAREHOUSE' && (
              <>
                <button onClick={onGoToWarehouse} className="hover:text-amber-200 text-[#e5c9a3] font-bold flex items-center gap-1 bg-[#3a342b] px-2.5 py-0.5 rounded-md border border-[#c5a880]/40 cursor-pointer">
                  📦 Bàn Làm Việc Nhân Viên Kho
                </button>
                <span className="hidden sm:inline text-stone-500">|</span>
              </>
            )}

            <span className="hidden md:inline text-stone-300 font-medium">
              📍 Chuyên Điện Thoại iPhone Chính Hãng (iPhone 4s ➔ 18 Pro Max)
            </span>
          </div>
        <div className="flex space-x-4 items-center">
          {/* Thông báo gọn gàng với icon vector cố định kích thước */}
          <div className="relative" ref={voucherRef}>
            <button 
              onClick={() => setIsVoucherOpen(!isVoucherOpen)}
              className="flex items-center gap-1 hover:text-[#e5c9a3] focus:outline-none cursor-pointer"
            >
              <Bell size={14} /> Thông báo
            </button>
            {isVoucherOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#faf8f5] rounded-xl shadow-2xl border border-[#e5e0d5] py-2 z-50 text-stone-800">
                <div className="px-4 py-2 border-b border-[#e5e0d5] text-xs font-bold uppercase tracking-wider text-[#8c6f46]">
                  Thông báo Thế Giới iPhone
                </div>
                <div className="max-h-[260px] overflow-y-auto divide-y divide-stone-100">
                  <div className="px-4 py-3 hover:bg-stone-100/70 cursor-pointer flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f3ede2] border border-[#d4b996] text-[#8c6f46] flex items-center justify-center shrink-0 font-black text-sm">
                      📱
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900">Sẵn hàng iPhone 18 Pro Max VN/A</p>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">Bản màu Đỏ Rượu Vang Burgundy & Xanh Glacier Titan mới nhất 2026, giao hỏa tốc 2h.</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-stone-100/70 cursor-pointer flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 font-black text-sm">
                      🎁
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900">Ưu đãi Thế Giới iPhone</p>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">Thu cũ đổi mới trợ giá tới 3 triệu & miễn phí ship toàn quốc.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {userRole === 'GUEST' ? (
            <>
              <button onClick={onOpenRegister} className="hover:text-[#e5c9a3] font-semibold transition-colors">Đăng ký</button>
              <span className="hidden sm:inline opacity-40">|</span>
              <button onClick={onLogin} className="hover:text-[#e5c9a3] font-semibold transition-colors">Đăng nhập</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-0.5 rounded-full text-xs border border-[#c5a880]/30">
                <div className="w-4 h-4 rounded-full bg-[#d4b996] text-[#1e1d1a] font-bold flex items-center justify-center text-[10px]">
                  {(currentUser?.name || currentUser?.email || userRole || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="font-medium max-w-[120px] truncate hidden md:inline">
                  {currentUser?.name || currentUser?.email || 'Thành viên'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                  userRole === 'ADMIN' ? 'bg-[#d4b996] text-[#1e1d1a]' : 
                  userRole === 'WAREHOUSE' ? 'bg-amber-400 text-amber-950' : 
                  userRole === 'SALES' ? 'bg-stone-300 text-stone-900' : 
                  'bg-[#e5c9a3] text-[#1e1d1a]'
                }`}>
                  {userRole === 'ADMIN' ? 'Admin (Chủ CH)' : 
                   userRole === 'WAREHOUSE' ? 'NV Kho' : 
                   userRole === 'SALES' ? 'NV Bán hàng' : 
                   'Khách hàng'}
                </span>
              </div>
              <button onClick={onOpenChangePassword} className="hover:text-[#e5c9a3] text-[11px] font-medium underline underline-offset-2 transition-colors ml-0.5">
                Đổi MK
              </button>
              <span className="opacity-40">|</span>
              <button onClick={onLogout} className="hover:text-red-300 text-xs font-semibold underline underline-offset-2 transition-colors">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo Thế Giới iPhone — Luxury Titanium Gold */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-shrink-0 mr-6 cursor-pointer group">
          <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none flex items-center gap-1.5">
            <span className="text-stone-100">Thế Giới</span>
            <span className="bg-gradient-to-r from-[#e5c9a3] via-[#d4b996] to-[#b89768] bg-clip-text text-transparent">iPhone</span>
          </div>
          <div className="text-[10px] text-[#c5a880] font-semibold tracking-widest uppercase mt-1">
            Titanium Apple Boutique • VN/A
          </div>
        </div>

        {/* Search Bar Interactive */}
        <div className="flex-grow max-w-2xl relative hidden sm:block" ref={searchRef}>
          <div className="flex bg-[#faf8f5] border border-[#d4b996]/40 rounded-xl p-1 shadow-inner">
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Tìm tại Thế Giới iPhone (vd: ip 18prm, 17 air, 16prm, 13prm, 8 plus, 4s)..." 
              className="w-full px-3 py-1.5 bg-transparent text-stone-900 placeholder:text-stone-400 text-sm focus-visible:outline-none"
            />
            {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="px-2 text-stone-400 hover:text-stone-600"
                >
                  <X size={16} />
                </button>
            )}
            <button 
              type="button"
              onClick={() => handleSearchSubmit()}
              className="bg-gradient-to-r from-[#b89768] to-[#9a7b4f] text-white px-5 py-1.5 ml-1 rounded-lg hover:brightness-110 transition flex items-center justify-center cursor-pointer shadow-sm"
              title="Tìm kiếm"
            >
              <Search size={18} />
            </button>
          </div>
          
          <div className="flex text-[11px] text-stone-300 mt-1.5 space-x-3 overflow-hidden whitespace-nowrap">
            {['iPhone 18 Pro Max', 'iPhone 17 Pro Max', 'iPhone 17 Air', 'iPhone 16 Pro Max', 'iPhone 15 Pro Max', 'iPhone 13 Pro Max', 'iPhone 8 Plus', 'iPhone 4s'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSearchSubmit(tag)}
                className="hover:underline hover:text-[#e5c9a3] transition-colors cursor-pointer text-left focus:outline-none"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchTerm && (
              <div className="absolute top-[42px] left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                  {searchResults.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto py-2">
                          <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                              <span>Sản phẩm gợi ý ({searchResults.length})</span>
                              <span className="text-[10px] text-gray-400 normal-case">Nhấn Enter để xem tất cả</span>
                          </div>
                          {searchResults.map(product => (
                              <div 
                                  key={product.id}
                                  onClick={() => {
                                      if (onProductClick) onProductClick(product.id);
                                      setIsSearchFocused(false);
                                  }}
                                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                              >
                                  <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden shrink-0">
                                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                                      <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-sm font-bold text-red-600">
                                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                          </span>
                                          {product.sizes && product.sizes.length > 0 && (
                                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                                                  {product.sizes.length} phiên bản
                                              </span>
                                          )}
                                      </div>
                                  </div>
                                  <ArrowRight size={16} className="text-gray-300" />
                              </div>
                          ))}
                          <div className="p-2 border-t border-gray-100 bg-gray-50">
                              <button
                                  type="button"
                                  onClick={() => handleSearchSubmit()}
                                  className="w-full py-2 bg-white hover:bg-brand-50 text-brand-600 font-bold text-xs rounded border border-gray-200 hover:border-brand-300 transition-colors flex items-center justify-center gap-1.5"
                              >
                                  <span>Xem toàn bộ {searchResults.length} sản phẩm cho "{searchTerm}"</span>
                                  <ArrowRight size={13} />
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="p-8 text-center text-gray-500">
                          <PackageOpen size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Không tìm thấy sản phẩm nào khớp với "{searchTerm}"</p>
                          <p className="text-xs text-gray-400 mt-1">Thử tìm với từ khóa "17 Pro Max", "16 Pro Max", "18 Pro Max", hoặc "Titan"</p>
                      </div>
                  )}
              </div>
          )}
        </div>

        {/* Cart */}
        <div className="flex-shrink-0 ml-8 relative cursor-pointer group" onClick={onOpenCart}>
          <ShoppingCart size={32} className="group-hover:scale-110 transition-transform" />
          {cartItemCount > 0 && (
             <span className="absolute -top-1 -right-2 bg-white text-brand-600 text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-brand-600">
               {cartItemCount}
             </span>
          )}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
