import React, { useState } from 'react';
import { QrCode, Zap, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Copy, Check, ExternalLink, Sparkles, CreditCard, Wallet, Smartphone } from 'lucide-react';

interface PaymentSimulator3DProps {
  onEnterStore: () => void;
}

type PaymentMethod = 'vietqr' | 'momo' | 'zalopay' | 'visa' | 'crypto';

const PaymentSimulator3D: React.FC<PaymentSimulator3DProps> = ({ onEnterStore }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('vietqr');
  const [amount, setAmount] = useState<number>(850000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const methods = [
    { id: 'vietqr', name: 'VietQR Napas 247', icon: QrCode, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { id: 'momo', name: 'Ví MoMo', icon: Smartphone, color: 'text-pink-400', border: 'border-pink-500/40' },
    { id: 'zalopay', name: 'ZaloPay', icon: Wallet, color: 'text-blue-400', border: 'border-blue-500/40' },
    { id: 'visa', name: 'Visa / Mastercard', icon: CreditCard, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { id: 'crypto', name: 'USDT Web3 Token', icon: Sparkles, color: 'text-purple-400', border: 'border-purple-500/40' },
  ];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTransactionSuccess(false);
    setCurrentStep(1);

    setTimeout(() => setCurrentStep(2), 500);
    setTimeout(() => setCurrentStep(3), 1100);
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionSuccess(true);
      const generatedHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(generatedHash);
    }, 1700);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(txHash);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="payment-simulator" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" />
          Mô Phỏng Trực Tiếp
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Cổng Thanh Toán Không Gian Lượng Tử
        </h2>
        <p className="text-gray-400 text-sm sm:text-base font-light">
          Trải nghiệm tốc độ thanh toán tức thời với công nghệ định tuyến đa kênh thông minh của SZ-Payment.
        </p>
      </div>

      {/* Simulator Card Box */}
      <div className="p-6 sm:p-10 rounded-3xl bg-black/60 border border-white/15 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Top bar decor */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input and Rail Selection (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Rail Selection */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-3">
                1. Chọn Kênh Thanh Toán Đa Điểm:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {methods.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                      disabled={isProcessing}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? `bg-white/[0.08] ${m.border} shadow-[0_0_20px_rgba(6,182,212,0.3)]`
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? m.color : 'text-gray-400'}`} />
                      <span className="text-xs font-bold text-white truncate">{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Amount Selection */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-3">
                2. Chọn Hoặc Nhập Số Tiền Giao Dịch:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[150000, 500000, 850000, 1500000, 3000000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    disabled={isProcessing}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      amount === val
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {val.toLocaleString('vi-VN')}đ
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={isProcessing}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono font-bold text-lg focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-gray-400">VND</span>
              </div>
            </div>

            {/* Step 3: Trigger Action */}
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                isProcessing
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Đang Khớp Lệnh Lượng Tử (0.02s)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-cyan-200" />
                  <span>KÍCH HOẠT THANH TOÁN 3D NGAY</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Holographic Digital Receipt & Status (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-black/70 border border-white/10 shadow-inner flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-mono text-gray-400 uppercase">Hóa Đơn Không Gian 3D</span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> E-Signature
                </span>
              </div>

              {isProcessing ? (
                /* Step-by-step progress animation */
                <div className="py-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 1 ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                      1
                    </span>
                    <span className="text-xs font-mono text-gray-300">Khởi tạo mã hóa ZK Token...</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                      2
                    </span>
                    <span className="text-xs font-mono text-gray-300">Định tuyến mạng lưới ngân hàng...</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 3 ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                      3
                    </span>
                    <span className="text-xs font-mono text-gray-300">Ký duyệt giao dịch tức thì!</span>
                  </div>

                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-6">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-full animate-pulse" />
                  </div>
                </div>
              ) : transactionSuccess ? (
                /* Transaction Success Receipt */
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">THANH TOÁN HOÀN TẤT (0.021s)</span>
                      <span className="text-[10px] text-gray-400">Đã nhận diện tiền thành công vào ví ZShop</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono pt-2">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Số tiền:</span>
                      <span className="text-white font-bold">{amount.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Kênh:</span>
                      <span className="text-cyan-400 font-semibold uppercase">{selectedMethod}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Mã đơn hàng:</span>
                      <span className="text-white">ZS-3D-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 block mb-1">Mã băm giao dịch (TxHash):</span>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-black/80 border border-white/10">
                        <span className="text-[10px] text-gray-300 truncate">{txHash}</span>
                        <button
                          onClick={handleCopyHash}
                          className="text-cyan-400 hover:text-cyan-300 flex-shrink-0 ml-auto"
                          title="Sao chép TxHash"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Ready State */
                <div className="py-12 text-center text-gray-400 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sẵn Sàng Mô Phỏng</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Chọn kênh và số tiền bên trái, sau đó nhấn nút Kích Hoạt để quan sát quy trình xử lý giao dịch.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Button to Shop */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={onEnterStore}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <span>Vào Cửa Hàng Thử Thanh Toán Thật</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSimulator3D;
