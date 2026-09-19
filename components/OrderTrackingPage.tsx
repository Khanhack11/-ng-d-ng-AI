import React, { useState } from 'react';
import { DatHangService } from '../services'; // UI Calls Business Layer
import { Search, Package, XCircle, ChevronLeft, Truck, CheckCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { TrackingStep, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  onBack: () => void;
  onRequestReturn?: (orderId: string, reason: string) => void;
}

const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onBack, onRequestReturn }) => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingStep[] | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Không vừa size, muốn đổi size khác');
  const [returnSuccess, setReturnSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // UI calling DatHangService (Business Layer)
    const result = DatHangService.traCuuDonHang(orderId);
    setTrackingData(result);
  };

  const handleCancelOrder = () => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.')) {
        alert('Đã gửi yêu cầu hủy đơn hàng. Tiền sẽ được hoàn về ví trong 24h.');
        setTrackingData(prev => prev ? [...prev, { status: OrderStatus.CANCELLED, date: new Date().toLocaleString(), description: 'Đã hủy bởi khách hàng', completed: true }] : null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
       <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="font-bold text-lg">Tra cứu đơn hàng (UC06)</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSearch} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhập mã đơn hàng hoặc SĐT</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="VD: DH-20241228"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none font-medium text-gray-900"
                        />
                    </div>
                    <button type="submit" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors flex items-center gap-2">
                        <Search size={20} />
                        Tra cứu
                    </button>
                </div>
            </form>
        </div>

        {/* Tracking Result */}
        {trackingData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in-up">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Đơn hàng #{orderId}</h2>
                        <p className="text-sm text-gray-500">Ngày đặt: 28/12/2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Only show Cancel button if not shipped yet */}
                        {!trackingData.find(s => s.status === OrderStatus.SHIPPING && s.completed) && !trackingData.find(s => s.status === OrderStatus.CANCELLED) && (
                            <button 
                                onClick={handleCancelOrder}
                                className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded border border-red-200 text-sm font-medium flex items-center gap-1 transition-colors"
                            >
                                <XCircle size={16} /> Hủy đơn
                            </button>
                        )}

                        {/* UC10: Nút Đổi trả & Hoàn hàng */}
                        <button
                            onClick={() => setShowReturnModal(true)}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 transition-colors"
                            title="Gửi yêu cầu đổi size hoặc hoàn tiền (UC10)"
                        >
                            <RotateCcw size={15} /> Yêu cầu Đổi trả (UC10)
                        </button>
                    </div>
                </div>

                {returnSuccess && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                        <span>Yêu cầu đổi trả của bạn đã được gửi thành công đến bộ phận CSKH ZShop. Chúng tôi sẽ thẩm định và hoàn tiền trong 24h!</span>
                    </div>
                )}

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {trackingData.map((step, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            
                            {/* Icon */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 
                                ${step.completed ? 'bg-green-100 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-400'}`}>
                                {step.status === OrderStatus.DELIVERED ? <CheckCircle size={20} /> :
                                 step.status === OrderStatus.SHIPPING ? <Truck size={20} /> :
                                 step.status === OrderStatus.CANCELLED ? <XCircle size={20} /> :
                                 <Clock size={20} />}
                            </div>
                            
                            {/* Card Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900">{step.status}</div>
                                    <time className="font-mono italic text-xs text-slate-500">{step.date}</time>
                                </div>
                                <div className="text-slate-500 text-sm">{step.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* MODAL YÊU CẦU ĐỔI TRẢ & HOÀN TIỀN (UC10) */}
        {showReturnModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2 text-rose-600">
                            <RotateCcw size={20} />
                            <h3 className="font-bold text-base text-slate-900">Yêu Cầu Đổi Trả & Hoàn Hàng (UC10)</h3>
                        </div>
                        <button onClick={() => setShowReturnModal(false)} className="text-slate-400 hover:text-slate-600">
                            <XCircle size={20} />
                        </button>
                    </div>

                    <div className="space-y-3 text-xs text-slate-700">
                        <div>
                            <label className="font-bold block mb-1">Mã đơn hàng áp dụng:</label>
                            <input 
                                type="text" 
                                readOnly 
                                value={orderId || 'DH-20241228'}
                                className="w-full p-2 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="font-bold block mb-1">Lý do đổi trả:</label>
                            <select 
                                value={returnReason}
                                onChange={e => setReturnReason(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-rose-500"
                            >
                                <option value="Không vừa size, muốn đổi size khác">Không vừa size, muốn đổi size khác</option>
                                <option value="Sản phẩm lỗi đường chỉ / rách">Sản phẩm lỗi đường chỉ / rách</option>
                                <option value="Giao sai màu sắc hoặc sai mẫu mã">Giao sai màu sắc hoặc sai mẫu mã</option>
                                <option value="Hàng không đúng như hình ảnh mô tả">Hàng không đúng như hình ảnh mô tả</option>
                            </select>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 space-y-1">
                            <div className="font-bold flex items-center gap-1">
                                <AlertTriangle size={14} /> Chính sách Hoàn tiền & Thu hồi điểm (UC10 Include):
                            </div>
                            <p>Khi yêu cầu đổi trả được phê duyệt, số tiền sản phẩm sẽ được hoàn về tài khoản, đồng thời số điểm thưởng tích lũy phát sinh từ đơn hàng này sẽ được tự động thu hồi.</p>
                        </div>
                    </div>

                    <div className="pt-3 border-t flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowReturnModal(false)}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (onRequestReturn) {
                                    onRequestReturn(orderId || 'DH-20241228', returnReason);
                                }
                                setShowReturnModal(false);
                                setReturnSuccess(true);
                            }}
                            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1"
                        >
                            <CheckCircle size={15} /> Gửi Yêu Cầu Đổi Trả
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;