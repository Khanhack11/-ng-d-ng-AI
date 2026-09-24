import React from 'react';
import { Star } from 'lucide-react';
import { ProductDetail } from '../../types';
import { MOCK_PRODUCTS_LIST } from '../../constants';

export interface ProductProps {
  id: string | number;
  name: string;
  price?: number;
  currentPrice?: number;
  originalPrice?: number;
  discountRate?: number;
  discountBadge?: string;
  image?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  soldCount?: number;
  rating?: number;
  category?: string;
}

interface ProductCardProps {
  product: ProductDetail | ProductProps | any;
  onClick?: () => void;
}

const DEFAULT_IPHONE_IMG = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png';

interface DynamicColorTheme {
  dot: string;
  label: string;
  headerBg: string;
  glowBg: string;
  borderHover: string;
  imgFilter: string;
}

/**
 * Hệ thống Đồng Bộ Màu Sắc Động (Dynamic Color-Sync Engine):
 * - Mỗi mã iPhone (25 mã) có 1 Màu Máy + 1 Nền Studio chuyển màu theo đúng màu máy đó
 * - Hiệu chỉnh quang học (imgFilter) đảm bảo các dòng như 18 Pro Max (Đỏ Burgundy), 18 Pro (Xanh Emerald),
 *   17 Pro Max (Cam Vũ Trụ), 17 Pro (Xanh Cobalt), 16 Pro Max (Vàng Gold Titan)... hoàn toàn KHÁC MÀU NHAU, không trùng màu cam!
 */
