import React from 'react';

const mockCategories = [
  { id: 1, name: "iPhone 17 & 18", icon: "🚀", keyword: "iPhone 17 & 18 Series" },
  { id: 2, name: "iPhone 16 Series", icon: "🌟", keyword: "iPhone 16 Series" },
  { id: 3, name: "iPhone 15 Series", icon: "💎", keyword: "iPhone 15 Series" },
  { id: 4, name: "iPhone 14 Series", icon: "📱", keyword: "iPhone 14 Series" },
  { id: 5, name: "iPhone 13 Series", icon: "✨", keyword: "iPhone 13 Series" },
  { id: 6, name: "iPhone 12 Series", icon: "⚡", keyword: "iPhone 12 Series" },
  { id: 7, name: "iPhone 11 Series", icon: "🎯", keyword: "iPhone 11 Series" },
  { id: 8, name: "iPhone X / XS / XR", icon: "👑", keyword: "iPhone Tràn Viền & Face ID" },
  { id: 9, name: "iPhone 6 / 7 / 8", icon: "🕰️", keyword: "iPhone Cổ Điển & Sưu Tầm" },
  { id: 10, name: "Phụ Kiện Apple", icon: "🎧", keyword: "Phụ Kiện Apple Chính Hãng" },
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
