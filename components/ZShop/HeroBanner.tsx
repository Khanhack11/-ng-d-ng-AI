import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Smartphone } from 'lucide-react';

const BANNERS = [
  {
    id: 'ip-17-promax',
    shortTab: '17 Pro Max • Cam Vũ Trụ',
    colorDot: '#EA580C',
    badge: 'HOT NHẤT • MÀU CAM SA MẠC VŨ TRỤ',
    title: 'iPhone 17 Pro Max 256GB',
    subtitle: '3 Camera 48MP ProRAW • Màn hình 6.9" 120Hz • Cam Sa Mạc Vũ Trụ',
    priceText: 'Ưu đãi chỉ còn 31.990.000đ • Trả góp 0%',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3_1.jpg',
    imgFilter: 'saturate(1.15) contrast(1.04)',
    wrapperBg: 'bg-gradient-to-r from-[#6E3419] via-[#8F4724] to-[#5E2B14]',
    cardBg: 'bg-gradient-to-r from-[#3D1608] via-[#7C2F12] to-[#C85322]',
    orbColor: 'bg-[#FF6B2B]/35',
    badgeClass: 'bg-[#EA580C]/30 border-[#FDBA74]/60 text-[#FFEDD5]',
    ctaClass: 'bg-gradient-to-r from-[#FB923C] to-[#EA580C] text-white',
    frameBorder: 'border-[#FB923C]/70 bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFEDD5]'
  },
  {
    id: 'ip-16-promax',
    shortTab: '16 Pro Max • Vàng Gold Titan',
    colorDot: '#C5A880',
    badge: 'BEST SELLER • VÀNG GOLD TITAN SA MẠC',
    title: 'iPhone 16 Pro Max 256GB',
    subtitle: 'Khung Titan Cấp 5 • Nút Camera Control • Vàng Gold Titan Sa Mạc',
    priceText: 'Giá tốt nhất 28.990.000đ • Bảo hành 12 tháng',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
    imgFilter: 'sepia(0.18) saturate(1.25) brightness(1.02)',
    wrapperBg: 'bg-gradient-to-r from-[#8A765B] via-[#A69174] to-[#78654C]',
    cardBg: 'bg-gradient-to-r from-[#2B2318] via-[#594732] to-[#9A7D56]',
    orbColor: 'bg-[#E5C9A3]/30',
    badgeClass: 'bg-[#D4B996]/25 border-[#E5C9A3]/60 text-[#FAF5EE]',
    ctaClass: 'bg-gradient-to-r from-[#DFC39D] to-[#B89768] text-[#1C1915]',
    frameBorder: 'border-[#D4B996]/80 bg-gradient-to-br from-[#FAF6F0] via-white to-[#F2E8D9]'
  },
  {
    id: 'ip-18-promax',
    shortTab: '18 Pro Max • Đỏ Burgundy Titan',
    colorDot: '#9F1239',
    badge: 'FLAGSHIP 2026 • ĐỎ RƯỢU VANG BURGUNDY & XANH GLACIER TITAN',
    title: 'iPhone 18 Pro Max 256GB',
    subtitle: 'Chip A20 Pro 2nm • Đỏ Rượu Vang Burgundy & Xanh Băng Hà • Zoom 10x',
    priceText: 'Chỉ từ 38.990.000đ • Sẵn hàng giao ngay 2h',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg',
    imgFilter: 'hue-rotate(-28deg) saturate(1.42) brightness(0.9) contrast(1.06)',
    wrapperBg: 'bg-gradient-to-r from-[#591826] via-[#782134] to-[#4A121E]',
    cardBg: 'bg-gradient-to-r from-[#2B0911] via-[#5E1526] to-[#96213C]',
    orbColor: 'bg-[#F43F5E]/30',
    badgeClass: 'bg-[#BE123C]/35 border-[#FDA4AF]/60 text-[#FFE4E6]',
    ctaClass: 'bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white',
    frameBorder: 'border-[#FDA4AF]/70 bg-gradient-to-br from-[#FFF1F2] via-white to-[#FFE4E6]'
  },
  {
    id: 'ip-17-pro',
    shortTab: '17 Pro • Xanh Cobalt Titan',
    colorDot: '#1D4ED8',
    badge: 'PRO COMPACT • XANH LAM COBALT TITAN',
    title: 'iPhone 17 Pro 256GB VN/A',
    subtitle: 'Màn hình 6.3" 120Hz • Chip A19 Pro • Xanh Lam Cobalt Không Trùng Màu',
    priceText: 'Ưu đãi 27.990.000đ • Thu cũ lên đời trợ giá 3Tr',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb_2_1_1.png',
    imgFilter: 'hue-rotate(185deg) saturate(1.35) brightness(0.94)',
    wrapperBg: 'bg-gradient-to-r from-[#1E3A5F] via-[#284E7D] to-[#18304F]',
    cardBg: 'bg-gradient-to-r from-[#0C192C] via-[#1B3963] to-[#2B5C9E]',
    orbColor: 'bg-[#38BDF8]/30',
    badgeClass: 'bg-[#1D4ED8]/35 border-[#93C5FD]/60 text-[#E0F2FE]',
    ctaClass: 'bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white',
    frameBorder: 'border-[#93C5FD]/70 bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE]'
  }
];

const HeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? BANNERS.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
  };

  const handleQuickFilter = (keyword: string) => {
    window.dispatchEvent(new CustomEvent('zshop:search', { detail: { keyword } }));
    const el = document.getElementById('all-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeBanner = BANNERS[currentIndex];

  return (
    <div className={`${activeBanner.wrapperBg} pt-4 pb-3.5 border-b border-white/15 transition-colors duration-700`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Dynamic Color-Sync Banner — Tự động chuyển nền theo đúng màu máy đang hiển thị */}
          <div
            onClick={() => handleQuickFilter(activeBanner.title.split(' ').slice(0, 3).join(' '))}
            className={`lg:col-span-2 relative h-48 sm:h-52 rounded-2xl overflow-hidden group cursor-pointer shadow-xl border border-white/25 transition-all duration-700 ${activeBanner.cardBg}`}
          >
            {/* Hiệu ứng quầng sáng Ambient Glow đồng bộ theo màu máy */}
            <div className={`absolute -top-16 -right-12 w-64 h-64 rounded-full ${activeBanner.orbColor} blur-3xl pointer-events-none transition-all duration-700`} />
            <div className={`absolute -bottom-16 left-1/3 w-56 h-56 rounded-full ${activeBanner.orbColor} blur-2xl pointer-events-none transition-all duration-700`} />

            <div className="relative z-10 h-full px-6 sm:px-8 pb-7 flex items-center justify-between gap-4">
              <div className="max-w-md space-y-2 text-white">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-xs transition-all duration-500 ${activeBanner.badgeClass}`}>
                  <Sparkles size={11} />
                  {activeBanner.badge}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
                  {activeBanner.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-1">
                  {activeBanner.subtitle}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className={`inline-block text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md transition-all duration-500 ${activeBanner.ctaClass}`}>
                    {activeBanner.priceText}
                  </span>
                </div>
              </div>

              {/* Khung ảnh máy iPhone đồng bộ màu sắc riêng biệt */}
              <div className={`shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-2 shadow-xl border-2 flex items-center justify-center transition-all duration-700 ${activeBanner.frameBorder}`}>
                <img
                  src={activeBanner.image}
                  alt={activeBanner.title}
                  style={{ filter: activeBanner.imgFilter }}
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-108"
                />
              </div>
            </div>

            {/* Nút điều hướng Slide */}
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 bg-black/45 hover:bg-black/70 text-white rounded-full items-center justify-center transition z-20"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 bg-black/45 hover:bg-black/70 text-white rounded-full items-center justify-center transition z-20"
            >
              <ChevronRight size={18} />
            </button>

            {/* Thanh chọn nhanh Màu Mã Máy ngay trên Banner (Chuyển màu nền tức thì) */}
            <div className="absolute bottom-2 left-4 right-4 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {BANNERS.map((b, index) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                    currentIndex === index
                      ? 'bg-white text-stone-900 shadow-md scale-105'
                      : 'bg-black/35 text-white/85 hover:bg-black/55 border border-white/15'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: b.colorDot }}
                  />
                  <span>{b.shortTab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2 Thẻ phụ bên phải — Đồng bộ hiệu ứng màu riêng cho iPhone 17 Air (Xanh Băng) & iPhone 8 Plus (Vàng Kim) */}
          <div className="hidden lg:flex flex-col gap-3 h-52">
            <div
              onClick={() => handleQuickFilter('iPhone 17 Air')}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#0E2A38] via-[#16425B] to-[#226487] border border-cyan-300/35 px-4 py-2.5 flex items-center justify-between cursor-pointer hover:brightness-110 transition group shadow-md text-white"
            >
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-200">
                  <Smartphone size={11} /> Siêu Mỏng 5.5mm • Xanh Băng Giá
                </span>
                <h3 className="text-sm font-black text-white">
                  iPhone 17 Air 256GB VN/A
                </h3>
                <p className="text-[11px] text-cyan-100/90 font-medium">Chỉ 24.990.000đ • Nhẹ 145g</p>
              </div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2_1_2.jpg"
                alt="iPhone 17 Air"
                className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-cyan-200 shrink-0 group-hover:scale-105 transition-transform"
              />
            </div>

            <div
              onClick={() => handleQuickFilter('iPhone 8 Plus')}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#362919] via-[#5E472B] to-[#8C6B42] border border-amber-200/35 px-4 py-2.5 flex items-center justify-between cursor-pointer hover:brightness-110 transition group shadow-md text-white"
            >
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                  <ShieldCheck size={11} /> Kệ Sưu Tầm Zin • Vàng Kim Kính
                </span>
                <h3 className="text-sm font-black text-white">
                  iPhone 4s ➔ 8 Plus & XS Max
                </h3>
                <p className="text-[11px] text-amber-100/90 font-medium">Từ 990.000đ • Bao test 1 đổi 1</p>
              </div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/8/-/8-plus-gold_27.jpg"
                alt="iPhone 8 Plus"
                className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-amber-200 shrink-0 group-hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
