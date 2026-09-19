import React, { useState, useEffect } from 'react';
import { ShoppingBag, Box, ShieldCheck, Zap, ArrowUpRight, Store, LayoutDashboard, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface Navbar3DProps {
  onEnterStore: () => void;
  onOpenCart: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  onLogin?: () => void;
  onLogout?: () => void;
  onGoToAdmin?: () => void;
  onOpenSellerChannel?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

const Navbar3D: React.FC<Navbar3DProps> = ({
  onEnterStore,
  onOpenCart,
  cartItemCount = 0,
  userRole,
  onLogin,
  onLogout,
  onGoToAdmin,
  onOpenSellerChannel,
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'py-5 bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all">
            <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-wider text-white">ZSHOP</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300">
                3D Spatial
              </span>
            </div>
            <span className="text-[10px] text-gray-400 tracking-wider font-mono">NEXT-GEN PAYMENT ENGINE</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5"
          >
            Tổng Quan
          </button>
          <button
            onClick={() => scrollToSection('bento-section')}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5"
          >
            Tính Năng 3D
          </button>
          <button
            onClick={() => scrollToSection('payment-simulator')}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            Mô Phỏng Cổng
          </button>
          <button
            onClick={() => scrollToSection('security-section')}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5 flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Bảo Mật
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Audio Ambience Toggle */}
          {onToggleAudio && (
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border transition-all ${
                isAudioPlaying
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title={isAudioPlaying ? 'Tắt âm thanh không gian' : 'Bật âm thanh không gian'}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {/* Cart Button with Counter */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/40 transition-all group"
            title="Giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-gradient-to-r from-pink-500 to-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Admin / Seller shortcuts if applicable */}
          {userRole === UserRole.ADMIN && onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin
            </button>
          )}

          {onOpenSellerChannel && (
            <button
              onClick={onOpenSellerChannel}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              Kênh Bán
            </button>
          )}

          {/* Primary CTA: Switch to E-commerce Storefront */}
          <button
            onClick={onEnterStore}
            className="relative group px-4 py-2 rounded-xl font-semibold text-xs text-white overflow-hidden shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Vào Cửa Hàng</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar3D;
