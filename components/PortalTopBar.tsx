import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Store, Headset, ShoppingBag, 
  BarChart3, Sparkles, Package, Boxes, RotateCcw, 
  Settings, Users, Truck, ChevronDown, LogOut, 
  ExternalLink, RefreshCw, Smartphone, CreditCard
} from 'lucide-react';
import { UserRole } from '../types';

export type PortalWorkspace = 'BUYER' | 'ADMIN' | 'CSKH' | 'WAREHOUSE';

export interface PortalTopBarProps {
  userRole?: string;
  currentUser?: { name?: string; email?: string; role?: string } | null;
  pendingReturnsCount?: number;
  pendingSellersCount?: number;
  currentWorkspace?: PortalWorkspace;
  onSwitchWorkspace?: (workspace: PortalWorkspace) => void;
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
  onNavigateSeller?: (tab?: 'overview' | 'products' | 'orders' | 'profile') => void;
  onNavigateWarehouse?: () => void;
  onNavigateHome?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const PortalTopBar: React.FC<PortalTopBarProps> = ({
  userRole = 'CUSTOMER',
  currentUser,
  pendingReturnsCount = 0,
  onNavigateAdminTab,
  onNavigateCSKH,
  onNavigateWarehouse,
  onNavigateHome,
  onSwitchRole,
  onLogout
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ẩn thanh điều hành nội bộ khi là Khách hàng hoặc Khách vãng lai
  if (userRole === 'CUSTOMER' || userRole === 'GUEST') {
    return null;
  }

  // Dropdown chuyển nhanh 4 tác nhân chuẩn của Shop nhỏ Thế Giới iPhone
  const renderRoleSwitcherDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2e2a24] hover:bg-[#3d372e] text-[#e5c9a3] border border-[#c5a880]/40 transition-all cursor-pointer font-bold text-[11px]"
      >
        <RefreshCw size={12} className="text-[#d4b996]" />
        <span className="hidden sm:inline">Đổi Tác Nhân (4 Vai Trò Shop)</span>
        <ChevronDown size={12} />
      </button>

      {isRoleDropdownOpen && (
        <div className="absolute right-0 mt-1.5 w-72 bg-[#1e1d1a] border border-[#c5a880]/40 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-fade-in space-y-1">
          <div className="px-2.5 py-1.5 text-[10px] font-black text-[#d4b996] uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
            <span>4 Tác Nhân Thế Giới iPhone</span>
            <span className="bg-[#d4b996]/20 text-[#e5c9a3] px-1.5 py-0.5 rounded">Boutique UML</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsRoleDropdownOpen(false);
              onSwitchRole?.(UserRole.ADMIN);
            }}
            className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
              userRole === 'ADMIN' ? 'bg-[#d4b996]/20 text-[#e5c9a3] border border-[#d4b996]/40' : 'hover:bg-white/5 text-stone-200'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck size={15} />
            </div>
            <div>
              <div className="font-bold text-white">1. Admin (Chủ cửa hàng)</div>
              <div className="text-[10px] text-stone-400">Doanh thu, Giá iPhone, Nhân sự, AI Điều hành</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRoleDropdownOpen(false);
              onSwitchRole?.(UserRole.SALES);
            }}
            className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
              userRole === 'SALES' ? 'bg-[#d4b996]/20 text-[#e5c9a3] border border-[#d4b996]/40' : 'hover:bg-white/5 text-stone-200'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
              <CreditCard size={15} />
            </div>
            <div>
              <div className="font-bold text-white">2. Nhân viên Bán hàng</div>
              <div className="text-[10px] text-stone-400">Thu ngân POS tại quầy, CRM VIP, Đổi trả 1-1</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRoleDropdownOpen(false);
              onSwitchRole?.(UserRole.WAREHOUSE);
            }}
            className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
              userRole === 'WAREHOUSE' ? 'bg-[#d4b996]/20 text-[#e5c9a3] border border-[#d4b996]/40' : 'hover:bg-white/5 text-stone-200'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Boxes size={15} />
            </div>
            <div>
              <div className="font-bold text-white">3. Nhân viên Kho</div>
              <div className="text-[10px] text-stone-400">Nhập lô VN/A, Tồn kho 25 mã máy, AI Kho</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRoleDropdownOpen(false);
              onSwitchRole?.(UserRole.CUSTOMER);
              onNavigateHome?.();
            }}
            className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 text-stone-200 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
              <ShoppingBag size={15} />
            </div>
            <div>
              <div className="font-bold text-white">4. Khách hàng (Mua sắm)</div>
              <div className="text-[10px] text-stone-400">Giao diện Showroom iPhone & Tư vấn AI</div>
            </div>
          </button>

          <div className="border-t border-white/10 pt-1.5 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsRoleDropdownOpen(false);
                onLogout?.();
              }}
              className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 font-semibold cursor-pointer"
            >
              <LogOut size={13} />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // =========================================================
  // 1. THANH ĐIỀU HÀNH CHỦ CỬA HÀNG (ADMIN)
  // =========================================================
  if (userRole === 'ADMIN') {
    return (
      <div className="bg-[#171614] text-stone-100 border-b border-[#c5a880]/40 sticky top-0 z-[60] shadow-xl text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#b89768] to-[#8c6f46] rounded-lg text-[#171614] font-black text-xs tracking-wide shadow-sm">
              <ShieldCheck size={14} />
              <span>CHỦ CỬA HÀNG • THẾ GIỚI IPHONE</span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap overflow-x-auto py-0.5">
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('DASHBOARD')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 transition-all font-semibold cursor-pointer"
            >
              <BarChart3 size={13} className="text-emerald-400" />
              <span>Doanh Thu Shop</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('AI_BI')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#332c22] hover:bg-[#42392b] text-[#e5c9a3] border border-[#c5a880]/40 transition-all font-bold cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>AI Điều Hành (UC09)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('PRODUCTS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 transition-all font-semibold cursor-pointer"
            >
              <Smartphone size={13} className="text-sky-400" />
              <span>25 Mã iPhone</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('ORDERS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 transition-all font-semibold cursor-pointer"
            >
              <Truck size={13} className="text-indigo-400" />
              <span>Đơn Đặt Máy</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('SELLERS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 transition-all font-semibold cursor-pointer"
            >
              <Users size={13} className="text-amber-400" />
              <span>Nhân Sự Shop</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateWarehouse?.()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 transition-all font-semibold cursor-pointer"
            >
              <Boxes size={13} className="text-amber-400" />
              <span>Kho iPhone</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateCSKH?.('POS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 transition-all font-semibold cursor-pointer"
            >
              <Headset size={13} className="text-rose-400" />
              <span>Quầy POS & CSKH</span>
              {pendingReturnsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingReturnsCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateHome?.()}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#262420] hover:bg-[#36322b] text-stone-200 rounded-lg font-semibold border border-white/10 transition-all cursor-pointer"
            >
              <Store size={12} className="text-[#d4b996]" />
              <span className="hidden md:inline">Xem Showroom</span>
            </button>
            {renderRoleSwitcherDropdown()}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 2. THANH ĐIỀU HÀNH NHÂN VIÊN BÁN HÀNG (SALES / POS / CSKH)
  // =========================================================
  if (userRole === 'SALES' || userRole === 'SUPPORT') {
    return (
      <div className="bg-[#171614] text-stone-100 border-b border-[#c5a880]/40 sticky top-0 z-[60] shadow-lg text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#b89768] to-[#8c6f46] text-[#171614] rounded-lg font-black text-xs flex items-center gap-1.5 shadow-sm">
              <CreditCard size={14} />
              <span>NHÂN VIÊN BÁN HÀNG • THẾ GIỚI IPHONE</span>
            </span>
            <span className="text-stone-400 text-xs hidden sm:inline">
              Ca trực: <strong className="text-[#e5c9a3]">{currentUser?.name || 'Nguyễn Thu Ngân (POS & CSKH)'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('POS')}
              className="px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-[#e5c9a3] border border-[#c5a880]/30 font-bold cursor-pointer flex items-center gap-1"
            >
              <CreditCard size={12} />
              <span>Thu Ngân POS (UC04)</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('CUSTOMERS')}
              className="px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 font-medium cursor-pointer"
            >
              Khách VIP CRM (UC03)
            </button>
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('RETURNS')}
              className="px-2.5 py-1 rounded-md bg-[#262420] hover:bg-[#36322b] text-stone-200 hover:text-[#e5c9a3] border border-white/10 font-medium cursor-pointer relative"
            >
              <span>Đổi Trả 1-1 (UC10)</span>
              {pendingReturnsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-1">
                  {pendingReturnsCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome?.()}
              className="px-2.5 py-1 bg-[#262420] hover:bg-[#36322b] text-stone-200 rounded-lg font-semibold border border-white/10 transition-all cursor-pointer flex items-center gap-1"
            >
              <Store size={12} className="text-[#d4b996]" />
              <span className="hidden md:inline">Xem Showroom</span>
            </button>
            {renderRoleSwitcherDropdown()}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 3. THANH ĐIỀU HÀNH NHÂN VIÊN KHO (WAREHOUSE)
  // =========================================================
  if (userRole === 'WAREHOUSE') {
    return (
      <div className="bg-[#171614] text-stone-100 border-b border-[#c5a880]/40 sticky top-0 z-[60] shadow-lg text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#b89768] to-[#8c6f46] text-[#171614] rounded-lg font-black text-xs flex items-center gap-1.5 shadow-sm">
              <Boxes size={14} />
              <span>NHÂN VIÊN KHO • THẾ GIỚI IPHONE</span>
            </span>
            <span className="text-stone-400 text-xs hidden sm:inline">
              Thủ kho: <strong className="text-[#e5c9a3]">{currentUser?.name || 'Trần Văn Kho (Kho VN/A)'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateWarehouse?.()}
              className="px-3 py-1 bg-[#2e2a24] hover:bg-[#3d372e] text-[#e5c9a3] border border-[#c5a880]/40 rounded-lg font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <Boxes size={12} />
              <span>Quản Lý Kho 25 Mã iPhone (UC05)</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome?.()}
              className="px-2.5 py-1 bg-[#262420] hover:bg-[#36322b] text-stone-200 rounded-lg font-semibold border border-white/10 transition-all cursor-pointer flex items-center gap-1"
            >
              <Store size={12} className="text-[#d4b996]" />
              <span className="hidden md:inline">Xem Showroom</span>
            </button>
            {renderRoleSwitcherDropdown()}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PortalTopBar;
