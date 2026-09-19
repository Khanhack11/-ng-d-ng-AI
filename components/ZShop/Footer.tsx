import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm border-t border-gray-200 mt-12 pb-8">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Column 1: Customer Care */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 uppercase">Chăm sóc khách hàng</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary transition">Trung Tâm Trợ Giúp</a></li>
            <li><a href="#" className="hover:text-primary transition">ZS-Economy Blog</a></li>
            <li><a href="#" className="hover:text-primary transition">ZS-Economy Mall</a></li>
            <li><a href="#" className="hover:text-primary transition">Hướng Dẫn Mua Hàng</a></li>
            <li><a href="#" className="hover:text-primary transition">Thanh Toán</a></li>
            <li><a href="#" className="hover:text-primary transition">Vận Chuyển</a></li>
          </ul>
        </div>

        {/* Column 2: About Shopee */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 uppercase">Về ZS-Economy</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary transition">Giới Thiệu</a></li>
            <li><a href="#" className="hover:text-primary transition">Tuyển Dụng</a></li>
            <li><a href="#" className="hover:text-primary transition">Điều Khoản ZS-Economy</a></li>
            <li><a href="#" className="hover:text-primary transition">Chính Sách Bảo Mật</a></li>
            <li><a href="#" className="hover:text-primary transition">Chính Hãng</a></li>
            <li><a href="#" className="hover:text-primary transition">Kênh Người Bán</a></li>
          </ul>
        </div>

        {/* Column 3: Payment & Logistics */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 uppercase">Thanh Toán</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-white shadow p-2 border border-gray-200 text-center text-xs">Visa</div>
            <div className="bg-white shadow p-2 border border-gray-200 text-center text-xs">JCB</div>
            <div className="bg-white shadow p-2 border border-gray-200 text-center text-xs">COD</div>
          </div>
          
          <h3 className="font-bold text-gray-800 mb-4 uppercase">Đơn Vị Vận Chuyển</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white shadow p-2 border border-gray-200 text-center text-xs">SPX</div>
            <div className="bg-white shadow p-2 border border-gray-200 text-center text-xs">GHN</div>
            <div className="bg-white shadow p-2 border border-gray-200 text-center text-xs">J&T</div>
          </div>
        </div>

        {/* Column 4: Social Media */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 uppercase">Theo Dõi Chúng Tôi Trên</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary transition flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded-full"></div> Facebook</a></li>
            <li><a href="#" className="hover:text-primary transition flex items-center gap-2"><div className="w-4 h-4 bg-pink-500 rounded-full"></div> Instagram</a></li>
            <li><a href="#" className="hover:text-primary transition flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded-full"></div> LinkedIn</a></li>
          </ul>
        </div>

        {/* Column 5: App Download */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 uppercase">Tải Ứng Dụng ZS-Economy</h3>
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-400">QR Code</div>
            <div className="flex flex-col gap-2">
              <div className="bg-white px-2 py-1 border border-gray-200 text-xs text-center">App Store</div>
              <div className="bg-white px-2 py-1 border border-gray-200 text-xs text-center">Google Play</div>
              <div className="bg-white px-2 py-1 border border-gray-200 text-xs text-center">AppGallery</div>
            </div>
          </div>
        </div>
        
      </div>
      
      <div className="border-t border-gray-200 pt-8 mt-4 text-center">
        <p>© 2026 ZS-Economy. Tất cả các quyền được bảo lưu.</p>
        <p className="mt-2">Quốc gia & Khu vực: Singapore | Indonesia | Đài Loan | Thái Lan | Malaysia | Việt Nam</p>
      </div>
    </footer>
  );
};

export default Footer;
