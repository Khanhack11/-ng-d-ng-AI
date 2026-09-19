import React from 'react';
import { Box, ShieldCheck, Zap, ArrowUp, Github, Sparkles, CheckCircle2 } from 'lucide-react';

interface Footer3DProps {
  onEnterStore: () => void;
  onGoToAdmin?: () => void;
  onOpenSellerChannel?: () => void;
}

const Footer3D: React.FC<Footer3DProps> = ({
  onEnterStore,
  onGoToAdmin,
  onOpenSellerChannel,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="security-section" className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/90 backdrop-blur-2xl z-10 overflow-hidden">
      {/* Ground Neon Glow Bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_#06b6d4]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
                  <Box className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-wider text-white">ZSHOP 3D</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              Nền tảng thương mại điện tử không gian thế hệ mới kết hợp đồ họa Three.js WebGL và cổng thanh toán lượng tử siêu tốc 0.02s.
            </p>

            {/* Live System Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All 24 Nodes Operational • 12ms Latency</span>
            </div>
          </div>

          {/* Col 2: Hệ Sinh Thái */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold mb-4">
              Hệ Sinh Thái
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={onEnterStore} className="hover:text-cyan-400 transition-colors">
                  Cửa Hàng Shopee / ZShop
                </button>
              </li>
              <li>
                <button onClick={onOpenSellerChannel} className="hover:text-cyan-400 transition-colors">
                  Kênh Người Bán
                </button>
              </li>
              <li>
                <button onClick={onGoToAdmin} className="hover:text-cyan-400 transition-colors">
                  Bảng Quản Trị Admin
                </button>
              </li>
              <li>
                <span className="text-gray-500">Trình Xem 3D Không Gian</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Cổng Thanh Toán */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold mb-4">
              Cổng Thanh Toán
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-mono">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> VietQR Napas 247
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> Ví Điện Tử MoMo
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> ZaloPay Gateway
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Thẻ Quốc Tế Visa/Master
              </li>
            </ul>
          </div>

          {/* Col 4: Công Nghệ & Tiêu Chuẩn */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold mb-4">
              Công Nghệ
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> MotionSites Prompt Spec
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" /> Three.js WebGL Engine
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Mã Hóa AES-256
              </li>
              <li className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-emerald-400" /> React 19 + Vite 6
              </li>
            </ul>
          </div>
        </div>

        {/* Large Decorative Wordmark */}
        <div className="border-t border-white/5 pt-10 pb-6 text-center select-none overflow-hidden">
          <span className="text-4xl sm:text-7xl lg:text-9xl font-black tracking-tighter bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent block">
            ZSHOP SPATIAL
          </span>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
          <div>
            © 2026 ZShop Vietnam. All Rights Reserved. Built with MotionSites 3D Prompts Collection.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1"
              title="Lên đầu trang"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Đầu trang</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer3D;
