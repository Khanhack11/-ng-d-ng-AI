import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowLeft, Eye, EyeOff, ShoppingBag, X, CheckCircle2, ShieldCheck, Store, UserCheck, Sparkles, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { AuthService } from '../services';

interface LoginPageProps {
  onLoginSuccess: (role: 'CUSTOMER' | 'ADMIN' | 'SALES' | 'WAREHOUSE') => void;
  onBack: () => void;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.94 21.1C22.2 19.01 23.52 15.92 23.52 12.29Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.96 22.92 19.94 21.1L16.08 18.1C15 18.82 13.62 19.24 12 19.24C8.87 19.24 6.22 17.13 5.27 14.29L1.29 17.38C3.26 21.3 7.31 24 12 24Z" fill="#34A853"/>
    <path d="M5.27 14.29C5.03 13.57 4.9 12.8 4.9 12C4.9 11.2 4.77 10.43 5.53 9.71L1.29 6.62C0.47 8.24 0 10.06 0 12C0 13.94 0.47 15.76 1.29 17.38L5.27 14.29Z" fill="#FBBC05"/>
    <path d="M12 4.76C13.76 4.76 15.35 5.37 16.59 6.56L20.03 3.12C17.96 1.18 15.24 0 12 0C7.31 0 3.26 2.7 1.29 6.62L5.53 9.71C6.22 6.87 8.87 4.76 12 4.76Z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12C24 5.373 18.627 0 12 0C5.373 0 0 5.373 0 12C0 17.989 4.388 22.954 10.125 23.854V15.469H7.078V12H10.125V9.356C10.125 6.349 11.916 4.688 14.658 4.688C15.97 4.688 17.344 4.922 17.344 4.922V7.875H15.831C14.34 7.875 13.875 8.794 13.875 9.738V12H17.203L16.671 15.469H13.875V23.854C19.612 22.954 24 17.989 24 12Z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

type TargetRole = 'CUSTOMER' | 'SALES' | 'WAREHOUSE' | 'ADMIN';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack, onGoToRegister, onGoToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState<TargetRole>('CUSTOMER');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Tự động kiểm tra trạng thái Backend & điền email đã nhớ
  useEffect(() => {
    const savedEmail = AuthService.getRememberEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword('123');
    } else {
      // Mặc định điền tài khoản Customer mẫu
      setEmail('customer@test.com');
      setPassword('123');
    }

    AuthService.checkBackendHealth().then((status) => {
      setIsBackendOnline(status);
    });
  }, []);

  // Đổi Role Tab tự động điền thông tin tài khoản mẫu theo 4 Tác nhân UML
  const handleSelectRoleTab = (role: TargetRole) => {
    setActiveTab(role);
    setErrorMsg('');
    if (role === 'CUSTOMER') {
      setEmail('customer@test.com');
      setPassword('123');
    } else if (role === 'SALES') {
      setEmail('sales@test.com');
      setPassword('123');
    } else if (role === 'WAREHOUSE') {
      setEmail('warehouse@test.com');
      setPassword('123');
    } else if (role === 'ADMIN') {
      setEmail('admin@test.com');
      setPassword('123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (rememberMe) {
        AuthService.saveRememberEmail(email.trim());
      } else {
        AuthService.saveRememberEmail('');
      }

      const data = await AuthService.login(email.trim(), password);
      if (data.success) {
        const roleName =
          data.role === 'ADMIN'
            ? 'Admin (Chủ cửa hàng)'
            : data.role === 'SALES'
            ? 'Nhân viên Bán hàng'
            : data.role === 'WAREHOUSE'
            ? 'Nhân viên Kho'
            : 'Khách hàng';
        const offlineNotice = data.isOffline ? ' (Chế độ Ngoại tuyến)' : ' (Đã kết nối CSDL)';
        setSuccessMsg(`Đăng nhập thành công với vai trò ${roleName}${offlineNotice}! Đang chuyển hướng...`);
        setTimeout(() => {
          onLoginSuccess(data.role as any);
        }, 500);
      } else {
        setErrorMsg(data.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error: any) {
      setErrorMsg(error?.message || 'Có lỗi phát sinh khi xử lý yêu cầu đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialTokenLogin = async (provider: 'google' | 'facebook' | 'apple', token: string, profile?: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await AuthService.socialLogin(provider, token, profile);
      if (!data.success) {
        setErrorMsg(data.error || 'Đăng nhập mạng xã hội thất bại.');
        return;
      }
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
        onLoginSuccess(data.role as any);
      }, 500);
    } catch (e: any) {
      setErrorMsg(e.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (selectedEmail: string, selectedName: string) => {
    setShowGoogleModal(false);
    await handleSocialTokenLogin('google', 'google_session_verified', {
      email: selectedEmail,
      name: selectedName,
      providerUserId: `google_${selectedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1d1a] via-[#2a251f] to-[#171614] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#d4b996]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#8c6f46]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-[#faf8f5] rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 border border-[#d4b996]/60 backdrop-blur-md">
        
        {/* Top Back button & Brand */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors p-1.5 rounded-lg hover:bg-stone-200/60"
          >
            <ArrowLeft size={16} />
            <span>Về Showroom</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#1e1d1a] bg-[#e5c9a3] px-2.5 py-0.5 rounded-md border border-[#c5a880]">
              Mô hình 4 Tác Nhân Cửa Hàng Nhỏ
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">Đăng Nhập Thế Giới iPhone</h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Chọn 1 trong 4 tác nhân vận hành cửa hàng bán lẻ iPhone chính hãng VN/A</p>
        </div>

        {/* Role Switcher Tabs (4 Tác nhân chuẩn Cửa hàng nhỏ) */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>4 Tác Nhân Phục Vụ Cửa Hàng Nhỏ:</span>
            <span className="text-[#8c6f46] font-black">1-Click Điền Tài Khoản Mẫu</span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-200/70 rounded-2xl border border-stone-300">
            
            {/* 1. Customer (Khách hàng) */}
            <button
              type="button"
              onClick={() => handleSelectRoleTab('CUSTOMER')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'CUSTOMER'
                  ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-md font-black'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <UserCheck size={14} />
              <span>1. Khách hàng (Mua iPhone)</span>
            </button>

            {/* 2. Sales (Nhân viên bán hàng) */}
            <button
              type="button"
              onClick={() => handleSelectRoleTab('SALES')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'SALES'
                  ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-md font-black'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <ShoppingBag size={14} />
              <span>2. Nhân viên Bán hàng (POS)</span>
            </button>

            {/* 3. Warehouse (Nhân viên kho) */}
            <button
              type="button"
              onClick={() => handleSelectRoleTab('WAREHOUSE')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'WAREHOUSE'
                  ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-md font-black'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <Store size={14} />
              <span>3. Nhân viên Kho (VN/A)</span>
            </button>

            {/* 4. Admin (Chủ cửa hàng) */}
            <button
              type="button"
              onClick={() => handleSelectRoleTab('ADMIN')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'bg-[#1e1d1a] text-[#e5c9a3] shadow-md font-black'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck size={14} />
              <span>4. Admin (Chủ cửa hàng)</span>
            </button>
          </div>
        </div>

        {/* Alerts: Error & Success */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-700 text-xs font-medium">
            <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold shadow-sm">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email / Username Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email đăng nhập
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-100 transition-all font-medium"
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">Mật khẩu</label>
              <button 
                type="button" 
                onClick={onGoToForgotPassword} 
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-100 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
              />
              <span>Ghi nhớ đăng nhập trên thiết bị này</span>
            </label>
          </div>

          {/* Submit Button with Role-themed Gradient */}
          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 select-none active:scale-[0.99] ${
              activeTab === 'CUSTOMER'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
                : activeTab === 'SALES'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-sky-500/25'
                : activeTab === 'WAREHOUSE'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-500/25'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25'
            } ${(!email || !password || isLoading) ? 'opacity-60 cursor-not-allowed shadow-none' : 'hover:shadow-xl'}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý đăng nhập...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập hệ thống ZShop</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 uppercase font-semibold">
                  {activeTab}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="px-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Hoặc tiếp tục với
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowGoogleModal(true)}
            className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-blue-400 transition-all text-sm font-semibold text-gray-700 group"
          >
            <GoogleIcon />
            <span className="group-hover:text-blue-600 transition-colors">Đăng nhập tài khoản Google</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialTokenLogin('facebook', 'mock_fb_token', { email: 'facebook.user@zshop.vn', name: 'Facebook User' })}
              className="bg-white border border-gray-200 shadow-sm rounded-xl py-2 px-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialTokenLogin('apple', 'mock_apple_token', { email: 'apple.user@zshop.vn', name: 'Apple User' })}
              className="bg-white border border-gray-200 shadow-sm rounded-xl py-2 px-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
            >
              <AppleIcon />
              <span>Apple ID</span>
            </button>
          </div>
        </div>

        {/* Bottom Register Prompt */}
        <div className="mt-7 text-center text-xs sm:text-sm text-gray-500">
          <span>Chưa có tài khoản ZShop? </span>
          <button
            onClick={onGoToRegister}
            className="text-brand-600 font-bold hover:underline hover:text-brand-700 transition-colors"
          >
            Đăng ký tài khoản ngay
          </button>
        </div>
      </div>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <GoogleIcon />
                <span className="font-bold text-gray-900 text-lg">Chọn tài khoản Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-gray-600 my-4 leading-relaxed">
              Chọn tài khoản Google xác thực để liên kết với hệ thống ZShop:
            </p>

            <div className="space-y-2.5 mb-5">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('khanhnguyen.ai@gmail.com', 'Nguyễn Quốc Khánh')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  K
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Nguyễn Quốc Khánh
                  </div>
                  <div className="text-xs text-gray-500 truncate">khanhnguyen.ai@gmail.com</div>
                </div>
                <span className="text-[11px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                  Google Auth
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('hoangnam.dev@gmail.com', 'Nguyễn Hoàng Nam')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  N
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Nguyễn Hoàng Nam
                  </div>
                  <div className="text-xs text-gray-500 truncate">hoangnam.dev@gmail.com</div>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
                  Google Auth
                </span>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Hoặc nhập email Google (@gmail.com) của bạn:
              </label>
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
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-all shadow-sm"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;