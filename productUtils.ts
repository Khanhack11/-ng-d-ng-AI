/**
 * Product Utilities:
 * - Chuẩn hóa tiếng Việt & tìm kiếm thông minh (có dấu / không dấu)
 * - Tự động tạo phân loại bộ nhớ (Storage) & màu sắc chuẩn Apple
 * - Tự động tạo thông số kỹ thuật, tương thích và cam kết bảo hành Apple chính hãng
 */

export interface ProductMeta {
  sizes: string[];
  colors: string[];
  highlights: string[];
  description: string;
}

/**
 * Chuẩn hóa chuỗi tiếng Việt thành chữ thường không dấu
 * Ví dụ: "iPhone 16 Pro Max" -> "iphone 16 pro max"
 */
export function normalizeVietnamese(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * So khớp từ khóa tìm kiếm thông minh:
 * - Hỗ trợ gõ có dấu ("điện thoại", "củ sạc") hoặc không dấu ("dien thoai", "cu sac")
 * - Tìm kiếm theo model ("ip 16", "16 prm", "airpods pro")
 */
export function matchSearchKeyword(text: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!text) return false;

  const rawQuery = query.trim().toLowerCase();
  const rawText = text.toLowerCase();

  const normQuery = normalizeVietnamese(rawQuery);
  const normText = normalizeVietnamese(rawText);

  // Khớp nguyên cụm từ
  if (normText.includes(normQuery)) {
    return true;
  }

  // Khớp từng từ (tất cả các từ trong query phải xuất hiện trong text)
  const queryWords = normQuery.split(/\s+/).filter(Boolean);
  const textWords = normText.split(/[\s,.\-_/\\+]+/).filter(Boolean);

  if (queryWords.length === 0) return true;

  return queryWords.every(qWord => {
    if (qWord.length <= 2) {
      return textWords.some(tWord => tWord === qWord);
    }
    return textWords.some(tWord => tWord.includes(qWord));
  });
}

/**
 * Tạo bảng dung lượng (Storage), màu sắc chính hãng và thông số kỹ thuật chuẩn Apple
 */