const getDynamicModelColorTheme = (id: string = '', colorName: string = ''): DynamicColorTheme => {
  switch (id) {
    case 'ip-18-promax':
      return {
        dot: '#9F1239',
        label: 'Đỏ Rượu Vang Burgundy',
        headerBg: 'bg-gradient-to-br from-[#2E0912] via-[#661428] to-[#9E203E]',
        glowBg: 'bg-[#F43F5E]/30',
        borderHover: 'hover:border-[#9F1239]',
        imgFilter: 'hue-rotate(-32deg) saturate(1.45) brightness(0.86) contrast(1.08)'
      };
    case 'ip-18-pro':
      return {
        dot: '#059669',
        label: 'Xanh Lục Bảo Emerald',
        headerBg: 'bg-gradient-to-br from-[#082B22] via-[#135745] to-[#20856A]',
        glowBg: 'bg-[#34D399]/30',
        borderHover: 'hover:border-[#059669]',
        imgFilter: 'hue-rotate(125deg) saturate(1.35) brightness(0.92)'
      };
    case 'ip-17-promax':
      return {
        dot: '#EA580C',
        label: 'Cam Sa Mạc Vũ Trụ',
        headerBg: 'bg-gradient-to-br from-[#3D1608] via-[#803012] to-[#C95422]',
        glowBg: 'bg-[#FB923C]/35',
        borderHover: 'hover:border-[#EA580C]',
        imgFilter: 'saturate(1.18) contrast(1.04)'
      };
    case 'ip-17-pro':
      return {
        dot: '#1D4ED8',
        label: 'Xanh Lam Cobalt Titan',
        headerBg: 'bg-gradient-to-br from-[#0C192E] via-[#1C3B6B] to-[#2C5FA6]',
        glowBg: 'bg-[#60A5FA]/30',
        borderHover: 'hover:border-[#1D4ED8]',
        imgFilter: 'hue-rotate(185deg) saturate(1.35) brightness(0.94)'
      };
    case 'ip-17-air':
      return {
        dot: '#38BDF8',
        label: 'Xanh Băng Giá Sky Ice',
        headerBg: 'bg-gradient-to-br from-[#0F2E3D] via-[#1D5670] to-[#3083A8]',
        glowBg: 'bg-[#7DD3FC]/35',
        borderHover: 'hover:border-[#0284C7]',
        imgFilter: 'hue-rotate(165deg) saturate(1.15) brightness(1.03)'
      };
    case 'ip-17':
      return {
        dot: '#8B5CF6',
        label: 'Tím Oải Hương Lavender',
        headerBg: 'bg-gradient-to-br from-[#2A174A] via-[#4D2C82] to-[#7446BA]',
        glowBg: 'bg-[#C4B5FD]/30',
        borderHover: 'hover:border-[#7C3AED]',
        imgFilter: 'hue-rotate(235deg) saturate(1.2) brightness(0.98)'
      };
    case 'ip-16-promax':
      return {
        dot: '#C5A880',
        label: 'Vàng Gold Titan Sa Mạc',
        headerBg: 'bg-gradient-to-br from-[#2B2218] via-[#5E4B34] to-[#9E8058]',
        glowBg: 'bg-[#E5C9A3]/35',
        borderHover: 'hover:border-[#8C6F46]',
        imgFilter: 'sepia(0.18) saturate(1.25) brightness(1.02)'
      };
    case 'ip-16-pro':
      return {
        dot: '#E2E8F0',
        label: 'Trắng Ngọc Titan',
        headerBg: 'bg-gradient-to-br from-[#2D3138] via-[#505661] to-[#79818F]',
        glowBg: 'bg-[#F8FAFC]/30',
        borderHover: 'hover:border-[#64748B]',
        imgFilter: 'grayscale(0.85) brightness(1.08) contrast(1.04)'
      };
    case 'ip-16-plus':
      return {
        dot: '#2563EB',
        label: 'Xanh Lưu Ly Ultramarine',
        headerBg: 'bg-gradient-to-br from-[#131F47] via-[#223B82] to-[#3459BD]',
        glowBg: 'bg-[#93C5FD]/30',
        borderHover: 'hover:border-[#2563EB]',
        imgFilter: 'saturate(1.25) contrast(1.03)'
      };
    case 'ip-16':
      return {
        dot: '#0D9488',
        label: 'Xanh Mòng Két Teal',
        headerBg: 'bg-gradient-to-br from-[#0D2E2E] via-[#195959] to-[#278585]',
        glowBg: 'bg-[#5EEAD4]/30',
        borderHover: 'hover:border-[#0D9488]',
        imgFilter: 'hue-rotate(-25deg) saturate(1.25)'
      };
    case 'ip-15-promax':
      return {
        dot: '#9E9B93',
        label: 'Xám Titan Tự Nhiên',
        headerBg: 'bg-gradient-to-br from-[#232326] via-[#43434A] to-[#6B6B75]',
        glowBg: 'bg-[#D4D4D8]/30',
        borderHover: 'hover:border-[#52525B]',
        imgFilter: 'saturate(0.85) contrast(1.05)'
      };
    case 'ip-15-pro':
      return {
        dot: '#1E3A5F',
        label: 'Titan Xanh Navy',
        headerBg: 'bg-gradient-to-br from-[#141E2E] via-[#263B59] to-[#3B5B87]',
        glowBg: 'bg-[#60A5FA]/25',
        borderHover: 'hover:border-[#1E3A5F]',
        imgFilter: 'hue-rotate(190deg) saturate(1.2) brightness(0.92)'
      };
    case 'ip-15-plus':
      return {
        dot: '#F472B6',
        label: 'Hồng Phấn Pastel',
        headerBg: 'bg-gradient-to-br from-[#47182B] via-[#7D2B4C] to-[#B84372]',
        glowBg: 'bg-[#FBCFE8]/35',
        borderHover: 'hover:border-[#DB2777]',
        imgFilter: 'saturate(1.2) contrast(1.02)'
      };
    case 'ip-15':
      return {
        dot: '#34D399',
        label: 'Xanh Lá Mint Pastel',
        headerBg: 'bg-gradient-to-br from-[#0F3325] via-[#1D5E44] to-[#2E8A65]',
        glowBg: 'bg-[#A7F3D0]/30',
        borderHover: 'hover:border-[#10B981]',
        imgFilter: 'saturate(1.2)'
      };
    case 'ip-14-promax':
      return {
        dot: '#581C87',
        label: 'Tím Đậm Deep Purple',
        headerBg: 'bg-gradient-to-br from-[#231036] via-[#441F69] to-[#66309C]',
        glowBg: 'bg-[#D8B4FE]/30',
        borderHover: 'hover:border-[#6B21A8]',
        imgFilter: 'saturate(1.2) contrast(1.04)'
      };
    case 'ip-14-pro':
      return {
        dot: '#D97706',
        label: 'Vàng Gold Hoàng Gia',
        headerBg: 'bg-gradient-to-br from-[#36240B] via-[#6B4816] to-[#A67024]',
        glowBg: 'bg-[#FDE68A]/35',
        borderHover: 'hover:border-[#B45309]',
        imgFilter: 'saturate(1.25) brightness(1.02)'
      };
    case 'ip-14':
      return {
        dot: '#60A5FA',
        label: 'Xanh Dương Storm Blue',
        headerBg: 'bg-gradient-to-br from-[#172A45] via-[#2B4E7E] to-[#4376BD]',
        glowBg: 'bg-[#BFDBFE]/30',
        borderHover: 'hover:border-[#2563EB]',
        imgFilter: 'saturate(1.15)'
      };
    case 'ip-13-promax':
      return {
        dot: '#7DD3FC',
        label: 'Xanh Dương Sierra Blue',
        headerBg: 'bg-gradient-to-br from-[#193042] via-[#2E5775] to-[#4882AD]',
        glowBg: 'bg-[#BAE6FD]/35',
        borderHover: 'hover:border-[#0284C7]',
        imgFilter: 'saturate(1.15)'
      };
    case 'ip-13':
      return {
        dot: '#F5F5F4',
        label: 'Trắng Ánh Sao Starlight',
        headerBg: 'bg-gradient-to-br from-[#383530] via-[#5E5950] to-[#8A8275]',
        glowBg: 'bg-[#FAF8F5]/35',
        borderHover: 'hover:border-[#78716C]',
        imgFilter: 'brightness(1.04)'
      };
    case 'ip-12-promax':
      return {
        dot: '#0369A1',
        label: 'Xanh Đại Dương Pacific',
        headerBg: 'bg-gradient-to-br from-[#0C2536] via-[#174666] to-[#246B99]',
        glowBg: 'bg-[#7DD3FC]/30',
        borderHover: 'hover:border-[#0369A1]',
        imgFilter: 'saturate(1.2)'
      };
    case 'ip-12':
      return {
        dot: '#DC2626',
        label: 'Đỏ Ruby Product RED',
        headerBg: 'bg-gradient-to-br from-[#3B0A0A] via-[#751414] to-[#B32020]',
        glowBg: 'bg-[#FCA5A5]/30',
        borderHover: 'hover:border-[#DC2626]',
        imgFilter: 'saturate(1.25)'
      };
    case 'ip-11-promax':
      return {
        dot: '#15803D',
        label: 'Xanh Rêu Midnight Green',
        headerBg: 'bg-gradient-to-br from-[#14291D] via-[#264F38] to-[#3B7855]',
        glowBg: 'bg-[#86EFAC]/25',
        borderHover: 'hover:border-[#15803D]',
        imgFilter: 'saturate(1.2)'
      };
    case 'ip-xs-max':
      return {
        dot: '#E09F7D',
        label: 'Đồng Ánh Hồng Rose Gold',
        headerBg: 'bg-gradient-to-br from-[#3B2219] via-[#6E4030] to-[#A36149]',
        glowBg: 'bg-[#FDBA74]/30',
        borderHover: 'hover:border-[#C2410C]',
        imgFilter: 'sepia(0.25) saturate(1.3)'
      };
    case 'ip-8-plus':
      return {
        dot: '#EAB308',
        label: 'Vàng Kim Lưng Kính',
        headerBg: 'bg-gradient-to-br from-[#362B14] via-[#665227] to-[#997B3B]',
        glowBg: 'bg-[#FEF08A]/30',
        borderHover: 'hover:border-[#CA8A04]',
        imgFilter: 'saturate(1.15)'
      };
    case 'ip-4s':
      return {
        dot: '#18181B',
        label: 'Đen Khung Thép Cổ Điển',
        headerBg: 'bg-gradient-to-br from-[#111113] via-[#27272A] to-[#45454D]',
        glowBg: 'bg-[#A1A1AA]/25',
        borderHover: 'hover:border-[#27272A]',
        imgFilter: 'contrast(1.08)'
      };
    case 'ip-18-ultra':
      return {
        dot: '#0284C7',
        label: 'Xanh Băng Hà Glacier Titan',
        headerBg: 'bg-gradient-to-br from-[#0C2536] via-[#1B4965] to-[#2C6E91]',
        glowBg: 'bg-[#38BDF8]/30',
        borderHover: 'hover:border-[#0284C7]',
        imgFilter: 'hue-rotate(175deg) saturate(1.28) brightness(0.98)'
      };
    case 'ip-18-promax-1tb':
      return {
        dot: '#5C4338',
        label: 'Cà Phê Mocha Titan',
        headerBg: 'bg-gradient-to-br from-[#231712] via-[#4A332A] to-[#6E4D40]',
        glowBg: 'bg-[#D97706]/25',
        borderHover: 'hover:border-[#78350F]',
        imgFilter: 'sepia(0.38) hue-rotate(-12deg) saturate(1.25) brightness(0.92)'
      };
    case 'ip-18-promax-512gb':
      return {
        dot: '#0284C7',
        label: 'Xanh Băng Hà Glacier Titan',
        headerBg: 'bg-gradient-to-br from-[#0E293B] via-[#1E5070] to-[#2F78A3]',
        glowBg: 'bg-[#7DD3FC]/30',
        borderHover: 'hover:border-[#0284C7]',
        imgFilter: 'hue-rotate(178deg) saturate(1.3) brightness(0.97)'
      };
    case 'ip-18-pro-512gb':
      return {
        dot: '#9F1239',
        label: 'Đỏ Rượu Vang Burgundy',
        headerBg: 'bg-gradient-to-br from-[#2E0912] via-[#661428] to-[#9E203E]',
        glowBg: 'bg-[#F43F5E]/30',
        borderHover: 'hover:border-[#9F1239]',
        imgFilter: 'hue-rotate(-28deg) saturate(1.4) brightness(0.9)'
      };
    case 'ip-18-plus':
      return {
        dot: '#1D4ED8',
        label: 'Xanh Lưu Ly Ultramarine',
        headerBg: 'bg-gradient-to-br from-[#0F1B3D] via-[#1E3675] to-[#3056B8]',
        glowBg: 'bg-[#60A5FA]/30',
        borderHover: 'hover:border-[#1D4ED8]',
        imgFilter: 'hue-rotate(195deg) saturate(1.32) brightness(0.96)'
      };
    case 'ip-18':
      return {
        dot: '#15803D',
        label: 'Xanh Matcha Sage',
        headerBg: 'bg-gradient-to-br from-[#142E24] via-[#245240] to-[#367A5F]',
        glowBg: 'bg-[#6EE7B7]/30',
        borderHover: 'hover:border-[#15803D]',
        imgFilter: 'hue-rotate(115deg) saturate(1.22) brightness(0.97)'
      };
    case 'ip-18e':
      return {
        dot: '#0D9488',
        label: 'Xanh Mòng Két Teal',
        headerBg: 'bg-gradient-to-br from-[#0D2E2B] via-[#1B5953] to-[#29857C]',
        glowBg: 'bg-[#5EEAD4]/30',
        borderHover: 'hover:border-[#0D9488]',
        imgFilter: 'hue-rotate(155deg) saturate(1.25) brightness(0.96)'
      };
    case 'ip-17-promax-1tb':
      return {
        dot: '#0F766E',
        label: 'Xanh Lá Trà Xanh Teal Titan',
        headerBg: 'bg-gradient-to-br from-[#0B2B28] via-[#175751] to-[#23827A]',
        glowBg: 'bg-[#2DD4BF]/30',
        borderHover: 'hover:border-[#0F766E]',
        imgFilter: 'hue-rotate(150deg) saturate(1.3) brightness(0.94)'
      };
    case 'ip-17-promax-512gb':
      return {
        dot: '#1D4ED8',
        label: 'Xanh Lam Cobalt Titan',
        headerBg: 'bg-gradient-to-br from-[#0C192E] via-[#1C3B6B] to-[#2C5FA6]',
        glowBg: 'bg-[#60A5FA]/30',
        borderHover: 'hover:border-[#1D4ED8]',
        imgFilter: 'hue-rotate(185deg) saturate(1.35) brightness(0.94)'
      };
    case 'ip-17-pro-512gb':
      return {
        dot: '#B45309',
        label: 'Vàng Đồng Amber Titan',
        headerBg: 'bg-gradient-to-br from-[#2B1B0E] via-[#59381C] to-[#8C582B]',
        glowBg: 'bg-[#FBBF24]/30',
        borderHover: 'hover:border-[#B45309]',
        imgFilter: 'sepia(0.28) saturate(1.3) brightness(0.96)'
      };
    case 'ip-17-plus':
      return {
        dot: '#EC4899',
        label: 'Hồng Mẫu Đơn Peony',
        headerBg: 'bg-gradient-to-br from-[#3B0F26] via-[#701D49] to-[#9D2B67]',
        glowBg: 'bg-[#F472B6]/30',
        borderHover: 'hover:border-[#DB2777]',
        imgFilter: 'hue-rotate(295deg) saturate(1.22) brightness(0.98)'
      };
    case 'ip-17e':
      return {
        dot: '#0284C7',
        label: 'Xanh Băng Giá Ice Blue',
        headerBg: 'bg-gradient-to-br from-[#0F2E3D] via-[#1D5670] to-[#3083A8]',
        glowBg: 'bg-[#7DD3FC]/35',
        borderHover: 'hover:border-[#0284C7]',
        imgFilter: 'hue-rotate(165deg) saturate(1.18) brightness(1.02)'
      };
    case 'ip-16-promax-1tb':
      return {
        dot: '#1E293B',
        label: 'Đen Không Gian Black Titan',
        headerBg: 'bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]',
        glowBg: 'bg-[#94A3B8]/25',
        borderHover: 'hover:border-[#334155]',
        imgFilter: 'grayscale(0.9) brightness(0.85) contrast(1.12)'
      };
    case 'ip-16-promax-512gb':
    case 'ip-16-pro-512gb':
      return {
        dot: '#94A3B8',
        label: 'Xám Tự Nhiên Natural Titan',
        headerBg: 'bg-gradient-to-br from-[#27272A] via-[#3F3F46] to-[#52525B]',
        glowBg: 'bg-[#E4E4E7]/25',
        borderHover: 'hover:border-[#52525B]',
        imgFilter: 'grayscale(0.75) brightness(0.98) contrast(1.06)'
      };
    case 'ip-16e':
      return {
        dot: '#0D9488',
        label: 'Xanh Mòng Két Teal',
        headerBg: 'bg-gradient-to-br from-[#0D2E2B] via-[#1B5953] to-[#29857C]',
        glowBg: 'bg-[#5EEAD4]/30',
        borderHover: 'hover:border-[#0D9488]',
        imgFilter: 'hue-rotate(155deg) saturate(1.22) brightness(0.98)'
      };
    case 'ip-15-promax-512gb':
    case 'ip-15-promax-1tb':
      return {
        dot: '#1E3A8A',
        label: 'Xanh Dương Blue Titanium',
        headerBg: 'bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB]',
        glowBg: 'bg-[#60A5FA]/30',
        borderHover: 'hover:border-[#1E3A8A]',
        imgFilter: 'hue-rotate(195deg) saturate(1.28) brightness(0.92)'
      };
    case 'ip-14-promax-512gb':
      return {
        dot: '#6D28D9',
        label: 'Tím Đậm Deep Purple',
        headerBg: 'bg-gradient-to-br from-[#24123E] via-[#462478] to-[#6838B0]',
        glowBg: 'bg-[#C4B5FD]/30',
        borderHover: 'hover:border-[#6D28D9]',
        imgFilter: 'hue-rotate(245deg) saturate(1.28) brightness(0.94)'
      };
    case 'ip-14-plus':
      return {
        dot: '#3B82F6',
        label: 'Xanh Dương Blue',
        headerBg: 'bg-gradient-to-br from-[#172554] via-[#1E40AF] to-[#3B82F6]',
        glowBg: 'bg-[#93C5FD]/30',
        borderHover: 'hover:border-[#2563EB]',
        imgFilter: 'hue-rotate(185deg) saturate(1.2) brightness(0.98)'
      };
    default:
      return {
        dot: '#C5A880',
        label: colorName ? colorName.replace(/\s*\(Mới\)/gi, '') : 'Vàng Gold Titan',
        headerBg: 'bg-gradient-to-br from-[#2B2218] via-[#5E4B34] to-[#9E8058]',
        glowBg: 'bg-[#E5C9A3]/35',
        borderHover: 'hover:border-[#8C6F46]',
        imgFilter: 'none'
      };
  }
};

