import React, { useState, useEffect, useMemo } from 'react';
import ProductCard, { ProductProps } from './ProductCard';
import { SanPhamAdminService, matchSearchKeyword } from '../../services';
import { Search, Sparkles, ArrowUpDown, ChevronDown, Layers, Check, ShoppingBag, X } from 'lucide-react';

interface ProductGridProps {
  onProductClick?: (id: string | number) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'ALL': '🌟',
  'iPhone 17 & 18 Series': '🚀',
  'iPhone 16 Series': '🌟',
  'iPhone 15 Series': '💎',
  'iPhone 14 Series': '📱',
  'iPhone 13 Series': '✨',
  'iPhone 12 Series': '⚡',
  'iPhone 11 Series': '🎯',
  'iPhone Tràn Viền & Face ID': '👑',
  'iPhone Cổ Điển & Sưu Tầm': '🕰️',
  'Phụ Kiện Apple Chính Hãng': '🎧'
};

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'TOP_RATED'>('POPULAR');
  const [visibleCount, setVisibleCount] = useState<number>(18);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const dbProducts = await SanPhamAdminService.layTatCaSanPham();
        if (dbProducts && dbProducts.length > 0) {
          const mapped: ProductProps[] = dbProducts.map((p: any) => {
            const rawPrice = Number(p.price) || 0;
            const originalPrice = Number(p.originalPrice) || Math.round(rawPrice * 1.25);
            const discountPercent = originalPrice > rawPrice 
              ? Math.round(((originalPrice - rawPrice) / originalPrice) * 100)
              : 0;

            return {
              id: p.id,
              name: p.name,
              currentPrice: rawPrice,
              originalPrice: originalPrice,
              image: p.image_url || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
              soldCount: Number(p.soldCount) || Math.floor(Math.random() * 500) + 50,
              rating: Number(p.rating) || 4.9,
              category: p.categoryName || p.category || 'iPhone 16 Series',
              discountBadge: discountPercent > 0 ? `-${discountPercent}%` : undefined
            };
          });
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const handleCustomSearch = (e: any) => {
      const keyword = e.detail?.keyword || '';
      setSearchKeyword(keyword);
      if (keyword) {
        setActiveCategory('ALL');
        setVisibleCount(18);
      }
    };

    window.addEventListener('zshop:search', handleCustomSearch);
    return () => window.removeEventListener('zshop:search', handleCustomSearch);
  }, []);

  // Danh mục động kèm số lượng sản phẩm
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = { ALL: products.length };
    products.forEach((p) => {
      const cat = p.category || 'Khác';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const definedCats = [
      'ALL',
      'iPhone 17 & 18 Series',
      'iPhone 16 Series',
      'iPhone 15 Series',
      'iPhone 14 Series',
      'iPhone 13 Series',
      'iPhone 12 Series',
      'iPhone 11 Series',
      'iPhone Tràn Viền & Face ID',
      'iPhone Cổ Điển & Sưu Tầm',
      'Phụ Kiện Apple Chính Hãng'
    ];
    const extraCats = Object.keys(counts).filter(c => !definedCats.includes(c));
    return [...definedCats, ...extraCats].filter(c => counts[c] !== undefined);
  }, [products]);

  // Bộ lọc & sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Lọc theo Danh mục
    if (activeCategory !== 'ALL') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Lọc theo từ khóa tìm kiếm thông minh (có dấu / không dấu)
    if (searchKeyword.trim()) {
      result = result.filter(p => 
        matchSearchKeyword(p.name, searchKeyword) || 
        (p.category && matchSearchKeyword(p.category, searchKeyword))
      );
    }

    // Sắp xếp
    if (sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'TOP_RATED') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'NEWEST') {
      result.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    } else {
      // POPULAR: Bán chạy nhất
      result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    return result;
  }, [products, activeCategory, searchKeyword, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 18);
  };

  return (
    <div className="container mx-auto px-4 mt-10 mb-16 select-none" id="all-products">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} className="text-brand-600" />
              <span>Gợi Ý Dành Riêng Cho Bạn</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
            <span>Tất Cả Sản Phẩm</span>
            <span className="text-sm font-semibold normal-case text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} sản phẩm
            </span>
          </h2>
        </div>

        {/* Quick Search within Catalog */}
        <div className="w-full md:w-96 flex flex-col gap-2">
          <div className="relative">
            <div className="absolute left-3.5 top-3 text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                if (e.target.value) setActiveCategory('ALL');
              }}
              placeholder="Tìm kiếm thông minh: Gõ 'áo', 'giày', 'quần'..."
              className="w-full pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-400 shadow-sm"
            />
            {searchKeyword && (
              <button 
                type="button"
                onClick={() => setSearchKeyword('')} 
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Quick Keywords Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[11px] pb-1">
            <span className="text-gray-400 text-[10px] shrink-0">Gợi ý:</span>
            {[
              { label: 'Tất cả', query: '' },
              { label: 'Áo', query: 'áo' },
              { label: 'Áo Khoác', query: 'áo khoác' },
              { label: 'Quần', query: 'quần' },
              { label: 'Giày', query: 'giày' },
              { label: 'Túi Xách', query: 'túi' },
              { label: 'Váy', query: 'váy' }
            ].map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setSearchKeyword(chip.query);
                  setActiveCategory('ALL');
                  setVisibleCount(18);
                }}
                className={`px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                  searchKeyword === chip.query
                    ? 'bg-brand-600 text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Search Filter Banner */}
      {searchKeyword && (
        <div className="mb-4 bg-brand-50 border border-brand-200 rounded-xl p-3 flex items-center justify-between gap-2 text-xs shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2 text-brand-900">
            <span className="bg-brand-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">TÌM KIẾM</span>
            <span>Kết quả cho từ khóa: <strong className="text-brand-700 font-bold">"{searchKeyword}"</strong> — Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm</span>
          </div>
          <button 
            type="button"
            onClick={() => setSearchKeyword('')}
            className="text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1 hover:underline text-xs"
          >
            <X size={14} /> Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* Category Tabs Carousel */}
      <div className="mb-6 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-2 min-w-max">
          {categoryStats.map(cat => {
            const isActive = activeCategory === cat;
            const icon = CATEGORY_ICONS[cat] || '🏷️';
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(18);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-brand-500/25 shadow-md scale-[1.02]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <span>{icon}</span>
                <span>{cat === 'ALL' ? 'Tất cả danh mục' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-medium text-gray-600">
          <span className="text-gray-400 mr-1 flex items-center gap-1">
            <ArrowUpDown size={14} />
            <span>Sắp xếp theo:</span>
          </span>

          <button
            type="button"
            onClick={() => setSortBy('POPULAR')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              sortBy === 'POPULAR'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            🔥 Phổ biến
          </button>

          <button
            type="button"
            onClick={() => setSortBy('NEWEST')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              sortBy === 'NEWEST'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Mới nhất
          </button>

          <button
            type="button"
            onClick={() => setSortBy('TOP_RATED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              sortBy === 'TOP_RATED'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Đánh giá cao ⭐
          </button>

          <button
            type="button"
            onClick={() => setSortBy('PRICE_ASC')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              sortBy === 'PRICE_ASC'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Giá: Thấp đến Cao
          </button>

          <button
            type="button"
            onClick={() => setSortBy('PRICE_DESC')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              sortBy === 'PRICE_DESC'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Giá: Cao đến Thấp
          </button>
        </div>

        <div className="text-gray-400 font-medium hidden lg:block">
          Hiển thị <strong className="text-gray-700">{displayedProducts.length}</strong> / {filteredProducts.length} sản phẩm
        </div>
      </div>

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {displayedProducts.map((product) => (
            <div key={product.id} className="h-full animate-fade-in">
              <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center my-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Không tìm thấy sản phẩm nào</h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
            Không có sản phẩm nào phù hợp với danh mục hoặc từ khóa "{searchKeyword}". Hãy thử tìm với từ khóa khác!
          </p>
          <button
            onClick={() => {
              setActiveCategory('ALL');
              setSearchKeyword('');
            }}
            className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition shadow-sm"
          >
            Xem lại tất cả sản phẩm
          </button>
        </div>
      ) : null}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <span className="text-xs text-gray-500 font-medium">Đang tải danh sách sản phẩm...</span>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && filteredProducts.length > visibleCount && (
        <div className="flex flex-col items-center justify-center mt-10">
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-8 py-3 bg-white border-2 border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white font-bold text-sm rounded-2xl transition-all shadow-sm hover:shadow-lg flex items-center gap-2 group active:scale-[0.98]"
          >
            <span>Xem thêm {Math.min(18, filteredProducts.length - visibleCount)} sản phẩm khác</span>
            <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
          <span className="text-[11px] text-gray-400 mt-2 font-medium">
            Đã hiển thị {displayedProducts.length} trong tổng số {filteredProducts.length} sản phẩm
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