export function generateProductMeta(name = '', category = ''): ProductMeta {
  const normName = normalizeVietnamese(name);
  const normCat = normalizeVietnamese(category);
  const combined = `${normName} ${normCat}`;

  const has = (...keywords: string[]) => keywords.some(kw => combined.includes(normalizeVietnamese(kw)));

  // 1. Phụ kiện Củ sạc Apple
  if (has('cu sac', 'adapter', 'power adapter', 'sac nhanh 20w', 'sac 35w')) {
    const is35W = has('35w', 'dual');
    const sizes = is35W ? ['35W Dual Type-C'] : ['20W Type-C'];
    const colors = ['Trắng Tiêu Chuẩn Apple'];

    return {
      sizes,
      colors,
      highlights: [
        'Công nghệ sạc nhanh chuẩn Power Delivery (PD) sạc 50% trong 30 phút',
        'Chip điều chỉnh dòng sạc thông minh chống quá nhiệt, chống chai pin',
        'Tương thích toàn diện iPhone 8 đến iPhone 18 Pro Max, iPad và Apple Watch'
      ],
      description: `⚡ THÔNG SỐ & HIỆU NĂNG SẠC NHANH:
• Chuẩn sạc nhanh Power Delivery (PD) công suất tối ưu cho các thế hệ iPhone và thiết bị Apple.
• Kiểm soát nhiệt độ tự động, hạn chế tối đa tình trạng nóng máy và bảo vệ tuổi thọ pin (Battery Health).
• Chân cắm chuẩn thị trường Việt Nam chắc chắn, nhỏ gọn thuận tiện mang theo di chuyển.

🔌 KHẢ NĂNG TƯƠNG THÍCH:
• iPhone: Tương thích 100% các dòng iPhone từ iPhone 8 đến iPhone 18 Pro Max.
• iPad / Apple Watch / AirPods: Tự động nhận diện công suất an toàn cho từng thiết bị.

🛡️ CHÍNH SÁCH BẢO HÀNH ZSHOP APPLE:
• Cam kết 100% phụ kiện Apple chính hãng có số Serial kiểm tra trên hệ thống.
• Bảo hành lỗi 1 đổi 1 trong 12 tháng trên toàn quốc.`
    };
  }

  // 2. Phụ kiện Cáp sạc Apple (Type-C / Lightning)
  if (has('cap sac', 'cable', 'lightning', 'type-c to type-c', 'usb-c to usb-c')) {
    const isLightning = has('lightning');
    const sizes = ['1m', '2m'];
    const colors = has('boc du', 'woven') ? ['Trắng Bọc Dù Chống Đứt'] : ['Trắng Tiêu Chuẩn Apple'];

    return {
      sizes,
      colors,
      highlights: [
        isLightning ? 'Chứng chỉ Apple MFi (Made for iPhone/iPad) chính thức' : 'Hỗ trợ sạc nhanh công suất cao lên đến 60W / 100W',
        'Lõi đồng nguyên chất bọc sợi dệt dù bền bỉ chống đứt gãy, chống rối',
        'Tốc độ đồng bộ dữ liệu cao, an toàn tuyệt đối cho thiết bị'
      ],
      description: `⚡ THÔNG SỐ KỸ THUẬT:
• Chiều dài dây: 1 mét / 2 mét linh hoạt phục vụ nhu cầu sạc tại bàn làm việc hoặc giường ngủ.
• ${isLightning ? 'Đầu nối Lightning mạ vàng chống oxy hóa, tích hợp chip C94 Apple chính hãng.' : 'Đầu nối USB-C tương thích chuẩn quốc tế tốc độ truyền tải dữ liệu cao.'}
• Vật liệu thân thiện môi trường, lớp vỏ bọc gia cố độ bền uốn gập hơn 10.000 lần.

🛡️ CHÍNH SÁCH BẢO HÀNH ZSHOP:
• Bảo hành 1 đổi 1 trong 12 tháng nếu đứt ngầm hoặc không nhận sạc.`
    };
  }

  // 3. Phụ kiện Tai nghe Apple AirPods (AirPods Pro, AirPods Max, AirPods 4/5)
  if (has('airpods', 'tai nghe', 'earpods', 'headphone')) {
    const isMax = has('max');
    const sizes = isMax ? ['Over-Ear Chụp Tai'] : ['Tiêu Chuẩn In-Ear'];
    const colors = isMax
      ? ['Xanh Đêm (Midnight)', 'Ánh Sao (Starlight)', 'Xanh Lam', 'Tím', 'Cam']
      : ['Trắng Bóng Apple'];

    return {
      sizes,
      colors,
      highlights: [
        'Công nghệ chống ồn chủ động ANC (Active Noise Cancellation) đỉnh cao',
        'Âm thanh không gian cá nhân hóa Spatial Audio theo dõi chuyển động đầu',
        'Thời lượng pin bền bỉ cả ngày dài kết hợp hộp sạc MagSafe tiện lợi'
      ],
      description: `🎵 TRẢI NGHIỆM ÂM THANH ĐỈNH CAO:
• Chip xử lý âm thanh Apple H2 thế hệ mới khử tiếng ồn môi trường gấp 2 lần.
• Chế độ Xuyên Âm (Transparency Mode) thích ứng giúp lắng nghe môi trường xung quanh tự nhiên.
• Kết nối liền mạch trong tích tắc với iPhone, iPad, Apple Watch và máy tính Mac.

🔋 THỜI LƯỢNG PIN & SẠC:
• Thời gian nghe nhạc liên tục lên đến 6 - 30 giờ (khi kèm hộp sạc).
• Hỗ trợ sạc nhanh không dây chuẩn MagSafe và cổng sạc USB-C hiện đại.

🛡️ BẢO HÀNH CHÍNH HÃNG:
• Bảo hành 1 đổi 1 trong 12 tháng tại các trung tâm ZShop Authorized Service.`
    };
  }

  // 4. Phụ kiện Sạc MagSafe / Pin sạc dự phòng
  if (has('magsafe', 'pin du phong', 'de sac', 'battery pack')) {
    return {
      sizes: ['Tiêu Chuẩn MagSafe'],
      colors: ['Bạc Kim Loại', 'Trắng Gốm Ceramic'],
      highlights: [
        'Lực hút nam châm Neodymium từ tính siêu mạnh hít chặt vào mặt lưng',
        'Công suất sạc nhanh không dây 15W - 25W chuẩn Qi2 tối ưu nhiệt độ',
        'Thiết kế siêu mỏng nhẹ, bề mặt êm ái chống trầy xước lưng iPhone'
      ],
      description: `🧲 ĐẶC ĐIỂM CÔNG NGHỆ MAGSAFE:
• Tự động căn chuẩn vòng nam châm ở mặt lưng iPhone giúp truyền điện năng hiệu suất cao nhất.
• Hiển thị widget mức pin thông minh trực tiếp trên màn hình iOS.
• Tương thích hoàn hảo với iPhone 12, 13, 14, 15, 16, 17 và 18 Pro Max.

🛡️ BẢO HÀNH ZSHOP:
• Bảo hành 12 tháng chính hãng 1 đổi 1.`
    };
  }

  // 5. Ốp lưng & Kính cường lực
  if (has('op lung', 'kinh cuong luc', 'mieng dan', 'dan man hinh', 'case')) {
    return {
      sizes: ['iPhone 11 - 14 Series', 'iPhone 15 - 16 Series', 'iPhone 17 - 18 Series'],
      colors: ['Trong Suốt (Clear)', 'Titan Đen', 'Xanh Biển Sâu', 'Titan Sa Mạc'],
      highlights: [
        'Chất liệu cao cấp chống ố vàng và chống trầy xước chuẩn độ cứng 9H',
        'Tích hợp vòng từ tính MagSafe hít chắc chắn với mọi phụ kiện',
        'Viền gờ nhô cao bảo vệ toàn diện cụm camera và màn hình trước va đập'
      ],
      description: `🛡️ BẢO VỆ TOÀN DIỆN THIẾT BỊ:
• Kính cường lực siêu mỏng chuẩn hiển thị HD trong suốt 99.9%, phủ nano chống bám dầu vân tay.
• Ốp lưng chịu lực chống sốc theo tiêu chuẩn quân đội, bảo vệ máy khi rơi từ độ cao 2 mét.
• Cắt khoét chuẩn xác từng phím bấm Action Button và Camera Control.`
    };
  }

  // 6. iPhone (iPhone 6 -> iPhone 18 Pro Max) - Mặc định cho mọi dòng máy
  const isOldIphone = has('iphone 6', 'iphone 7', 'iphone 8', 'iphone x', 'co dien', 'suu tam');
  const isFlagship = has('pro max', '16 pro', '17 pro', '18 pro');

  const sizes = isOldIphone 
    ? ['64GB', '128GB', '256GB']
    : isFlagship 
      ? ['256GB', '512GB', '1TB'] 
      : ['128GB', '256GB', '512GB'];

  let colors = ['Đỏ Rượu Vang Burgundy Titan (Mới)', 'Xanh Băng Hà Glacier Blue Titan (Mới)', 'Cà Phê Mocha Titan (Mới)', 'Bạc Platinum Titan', 'Đen Không Gian Titan', 'Vàng Sa Mạc Titan'];
  if (isOldIphone) {
    colors = ['Xám Không Gian (Space Gray)', 'Bạc (Silver)', 'Vàng Kim (Gold)', 'Đỏ (Product RED)'];
  } else if (has('17') && has('pro')) {
    colors = ['Xanh Lá Trà Xanh Teal Titan (Mới)', 'Xanh Lam Cobalt Titan (Mới)', 'Vàng Đồng Amber Titan (Mới)', 'Bạc Platinum Titan', 'Đen Không Gian Titan'];
  } else if (has('16') && has('pro')) {
    colors = ['Vàng Sa Mạc Desert Titanium (Mới)', 'Xanh Rừng Sâu Forest Titan (Mới)', 'Xám Khói Ash Titan (Mới)', 'Titan Tự Nhiên (Natural)', 'Titan Trắng', 'Titan Đen'];
  } else if (has('16', '15', '14', '13') && !has('pro')) {
    colors = ['Xanh Lưu Ly Ultramarine (Mới)', 'Xanh Mòng Két Teal (Mới)', 'Hồng Đào Peony (Mới)', 'Trắng Starlight', 'Đen Midnight'];
  }

  return {
    sizes,
    colors,
    highlights: [
      'Màn hình Super Retina XDR OLED sắc nét, True Tone bảo vệ mắt',
      'Hệ thống camera Apple chuyên nghiệp quay video 4K điện ảnh Cinematic Mode',
      'Chip Apple Silicon Bionic / A-Series siêu mạnh mẽ, tối ưu thời lượng pin'
    ],
    description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Sản phẩm iPhone chính hãng tiêu chuẩn Apple VN/A, máy tuyển chọn likenew 99% nguyên bản hoặc mới 100%.
• Thiết kế sang trọng đỉnh cao, khung viền bền bỉ cùng kính cường lực Ceramic Shield chống trầy xước tối đa.
• Cụm camera nhiếp ảnh thuật toán thông minh, chụp đêm Night Mode, xóa phông Portrait Mode sắc nét từng chi tiết.
• Hiệu năng chip Apple vượt trội, vận hành mượt mà mọi tựa game đồ họa cao và tác vụ Apple Intelligence đa nhiệm.

💾 HƯỚNG DẪN CHỌN DUNG LƯỢNG BỘ NHỚ:
• 64GB - 128GB: Phù hợp nhu cầu cơ bản nghe gọi, mạng xã hội, lướt web và lưu trữ ảnh thường ngày.
• 256GB - 512GB: Tối ưu cho người dùng quay video 4K, cài đặt nhiều ứng dụng và lưu trữ dữ liệu lâu dài.
• 1TB: Dành cho sáng tạo nội dung chuyên nghiệp, quay video ProRes và Apple Log không giới hạn dung lượng.

🔋 QUY CHUẨN PIN & SẠC AN TOÀN:
• Máy bán ra cam kết dung lượng pin (Battery Health) từ 85% đến 100%.
• Bảo hành thay pin Apple mới hoàn toàn miễn phí nếu dung lượng pin dưới 80% trong thời gian bảo hành.
• Hỗ trợ công nghệ sạc nhanh Power Delivery (PD) và sạc không dây tiện lợi.

🛡️ CHÍNH SÁCH BẢO HÀNH ZSHOP APPLE AUTHORIZED:
• Bảo hành toàn diện 12 tháng (bao gồm cả Nguồn, Màn hình và Face ID / Touch ID).
• Lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nếu có bất kỳ lỗi kỹ thuật nào từ nhà sản xuất.
• Hỗ trợ kiểm tra máy, check IMEI và Serial chính hãng Apple trước khi thanh toán.`
  };
}

/**
 * Làm giàu dữ liệu sản phẩm với đầy đủ sizes, colors, description chuyên nghiệp
 */
export function enrichProduct<T extends { name?: string; category?: string; sizes?: string[]; colors?: string[]; description?: string }>(product: T): T {
  if (!product) return product;
  const meta = generateProductMeta(product.name || '', product.category || '');

  // Giữ nguyên sizes của sản phẩm nếu đã có sẵn từ constants/all_50_products
  const finalSizes = product.sizes && product.sizes.length > 0 ? product.sizes : meta.sizes;

  // Giữ nguyên colors của sản phẩm nếu đã có sẵn
  const finalColors = product.colors && product.colors.length > 0 ? product.colors : meta.colors;

  // Mô tả sản phẩm: Giữ nguyên mô tả chi tiết của sản phẩm, không chèn các thông tin không liên quan
  let finalDescription = product.description || meta.description;

  return {
    ...product,
    sizes: finalSizes,
    colors: finalColors,
    description: finalDescription
  };
}

export interface ProductVisualSync {
  canonicalId: string;
  image: string;
  colorLabel: string;
  swatchHex: string;
  studioBg: string;
  imgFilter: string;
  categoryGroup: 'FLAGSHIP_18_17' | 'PRO_16_15_14' | 'CLASSIC_OTHER';
  categoryGroupLabel: string;
}

/**
 * Đồng bộ 100% Hình Ảnh, Màu Máy & Studio Theme giữa ngoài Mục Sản Phẩm (ProductCard),
 * Trang Chi Tiết (ProductDetailPage), Giỏ Hàng (MiniCart) và Thanh Toán (CheckoutPage).
 */
export function getProductVisualSync(
  item: {
    id?: string;
    productId?: string;
    name?: string;
    size?: string;
    color?: string;
    image?: string;
    images?: string[];
    colors?: string[];
    imgFilter?: string;
    studioBg?: string;
    swatchHex?: string;
  },
  catalog: any[] = []
): ProductVisualSync {
  const rawName = (item?.name || '').toLowerCase();
  const rawId = String(item?.productId || item?.id || '').toLowerCase();

  // Tìm sản phẩm chuẩn trong catalog nếu có
  const matchedCanon = catalog.find(
    p =>
      String(p.id).toLowerCase() === rawId ||
      (item?.name && p.name.toLowerCase() === rawName) ||
      (rawName.length > 6 && p.name.toLowerCase().includes(rawName.replace(' | chính hãng vn/a', '').trim()))
  );

  const canonicalId = String(matchedCanon?.id || item?.productId || item?.id || '');
  const resolvedImage =
    item?.image ||
    (item?.images && item.images[0]) ||
    (matchedCanon?.images && matchedCanon.images[0]) ||
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg';

  // Xác định tên màu từ item.color, hoặc tách từ item.size ("256GB - Đỏ Rượu Vang Burgundy Titan"), hoặc từ matchedCanon
  const sizeParts = (item?.size || '').split(' - ');
  const extractedColorFromSize = sizeParts.length > 1 ? sizeParts.slice(1).join(' - ').trim() : '';
  const rawColorText = (
    item?.color ||
    extractedColorFromSize ||
    (item?.colors && item.colors[0]) ||
    (matchedCanon?.colors && matchedCanon.colors[0]) ||
    ''
  ).replace(/\s*\(Mới\)/gi, '').trim();

  const lowerColor = `${rawColorText} ${canonicalId} ${rawName}`.toLowerCase();

  let swatchHex = item?.swatchHex || '#C5A880';
  let studioBg = item?.studioBg || 'from-[#2B2218] via-[#5E4B34] to-[#9E8058]';
  let imgFilter = item?.imgFilter || 'none';
  let colorLabel = rawColorText || 'Titan Chính Hãng VN/A';

  if (!item?.imgFilter || !item?.studioBg) {
    if (lowerColor.includes('burgundy') || lowerColor.includes('rượu vang') || lowerColor.includes('đỏ') || canonicalId === 'ip-18-promax' || canonicalId === 'ip-18-pro-512gb') {
      swatchHex = '#9F1239';
      colorLabel = rawColorText || 'Đỏ Rượu Vang Burgundy Titan';
      studioBg = 'from-[#2E0912] via-[#661428] to-[#9E203E]';
      imgFilter = 'hue-rotate(-28deg) saturate(1.42) brightness(0.9) contrast(1.06)';
    } else if (lowerColor.includes('glacier') || lowerColor.includes('băng hà') || lowerColor.includes('băng giá') || lowerColor.includes('sky') || canonicalId === 'ip-18-ultra' || canonicalId === 'ip-18-promax-512gb' || canonicalId === 'ip-17-air' || canonicalId === 'ip-17e') {
      swatchHex = '#0284C7';
      colorLabel = rawColorText || 'Xanh Băng Hà Glacier Titan';
      studioBg = 'from-[#0C2536] via-[#1B4965] to-[#2C6E91]';
      imgFilter = 'hue-rotate(175deg) saturate(1.28) brightness(0.98)';
    } else if (lowerColor.includes('mocha') || lowerColor.includes('cà phê') || lowerColor.includes('amber') || lowerColor.includes('đồng') || canonicalId === 'ip-18-promax-1tb' || canonicalId === 'ip-17-pro-512gb') {
      swatchHex = '#5C4338';
      colorLabel = rawColorText || 'Cà Phê Mocha Titan';
      studioBg = 'from-[#231712] via-[#4A332A] to-[#6E4D40]';
      imgFilter = 'sepia(0.38) hue-rotate(-12deg) saturate(1.25) brightness(0.92)';
    } else if (lowerColor.includes('emerald') || lowerColor.includes('lục bảo') || lowerColor.includes('rừng') || lowerColor.includes('alpine') || lowerColor.includes('matcha') || lowerColor.includes('sage') || canonicalId === 'ip-18-pro' || canonicalId === 'ip-18') {
      swatchHex = '#059669';
      colorLabel = rawColorText || 'Xanh Lục Bảo Emerald Titan';
      studioBg = 'from-[#082B22] via-[#135745] to-[#20856A]';
      imgFilter = 'hue-rotate(122deg) saturate(1.32) brightness(0.94)';
    } else if (lowerColor.includes('cobalt') || lowerColor.includes('ultramarine') || lowerColor.includes('lưu ly') || lowerColor.includes('xanh lam') || lowerColor.includes('teal') || lowerColor.includes('mòng két') || canonicalId === 'ip-17-pro' || canonicalId === 'ip-18-plus') {
      swatchHex = '#1D4ED8';
      colorLabel = rawColorText || 'Xanh Lam Cobalt Titan';
      studioBg = 'from-[#0C192E] via-[#1C3B6B] to-[#2C5FA6]';
      imgFilter = 'hue-rotate(185deg) saturate(1.35) brightness(0.94)';
    } else if (lowerColor.includes('tím') || lowerColor.includes('purple') || lowerColor.includes('lavender') || lowerColor.includes('oải hương') || canonicalId === 'ip-17' || canonicalId === 'ip-14-promax') {
      swatchHex = '#7C3AED';
      colorLabel = rawColorText || 'Tím Oải Hương Lavender';
      studioBg = 'from-[#24123E] via-[#462478] to-[#6838B0]';
      imgFilter = 'hue-rotate(240deg) saturate(1.25) brightness(0.95)';
    } else if (lowerColor.includes('hồng') || lowerColor.includes('pink') || lowerColor.includes('peony') || canonicalId === 'ip-17-plus' || canonicalId === 'ip-16-plus') {
      swatchHex = '#EC4899';
      colorLabel = rawColorText || 'Hồng Đào Peony';
      studioBg = 'from-[#3B0F26] via-[#701D49] to-[#9D2B67]';
      imgFilter = 'hue-rotate(295deg) saturate(1.22) brightness(0.98)';
    } else if (lowerColor.includes('cam') || canonicalId === 'ip-17-promax') {
      swatchHex = '#EA580C';
      colorLabel = rawColorText || 'Cam Sa Mạc Vũ Trụ';
      studioBg = 'from-[#3D1608] via-[#803012] to-[#C95422]';
      imgFilter = 'saturate(1.18) contrast(1.04)';
    } else if (lowerColor.includes('đen') || lowerColor.includes('black') || lowerColor.includes('midnight') || canonicalId === 'ip-16-promax-1tb') {
      swatchHex = '#1E293B';
      colorLabel = rawColorText || 'Đen Không Gian Titan';
      studioBg = 'from-[#0F172A] via-[#1E293B] to-[#334155]';
      imgFilter = 'grayscale(0.9) brightness(0.84) contrast(1.12)';
    } else if (lowerColor.includes('bạc') || lowerColor.includes('trắng') || lowerColor.includes('silver') || lowerColor.includes('platinum') || canonicalId === 'ip-16-pro') {
      swatchHex = '#E2E8F0';
      colorLabel = rawColorText || 'Bạc Platinum Titan';
      studioBg = 'from-[#2D3138] via-[#505661] to-[#79818F]';
      imgFilter = 'grayscale(0.85) brightness(1.08) contrast(1.04)';
    } else {
      swatchHex = '#C5A880';
      colorLabel = rawColorText || 'Vàng Sa Mạc Titan';
      studioBg = 'from-[#2B2218] via-[#5E4B34] to-[#9E8058]';
      imgFilter = 'sepia(0.18) saturate(1.22) brightness(1.01)';
    }
  }

  let categoryGroup: 'FLAGSHIP_18_17' | 'PRO_16_15_14' | 'CLASSIC_OTHER' = 'PRO_16_15_14';
  let categoryGroupLabel = 'iPhone 16 / 15 / 14 Series';

  if (canonicalId.includes('ip-18') || canonicalId.includes('ip-17') || rawName.includes('iphone 18') || rawName.includes('iphone 17')) {
    categoryGroup = 'FLAGSHIP_18_17';
    categoryGroupLabel = 'Flagship iPhone 18 & 17 Series';
  } else if (
    canonicalId.includes('ip-13') ||
    canonicalId.includes('ip-12') ||
    canonicalId.includes('ip-11') ||
    canonicalId.includes('ip-xs') ||
    canonicalId.includes('ip-8') ||
    canonicalId.includes('ip-4s') ||
    rawName.includes('iphone 13') ||
    rawName.includes('iphone 12') ||
    rawName.includes('iphone 11')
  ) {
    categoryGroup = 'CLASSIC_OTHER';
    categoryGroupLabel = 'iPhone 11-13 & Sưu Tầm';
  }

  return {
    canonicalId,
    image: resolvedImage,
    colorLabel,
    swatchHex,
    studioBg,
    imgFilter,
    categoryGroup,
    categoryGroupLabel
  };
}

