import React from 'react';
import { Star, Zap } from 'lucide-react';

export interface ProductProps {
  id: number | string;
  image: string;
  name: string;
  originalPrice: number;
  currentPrice: number;
  soldCount: number;
  category?: string;
  rating?: number;
  discountBadge?: string;
  badgeText?: string;
}

interface CardProps {
  product: ProductProps;
  onClick?: (id: string) => void;
}

const ProductCard: React.FC<CardProps> = ({ product, onClick }) => {
  const discountPercent = product.originalPrice > product.currentPrice
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating || 4.9;
  const soldFormatted = product.soldCount > 1000 
    ? `${(product.soldCount / 1000).toFixed(1)}k` 
    : (product.soldCount || 100);

  return (
    <div 
      onClick={() => onClick && onClick(product.id.toString())}
      className="bg-white hover:border-brand-500 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-full group overflow-hidden relative select-none"
    >
      {/* Product Image Box */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-slate-50">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'} 
          alt={product.name} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600';
          }}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Brand/Official Tag Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-0.5">
            <span>Mall</span>
          </span>
        </div>

        {/* Discount Badge Top Right */}
        {(product.discountBadge || discountPercent > 0) && (
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-950 font-black text-[11px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
            <span>{product.discountBadge || `-${discountPercent}%`}</span>
          </div>
        )}

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          <span className="w-full bg-white/95 text-brand-700 text-xs font-bold py-1.5 rounded-xl text-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Xem chi tiết
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Category Pill if available */}
        {product.category && (
          <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mb-1 line-clamp-1">
            {product.category}
          </span>
        )}

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-snug min-h-[36px] mb-2 font-semibold group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating & Sold count */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <div className="flex items-center text-amber-400">
            <Star size={12} className="fill-amber-400" />
            <span className="text-[11px] font-bold text-gray-700 ml-0.5">{rating}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-[11px]">Đã bán {soldFormatted}</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-baseline justify-between">
          <div className="flex flex-col">
            {product.originalPrice > product.currentPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                ₫{product.originalPrice.toLocaleString('vi-VN')}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-brand-600">
              ₫{product.currentPrice.toLocaleString('vi-VN')}
            </span>
          </div>

          {/* Freeship Icon Pill */}
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5" title="Miễn phí vận chuyển">
            <Zap size={10} className="fill-emerald-600 text-emerald-600" />
            <span>Freeship</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
