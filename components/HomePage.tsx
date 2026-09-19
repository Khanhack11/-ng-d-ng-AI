import React, { useState, useRef, useEffect } from 'react';
import { SanPhamService } from '../services';
import { ProductDetail, UserRole } from '../types';
import { ShoppingCart, Search, User, FileText, Settings, LayoutDashboard, LogOut, Star, ArrowRight, X, PackageOpen } from 'lucide-react';

interface HomePageProps {
  onProductClick: (productId: string) => void;
  onOpenCart: () => void;
  cartItemCount: number;
  userRole: UserRole;
  onLogin: () => void;
  onLogout: () => void;
  onViewOrders: () => void;
  onGoToAdmin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
    onProductClick,
    onOpenCart,
    cartItemCount,
    userRole,
    onLogin,
    onLogout,
    onViewOrders,
    onGoToAdmin
}) => {
    // Danh sách sản phẩm chính (không bị lọc bởi search)
    const products = SanPhamService.layDanhSachSanPham();
    
    // State cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ProductDetail[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Click outside to close menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
          }
          if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
             setIsSearchFocused(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xử lý tìm kiếm Real-time (Dropdown)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchTerm(keyword);
        
        if (keyword.trim()) {
            const result = SanPhamService.timKiemSanPham(keyword);
            setSearchResults(result);
        } else {
            setSearchResults([]);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 animate-fade-in">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="font-black text-2xl tracking-tighter text-brand-600 flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                        SZSHOP
                    </div>
                    
                    {/* Search Bar Interactive with Dropdown Results */}
                    <div className="flex-1 max-w-xl relative hidden sm:block group" ref={searchRef}>
                        <div className="relative z-50">
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={handleSearch}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
                                className="w-full h-10 pl-4 pr-12 bg-gray-100 border border-transparent rounded-full focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-brand-500 transition-all text-sm font-medium text-gray-900 placeholder:font-normal"
                            />
                            {searchTerm ? (
                                <button 
                                    onClick={handleClearSearch}
                                    className="absolute right-12 top-0 h-10 w-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            ) : null}
                            
                            <button className="absolute right-0 top-0 h-10 w-12 bg-black text-white flex items-center justify-center rounded-r-full hover:bg-gray-800 transition-colors">
                                <Search size={18} />
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchFocused && searchTerm && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in origin-top z-40">
                                {searchResults.length > 0 ? (
                                    <div className="max-h-[400px] overflow-y-auto py-2">
                                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Sản phẩm gợi ý
                                        </div>
                                        {searchResults.map(product => (
                                            <div 
                                                key={product.id}
                                                onClick={() => {
                                                    onProductClick(product.id);
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
                                                        {product.discountRate > 0 && (
                                                            <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">-{product.discountRate}%</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <PackageOpen size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Không tìm thấy sản phẩm nào</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium">
                        <div 
                            className="flex items-center gap-1 cursor-pointer hover:text-brand-600 relative group"
                            onClick={onOpenCart}
                        >
                            <div className="relative">
                                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white animate-scale-in">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline">Giỏ hàng</span>
                        </div>

                        {/* Account Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => userRole === UserRole.GUEST ? onLogin() : setIsUserMenuOpen(!isUserMenuOpen)}
                                className={`flex items-center gap-2 cursor-pointer transition-colors ${isUserMenuOpen ? 'text-brand-600' : 'hover:text-brand-600'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isUserMenuOpen ? 'bg-brand-50 border-brand-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <User size={18} />
                                </div>
                                <div className="hidden md:flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-gray-500 font-normal">
                                        {userRole === UserRole.GUEST ? 'Xin chào!' : 'Tài khoản'}
                                    </span>
                                    <span className="font-bold truncate max-w-[100px]">
                                        {userRole === UserRole.GUEST ? 'Đăng nhập' : 'Quốc Khánh'}
                                    </span>
                                </div>
                            </button>
                             {/* Dropdown Menu */}
                            {isUserMenuOpen && userRole !== UserRole.GUEST && (
                                <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-in origin-top-right">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                        <p className="text-xs text-gray-500 mb-1">Đang đăng nhập là:</p>
                                        <p className="font-bold text-gray-900 truncate">Nguyễn Quốc Khánh</p>
                                        <p className="text-xs text-brand-600 mt-0.5">{userRole === UserRole.ADMIN ? 'Administrator' : 'Thành viên Vàng'}</p>
                                    </div>
                                    
                                    <div className="p-2 space-y-1">
                                        <button 
                                            onClick={onViewOrders}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                        >
                                            <FileText size={16} className="text-gray-400" />
                                            Đơn hàng của tôi
                                        </button>
                                        
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                            <Settings size={16} className="text-gray-400" />
                                            Thiết lập tài khoản
                                        </button>

                                        {userRole === UserRole.ADMIN && (
                                            <button 
                                                onClick={onGoToAdmin}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-left"
                                            >
                                                <LayoutDashboard size={16} />
                                                Trang quản trị
                                            </button>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 mt-1 pt-1 p-2">
                                        <button 
                                            onClick={onLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                                        >
                                            <LogOut size={16} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Banner Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mb-8 animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <span className="inline-block px-3 py-1 bg-brand-600 rounded text-xs font-bold uppercase tracking-widest">Bộ sưu tập mới</span>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight">Thời trang <br/>Phong cách & Đẳng cấp</h1>
                        <p className="text-gray-300 max-w-lg">Khám phá các xu hướng mới nhất với chất lượng tuyệt vời và mức giá ưu đãi.</p>
                        <button className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                            Mua ngay <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center md:justify-end">
                        <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl absolute"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" 
                            alt="Banner" 
                            className="relative z-10 w-full max-w-sm rounded-lg shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 object-cover aspect-[4/5]"
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid - Always shows all products (not filtered by search anymore) */}
            <main className="max-w-7xl mx-auto px-4 pb-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-brand-600 rounded-sm"></span>
                    Gợi ý cho bạn
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            onClick={() => onProductClick(product.id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="aspect-[4/5] overflow-hidden relative bg-gray-100">
                                <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.discountRate > 0 && (
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        -{product.discountRate}%
                                    </div>
                                )}
                                {/* Quick Add Button Overlay */}
                                <button className="absolute bottom-4 right-4 bg-white text-black p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-600 hover:text-white">
                                    <ShoppingCart size={18} />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-brand-600 transition-colors">
                                    {product.name}
                                </h3>
                                
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-red-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                        {product.discountRate > 0 && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                                    <div className="flex items-center text-yellow-500">
                                        <Star size={12} fill="currentColor" />
                                        <span className="ml-1 font-bold text-gray-700">{product.rating}</span>
                                    </div>
                                    <div className="w-px h-3 bg-gray-300"></div>
                                    <span>Đã bán {product.soldCount >= 1000 ? `${(product.soldCount/1000).toFixed(1)}k` : product.soldCount}</span>
                                    <div className="ml-auto text-gray-400">
                                        {product.shippingEstimate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-600 font-medium hover:border-black hover:text-black transition-colors">
                        Xem thêm sản phẩm
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;