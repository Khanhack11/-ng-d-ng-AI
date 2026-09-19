import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, Eye, Activity, Cpu } from 'lucide-react';
import { ModelType } from './ThreeScene';

interface Hero3DProps {
  onEnterStore: () => void;
  onExplorePayment: () => void;
  activeModel: ModelType;
  onChangeModel: (model: ModelType) => void;
  isWireframe: boolean;
  onToggleWireframe: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
}

const Hero3D: React.FC<Hero3DProps> = ({
  onEnterStore,
  onExplorePayment,
  activeModel,
  onChangeModel,
  isWireframe,
  onToggleWireframe,
  speedMultiplier,
  onChangeSpeed,
}) => {
  return (
    <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 z-10">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-fuchsia-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* MotionSites Spec Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.2)] mb-8 hover:border-cyan-400/60 transition-all cursor-default animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wide text-cyan-200">
            MOTIONSITES SPATIAL ENGINE • CÔNG NGHỆ 3D & THANH TOÁN LƯỢNG TỬ
          </span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white max-w-4xl mb-6">
          Trải Nghiệm Mua Sắm &amp;{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            Thanh Toán Không Gian 3D
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-300/80 font-light max-w-2xl mb-10 leading-relaxed">
          Nâng tầm thương mại điện tử với kiến trúc đồ họa WebGL tương tác cao, tốc độ xử lý giao dịch siêu tốc{' '}
          <span className="text-cyan-400 font-medium">0.02s</span> và két bảo mật chuẩn mã hóa ngân hàng.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
          <button
            onClick={onEnterStore}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_45px_rgba(59,130,246,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Khám Phá Cửa Hàng Ngay</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExplorePayment}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-gray-200 bg-white/[0.05] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.09] backdrop-blur-lg hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Mô Phỏng Cổng Thanh Toán</span>
          </button>
        </div>

        {/* 3D Model Control HUD Toolbar */}
        <div className="w-full max-w-2xl p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Model Switcher */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-gray-400 font-mono text-[11px] mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Mô hình:
            </span>
            <button
              onClick={() => onChangeModel('core')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeModel === 'core'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-gray-400 hover:text-gray-200 bg-white/5'
              }`}
            >
              Lõi Lượng Tử
            </button>
            <button
              onClick={() => onChangeModel('torus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeModel === 'torus'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'text-gray-400 hover:text-gray-200 bg-white/5'
              }`}
            >
              Vòng Torus
            </button>
            <button
              onClick={() => onChangeModel('sphere')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeModel === 'sphere'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-gray-400 hover:text-gray-200 bg-white/5'
              }`}
            >
              Hologram
            </button>
            <button
              onClick={() => onChangeModel('lattice')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeModel === 'lattice'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-gray-400 hover:text-gray-200 bg-white/5'
              }`}
            >
              Ma Trận
            </button>
          </div>

          {/* Wireframe & Speed Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
            <button
              onClick={onToggleWireframe}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                isWireframe
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  : 'text-gray-400 hover:text-gray-200 bg-white/5'
              }`}
              title="Bật/Tắt chế độ khung dây neon"
            >
              <Eye className="w-3 h-3" />
              <span>{isWireframe ? 'Wireframe Bật' : 'Khối Đặc'}</span>
            </button>

            <button
              onClick={() => onChangeSpeed(speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 0.5 : 1)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-all"
              title="Thay đổi tốc độ quay 3D"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>{speedMultiplier}x Tốc Độ</span>
            </button>
          </div>
        </div>

        {/* Real-time Metric Pill Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center gap-1 text-cyan-400 text-lg font-bold font-mono">
              <Zap className="w-4 h-4" />
              <span>0.02 Giây</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-0.5">Khớp lệnh thanh toán</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-400 text-lg font-bold font-mono">
              <Activity className="w-4 h-4" />
              <span>99.99%</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-0.5">Độ sẵn sàng hệ thống</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center gap-1 text-purple-400 text-lg font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>AES-256</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-0.5">Mã hóa đa tầng</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center gap-1 text-pink-400 text-lg font-bold font-mono">
              <Cpu className="w-4 h-4" />
              <span>WebGL 2.0</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-0.5">GPU gia tốc phần cứng</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
