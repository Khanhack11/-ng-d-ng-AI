import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1d1a] text-stone-300 text-sm border-t border-[#c5a880]/30 mt-12 pb-8">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Thương hiệu Thế Giới iPhone */}
        <div>
          <div className="text-xl font-black tracking-tight mb-2">
            <span className="text-stone-100">Thế Giới </span>
            <span className="text-[#d4b996]">iPhone</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed mb-3">
            Cửa hàng chuyên kinh doanh Điện Thoại iPhone Chính Hãng VN/A & iPhone Sưu Tầm nguyên zin từ iPhone 4s đến iPhone 18 Pro Max.
          </p>
          <div className="inline-block bg-[#2a2722] border border-[#c5a880]/40 text-[#e5c9a3] text-[11px] font-semibold px-3 py-1 rounded-lg">
            🤖 Hỗ trợ bởi AI Thế Giới iPhone 24/7
          </div>
        </div>

        {/* Column 2: Chính sách bảo hành */}
        <div>
          <h3 className="font-bold text-[#e5c9a3] mb-3 uppercase text-xs tracking-wider">Chính Sách Thế Giới iPhone</h3>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>• Bảo hành chính hãng Apple VN/A 12 tháng</li>
            <li>• Lỗi 1 đổi 1 trong 30 ngày đầu tiên</li>
            <li>• Thu cũ lên đời iPhone 17 / 18 Pro Max trợ giá cao</li>
            <li>• Miễn phí giao hàng hỏa tốc 2h nội thành</li>
          </ul>
        </div>

        {/* Column 3: Các dòng máy chủ lực */}
        <div>
          <h3 className="font-bold text-[#e5c9a3] mb-3 uppercase text-xs tracking-wider">Dòng iPhone Nổi Bật</h3>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>• iPhone 18 Pro Max / 18 Pro (Flagship 2026)</li>
            <li>• iPhone 17 Pro Max / iPhone 17 Air Siêu Mỏng</li>
            <li>• iPhone 16 Pro Max / 15 Pro Max Khung Titan</li>
            <li>• iPhone 4s / 8 Plus / XS Max Sưu Tầm Zin</li>
          </ul>
        </div>

        {/* Column 4: Thanh Toán & Hỗ Trợ */}
        <div>
          <h3 className="font-bold text-[#e5c9a3] mb-3 uppercase text-xs tracking-wider">Thanh Toán & Giao Nhận</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#2a2722] border border-[#c5a880]/30 rounded p-2 text-center text-xs text-stone-200 font-semibold">VietQR</div>
            <div className="bg-[#2a2722] border border-[#c5a880]/30 rounded p-2 text-center text-xs text-stone-200 font-semibold">Trả Góp 0%</div>
            <div className="bg-[#2a2722] border border-[#c5a880]/30 rounded p-2 text-center text-xs text-stone-200 font-semibold">COD</div>
          </div>
          <p className="text-xs text-stone-400">
            Hotline Tư Vấn: <strong className="text-[#e5c9a3]">1900.6868</strong> (08:00 - 22:00)
          </p>
        </div>
        
      </div>
      
      <div className="border-t border-white/10 pt-6 mt-2 text-center text-xs text-stone-400">
        <p>© 2026 <strong className="text-[#e5c9a3]">Thế Giới iPhone</strong> — Chuyên Điện Thoại iPhone Chính Hãng & Trợ Lý AI Thế Giới iPhone.</p>
      </div>
    </footer>
  );
};

export default Footer;
