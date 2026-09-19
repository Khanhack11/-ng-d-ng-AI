import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const banner1 = "/image_banner/Banner1.jpg";
const banner2 = "/image_banner/Banner2.jpg";
const banner3 = "/image_banner/Banner3.jpg";
const banner4 = "/image_banner/Banner4.jpg";

const HeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [banner1, banner2, banner3,banner4];

  // Tự động chuyển banner sau mỗi 4 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToNext = () => setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const goToPrev = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="container mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Main Slider */}
      <div className="md:col-span-2 h-32 sm:h-48 md:h-[256px] rounded-sm overflow-hidden relative bg-gray-200 group">
        <img
          src={banners[currentIndex]}
          alt={`Banner ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 hidden group-hover:block transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 hidden group-hover:block transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary ring-2 ring-white' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>

      {/* Side Banners (Visible on md and up) */}
      <div className="hidden md:flex flex-col gap-2 md:h-[256px]">
        <div className="flex-1 rounded-sm overflow-hidden bg-gray-200">
          <img
            src={banners[1]}
            alt="Side Banner 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 rounded-sm overflow-hidden bg-gray-200">
          <img
            src={banner4}
            alt="Side Banner 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