const getSeriesBadge = (id: string) => {
  if (id.includes('ip-18')) return 'Flagship 2026';
  if (id.includes('ip-17-air')) return 'Siêu Mỏng 5.5mm';
  if (id.includes('ip-17')) return 'iPhone 17 Series';
  if (id.includes('ip-16')) return 'iPhone 16 Series';
  if (id.includes('ip-15')) return 'iPhone 15 Series';
  if (id.includes('ip-14') || id.includes('ip-13')) return 'Bán Chạy Nhất';
  return 'Sưu Tầm Zin 99%';
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const canonical = MOCK_PRODUCTS_LIST.find(
    m => String(m.id) === String(product?.id) || m.name === product?.name
  );

  const modelId = String(canonical?.id || product?.id || '');
  const displayPrice = Number(product?.price ?? product?.currentPrice ?? canonical?.price ?? 15990000);
  const displayOriginalPrice = Number(product?.originalPrice ?? canonical?.originalPrice ?? Math.round(displayPrice * 1.15));
  const displayDiscount = Number(
    product?.discountRate ?? canonical?.discountRate ?? (displayOriginalPrice > displayPrice ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100) : 0)
  );

  const displayImage =
    (canonical?.images && canonical.images[0]) ||
    (product?.images && product.images[0]) ||
    product?.image ||
    DEFAULT_IPHONE_IMG;

  const primaryColor =
    (canonical?.colors && canonical.colors[0]) ||
    (product?.colors && product.colors[0]) ||
    'Vàng Gold Titan';

  const displaySizes =
    (canonical?.sizes && canonical.sizes.length > 0)
      ? canonical.sizes
      : (product?.sizes && product.sizes.length > 0 ? product.sizes : ['128GB', '256GB']);

  const formatPrice = (price: number) => {
    const safePrice = Number.isFinite(price) && price > 0 ? price : 15990000;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safePrice);
  };

  const theme = getDynamicModelColorTheme(modelId, primaryColor);
  const seriesText = getSeriesBadge(modelId);

  return (
    <div 
      onClick={onClick}
      className={`bg-[#FAF7F2] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#B09E86] ${theme.borderHover} flex flex-col cursor-pointer group overflow-hidden relative`}
    >
      {/* Nền Studio Chuyển Màu Động theo đúng màu của mã máy (17 Pro Max Cam -> Nền Cam, 16 Pro Max Titan -> Nền Titan, 18 Pro Max Đỏ -> Nền Đỏ...) */}
      <div className={`relative w-full h-48 sm:h-52 ${theme.headerBg} flex items-center justify-center p-3.5 overflow-hidden border-b border-black/15 transition-all duration-500`}>
        {/* Quầng sáng Ambient Glow theo màu máy */}
        <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${theme.glowBg} blur-xl pointer-events-none transition-transform duration-500 group-hover:scale-125`} />

        {/* Khung Studio hiển thị thân máy với màu sắc riêng biệt */}
        <div className="w-full h-full bg-white/95 rounded-xl flex items-center justify-center p-2.5 shadow-md border border-white/40 relative overflow-hidden">
          <img 
            src={displayImage} 
            alt={product.name}
            style={{ filter: theme.imgFilter }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== DEFAULT_IPHONE_IMG) {
                target.src = DEFAULT_IPHONE_IMG;
              }
            }}
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 relative z-10"
          />
        </div>
        
        {/* Nhãn Series góc trái */}
        <div className="absolute top-2.5 left-2.5 z-20 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs bg-black/65 backdrop-blur-xs text-white border border-white/25">
          {seriesText}
        </div>

        {/* Nhãn giảm giá góc phải */}
        {displayDiscount > 0 && (
          <div className="absolute top-2.5 right-2.5 z-20 bg-[#9A3412] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs border border-white/20">
            -{displayDiscount}%
          </div>
        )}

        {/* Pill hiển thị MÀU ĐỘC BẢN của từng mã iPhone */}
        <div className="absolute bottom-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-xs border border-white/30 px-2.5 py-0.5 rounded-full shadow-md">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/70 shrink-0"
            style={{ backgroundColor: theme.dot }}
          />
          <span className="text-[10px] font-bold text-white truncate max-w-[140px]">
            {theme.label}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-grow justify-between bg-[#FAF7F2]">
        <div>
          <h3 className="text-xs sm:text-sm text-[#241F1A] font-bold line-clamp-2 mb-1.5 group-hover:text-[#7D623C] transition-colors leading-snug">
            {product.name}
          </h3>
          
          {/* Dung lượng hỗ trợ */}
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {displaySizes.slice(0, 3).map((sz: string, idx: number) => (
              <span key={idx} className="text-[10px] text-[#54483B] bg-[#EFE9DF] border border-[#D5C7B4] px-1.5 py-0.5 rounded font-semibold">
                {sz}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Giá bán */}
          <div className="flex items-baseline flex-wrap gap-1.5 mt-1">
            <span className="text-[#9A3412] font-black text-sm sm:text-base">
              {formatPrice(displayPrice)}
            </span>
            {displayOriginalPrice > displayPrice && (
              <span className="text-[#8C7E6E] text-[11px] line-through">
                {formatPrice(displayOriginalPrice)}
              </span>
            )}
          </div>

          {/* Đánh giá & Lượt bán */}
          <div className="flex items-center justify-between mt-2 text-[11px] text-[#6E6050] pt-2 border-t border-[#E6DEC8]">
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-[#B89768] text-[#B89768]" />
              <span className="font-bold text-[#362F27]">{product.rating || 4.9}</span>
            </div>
            <span>Đã bán {(product.soldCount || 350) > 1000 ? `${((product.soldCount || 350)/1000).toFixed(1)}k` : (product.soldCount || 350)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
