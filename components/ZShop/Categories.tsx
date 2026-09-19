import React from 'react';

const mockCategories = [
  { id: 1, name: "Điện Thoại Thông Minh", icon: "📱", keyword: "Điện Thoại" },
  { id: 2, name: "Củ Sạc Nhanh GaN", icon: "⚡", keyword: "Củ Sạc" },
  { id: 3, name: "Cáp Sạc & Dây Cáp", icon: "🔌", keyword: "Cáp Sạc" },
  { id: 4, name: "Pin Sạc Dự Phòng", icon: "🔋", keyword: "Sạc Dự Phòng" },
  { id: 5, name: "Tai Nghe & Âm Thanh", icon: "🎧", keyword: "Tai Nghe" },
  { id: 6, name: "Ốp Lưng & Bao Da", icon: "🛡️", keyword: "Ốp Lưng" },
  { id: 7, name: "Kính Cường Lực & Dán PPF", icon: "🪟", keyword: "Cường Lực" },
  { id: 8, name: "Trạm Sạc Không Dây", icon: "🧲", keyword: "Trạm Sạc" },
  { id: 9, name: "Giá Đỡ & Gimbal AI", icon: "📐", keyword: "Giá Đỡ" },
  { id: 10, name: "Phụ Kiện Tiện Ích", icon: "✨", keyword: "Phụ Kiện" },
];

const Categories: React.FC = () => {
  const handleCategoryClick = (cat: typeof mockCategories[0]) => {
    const searchKeyword = cat.keyword || cat.name;

    window.dispatchEvent(new CustomEvent('zshop:search', { detail: { keyword: searchKeyword } }));

    const el = document.getElementById('all-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 uppercase text-gray-500 font-semibold text-sm flex items-center justify-between">
          <span>Danh Mục Nổi Bật</span>
          <span className="text-xs font-normal text-gray-400">Bấm vào để lọc sản phẩm</span>
        </div>
        
        {/* Horizontal scroll on mobile, wrap on PC */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex sm:grid sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 min-w-max sm:min-w-0">
            {mockCategories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat)}
                className="w-24 sm:w-auto p-4 border-r border-b border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:bg-brand-50/50 transition group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="text-xs text-center text-gray-700 leading-tight group-hover:text-brand-600 font-medium">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
