import React from 'react';
import { CheckCircle, MapPin, Package, CreditCard, Home, ChevronLeft, Phone, Truck, ExternalLink } from 'lucide-react';
import { MOCK_ORDER } from '../constants';
import { CartItem, UserRole } from '../types';
import Header from './ZShop/Header';

interface OrderDetailPageProps {
  cartItems: CartItem[]; // Accept cartItems
  onBack: () => void;
  onGoHome: () => void;
  onOpenCart?: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ 
  cartItems, 
  onBack, 
  onGoHome,
  onOpenCart,
  cartItemCount,
  userRole,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick
}) => {
  const orderDate = new Date().toLocaleDateString('vi-VN', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-fade-in">
      <Header 
        onOpenCart={onOpenCart || (() => {})}
        cartItemCount={cartItemCount || 0}
        onLogin={onLogin || (() => {})}
        userRole={userRole || UserRole.GUEST}
        onLogout={onLogout || (() => {})}
        onOpenRegister={onOpenRegister}
        onOpenSellerChannel={onOpenSellerChannel}
        onBecomeSeller={onBecomeSeller}
        onProductClick={onProductClick}
      />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-green-800">Đặt hàng thành công</h2>
            <p className="text-green-700 mt-1">Cảm ơn bạn đã mua sắm tại SZSHOP</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="font-semibold text-gray-700">Đơn hàng: #{MOCK_ORDER.id}</span>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{orderDate}</span>
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <MapPin size={16} className="text-brand-600" />
                            Địa chỉ nhận hàng
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1 pl-6 border-l-2 border-brand-100">
                            <p className="font-bold text-gray-900 text-base">Nguyễn Quốc Khánh</p>
                            <p className="flex items-center gap-2"><Phone size={12} /> 0829999456</p>
                            <p className="text-gray-500">Số 123, Đường Xuân Thủy</p>
                            <p className="text-gray-500">Phổ yên, Thái Nguyên</p>
                        </div>
                    </div>

                    <div className="flex-1">
                         <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <CreditCard size={16} className="text-brand-600" />
                            Thanh toán & Vận chuyển
                        </h3>
                        <div className="text-sm text-gray-600 space-y-3 pl-6 border-l-2 border-brand-100">
                            <div>
                                <p className="text-xs text-gray-400">Phương thức thanh toán</p>
                                <p className="font-medium text-gray-900">VNPAY-QR / Thẻ / COD</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Trạng thái</p>
                                <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded text-xs mt-1">
                                    <CheckCircle size={10} /> Đã thanh toán / Chờ xác nhận
                                </span>
                            </div>
                             <div>
                                <p className="text-xs text-gray-400">Đơn vị vận chuyển</p>
                                <div className="mt-1">
                                    <div className="flex items-center gap-2">
                                         <Truck size={14} className="text-gray-600" />
                                         <span className="font-medium text-gray-900">Giao hàng nhanh</span>
                                    </div>
                                    <div className="mt-1.5 flex flex-col gap-1 bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <span>Mã vận đơn:</span>
                                            <span className="font-mono font-bold text-gray-900 select-all">GHN-KV291823</span>
                                        </div>
                                        <a href="#" className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1 hover:underline">
                                            Theo dõi đơn hàng <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Package size={16} className="text-brand-600" />
                    Sản phẩm ({cartItems.length})
                </h3>
            </div>
            <div className="p-6 divide-y divide-gray-100">
                {cartItems.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                        <div className="w-16 h-16 rounded-md border border-gray-200 overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">Phân loại: {item.size}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">x{item.quantity}</span>
                                <span className="font-medium text-gray-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                </div>
                <div className="border-t border-gray-100 my-2 pt-2"></div>
                <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Tổng thanh toán</span>
                    <span className="text-red-600 text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
             </div>
        </div>

        <button 
            onClick={onGoHome}
            className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
            <Home size={20} />
            Tiếp tục mua sắm
        </button>
      </main>
    </div>
  );
};

export default OrderDetailPage;