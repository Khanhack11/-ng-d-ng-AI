import React, { useState } from 'react';
import { ArrowLeft, Mail, ShoppingBag } from 'lucide-react';
import { AuthService } from '../services';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
        const response = await AuthService.forgotPassword(email);
        if (response.success) {
            setMessage({ type: 'success', text: response.message || 'Đường dẫn khôi phục đã được gửi.' });
        } else {
            setMessage({ type: 'error', text: response.error || 'Có lỗi xảy ra. Vui lòng thử lại.' });
        }
    } catch (e) {
        setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in font-sans">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2">
                <ArrowLeft size={24}/>
            </button>
            <div className="text-xl font-medium text-gray-800">Quên mật khẩu</div>
            <div className="w-10"></div> {/* Placeholder for balance */}
        </div>

        <div className="flex-1 px-6 pt-10 pb-6 flex flex-col max-w-md mx-auto w-full">
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 text-white mb-4">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-gray-900 font-bold text-2xl tracking-tight text-center">Khôi phục tài khoản</h2>
                <p className="text-gray-500 text-sm mt-3 font-medium text-center leading-relaxed">
                    Vui lòng nhập định dạng email của bạn. Chúng tôi sẽ gửi một đường dẫn để đặt lại mật khẩu.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                    <div className="absolute left-0 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                        <Mail size={22} />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email của bạn"
                        className="w-full pl-9 pr-4 py-2.5 border-b border-gray-300 outline-none text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-600 transition-colors bg-transparent font-medium"
                    />
                </div>

                {message.text && (
                    <div className={`text-sm font-medium text-center p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={!email || isLoading}
                        className={`w-full py-3 rounded-sm text-white font-medium text-base transition-all shadow-md
                            ${email && !isLoading ? 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}
                        `}
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ForgotPasswordPage;
