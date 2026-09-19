import React from 'react';
import { Order } from '../types';
import { ShoppingBag, Package } from 'lucide-react';

interface OrderSectionProps {
  order: Order;
}

const OrderSection: React.FC<OrderSectionProps> = ({ order }) => {
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + order.shippingFee - order.discount;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={20} className="text-brand-600" />
          Thông tin đơn hàng
        </h2>
        <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
          #{order.id}
        </span>
      </div>

      <div className="p-6">
        {/* Product List */}
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">x{item.quantity}</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-200 my-4"></div>

        {/* Calculations */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4 pt-4">
          <div className="flex justify-between items-end">
            <span className="font-semibold text-gray-900">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-brand-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
            </span>
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">(Đã bao gồm VAT)</p>
        </div>
        
        <div className="mt-6 bg-brand-50 rounded-lg p-3 flex items-start gap-3">
             <Package size={18} className="text-brand-600 mt-0.5 shrink-0" />
             <div className="text-xs text-brand-800">
                 Đơn hàng được bảo vệ bởi chính sách hoàn tiền 100% của SZSHOP nếu có lỗi từ nhà sản xuất.
             </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSection;