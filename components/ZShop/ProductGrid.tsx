import React, { useState, useEffect, useMemo } from 'react';
import ProductCard, { ProductProps } from './ProductCard';
import { SanPhamAdminService, matchSearchKeyword } from '../../services';
import { Search, Sparkles, ArrowUpDown, Layers, X, Smartphone } from 'lucide-react';

interface ProductGridProps {
  onProductClick?: (id: string | number) => void;
}

// Chuẩn hóa thứ tự & icon đúng 100% với tên Category trong constants.ts (Ưu tiên đời mới nhất 18 -> 4s)
const CATEGORY_CONFIG: Array<{ key: string; label: string; icon: string }> = [
  { key: 'ALL', label: 'Tất cả (25)', icon: '🌟' },
  { key: 'iPhone 18 Series (Flagship 2026)', label: 'iPhone 18 Series', icon: '🔥' },
  { key: 'iPhone 17 Series', label: 'iPhone 17 Series', icon: '🚀' },
  { key: 'iPhone 16 Series', label: 'iPhone 16 Series', icon: '💎' },
  { key: 'iPhone 15 Series', label: 'iPhone 15 Series', icon: '⚡' },
  { key: 'iPhone 14 Series', label: 'iPhone 14 Series', icon: '👑' },
  { key: 'iPhone 13 Series', label: 'iPhone 13 Series', icon: '✨' },
  { key: 'iPhone 12 Series', label: 'iPhone 12 Series', icon: '💠' },
  { key: 'iPhone 11 Series', label: 'iPhone 11 Series', icon: '🌿' },
  { key: 'iPhone Cổ Điển & Sưu Tầm (4s - XS Max)', label: 'Cổ Điển (4s ➔ XS Max)', icon: '🕰️' }
];

// Bộ lọc nhanh theo Phân Loại Model (Cùng Loại Máy: Pro Max, Pro, Air/Plus, Tiêu Chuẩn)
const MODEL_TYPE_FILTERS: Array<{
  id: string;
  label: string;
  icon: string;
  matcher: (p: any) => boolean;
}> = [
  {
    id: 'ALL_TYPES',
    label: 'Tất cả kiểu máy',
    icon: '📱',
    matcher: () => true
  },
  {
    id: 'PRO_MAX',
    label: 'Dòng Pro Max / Max (Màn lớn 3 Cam)',
    icon: '👑',
    matcher: (p) => /pro\s*max|xs\s*max/i.test(p.name)
  },
  {
    id: 'PRO_COMPACT',
    label: 'Dòng Pro Nhỏ Gọn (3 Cam 120Hz)',
    icon: '💎',
    matcher: (p) => /\bpro\b/i.test(p.name) && !/pro\s*max/i.test(p.name)
  },
  {
    id: 'AIR_PLUS',
    label: 'Dòng Air & Plus (Siêu mỏng / Pin trâu)',
    icon: '🪶',
    matcher: (p) => /\b(air|plus)\b/i.test(p.name)
  },
  {
    id: 'STANDARD',
    label: 'Dòng Tiêu Chuẩn (Nhỏ gọn trẻ trung)',
    icon: '✨',
    matcher: (p) => !/\b(pro|max|air|plus|4s)\b/i.test(p.name)
  },
  {
    id: 'CLASSIC',
    label: 'Dòng Sưu Tầm Huyền Thoại (4s ➔ XS Max)',
    icon: '🕰️',
    matcher: (p) => /\b(4s|8\s*plus|xs\s*max)\b/i.test(p.name)
  }
];

