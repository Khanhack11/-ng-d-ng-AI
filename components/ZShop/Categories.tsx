import React from 'react';

const mockCategories = [
  { id: 1, name: "Thời Trang Nam", icon: "👕" },
  { id: 2, name: "Điện Thoại & Phụ Kiện", icon: "📱" },
  { id: 3, name: "Thiết Bị Điện Tử", icon: "💻" },
  { id: 4, name: "Máy Tính & Laptop", icon: "🖥️" },
  { id: 5, name: "Máy Ảnh - Máy Quay", icon: "📷" },
  { id: 6, name: "Đồng Hồ", icon: "⌚" },
  { id: 7, name: "Giày Dép Nam", icon: "👟" },
  { id: 8, name: "Thiết Bị Gia Dụng", icon: "📻" },
  { id: 9, name: "Thể Thao & Du Lịch", icon: "⚽" },
  { id: 10, name: "Ô Tô & Xe Máy", icon: "🚗" },
  { id: 11, name: "Thời Trang Nữ", icon: "👗" },
  { id: 12, name: "Mẹ & Bé", icon: "🍼" },
];

const Categories: React.FC = () => {
  const handleCategoryClick = (catName: string) => {
    let searchKeyword = catName;
    if (catName.includes('Giày')) searchKeyword = 'giày';
    else if (catName.includes('Đồng Hồ')) searchKeyword = 'đồng hồ';
    else if (catName.includes('Nam')) searchKeyword = 'nam';
    else if (catName.includes('Nữ')) searchKeyword = 'nữ';

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
                onClick={() => handleCategoryClick(cat.name)}
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
