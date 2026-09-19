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
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick,
  onOpenLanding3D,
  onGoToAdmin,
  onViewOrders,
  onGoToWarehouse,
  onGoToCustomers,
  onGoToReturns,
  onOpenPOS,
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
                  category: p.category || 'Thời trang'
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
        pendingSellersCount={pendingSellersCount}
        currentWorkspace={userRole === 'ADMIN' ? 'ADMIN' : userRole === 'SELLER' ? 'SELLER' : (userRole === 'SALES' || userRole === 'SUPPORT' || userRole === 'WAREHOUSE') ? 'CSKH' : 'BUYER'}
        onSwitchWorkspace={onSwitchWorkspace}
        onNavigateAdminTab={onNavigateAdminTab}
        onNavigateCSKH={onNavigateCSKH}
        onNavigateSeller={onNavigateSeller}
        onNavigateWarehouse={onGoToWarehouse}
        onNavigateHome={() => window.scrollTo(0, 0)}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />

      {/* 2. Main E-Commerce Header */}
      <header className="sticky top-0 z-50 bg-brand-600 shadow-md text-white">
        {/* Top Navbar */}
        <div className="container mx-auto px-4 py-1 flex justify-between text-xs sm:text-sm">
          <div className="flex space-x-4 items-center">

            {/* VAI TRÒ KHÁCH HÀNG (CUSTOMER): CHỈ HIỂN THỊ MUA SẮM */}
            {userRole === 'CUSTOMER' && (
              <>
                <button onClick={onOpenLoyaltyModal} className="hover:text-amber-200 text-amber-300 font-bold flex items-center gap-1 bg-black/20 px-2.5 py-0.5 rounded-full border border-amber-300/30 cursor-pointer">
                  ⭐ {customerPoints || 450} Điểm ({customerTier || 'Vàng'})
                </button>
                <span className="hidden sm:inline">|</span>
                <button onClick={onViewOrders} className="hover:text-gray-200 font-medium flex items-center gap-1 cursor-pointer">
                  📦 Đơn Mua Của Tôi
                </button>
                <span className="hidden sm:inline">|</span>
                <button onClick={onBecomeSeller} className="inline-block px-2 hover:text-white transition-colors duration-200 cursor-pointer">
                  Trở thành Người bán ZS-Economy
                </button>
                <span className="hidden sm:inline">|</span>
              </>
            )}

            {/* VAI TRÒ KHÁCH VÃNG LAI (GUEST) */}
            {userRole === 'GUEST' && (
              <>
                <button onClick={onBecomeSeller} className="inline-block px-2 hover:text-white transition-colors duration-200 cursor-pointer">
                  Trở thành Người bán ZS-Economy
                </button>
                <span className="hidden sm:inline">|</span>
              </>
            )}

            {/* VAI TRÒ ADMIN: HUY HIỆU VÀO TRANG QUẢN TRỊ */}
            {userRole === 'ADMIN' && (
              <>
                <button onClick={onGoToAdmin} className="hover:text-amber-200 text-amber-300 font-bold flex items-center gap-1 bg-purple-950/40 px-2.5 py-0.5 rounded-md border border-purple-400/40 cursor-pointer">
                  👑 Bàn Làm Việc Quản Trị Viên (Admin)
                </button>
                <span className="hidden sm:inline">|</span>
              </>
            )}

            {/* VAI TRÒ SELLER: HUY HIỆU VÀO KÊNH NGƯỜI BÁN */}
            {userRole === 'SELLER' && (
              <>
                <button onClick={onOpenSellerChannel} className="hover:text-amber-200 text-amber-300 font-bold flex items-center gap-1 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-400/40 cursor-pointer">
                  🏪 Bàn Làm Việc Nhà Bán Hàng (Seller)
                </button>
                <span className="hidden sm:inline">|</span>
              </>
            )}

            {/* VAI TRÒ CSKH / SALES / WAREHOUSE */}
            {(userRole === 'SALES' || userRole === 'SUPPORT' || userRole === 'WAREHOUSE') && (
              <>
                <button onClick={() => onSwitchWorkspace && onSwitchWorkspace('CSKH')} className="hover:text-indigo-200 text-indigo-300 font-bold flex items-center gap-1 bg-indigo-950/40 px-2.5 py-0.5 rounded-md border border-indigo-400/40 cursor-pointer">
                  🎧 Cổng Chăm Sóc Khách Hàng (CSKH & Sales)
                </button>
                <span className="hidden sm:inline">|</span>
              </>
            )}

            <a href="#" className="hover:text-gray-200">Tải ứng dụng</a>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Kết nối</span>
          </div>
        <div className="flex space-x-4 items-center">
          {/* Voucher / Notifications Dropdown */}
          <div className="relative" ref={voucherRef}>
            <button 
              onClick={() => setIsVoucherOpen(!isVoucherOpen)}
              className="flex items-center gap-1 hover:text-gray-200 focus:outline-none"
            >
              <Bell size={14} /> Thông báo
            </button>
            {isVoucherOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 text-gray-800">
                <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-500">
                  Thông báo mới nhận
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-brand-50 cursor-pointer border-b border-gray-50 flex gap-3">
                        <img src="https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lsth7f13m6d45e_tn" className="w-10 h-10 object-contain" alt="voucher" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Mã Miễn Phí Vận Chuyển</p>
                            <p className="text-xs text-gray-500 mt-1">Sử dụng ngay mã FREESHIP0D để được miễn phí vận chuyển cho đơn hàng từ 0Đ!</p>
                        </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-brand-50 cursor-pointer border-b border-gray-50 flex gap-3">
                        <img src="https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lzabtz9n7rhy96_tn" className="w-10 h-10 object-contain" alt="voucher" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Giảm giá 50k</p>
                            <p className="text-xs text-gray-500 mt-1">Chào mừng bạn mới, tặng bạn mã ZSNEW giảm 50.000đ khi thanh toán.</p>
                        </div>
                    </div>
                </div>
                <div className="text-center py-2 border-t border-gray-100">
                    <button className="text-brand-600 hover:text-brand-800 text-sm">Xem tất cả</button>
                </div>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-gray-200">Hỗ trợ</a>
          {userRole === 'GUEST' ? (
            <>
              <button onClick={onOpenRegister} className="hover:text-gray-200 font-semibold transition-colors">Đăng ký</button>
              <span className="hidden sm:inline opacity-60">|</span>
              <button onClick={onLogin} className="hover:text-gray-200 font-semibold transition-colors">Đăng nhập</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-black/15 px-2.5 py-0.5 rounded-full text-xs border border-white/10">
                <div className="w-4 h-4 rounded-full bg-white text-brand-600 font-bold flex items-center justify-center text-[10px]">
                  {(currentUser?.name || currentUser?.email || userRole || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="font-medium max-w-[120px] truncate hidden md:inline">
                  {currentUser?.name || currentUser?.email || 'Thành viên'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                  userRole === 'ADMIN' ? 'bg-purple-400 text-purple-950' : 
                  userRole === 'SELLER' ? 'bg-emerald-400 text-emerald-950' : 
                  userRole === 'WAREHOUSE' ? 'bg-amber-400 text-amber-950' : 
                  userRole === 'SALES' ? 'bg-indigo-300 text-indigo-950' : 
                  'bg-sky-300 text-blue-950'
                }`}>
                  {userRole === 'ADMIN' ? 'Admin' : 
                   userRole === 'SELLER' ? 'Seller' : 
                   userRole === 'WAREHOUSE' ? 'Thủ Kho' : 
                   userRole === 'SALES' ? 'NV Bán hàng' : 
                   'Member'}
                </span>
              </div>
              <button onClick={onOpenChangePassword} className="hover:text-white text-[11px] font-medium underline underline-offset-2 transition-colors ml-0.5">
                Đổi MK
              </button>
              <span className="opacity-40">|</span>
              <button onClick={onLogout} className="hover:text-red-200 text-xs font-semibold underline underline-offset-2 transition-colors">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 text-3xl font-bold tracking-tighter mr-8 cursor-pointer">
          ZS-Economy
        </div>

        {/* Search Bar Interactive */}
        <div className="flex-grow max-w-3xl relative hidden sm:block" ref={searchRef}>
          <div className="flex bg-white rounded-sm p-1">
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
              placeholder="Tìm kiếm: 'iPhone 16', 'Sạc GaN 65W', 'AirPods', 'MagSafe', 'S24 Ultra'..." 
              className="w-full px-3 py-1.5 text-surface-base text-sm focus-visible:outline-text-secondary"
            />
            {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="px-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
            )}
            <button 
              type="button"
              onClick={() => handleSearchSubmit()}
              className="bg-brand-600 text-white px-5 py-1.5 ml-1 rounded-sm hover:bg-brand-700 transition flex items-center justify-center cursor-pointer"
              title="Tìm kiếm"
            >
              <Search size={18} />
            </button>
          </div>
          
          <div className="flex text-xs text-white/90 mt-1 space-x-3 overflow-hidden whitespace-nowrap">
            {['iPhone 16 Pro', 'Samsung S24 Ultra', 'Củ Sạc GaN 65W', 'Tai Nghe Chống Ồn', 'Sạc Dự Phòng MagSafe', 'Ốp Lưng UAG', 'Kính Cường Lực'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSearchSubmit(tag)}
                className="hover:underline hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchTerm && (
              <div className="absolute top-[42px] left-0 w-full mt-2 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">
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
                                                  {product.sizes.length} sizes
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
                          <p className="text-xs text-gray-400 mt-1">Thử tìm với từ khóa "áo", "giày", "quần", hoặc "túi"</p>
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