const QUICK_MODEL_CHIPS = [
  { label: 'Tất cả (25)', query: '', seriesKey: 'ALL', typeId: 'ALL_TYPES' },
  { label: '18 Pro Max', query: 'iPhone 18 Pro Max', seriesKey: 'iPhone 18 Series (Flagship 2026)', typeId: 'PRO_MAX' },
  { label: '18 Pro', query: 'iPhone 18 Pro', seriesKey: 'iPhone 18 Series (Flagship 2026)', typeId: 'PRO_COMPACT' },
  { label: '17 Pro Max', query: 'iPhone 17 Pro Max', seriesKey: 'iPhone 17 Series', typeId: 'PRO_MAX' },
  { label: '17 Pro', query: 'iPhone 17 Pro', seriesKey: 'iPhone 17 Series', typeId: 'PRO_COMPACT' },
  { label: '17 Air', query: 'iPhone 17 Air', seriesKey: 'iPhone 17 Series', typeId: 'AIR_PLUS' },
  { label: '16 Pro Max', query: 'iPhone 16 Pro Max', seriesKey: 'iPhone 16 Series', typeId: 'PRO_MAX' },
  { label: '15 Pro Max', query: 'iPhone 15 Pro Max', seriesKey: 'iPhone 15 Series', typeId: 'PRO_MAX' },
  { label: '14 Pro Max', query: 'iPhone 14 Pro Max', seriesKey: 'iPhone 14 Series', typeId: 'PRO_MAX' },
  { label: '13 Pro Max', query: 'iPhone 13 Pro Max', seriesKey: 'iPhone 13 Series', typeId: 'PRO_MAX' },
  { label: '8 Plus', query: 'iPhone 8 Plus', seriesKey: 'iPhone Cổ Điển & Sưu Tầm (4s - XS Max)', typeId: 'CLASSIC' },
  { label: '4s Sưu Tầm', query: 'iPhone 4s', seriesKey: 'iPhone Cổ Điển & Sưu Tầm (4s - XS Max)', typeId: 'CLASSIC' }
];

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeModelType, setActiveModelType] = useState<string>('ALL_TYPES');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'TOP_RATED'>('NEWEST');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const dbProducts = await SanPhamAdminService.layTatCaSanPham();
        if (dbProducts && dbProducts.length > 0) {
          const mapped: any[] = dbProducts.map((p: any) => {
            const rawPrice = Number(p.price) || Number(p.currentPrice) || 15990000;
            const originalPrice = Number(p.originalPrice) || Math.round(rawPrice * 1.15);
            const discountPercent = Number(p.discountRate) || (originalPrice > rawPrice 
              ? Math.round(((originalPrice - rawPrice) / originalPrice) * 100)
              : 0);
            const primaryImg = (p.images && p.images[0]) || p.image_url || p.image || 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png';

            return {
              ...p,
              id: p.id,
              name: p.name,
              price: rawPrice,
              currentPrice: rawPrice,
              originalPrice: originalPrice,
              discountRate: discountPercent,
              image: primaryImg,
              images: (p.images && p.images.length > 0) ? p.images : [primaryImg],
              colors: (p.colors && p.colors.length > 0) ? p.colors : ['Vàng Gold Titan'],
              sizes: (p.sizes && p.sizes.length > 0) ? p.sizes : ['128GB', '256GB'],
              soldCount: Number(p.soldCount) || 350,
              rating: Number(p.rating) || 4.9,
              category: p.categoryName || p.category || 'iPhone 18 Series (Flagship 2026)',
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
      setActiveCategory('ALL');
      setActiveModelType('ALL_TYPES');
    };

    window.addEventListener('zshop:search', handleCustomSearch);
    return () => window.removeEventListener('zshop:search', handleCustomSearch);
  }, []);

  // Đếm số lượng máy theo từng Series
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: products.length };
    products.forEach((p) => {
      const cat = p.category || 'Khác';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Đếm số lượng máy theo từng Phân Loại (Pro Max, Pro, Air/Plus, Thường, Cổ điển)
  const modelTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MODEL_TYPE_FILTERS.forEach(tf => {
      counts[tf.id] = products.filter(tf.matcher).length;
    });
    return counts;
  }, [products]);

  // Danh sách sản phẩm chính + Danh sách sản phẩm tương ứng cùng loại (khi chọn 1 mã máy cụ thể)
  const { primaryProducts, relatedSameTypeProducts, relatedTitle } = useMemo(() => {
    let result = [...products];

    // 1. Lọc theo Series (Danh mục)
    if (activeCategory !== 'ALL') {
      result = result.filter(p => p.category === activeCategory);
    }

    // 2. Lọc theo Kiểu Máy (Pro Max / Pro / Air & Plus / Tiêu chuẩn)
    if (activeModelType !== 'ALL_TYPES') {
      const tf = MODEL_TYPE_FILTERS.find(t => t.id === activeModelType);
      if (tf) {
        result = result.filter(tf.matcher);
      }
    }

    // 3. Lọc theo từ khóa hoặc mã máy chọn nhanh
    if (searchKeyword.trim()) {
      result = result.filter(p =>
        matchSearchKeyword(p.name, searchKeyword) ||
        (p.category && matchSearchKeyword(p.category, searchKeyword))
      );
    }

    // Sắp xếp
    const sortFn = (list: ProductProps[]) => {
      const copy = [...list];
      if (sortBy === 'PRICE_ASC') copy.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
      else if (sortBy === 'PRICE_DESC') copy.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0));
      else if (sortBy === 'TOP_RATED') copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sortBy === 'POPULAR') copy.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      return copy;
    };

    const sortedPrimary = sortFn(result);

    // Tìm các sản phẩm TƯƠNG ỨNG CÙNG LOẠI (Cùng Series hoặc Cùng Dòng Pro Max / Pro / Air) khi khách bấm vào 1 model
    let related: ProductProps[] = [];
    let relTitle = '';

    if (sortedPrimary.length > 0 && sortedPrimary.length <= 3 && (searchKeyword.trim() || activeCategory !== 'ALL')) {
      const refPhone = sortedPrimary[0];
      const primaryIds = new Set(sortedPrimary.map(p => p.id));
      const isProMax = /pro\s*max/i.test(refPhone.name);
      const isPro = /\bpro\b/i.test(refPhone.name) && !isProMax;
      const isAirOrPlus = /\b(air|plus)\b/i.test(refPhone.name);

      // Lấy các máy cùng Series trước + các máy cùng phân khúc (VD: cùng dòng Pro Max hoặc cùng dòng Pro)
      const sameSeries = products.filter(p => !primaryIds.has(p.id) && p.category === refPhone.category);
      const sameType = products.filter(p => {
        if (primaryIds.has(p.id) || sameSeries.some(s => s.id === p.id)) return false;
        if (isProMax) return /pro\s*max/i.test(p.name);
        if (isPro) return /\bpro\b/i.test(p.name) && !/pro\s*max/i.test(p.name);
        if (isAirOrPlus) return /\b(air|plus)\b/i.test(p.name);
        return true;
      });

      related = [...sameSeries, ...sameType].slice(0, 6);
      relTitle = isProMax
        ? `Các mẫu iPhone cùng dòng ${refPhone.category} & Phân khúc Pro Max tương ứng`
        : isPro
          ? `Các mẫu iPhone cùng dòng ${refPhone.category} & Phân khúc Pro nhỏ gọn tương ứng`
          : `Các mẫu iPhone cùng dòng ${refPhone.category} & Phân khúc tương ứng`;
    }

    return {
      primaryProducts: sortedPrimary,
      relatedSameTypeProducts: related,
      relatedTitle: relTitle
    };
  }, [products, activeCategory, activeModelType, searchKeyword, sortBy]);

  // Các mẫu máy con thuộc Series đang chọn (để hiện nút chọn nhanh từng máy trong Series đó)
  const modelsInActiveCategory = useMemo(() => {
    if (activeCategory === 'ALL') return [];
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleResetAllFilters = () => {
    setSearchKeyword('');
    setActiveCategory('ALL');
    setActiveModelType('ALL_TYPES');
  };

  return (
    <div className="container mx-auto px-4 mt-6 mb-12 select-none" id="all-products">
      
      {/* Section Header & Quick Model Bar */}
      <div className="bg-[#FAF7F2] border border-[#A39078] rounded-2xl p-4 sm:p-5 mb-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5DEC9]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#241F1A] text-[#E5C9A3] border border-[#C5A880]/50 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#D4B996]" />
                <span>Thế Giới iPhone — 25 Mã Máy • 25 Màu Độc Bản Không Trùng</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#241F1A] tracking-tight uppercase flex flex-wrap items-center gap-2.5">
              <span>Kệ Máy Thế Giới iPhone</span>
              <span className="text-xs font-bold normal-case text-[#7D623C] bg-[#F2ECE1] border border-[#C5A880] px-3 py-0.5 rounded-full">
                Đang hiển thị {primaryProducts.length} / {products.length} dòng iPhone
              </span>
            </h2>
          </div>

          {/* Ô tìm kiếm nhanh */}
          <div className="w-full lg:w-96">
            <div className="relative">
              <div className="absolute left-3.5 top-2.5 text-[#7D623C]">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  if (e.target.value) {
                    setActiveCategory('ALL');
                    setActiveModelType('ALL_TYPES');
                  }
                }}
                placeholder="Tìm mã máy: 18 Pro Max, 17 Pro, 17 Air, 16 Pro Max..."
                className="w-full pl-10 pr-8 py-2 bg-white border border-[#C5A880] rounded-xl text-xs sm:text-sm text-[#241F1A] outline-none focus:border-[#7D623C] focus:ring-2 focus:ring-[#D4B996]/40 transition-all placeholder:text-stone-400 shadow-2xs"
              />
              {searchKeyword && (
                <button 
                  type="button"
                  onClick={() => setSearchKeyword('')} 
                  className="absolute right-2.5 top-2 text-xs text-stone-500 hover:text-stone-800 bg-stone-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hàng 1: Chọn nhanh Mã Máy Nổi Bật (Flex-wrap gọn đẹp, không thanh cuộn ngang xấu) */}
        <div className="pt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[#6E5A40] font-bold text-[11px] mr-1 flex items-center gap-1">
            <Smartphone size={13} /> Chọn nhanh Model:
          </span>
          {QUICK_MODEL_CHIPS.map(chip => {
            const isChipActive =
              (chip.query === '' && searchKeyword === '' && activeCategory === 'ALL' && activeModelType === 'ALL_TYPES') ||
              (chip.query !== '' && searchKeyword.toLowerCase() === chip.query.toLowerCase());

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  if (chip.query === '') {
                    handleResetAllFilters();
                  } else {
                    setSearchKeyword(chip.query);
                    setActiveCategory('ALL');
                    setActiveModelType('ALL_TYPES');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                  isChipActive
                    ? 'bg-[#241F1A] text-[#E5C9A3] border-[#B89768] font-bold shadow-xs scale-[1.02]'
                    : 'bg-white text-[#3D342B] border-[#D5C7B4] hover:border-[#8C6F46] hover:bg-[#F5EFE6] font-medium'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Hàng 2: Lọc theo Phân Loại Cùng Kiểu Máy (Pro Max, Pro, Air/Plus, Tiêu Chuẩn, Cổ Điển) */}
        <div className="pt-2.5 mt-2.5 border-t border-[#EBE4D8] flex flex-wrap items-center gap-1.5">
          <span className="text-[#6E5A40] font-bold text-[11px] mr-1 flex items-center gap-1">
            <Layers size={13} /> Lọc cùng loại máy:
          </span>
          {MODEL_TYPE_FILTERS.map(tf => {
            const isTypeActive = activeModelType === tf.id && !searchKeyword;
            const count = modelTypeCounts[tf.id] || 0;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => {
                  setActiveModelType(tf.id);
                  setSearchKeyword('');
                  if (tf.id !== 'ALL_TYPES') {
                    setActiveCategory('ALL');
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all cursor-pointer border ${
                  isTypeActive
                    ? 'bg-gradient-to-r from-[#8C6F46] to-[#6E5634] text-white border-[#6E5634] font-bold shadow-xs'
                    : 'bg-[#F3EDE2] text-[#4A3E31] border-[#D8CBB8] hover:border-[#8C6F46] font-semibold'
                }`}
              >
                <span>{tf.icon}</span>
                <span>{tf.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isTypeActive ? 'bg-black/25 text-[#F5EBE0]' : 'bg-white text-[#7D623C]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hàng 3: Danh mục Thế Hệ iPhone (Từ iPhone 18 Series -> iPhone Cổ Điển, Flex-wrap không thanh cuộn) */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_CONFIG.map(cat => {
            const count = categoryCounts[cat.key] || 0;
            if (cat.key !== 'ALL' && count === 0) return null;
            const isActive = activeCategory === cat.key && !searchKeyword;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.key);
                  setSearchKeyword('');
                  setActiveModelType('ALL_TYPES');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                  isActive
                    ? 'bg-[#241F1A] text-[#E5C9A3] border-[#C5A880] shadow-md scale-[1.02]'
                    : 'bg-[#FAF7F2] text-[#362F27] hover:bg-white border-[#9E8C75] hover:border-[#6E5634]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-[#8C6F46] text-white' : 'bg-[#EAE2D3] text-[#5C4B37]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Khi bấm vào 1 Series (VD: iPhone 17 Series), hiện ngay danh sách các Model con thuộc Series đó */}
        {activeCategory !== 'ALL' && modelsInActiveCategory.length > 0 && (
          <div className="mt-3 bg-[#241F1A] text-[#FAF7F2] p-3 rounded-xl border border-[#C5A880]/50 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#E5C9A3] mr-1">
                📱 Các mẫu trong {activeCategory} ({modelsInActiveCategory.length} máy):
              </span>
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                  !searchKeyword
                    ? 'bg-[#C5A880] text-[#1C1B18]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Hiện tất cả ({modelsInActiveCategory.length})
              </button>
              {modelsInActiveCategory.map(m => {
                const shortName = m.name.replace('Chính Hãng VN/A', '').replace('Likenew 99%', '').trim();
                const isSelected = searchKeyword === m.name;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSearchKeyword(isSelected ? '' : m.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#C5A880] text-[#1C1B18] font-bold'
                        : 'bg-white/10 text-stone-200 hover:bg-white/20'
                    }`}
                  >
                    <span>{shortName}</span>
                    {m.colors && m.colors[0] && (
                      <span className="text-[10px] opacity-80">({m.colors[0]})</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="text-[11px] text-[#E5C9A3] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <X size={13} /> Xem toàn bộ 25 máy
            </button>
          </div>
        )}
      </div>

      {/* Thanh Sắp Xếp & Trạng Thái Bộ Lọc */}
      <div className="bg-[#FAF7F2] px-4 py-2.5 rounded-xl border border-[#A39078] shadow-2xs mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-medium text-[#4A3E31]">
          <span className="text-[#7D623C] mr-1 flex items-center gap-1 font-bold">
            <ArrowUpDown size={14} />
            <span>Sắp xếp:</span>
          </span>

          {[
            { key: 'NEWEST', label: '✨ Đời Mới Nhất (18 Pro Max ➔ 4s)' },
            { key: 'POPULAR', label: '🔥 Bán Chạy Nhất' },
            { key: 'TOP_RATED', label: '⭐ Đánh Giá Cao' },
            { key: 'PRICE_ASC', label: 'Giá Thấp ➔ Cao' },
            { key: 'PRICE_DESC', label: 'Giá Cao ➔ Thấp' }
          ].map(s => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSortBy(s.key as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                sortBy === s.key
                  ? 'bg-[#241F1A] text-[#E5C9A3] shadow-2xs'
                  : 'hover:bg-[#EAE2D3] text-[#4A3E31]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {(searchKeyword || activeCategory !== 'ALL' || activeModelType !== 'ALL_TYPES') && (
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="px-3 py-1 bg-[#9A3412] text-white rounded-lg font-bold flex items-center gap-1 hover:brightness-110 transition cursor-pointer"
          >
            <X size={13} /> Đặt lại bộ lọc (Hiện đủ 25 máy)
          </button>
        )}
      </div>

      {/* Product Grid Chính */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#C5A880]/40 h-72 animate-pulse flex flex-col justify-between">
              <div className="w-full h-44 bg-[#E5DEC9] rounded-xl" />
              <div className="space-y-2">
                <div className="h-3 bg-[#E5DEC9] rounded w-3/4" />
                <div className="h-4 bg-[#E5DEC9] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : primaryProducts.length === 0 ? (
        <div className="bg-[#FAF7F2] rounded-2xl p-10 text-center border border-[#A39078] shadow-sm">
          <p className="text-base font-bold text-[#241F1A] mb-2">
            Không tìm thấy mẫu iPhone khớp chính xác với từ khóa "{searchKeyword}"
          </p>
          <p className="text-xs text-[#6E5A40] mb-4">
            Hệ thống Thế Giới iPhone có sẵn 25 mẫu từ iPhone 4s đến iPhone 18 Pro Max.
          </p>
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="px-5 py-2 bg-[#241F1A] text-[#E5C9A3] font-bold text-xs rounded-xl hover:brightness-110 transition cursor-pointer"
          >
            Hiển thị toàn bộ 25 dòng iPhone
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {primaryProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick && onProductClick(product.id)}
              />
            ))}
          </div>

          {/* Kệ Gợi Ý Sản Phẩm Tương Ứng Cùng Loại (Hiện tự động khi khách ấn vào 1 model cụ thể) */}
          {relatedSameTypeProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-[#9E8C75]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-[#241F1A] text-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#C5A880]/50">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#D4B996] shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#E5C9A3] uppercase tracking-wide">
                      {relatedTitle}
                    </h3>
                    <p className="text-[11px] text-stone-300">
                      So sánh nhanh các phiên bản cùng dòng máy & cùng phân khúc tại Thế Giới iPhone
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="px-3 py-1.5 bg-[#C5A880] text-[#1C1B18] font-extrabold text-xs rounded-xl hover:brightness-110 transition cursor-pointer shrink-0"
                >
                  Xem tất cả 25 máy
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {relatedSameTypeProducts.map((relProduct) => (
                  <ProductCard
                    key={`rel-${relProduct.id}`}
                    product={relProduct}
                    onClick={() => onProductClick && onProductClick(relProduct.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
