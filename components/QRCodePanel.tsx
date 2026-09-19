import React, { useState, useEffect } from 'react';
import { Timer, Smartphone, Copy, RefreshCw, CheckCircle } from 'lucide-react';

interface QRCodePanelProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

const QRCodePanel: React.FC<QRCodePanelProps> = ({ amount, orderId, onSuccess }) => {
  // 15 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    setTimeLeft(15 * 60);
    setIsExpired(false);
  };

  // Tạo mã QR
  const qrData = `SZSHOP-PAYMENT-${orderId}-${amount}`;
  let qrUrl = `components/img_QR/QR_NQK.png`;

  // NOTE: Để "thay thế bằng hình ảnh của mình" (Mã QR tài khoản tĩnh của cửa hàng), bạn hãy copy file ảnh (VD: qr-cua-toi.jpg) 
  // vào thư mục public/ và bỏ comment dòng dưới đây để đè lên URL mặc định:
  // qrUrl = "/qr-cua-toi.jpg";

  return (
    <div className="bg-white rounded-xl border border-brand-100 p-6 shadow-sm flex flex-col items-center text-center animate-fade-in">
      <div className="mb-4 flex items-center gap-2 text-brand-700 bg-brand-50 px-4 py-2 rounded-full text-sm font-medium">
        <Timer size={18} />
        <span>Đơn hàng hết hạn sau: <span className="font-bold text-red-500">{formatTime(timeLeft)}</span></span>
      </div>

      <div className="relative group">
        {isExpired ? (
          <div className="w-64 h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
            <RefreshCw size={48} className="mb-2" />
            <span className="text-sm font-medium">Mã QR đã hết hạn</span>
          </div>
        ) : (
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-inner">
            <img
              src={qrUrl}
              alt="Payment QR Code"
              className="w-56 h-56 object-contain"
            />
            {/* Logo overlay simulation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1 rounded-full shadow-md">
                <Smartphone size={24} className="text-brand-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 w-full max-w-xs space-y-3">
        <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span>Số tiền:</span>
          <span className="font-bold text-brand-700 text-lg">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span>Nội dung:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-gray-900">{orderId}</span>
            <button className="text-brand-500 hover:text-brand-700 transition-colors" title="Sao chép">
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 max-w-sm mb-4">
        <p>Mở ứng dụng ngân hàng hoặc ví điện tử (MoMo, ZaloPay) để quét mã thanh toán.</p>
        {isExpired && (
          <button
            onClick={handleRefresh}
            className="mt-2 text-brand-600 hover:underline font-medium"
          >
            Tạo mã QR mới
          </button>
        )}
      </div>

      {/* DEMO BUTTON FOR SUCCESS */}
      <button
        onClick={onSuccess}
        className="mt-2 w-full py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2 text-sm font-bold"
      >
        <CheckCircle size={16} />
        [DEMO] Giả lập: Đã thanh toán
      </button>
    </div>
  );
};

export default QRCodePanel;