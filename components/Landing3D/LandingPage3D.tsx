import React from 'react';
import { 
  ShoppingBag, ShieldCheck, Truck, Zap, ArrowRight, 
  CheckCircle2, Star, Sparkles, CreditCard, Headphones, 
  ChevronRight, Lock
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPage3DProps {
  onEnterStore: () => void;
  onProductClick: (id: string) => void;
  onOpenCart: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  onLogin?: () => void;
  onLogout?: () => void;
  onGoToAdmin?: () => void;
  onOpenSellerChannel?: () => void;
}

const LandingPage3D: React.FC<LandingPage3DProps> = ({
  onEnterStore,
  onProductClick,
  onOpenCart,
  cartItemCount = 0,
  userRole,
  onLogin,
  onLogout,
  onGoToAdmin,
  onOpenSellerChannel,
}) => {
  const featuredProducts = [
    {
      id: "DIOR-TSHIRT-001",
      name: "Áo Thun Cotton Compact Cao Cấp",
      price: 289000,
      originalPrice: 389000,
      image: "/Image-Product/Áo polo Nam.jpg",
      rating: 4.9,
      sold: 1420
    },
    {
      id: "SP-SNEAKER-002",
      name: "Giày Thể Thao Sneaker Nam Nữ",
      price: 450000,
      originalPrice: 620000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      rating: 4.8,
      sold: 890
    },
    {
      id: "SP-HOODIE-003",
      name: "Áo Hoodie Form Rộng Nỉ Bông",
      price: 320000,
      originalPrice: 420000,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
      rating: 4.9,
      sold: 2150
    },
    {
      id: "SP-WATCH-004",
      name: "Đồng Hồ Nam Dây Da Tối Giản",
      price: 699000,
      originalPrice: 950000,
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      rating: 5.0,
      sold: 630
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* 1. Top Static Navigation Bar (Sky Blue + White) */}
      <header className="sticky top-0 z-50 bg-white border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={onEnterStore}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-600/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-sky-700">ZS-ECONOMY</span>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider -mt-1">E-Commerce Store</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={onEnterStore} className="hover:text-sky-600 transition-colors">Trang Chủ</button>
            <button onClick={onEnterStore} className="hover:text-sky-600 transition-colors">Sản Phẩm</button>
            <button onClick={onEnterStore} className="hover:text-sky-600 transition-colors">Flash Sale</button>
            <button onClick={onEnterStore} className="hover:text-sky-600 transition-colors">Ưu Đãi 0Đ</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {userRole === 'SELLER' && (
              <button 
                onClick={onOpenSellerChannel}
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
              >
                Kênh Người Bán
              </button>
            )}
            {userRole === UserRole.ADMIN && (
              <button 
                onClick={onGoToAdmin}
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Admin
              </button>
            )}
            <button
              onClick={onEnterStore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition-all"
            >
              <span>Vào Cửa Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Clean Sky Blue + White Static Banner) */}
      <section className="bg-gradient-to-b from-sky-100/60 via-sky-50/40 to-slate-50 py-16 sm:py-20 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 shadow-sm text-sky-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>NỀN TẢNG MUA SẮM TRỰC TUYẾN CHÍNH HÃNG</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Mua Sắm Dễ Dàng, <br />
                <span className="text-sky-600">Thanh Toán An Toàn</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Trải nghiệm mua sắm trực tuyến chuẩn mực với hàng ngàn sản phẩm chọn lọc, chính sách miễn phí vận chuyển toàn quốc và cổng thanh toán bảo mật đa kênh.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onEnterStore}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Khám Phá Cửa Hàng Ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onEnterStore}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 font-bold text-base transition-colors shadow-sm"
                >
                  Xem Sản Phẩm Bán Chạy
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>100% Hàng chính hãng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Miễn phí đổi trả 7 ngày</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Static Visual Banner */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 relative">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm">Ưu đãi hôm nay</span>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Flash Sale 50%
                  </span>
                </div>

                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100 relative group cursor-pointer" onClick={onEnterStore}>
                  <img 
                    src="/Image-Product/Áo polo Nam.jpg" 
                    alt="Sản phẩm nổi bật"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-3 left-3 bg-sky-600 text-white font-bold text-xs px-2 py-1 rounded">
                    Bán Chạy Nhất
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">Bộ Sưu Tập Thời Trang Xu Hướng 2026</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    Chất liệu cotton cao cấp thoáng mát, thiết kế phom dáng hiện đại phù hợp mọi phong cách.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-2">389.000₫</span>
                      <span className="text-lg font-extrabold text-sky-700">289.000₫</span>
                    </div>
                    <button 
                      onClick={onEnterStore}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Mua Ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 Static Feature Pillars */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-slate-500 mt-1">Miễn phí vận chuyển cho đơn hàng từ 0Đ, nhận hàng siêu tốc.</p>
              </div>
            </div>

            <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Thanh Toán Linh Hoạt</h4>
                <p className="text-xs text-slate-500 mt-1">Hỗ trợ mã QR, VNPAY, chuyển khoản hoặc trả tiền mặt COD.</p>
              </div>
            </div>

            <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Bảo Đảm Chất Lượng</h4>
                <p className="text-xs text-slate-500 mt-1">Cam kết 100% hàng chuẩn chất lượng, đổi trả thuận tiện.</p>
              </div>
            </div>

            <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/30">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hỗ Trợ Tận Tâm 24/7</h4>
                <p className="text-xs text-slate-500 mt-1">Trợ lý AI và đội ngũ CSKH luôn sẵn sàng giải đáp thắc mắc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Static Grid in Sky Blue + White) */}
      <section className="py-16 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sản Phẩm Được Mua Nhiều Nhất</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Các sản phẩm thịnh hành được đánh giá 5 sao từ khách hàng</p>
            </div>
            <button
              onClick={onEnterStore}
              className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (onProductClick) {
                    onProductClick(p.id);
                  } else {
                    onEnterStore();
                  }
                }}
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-400 transition-all cursor-pointer overflow-hidden flex flex-col group"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[10px] px-1.5 py-0.5 rounded">
                    Giảm 25%
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 min-h-[40px] group-hover:text-sky-600 transition-colors">
                    {p.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{p.rating}</span>
                    <span className="text-slate-400 font-normal">({p.sold} đã bán)</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 line-through block">
                        ₫{p.originalPrice.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-base font-black text-sky-700">
                        ₫{p.price.toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterStore();
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Card */}
          <div className="mt-12 bg-sky-600 text-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-sky-600/20 text-center flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">Sẵn Sàng Mua Sắm Cùng ZS-Economy?</h3>
            <p className="text-sm sm:text-base text-sky-100 max-w-xl mb-6">
              Hàng ngàn mã giảm giá và ưu đãi vận chuyển 0Đ đang chờ đón bạn trong cửa hàng.
            </p>
            <button
              onClick={onEnterStore}
              className="px-8 py-4 bg-white hover:bg-sky-50 text-sky-700 font-bold text-base rounded-xl shadow-md transition-all active:scale-98"
            >
              Truy Cập Cửa Hàng Ngay
            </button>
          </div>
        </div>
      </section>

      {/* 5. Static Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 ZS-Economy. Nền tảng thương mại điện tử uy tín & an toàn.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage3D;
