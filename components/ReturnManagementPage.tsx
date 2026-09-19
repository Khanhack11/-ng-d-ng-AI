import React, { useState } from 'react';
import { 
  RotateCcw, ArrowLeft, CheckCircle, XCircle, Search, 
  DollarSign, Gift, AlertCircle, Clock, ShieldAlert, Phone, User, Users, ShoppingCart
} from 'lucide-react';
import { ReturnRequest } from '../types';

interface ReturnManagementPageProps {
  returnRequests: ReturnRequest[];
  onBack: () => void;
  onProcessReturn: (requestId: string, action: 'APPROVE' | 'REJECT' | 'REFUND_AND_CLAWBACK') => void;
  onOpenCustomers?: () => void;
  onOpenPOS?: () => void;
}

export const ReturnManagementPage: React.FC<ReturnManagementPageProps> = ({
  returnRequests,
  onBack,
  onProcessReturn,
  onOpenCustomers,
  onOpenPOS
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REFUNDED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = returnRequests.filter(req => {
    const matchStatus = filterStatus === 'ALL' || req.status === filterStatus;
    const matchSearch = req.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        req.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = returnRequests.filter(r => r.status === 'PENDING').length;
  const totalRefundAmount = returnRequests
    .filter(r => r.status === 'REFUNDED')
    .reduce((sum, r) => sum + r.refundAmount, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} /> Thoát Quản Lý Đổi Trả
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white shadow-sm">
              <RotateCcw size={18} />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Quản Lý Đổi Trả & Hoàn Tiền (UC10)</h1>
              <p className="text-[11px] text-slate-400">Xử lý yêu cầu trả hàng, hoàn tiền và thu hồi điểm thưởng tích lũy</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {onOpenPOS && (
            <button
              onClick={onOpenPOS}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-lg border border-amber-900/50 shadow transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart size={15} /> Bán Hàng POS (UC04)
            </button>
          )}
          {onOpenCustomers && (
            <button
              onClick={onOpenCustomers}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs rounded-lg border border-indigo-900/50 shadow transition-colors flex items-center gap-1.5"
            >
              <Users size={15} /> Sang Quản Lý Khách Hàng (CRM)
            </button>
          )}
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
            Chờ xử lý: {pendingCount} đơn
          </span>
        </div>
      </header>

      {/* KPI Overview */}
      <div className="p-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng yêu cầu đổi trả</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{returnRequests.length} hồ sơ</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <RotateCcw size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-800 font-medium">Đang chờ thẩm định</span>
            <h3 className="text-xl font-black text-amber-900 mt-0.5">{pendingCount} yêu cầu</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng tiền đã hoàn trả</span>
            <h3 className="text-xl font-black text-emerald-700 mt-0.5">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRefundAmount)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm mã đơn, tên khách hàng, mã phiếu..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar text-xs font-semibold">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'PENDING', label: 'Chờ thẩm định' },
                { id: 'APPROVED', label: 'Đã duyệt hàng' },
                { id: 'REFUNDED', label: 'Đã hoàn tiền & thu hồi điểm' },
                { id: 'REJECTED', label: 'Từ chối' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    filterStatus === tab.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mã Đơn / Phiếu</th>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Lý Do Đổi Trả</th>
                  <th className="py-3 px-4 text-right">Tiền Hoàn Lại</th>
                  <th className="py-3 px-4 text-center">Điểm Cần Thu Hồi</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Hành Động Nghiệp Vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-sky-700">{req.orderId}</div>
                      <span className="text-[10px] text-slate-400">Phiếu: {req.id}</span>
                      <div className="text-[10px] text-slate-400">{req.requestedAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{req.customerName}</div>
                      <div className="text-[11px] text-slate-500">{req.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-100 block truncate" title={req.reason}>
                        {req.reason}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {req.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-rose-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(req.refundAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        -{req.pointsToDeduct} điểm
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        req.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : req.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : req.status === 'REFUNDED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {req.status === 'PENDING' ? 'Chờ thẩm định' : 
                         req.status === 'APPROVED' ? 'Đã duyệt nhận hàng' :
                         req.status === 'REFUNDED' ? 'Đã hoàn tiền & thu hồi điểm' : 'Từ chối'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => onProcessReturn(req.id, 'APPROVE')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold transition-colors"
                              title="Duyệt nhận lại sản phẩm"
                            >
                              Duyệt nhận hàng
                            </button>
                            <button
                              onClick={() => onProcessReturn(req.id, 'REJECT')}
                              className="px-2 py-1 bg-slate-100 text-red-600 hover:bg-red-50 border border-red-200 rounded text-[11px] font-semibold transition-colors"
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => onProcessReturn(req.id, 'REFUND_AND_CLAWBACK')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow transition-all flex items-center gap-1"
                            title="Xác nhận hoàn tiền và tự động trừ điểm tích lũy"
                          >
                            <DollarSign size={13} /> Hoàn tiền & Thu hồi điểm
                          </button>
                        )}

                        {req.status === 'REFUNDED' && (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle size={14} /> Hoàn tất
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnManagementPage;
