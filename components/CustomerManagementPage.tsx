import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, ArrowLeft, Star, Award, 
  Phone, Mail, MapPin, DollarSign, Calendar, Gift, 
  ChevronRight, CheckCircle, X, ShieldCheck, RotateCcw, ShoppingCart
} from 'lucide-react';
import { CustomerProfile } from '../types';

interface CustomerManagementPageProps {
  customers: CustomerProfile[];
  onBack: () => void;
  onAddCustomer: (customer: CustomerProfile) => void;
  onUpdatePoints: (customerId: string, pointsDelta: number) => void;
  onOpenReturns?: () => void;
  onOpenPOS?: () => void;
}

export const CustomerManagementPage: React.FC<CustomerManagementPageProps> = ({
  customers,
  onBack,
  onAddCustomer,
  onUpdatePoints,
  onOpenReturns,
  onOpenPOS
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  // Form Thêm khách hàng mới
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const tiers = ['ALL', 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'];

  const filteredCustomers = customers.filter(c => {
    const matchTier = selectedTier === 'ALL' || c.tier === selectedTier;
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.phone.includes(searchTerm) || 
                        c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTier && matchSearch;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone) {
      alert('Vui lòng nhập họ tên và số điện thoại khách hàng!');
      return;
    }

    const created: CustomerProfile = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newCustomerForm.name,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email || `${newCustomerForm.phone}@zshop.user`,
      address: newCustomerForm.address || 'TP. Hồ Chí Minh',
      points: 100, // Tặng 100 điểm khởi tạo chào mừng thành viên mới
      tier: 'Đồng',
      totalSpent: 0,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    onAddCustomer(created);
    setIsAddModalOpen(false);
    setNewCustomerForm({ name: '', phone: '', email: '', address: '' });
    alert(`Đã thêm thành công khách hàng "${created.name}" kèm 100 điểm thưởng chào mừng!`);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Kim Cương':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Vàng':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Bạc':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} /> Thoát Quản Lý Khách Hàng
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Users size={18} />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Quản Lý Khách Hàng & Điểm Tích Lũy (UC03)</h1>
              <p className="text-[11px] text-slate-400">CRM Khách hàng dành cho Nhân viên Bán hàng & Chủ shop</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenPOS && (
            <button
              onClick={onOpenPOS}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-lg border border-amber-900/50 shadow transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart size={15} /> Bán Hàng POS (UC04)
            </button>
          )}
          {onOpenReturns && (
            <button
              onClick={onOpenReturns}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs rounded-lg border border-rose-900/50 shadow transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={15} /> Sang Quản Lý Đổi Trả (UC10)
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <UserPlus size={16} /> Thêm Khách Hàng Mới
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="p-6 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng số khách hàng</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{customers.length} thành viên</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Khách hàng Kim Cương & Vàng</span>
            <h3 className="text-xl font-black text-amber-900 mt-0.5">
              {customers.filter(c => c.tier === 'Kim Cương' || c.tier === 'Vàng').length} VIP
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng điểm tích lũy hệ thống</span>
            <h3 className="text-xl font-black text-purple-900 mt-0.5">
              {customers.reduce((sum, c) => sum + c.points, 0).toLocaleString('vi-VN')} điểm
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Gift size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng doanh số tích lũy</span>
            <h3 className="text-xl font-black text-emerald-900 mt-0.5">
              {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000).toFixed(1)} Tr
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm tên, số điện thoại, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              {tiers.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedTier === t
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t === 'ALL' ? 'Tất cả hạng' : `Hạng ${t}`}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Họ và Tên</th>
                  <th className="py-3 px-4">Số Điện Thoại</th>
                  <th className="py-3 px-4">Hạng Thành Viên</th>
                  <th className="py-3 px-4 text-center">Điểm Tích Lũy</th>
                  <th className="py-3 px-4 text-right">Tổng Chi Tiêu</th>
                  <th className="py-3 px-4">Địa Chỉ</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div>{cust.name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{cust.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{cust.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTierBadge(cust.tier)}`}>
                        {cust.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {cust.points} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cust.totalSpent)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[150px] truncate" title={cust.address}>
                      {cust.address}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const bonus = prompt(`Tặng điểm tích lũy cho khách hàng "${cust.name}":`, '50');
                            if (bonus !== null && !isNaN(Number(bonus))) {
                              onUpdatePoints(cust.id, parseInt(bonus, 10));
                            }
                          }}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-bold transition-colors"
                          title="Tặng/Trừ điểm"
                        >
                          + Tặng điểm
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-[11px] font-medium transition-colors"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Thêm Khách Hàng Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-400" />
                <h3 className="font-bold text-sm">Thêm Khách Hàng Mới (UC03)</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Họ và Tên (*)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nguyễn Văn A"
                  value={newCustomerForm.name}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại (*)</label>
                <input 
                  type="tel" 
                  required
                  placeholder="0912 345 678"
                  value={newCustomerForm.phone}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="customer@gmail.com"
                  value={newCustomerForm.email}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Địa Chỉ Giao Hàng</label>
                <input 
                  type="text" 
                  placeholder="Quận 1, TP. Hồ Chí Minh"
                  value={newCustomerForm.address}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <Gift size={16} className="shrink-0" />
                <span>Khách hàng mới sẽ được tự động kích hoạt hạng <strong>Đồng</strong> và nhận ngay <strong>100 điểm thưởng</strong> tích lũy!</span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1"
                >
                  <CheckCircle size={16} /> Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chi Tiết Khách Hàng */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedCustomer.name}</h3>
                <span className="text-xs text-slate-500">Mã KH: {selectedCustomer.id} • Đăng ký ngày {selectedCustomer.createdAt}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-indigo-600" />
                <span>Số điện thoại: <strong>{selectedCustomer.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-600" />
                <span>Email: <strong>{selectedCustomer.email}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-600" />
                <span>Địa chỉ: <strong>{selectedCustomer.address}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-amber-600" />
                <span>Hạng thành viên: <strong className="text-amber-800">{selectedCustomer.tier}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-purple-600" />
                <span>Điểm tích lũy khả dụng: <strong className="text-purple-800">{selectedCustomer.points} điểm</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-600" />
                <span>Tổng chi tiêu đã mua: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedCustomer.totalSpent)}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-black"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagementPage;
