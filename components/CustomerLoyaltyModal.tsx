import React from 'react';
import { Award, Star, Gift, ChevronRight, X, Clock, ShieldCheck, ShoppingBag, ArrowUpRight, TrendingUp } from 'lucide-react';
import { CustomerProfile } from '../types';

interface CustomerLoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: CustomerProfile | null;
  onGoShopping?: () => void;
}

export const CustomerLoyaltyModal: React.FC<CustomerLoyaltyModalProps> = ({
  isOpen,
  onClose,
  customer,
  onGoShopping
}) => {
  if (!isOpen) return null;

  // Dữ liệu mẫu nếu khách chưa có trong state
  const currentProfile: CustomerProfile = customer || {
    id: 'CUST-001',
    name: 'Khách hàng ZShop',
    phone: '0901234567',
    email: 'customer@test.com',
    address: 'TP. Hồ Chí Minh',
    points: 450,
    tier: 'Vàng',
    totalSpent: 12500000,
    createdAt: '10/01/2026'
  };

  const pointsValue = currentProfile.points * 100;

  const nextTierTarget = currentProfile.tier === 'Đồng' ? 3000000 
    : currentProfile.tier === 'Bạc' ? 10000000 
    : currentProfile.tier === 'Vàng' ? 25000000 
    : 50000000;

  const progressPercent = Math.min(100, Math.round((currentProfile.totalSpent / nextTierTarget) * 100));

  const tierColors = {
    'Đồng': { bg: 'from-amber-700 to-amber-900', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
    'Bạc': { bg: 'from-slate-400 to-slate-600', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
    'Vàng': { bg: 'from-amber-400 to-yellow-600', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    'Kim Cương': { bg: 'from-blue-600 via-indigo-600 to-purple-700', badge: 'bg-indigo-100 text-indigo-900 border-indigo-300' }
  };

  const mockPointHistory = [
    { id: 'PH-01', title: 'Tích điểm đơn hàng #DH-20241228', type: 'EARNED', points: +125, date: '28/12/2024 14:30', note: 'Đơn hàng trực tuyến 12.500.000đ' },
    { id: 'PH-02', title: 'Dùng điểm giảm giá tại quầy POS', type: 'SPENT', points: -50, date: '25/12/2024 10:15', note: 'Hóa đơn POS #POS-20241225' },
    { id: 'PH-03', title: 'Tích điểm đơn hàng #DH-20241215', type: 'EARNED', points: +375, date: '15/12/2024 18:20', note: 'Đơn hàng mua sắm Tết' },
    { id: 'PH-04', title: 'Thưởng chào mừng thành viên mới', type: 'EARNED', points: +100, date: '10/01/2024 09:00', note: 'Đăng ký tài khoản ZShop' }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with VIP Card Style */}
        <div className={`p-6 bg-gradient-to-br ${tierColors[currentProfile.tier].bg} text-white relative overflow-hidden shrink-0`}>
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <Award size={20} className="text-yellow-300" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-white/90">Thẻ Thành Viên ZShop (UC03)</span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight">{currentProfile.name}</h3>
                <p className="text-xs text-white/80 font-mono">{currentProfile.phone} | Mã: {currentProfile.id}</p>
              </div>
              <span className="px-3 py-1 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-wider shadow-md">
                Hạng {currentProfile.tier}
              </span>
            </div>

            <div className="pt-2 flex items-baseline justify-between bg-black/20 backdrop-blur-sm p-3.5 rounded-2xl border border-white/15">
              <div>
                <span className="text-[11px] text-white/80 block">Điểm Thưởng Khả Dụng</span>
                <span className="text-3xl font-black tracking-tight text-amber-300">{currentProfile.points.toLocaleString('vi-VN')}</span>
                <span className="text-xs text-white/90 ml-1.5 font-medium">điểm</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-white/80 block">Giá trị quy đổi</span>
                <span className="text-lg font-bold text-white">
                  = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointsValue)}
                </span>
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="pt-1">
              <div className="flex justify-between text-[11px] text-white/90 mb-1">
                <span>Tổng chi tiêu: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProfile.totalSpent)}</strong></span>
                <span>Mục tiêu: {progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Policy Overview */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Gift size={14} className="text-amber-700" /> Đặc Quyền & Chính Sách Tích Điểm
            </h4>
            <ul className="text-xs text-amber-950 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Tích lũy 1%</strong> giá trị mọi đơn hàng mua online hoặc tại quầy thu ngân POS.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>1 điểm = 100 VNĐ</strong>: Được trừ thẳng vào hóa đơn thanh toán không giới hạn.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Đổi trả sản phẩm: Khi hoàn tiền thành công, hệ thống tự động thu hồi điểm tích lũy của đơn đó (UC10 Include).</span>
              </li>
            </ul>
          </div>

          {/* History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-slate-500" /> Lịch Sử Giao Dịch Điểm
              </h4>
              <span className="text-[11px] text-slate-500">4 giao dịch gần nhất</span>
            </div>

            <div className="space-y-2.5">
              {mockPointHistory.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      item.type === 'EARNED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.type === 'EARNED' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.date} • {item.note}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black ${
                    item.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {item.points > 0 ? `+${item.points}` : item.points} điểm
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
          >
            Đóng
          </button>
          {onGoShopping && (
            <button
              onClick={() => {
                onClose();
                onGoShopping();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={14} /> Mua sắm tích thêm điểm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLoyaltyModal;
