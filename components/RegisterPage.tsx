import React, { useState } from 'react';
import { User, Lock, ArrowLeft, Mail, ShoppingBag, Eye, EyeOff, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { AuthService } from '../services';

interface RegisterPageProps {
  onRegisterSuccess: (role?: 'CUSTOMER' | 'ADMIN') => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.94 21.1C22.2 19.01 23.52 15.92 23.52 12.29Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.96 22.92 19.94 21.1L16.08 18.1C15 18.82 13.62 19.24 12 19.24C8.87 19.24 6.22 17.13 5.27 14.29L1.29 17.38C3.26 21.3 7.31 24 12 24Z" fill="#34A853"/>
    <path d="M5.27 14.29C5.03 13.57 4.9 12.8 4.9 12C4.9 11.2 4.77 10.43 5.53 9.71L1.29 6.62C0.47 8.24 0 10.06 0 12C0 13.94 0.47 15.76 1.29 17.38L5.27 14.29Z" fill="#FBBC05"/>
    <path d="M12 4.76C13.76 4.76 15.35 5.37 16.59 6.56L20.03 3.12C17.96 1.18 15.24 0 12 0C7.31 0 3.26 2.7 1.29 6.62L5.53 9.71C6.22 6.87 8.87 4.76 12 4.76Z" fill="#EA4335"/>
  </svg>
);

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onBack, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password || !name) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password.length < 3) {
      setErrorMsg('Mật khẩu cần ít nhất 3 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const registerEmail = email.trim();
      const response = await AuthService.register(registerEmail, password, name, 'CUSTOMER');
      if (response.success) {
        setSuccessMsg('Đăng ký tài khoản Khách hàng thành công! Dữ liệu đã lưu vào CSDL.');
        setTimeout(() => {
          onRegisterSuccess('CUSTOMER');
        }, 700);
      } else {
        setErrorMsg(response.error || 'Lỗi đăng ký tài khoản.');
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ SQL Server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setErrorMsg('');
    setShowGoogleModal(true);
  };

  const handleSelectGoogleAccount = async (selectedEmail: string, selectedName: string) => {
    setShowGoogleModal(false);
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await AuthService.socialLogin('google', 'google_session_verified', {
        email: selectedEmail,
        name: selectedName,
        providerUserId: `google_${selectedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        provider: 'google'
      });

      if (response.success) {
        setSuccessMsg(`Đăng ký Google thành công! Chào mừng ${selectedName}.`);
        setTimeout(() => {
          onRegisterSuccess('CUSTOMER');
        }, 500);
      } else {
        setErrorMsg(response.error || 'Đăng ký Google thất bại.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ khi đăng ký Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in font-sans">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} />
        </button>
        <div className="text-lg font-semibold text-gray-800">Tạo tài khoản Khách hàng ZShop</div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-8 flex flex-col max-w-md mx-auto w-full">
        {/* Logo & Subtitle */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-brand-600 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 text-white mb-3">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-gray-900 font-bold text-2xl tracking-tight">ZShop E-Commerce</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">Đăng ký tài khoản Khách hàng thành viên để tích điểm VIP & mua sắm 3D</p>
        </div>

        {/* Thông báo Lỗi / Thành công */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <X size={18} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Đăng ký */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          
          {/* Thông tin vai trò mặc định */}
          <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl flex items-center justify-between">
            <div className="text-xs font-semibold text-brand-800">
              🛒 Tác nhân đăng ký: <span className="font-bold">Khách hàng (Customer)</span>
            </div>
            <span className="text-[10px] font-bold bg-brand-600 text-white px-2 py-0.5 rounded-full">Tích điểm VIP</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email đăng ký</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 3 ký tự"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Khớp với mật khẩu trên"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={isLoading || !email || !password || !name}
              className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2
                ${email && password && name && !isLoading 
                  ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-200 cursor-pointer active:scale-[0.99]' 
                  : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang khởi tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Hoàn tất đăng ký</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Hoặc đăng ký nhanh</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Social Register */}
        <div className="space-y-2.5">
          <button 
            type="button" 
            disabled={isLoading} 
            onClick={handleGoogleRegister} 
            className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-blue-400 transition-all disabled:opacity-60 group"
          >
            <GoogleIcon />
            <span className="text-sm text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
              Đăng ký nhanh bằng Google
            </span>
          </button>
        </div>

        {/* Chuyển sang Đăng nhập */}
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Đã có tài khoản? </span>
          <button onClick={onGoToLogin} className="text-brand-600 font-semibold hover:underline">
            Đăng nhập ngay
          </button>
        </div>
      </div>

      {/* Modal: Hộp thoại Đăng ký bằng Google (Lưu vào Database Users & Customers) */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <GoogleIcon />
                <span className="font-semibold text-gray-900 text-lg">Đăng ký bằng Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 mb-4">
              <p className="text-sm text-gray-600">
                Chọn tài khoản Google của bạn để tự động tạo tài khoản trong CSDL <strong>ZShop (SQL Server)</strong>:
              </p>
            </div>

            {/* Danh sách tài khoản mẫu 1-chạm */}
            <div className="space-y-2.5 mb-5">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('khanhnguyen.ai@gmail.com', 'Nguyễn Quốc Khánh')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  K
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Nguyễn Quốc Khánh</div>
                  <div className="text-xs text-gray-500 truncate">khanhnguyen.ai@gmail.com</div>
                </div>
                <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Google Auth</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('hoangnam.dev@gmail.com', 'Nguyễn Hoàng Nam')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  N
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Nguyễn Hoàng Nam</div>
                  <div className="text-xs text-gray-500 truncate">hoangnam.dev@gmail.com</div>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Google Auth</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('thuylinh.zshop@gmail.com', 'Trần Thùy Linh')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  L
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Trần Thùy Linh</div>
                  <div className="text-xs text-gray-500 truncate">thuylinh.zshop@gmail.com</div>
                </div>
                <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Google Auth</span>
              </button>
            </div>

            {/* Tùy chọn nhập email Google cá nhân */}
            <div className="border-t border-gray-100 pt-4">
              <label className="text-xs font-semibold text-gray-700 block mb-2">Hoặc nhập email Google (@gmail.com) cá nhân:</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="tenban@gmail.com"
                  className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount(customGoogleEmail.trim(), 'Google User')}
                  disabled={!customGoogleEmail.includes('@')}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-all shadow-sm"
                >
                  Tạo tài khoản
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Hệ thống sẽ khởi tạo bản ghi trong bảng <code>Users</code> (provider: 'google') và <code>Customers</code> trên SQL Server.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
