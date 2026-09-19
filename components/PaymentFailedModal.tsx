import React, { useState } from 'react';
import { AlertCircle, X, Phone, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface PaymentFailedModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onContactSupport: () => void;
  onClose: () => void;
}

const PaymentFailedModal: React.FC<PaymentFailedModalProps> = ({ isOpen, onRetry, onContactSupport, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-[scale-in_0.2s_ease-out]">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
            <X size={20} />
        </button>

        <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-red-500 w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
                Rất tiếc, giao dịch không thể thực hiện lúc này. Vui lòng kiểm tra lại thông tin thẻ hoặc đường truyền mạng của bạn.
            </p>

            <div className="space-y-3 mb-6">
                <button 
                    onClick={onRetry}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200"
                >
                    <RefreshCcw size={18} />
                    Thử lại ngay
                </button>
                
                <button 
                    onClick={onContactSupport}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                    <Phone size={18} />
                    Liên hệ hỗ trợ (1900 1080)
                </button>
            </div>

            {/* Debug/Technical Details Section */}
            <div className="border-t border-gray-100 pt-4">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto transition-colors focus:outline-none"
                >
                    {showDetails ? 'Ẩn thông tin kỹ thuật' : 'Xem chi tiết lỗi (Debug)'}
                    {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {showDetails && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 text-left text-xs font-mono text-gray-600 border border-gray-200 break-all animate-fade-in">
                        <div className="grid grid-cols-[60px_1fr] gap-y-1 gap-x-2">
                            <span className="font-bold text-gray-500">Error:</span>
                            <span className="text-red-600">PAYMENT_GATEWAY_TIMEOUT</span>
                            
                            <span className="font-bold text-gray-500">Code:</span>
                            <span>504 Gateway Timeout</span>
                            
                            <span className="font-bold text-gray-500">Ref ID:</span>
                            <span>req_{Math.random().toString(36).substring(7)}</span>
                            
                            <span className="font-bold text-gray-500">Time:</span>
                            <span>{new Date().toISOString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedModal;