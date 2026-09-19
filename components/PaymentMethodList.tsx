import React from 'react';
import { PaymentMethodConfig, PaymentMethodType } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { QrCode, CreditCard, Globe, CheckCircle2, Wallet, Banknote, HelpCircle, Sparkles, AlertTriangle, ThumbsUp } from 'lucide-react';

interface PaymentMethodListProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  totalAmount: number; // New prop for logic
}

const getIcon = (iconName: string, active: boolean) => {
  const className = active ? "text-brand-600" : "text-gray-400";
  switch (iconName) {
    case 'qr': return <QrCode className={className} />;
    case 'credit-card': return <CreditCard className={className} />;
    case 'globe': return <Globe className={className} />;
    case 'wallet': return <Wallet className={className} />;
    case 'money': return <Banknote className={className} />;
    default: return <CreditCard className={className} />;
  }
};

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ selectedMethod, onSelect, totalAmount }) => {
  
  // Helper to determine status based on amount
  const getMethodStatus = (methodId: PaymentMethodType) => {
    // Rule 1: Disable COD for orders > 5,000,000 VND
    if (methodId === PaymentMethodType.COD && totalAmount > 5000000) {
        return {
            disabled: true,
            badge: "Không hỗ trợ đơn > 5tr",
            badgeColor: "bg-gray-100 text-gray-500",
            recommend: false
        };
    }

    // Rule 2: Recommend QR/Banking for orders > 2,000,000 VND
    if (totalAmount > 2000000) {
        if (methodId === PaymentMethodType.QR_CODE) {
            return { disabled: false, badge: "Khuyên dùng", badgeColor: "bg-indigo-100 text-indigo-700", recommend: true };
        }
        if (methodId === PaymentMethodType.DOMESTIC_CARD) {
            return { disabled: false, badge: "An toàn", badgeColor: "bg-blue-100 text-blue-700", recommend: false };
        }
    }

    // Rule 3: Recommend MoMo for small orders < 500,000 VND
    if (totalAmount < 500000 && methodId === PaymentMethodType.MOMO) {
         return { disabled: false, badge: "Siêu tốc", badgeColor: "bg-pink-100 text-pink-700", recommend: true };
    }
    
    // Default recommendations
    if (methodId === PaymentMethodType.QR_CODE && totalAmount <= 2000000) {
        return { disabled: false, badge: "Nhanh chóng", badgeColor: "bg-green-100 text-green-700", recommend: false };
    }

    return { disabled: false, badge: null, badgeColor: "", recommend: false };
  };

  return (
    <div className="space-y-3">
      {PAYMENT_METHODS.map((method) => {
        const status = getMethodStatus(method.id);
        const isSelected = selectedMethod === method.id;
        const isDisabled = status.disabled;

        return (
          <button
            key={method.id}
            onClick={() => !isDisabled && onSelect(method.id)}
            disabled={isDisabled}
            className={`
              w-full relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300 ease-out group
              ${isDisabled 
                ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed grayscale' 
                : isSelected 
                    ? 'border-brand-500 bg-brand-50 shadow-md ring-1 ring-brand-500' 
                    : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {/* Recommendation Ribbon */}
            {status.recommend && !isDisabled && (
                <div className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <ThumbsUp size={10} />
                    Gợi ý tốt nhất
                </div>
            )}

            {/* Custom Radio Button */}
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
              ${isSelected ? 'border-brand-600' : 'border-gray-300'}
            `}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-scale-in" />}
            </div>

            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center border transition-colors duration-300 shrink-0
              ${isSelected ? 'bg-white border-brand-200' : 'bg-gray-50 border-gray-100'}
            `}>
              {getIcon(method.iconName, isSelected)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-semibold transition-colors duration-300 truncate ${isSelected ? 'text-brand-900' : 'text-gray-900'}`}>
                    {method.title}
                  </h3>
                  
                  {/* Status Badge */}
                  {status.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${status.badgeColor}`}>
                          {status.badge}
                      </span>
                  )}

                  {isDisabled && (
                      <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold border border-red-200 bg-red-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={10} />
                          Giới hạn
                      </div>
                  )}
              </div>
              
              <p className="text-sm text-gray-500 truncate">
                {method.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodList;