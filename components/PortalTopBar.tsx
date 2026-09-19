import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Store, Headset, ShoppingBag, 
  BarChart3, Sparkles, Package, Boxes, RotateCcw, 
  Settings, Users, Truck, ChevronDown, LogOut, 
  ExternalLink, UserCheck, RefreshCw, Eye
} from 'lucide-react';
import { UserRole } from '../types';

export type PortalWorkspace = 'BUYER' | 'ADMIN' | 'SELLER' | 'CSKH';

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
  pendingSellersCount = 0,
  currentWorkspace,
  onSwitchWorkspace,
  onNavigateAdminTab,
  onNavigateCSKH,
  onNavigateSeller,
  onNavigateWarehouse,
  onNavigateHome,
  onSwitchRole,
  onLogout
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. QUY TẮC CỐT LÕI: NẾU LÀ KHÁCH HÀNG (CUSTOMER) HOẶC KHÁCH VÃNG LAI (GUEST)
  // THÌ HOÀN TOÀN ẨN THANH NÀY ĐỂ GIAO DIỆN MUA SẮM SẠCH ĐẸP 100% NHƯ WEBSITE HIỆN TẠI!
  if (userRole === 'CUSTOMER' || userRole === 'GUEST') {
    return null;
  }

  // =========================================================
  // 2. PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN CONTROL BAR)
  // Xuất hiện ở giao diện chính để Admin dễ dàng kiểm tra các chức vụ của Admin
  // =========================================================
  if (userRole === 'ADMIN') {
    return (
      <div className="bg-slate-950 text-white border-b-2 border-purple-600/80 sticky top-0 z-[60] shadow-xl text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
          
          {/* Logo / Badge Admin */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg border border-purple-400/30 text-white font-black text-xs tracking-wider shadow-inner">
              <ShieldCheck size={15} className="text-amber-400" />
              <span>SZSHOP ADMIN</span>
            </div>
            <span className="hidden xl:inline-block text-[11px] text-purple-300/80 font-medium">
              Thanh Quản Trị Hệ Thống
            </span>
          </div>

          {/* Dãy nút truy cập nhanh vào từng Chức Vụ Của Admin */}
          <div className="flex items-center gap-1 flex-wrap overflow-x-auto py-0.5">
            {/* Chức vụ 1: Doanh Thu */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('DASHBOARD')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-purple-500/50 transition-all font-medium cursor-pointer"
              title="Xem Báo cáo Doanh thu & Tăng trưởng sàn (UC06)"
            >
              <BarChart3 size={13} className="text-emerald-400" />
              <span>Doanh Thu</span>
            </button>

            {/* Chức vụ 2: AI Hỏi đáp K.Doanh (UC09) */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('AI_BI')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/60 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-800/60 hover:border-purple-400 transition-all font-bold cursor-pointer"
              title="AI Trợ Lý Phân Tích & Dự Báo Kinh Doanh (UC09)"
            >
              <Sparkles size={13} className="text-amber-400 animate-pulse" />
              <span>AI UC09</span>
            </button>

            {/* Chức vụ 3: Quản Lý Sản Phẩm Toàn Sàn */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('PRODUCTS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-purple-500/50 transition-all font-medium cursor-pointer"
              title="Quản lý & Kiểm duyệt sản phẩm sàn"
            >
              <Package size={13} className="text-sky-400" />
              <span>Sản Phẩm</span>
            </button>

            {/* Chức vụ 4: Duyệt Đối Tác Seller */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('SELLERS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-purple-500/50 transition-all font-medium cursor-pointer relative"
              title="Duyệt đơn đăng ký mở shop của Nhà bán hàng"
            >
              <Store size={13} className="text-amber-400" />
              <span>Duyệt Seller</span>
              {pendingSellersCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5 animate-bounce">
                  {pendingSellersCount}
                </span>
              )}
            </button>

            {/* Chức vụ 5: Đơn Hàng Sàn */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('ORDERS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-purple-500/50 transition-all font-medium cursor-pointer"
              title="Quản lý danh sách đơn đặt hàng toàn sàn"
            >
              <Truck size={13} className="text-indigo-400" />
              <span>Đơn Hàng</span>
            </button>

            {/* Chức vụ 6: Kho Tổng & Tồn Kho (UC05) */}
            <button
              type="button"
              onClick={() => onNavigateWarehouse?.()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-purple-500/50 transition-all font-medium cursor-pointer"
              title="Quản lý Kho hàng & Nhập kho (UC05)"
            >
              <Boxes size={13} className="text-amber-400" />
              <span>Kho Tổng (UC05)</span>
            </button>

            {/* Chức vụ 7: Cổng CSKH & Đổi Trả (UC10) */}
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('RETURNS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-purple-500/50 transition-all font-medium cursor-pointer"
              title="Cổng CSKH: Xử lý đổi trả hoàn tiền (UC10), CRM (UC03), POS (UC04)"
            >
              <Headset size={13} className="text-rose-400" />
              <span>Cổng CSKH & Đổi Trả</span>
              {pendingReturnsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5">
                  {pendingReturnsCount}
                </span>
              )}
            </button>

            {/* Chức vụ 8: Cấu Hình */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('CONFIG')}
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all cursor-pointer"
              title="Cấu hình hệ thống sàn"
            >
              <Settings size={13} />
              <span>Cấu Hình</span>
            </button>
          </div>

          {/* Phía Phải: Nút Toàn Màn Hình Dashboard + Menu Chuyển Đổi Nhanh */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Nút vào Bàn làm việc Admin */}
            <button
              type="button"
              onClick={() => onNavigateAdminTab?.('DASHBOARD')}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Vào Dashboard</span>
              <ExternalLink size={12} />
            </button>

            {/* Dropdown Chuyển góc nhìn / Đổi vai trò để test */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              >
                <RefreshCw size={12} className="text-amber-400" />
                <span className="hidden sm:inline">Chuyển Vai Trò</span>
                <ChevronDown size={12} />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-fade-in space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Đổi Góc Nhìn Kiểm Thử:
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      onSwitchRole?.(UserRole.CUSTOMER);
                      onNavigateHome?.();
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-sky-300 font-medium cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <div>
                      <div className="font-bold">Góc nhìn Khách hàng</div>
                      <div className="text-[10px] text-slate-400">Ẩn thanh quản trị, mua sắm chuẩn</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      onSwitchRole?.(UserRole.SELLER);
                      onNavigateSeller?.('overview');
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-emerald-300 font-medium cursor-pointer"
                  >
                    <Store size={14} />
                    <div>
                      <div className="font-bold">Kênh Nhà Bán Hàng</div>
                      <div className="text-[10px] text-slate-400">Quản lý Shop, Sản phẩm, Đơn shop</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      onSwitchRole?.(UserRole.SALES);
                      onNavigateCSKH?.('RETURNS');
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-indigo-300 font-medium cursor-pointer"
                  >
                    <Headset size={14} />
                    <div>
                      <div className="font-bold">Cổng CSKH & Vận Hành</div>
                      <div className="text-[10px] text-slate-400">Đổi trả UC10, CRM UC03, POS UC04</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      onSwitchRole?.(UserRole.WAREHOUSE);
                      onNavigateWarehouse?.();
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-amber-300 font-medium cursor-pointer"
                  >
                    <Boxes size={14} />
                    <div>
                      <div className="font-bold">Quản Lý Kho Hàng</div>
                      <div className="text-[10px] text-slate-400">Phiếu nhập kho & Tồn kho UC05</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 font-medium cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // 3. PHÂN HỆ NHÀ BÁN HÀNG (SELLER CONTROL BAR)
  // =========================================================
  if (userRole === 'SELLER') {
    return (
      <div className="bg-slate-950 text-white border-b-2 border-emerald-600 sticky top-0 z-[60] shadow-lg text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md font-bold text-xs flex items-center gap-1.5">
              <Store size={14} className="text-emerald-400" />
              <span>KÊNH NHÀ BÁN HÀNG</span>
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              Shop: <strong className="text-slate-200">Cửa hàng ZS-Economy Demo</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateSeller?.('overview')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 font-medium cursor-pointer"
            >
              Tổng quan
            </button>
            <button
              type="button"
              onClick={() => onNavigateSeller?.('products')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 font-medium cursor-pointer"
            >
              Sản phẩm shop
            </button>
            <button
              type="button"
              onClick={() => onNavigateSeller?.('orders')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 font-medium cursor-pointer"
            >
              Đơn hàng shop
            </button>
            <button
              type="button"
              onClick={() => onNavigateSeller?.('overview')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Vào Kênh Quản Lý</span>
              <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-2 py-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 4. PHÂN HỆ CSKH & SALES (CSKH CONTROL BAR)
  // =========================================================
  if (userRole === 'SALES' || userRole === 'SUPPORT') {
    return (
      <div className="bg-slate-950 text-white border-b-2 border-indigo-600 sticky top-0 z-[60] shadow-lg text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md font-bold text-xs flex items-center gap-1.5">
              <Headset size={14} className="text-indigo-400" />
              <span>CỔNG CSKH & VẬN HÀNH</span>
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              Nhân viên: <strong className="text-slate-200">{currentUser?.name || 'CSKH & Sales'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('RETURNS')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-800 font-medium cursor-pointer relative"
            >
              <span>Xử lý Đổi trả (UC10)</span>
              {pendingReturnsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-1">
                  {pendingReturnsCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('CUSTOMERS')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-800 font-medium cursor-pointer"
            >
              Khách hàng CRM (UC03)
            </button>
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('POS')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-800 font-medium cursor-pointer"
            >
              Thu ngân POS (UC04)
            </button>
            <button
              type="button"
              onClick={() => onNavigateCSKH?.('RETURNS')}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Vào Cổng CSKH</span>
              <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-2 py-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 5. PHÂN HỆ THỦ KHO (WAREHOUSE CONTROL BAR)
  // =========================================================
  if (userRole === 'WAREHOUSE') {
    return (
      <div className="bg-slate-950 text-white border-b-2 border-amber-600 sticky top-0 z-[60] shadow-lg text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded-md font-bold text-xs flex items-center gap-1.5">
              <Boxes size={14} className="text-amber-400" />
              <span>BỘ PHẬN THỦ KHO</span>
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              Nhân viên: <strong className="text-slate-200">{currentUser?.name || 'Trần Văn Kho'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateWarehouse?.()}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Vào Quản Lý Kho & Nhập Hàng (UC05)</span>
              <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-2 py-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PortalTopBar;
