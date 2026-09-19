/**
 * Product Utilities:
 * - Chuẩn hóa tiếng Việt & tìm kiếm thông minh (có dấu / không dấu)
 * - Tự động tạo bảng size phù hợp cho từng loại sản phẩm (Áo, Quần, Giày, Túi, Phụ kiện...)
 * - Tự động tạo mô tả sản phẩm chi tiết chuẩn E-commerce (Shopee Mall / ZShop)
 */

export interface ProductMeta {
  sizes: string[];
  colors: string[];
  highlights: string[];
  description: string;
}

/**
 * Chuẩn hóa chuỗi tiếng Việt thành chữ thường không dấu
 * Ví dụ: "Áo Polo Nam" -> "ao polo nam"
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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * So khớp từ khóa tìm kiếm thông minh:
 * - Hỗ trợ gõ có dấu ("áo", "giày") hoặc không dấu ("ao", "giay")
 * - Chống lỗi false positive (ví dụ: gõ "áo" KHÔNG bị lẫn sang "da báo", "bánh táo")
 * - Tìm kiếm nhiều từ ("ao polo", "giay nam")
 */
export function matchSearchKeyword(text: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!text) return false;

  const rawQuery = query.trim().toLowerCase();
  const rawText = text.toLowerCase();

  const normQuery = normalizeVietnamese(rawQuery);
  const normText = normalizeVietnamese(rawText);

  // 1. Đối với từ khóa ngắn (<= 3 ký tự như "ao", "vi", "mu", "vay"), yêu cầu khớp theo nguyên từ (word boundary)
  // để tránh việc "áo" trùng với "báo", "táo", "sáo"...
  if (normQuery.length <= 3) {
    const wordRegex = new RegExp(`\\b${escapeRegex(normQuery)}\\b`, 'i');
    return wordRegex.test(normText);
  }

  // 2. Khớp nguyên cụm từ đầy đủ
  if (normText.includes(normQuery)) {
    return true;
  }

  // 3. Khớp từng từ (tất cả các từ trong query phải xuất hiện trong text)
  const queryWords = normQuery.split(/\s+/).filter(Boolean);
  const textWords = normText.split(/[\s,.\-_/\\+]+/).filter(Boolean);

  if (queryWords.length === 0) return true;

  return queryWords.every(qWord => {
    if (qWord.length <= 3) {
      return textWords.some(tWord => tWord === qWord);
    }
    return textWords.some(tWord => tWord.includes(qWord));
  });
}

/**
 * Tạo bảng Size, Màu sắc và Mô tả sản phẩm phong phú chuẩn E-commerce dựa trên Tên & Danh mục
 */
export function generateProductMeta(name = '', category = ''): ProductMeta {
  const normName = normalizeVietnamese(name);
  const normCat = normalizeVietnamese(category);
  const combined = `${normName} ${normCat}`;

  const has = (...keywords: string[]) => keywords.some(kw => combined.includes(normalizeVietnamese(kw)));

  // 1. Giày dép / Sneaker / Loafer / Sandal / Dép
  if (has('giay', 'sneaker', 'loafer', 'sandal', 'dep', 'boots', 'oxford', 'cao got', 'giay dep')) {
    const isWomen = has('nu', 'cao got', 'quai manh', 'bup be');
    const sizes = isWomen 
      ? ['35 (22.5cm)', '36 (23.0cm)', '37 (23.5cm)', '38 (24.0cm)', '39 (24.5cm)']
      : ['39 (24.5cm)', '40 (25.0cm)', '41 (25.5cm)', '42 (26.0cm)', '43 (26.5cm)', '44 (27.0cm)'];
    
    const colors = isWomen
      ? ['Trắng Kem', 'Đen Tuyển', 'Hồng Pastel', 'Be Nude']
      : ['Trắng Basic', 'Đen Classic', 'Xám Bạc', 'Xanh Navy'];

    return {
      sizes,
      colors,
      highlights: [
        'Đế cao su non đúc nguyên khối chống trơn trượt tối đa',
        'Lót đệm Ortholite kháng khuẩn êm ái chống thấu khí',
        'Chất liệu da vi sợi Microfiber cao cấp & vải Mesh thoáng mát'
      ],
      description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Thiết kế thời thượng, chuẩn phom chân người Việt, êm ái khi vận động suốt cả ngày dài.
• Thân giày làm từ chất liệu cao cấp kháng nước nhẹ, lót trong êm ái khử mùi hiệu quả.
• Đế giày cao su non đúc rãnh sâu chống trượt tuyệt đối trên mọi bề mặt ướt.
• Phong cách trẻ trung, năng động, dễ dàng phối hợp cùng quần jeans, short hay trang phục thể thao.

📏 BẢNG HƯỚNG DẪN CHỌN SIZE CHUẨN:
${sizes.map(s => `• Size ${s}`).join('\n')}
*(Mẹo: Nếu chân bè hoặc mu bàn chân dày, bạn nên chọn tăng thêm 1 size để thoải mái nhất).*

🧼 HƯỚNG DẪN VỆ SINH & BẢO QUẢN:
• Vệ sinh bằng khăn mềm ẩm hoặc bàn chải mềm cùng dung dịch vệ sinh chuyên dụng.
• Không ngâm trong nước quá lâu hoặc giặt bằng máy giặt.
• Phơi nơi khô ráo thoáng gió, tránh phơi trực tiếp dưới ánh nắng gay gắt.

🛡️ CHÍNH SÁCH CAM KẾT ZSHOP:
• 100% ảnh chụp thực tế tại studio ZShop.
• Hỗ trợ đổi size miễn phí trong 7 ngày nếu không vừa vặn.
• Bảo hành keo dán 6 tháng, kiểm tra hàng trước khi thanh toán.`
    };
  }

  // 2. Quần (Jeans, Short, Quần âu, Quần tây, Quần jogger, Kaki) - ngoại trừ "bộ quần áo"
  if (has('quan', 'short', 'jeans', 'jogger', 'kaki', 'tay au', 'ong rong') && !has('bo quan ao')) {
    const isShort = has('short', 'dui', 'lung');
    const sizes = isShort
      ? ['29 (S: 48-55kg)', '30 (M: 55-62kg)', '31 (L: 62-69kg)', '32 (XL: 70-78kg)', '33 (XXL: 78-86kg)']
      : ['29 (Vòng eo 73-75cm)', '30 (Vòng eo 76-79cm)', '31 (Vòng eo 80-83cm)', '32 (Vòng eo 84-87cm)', '33 (Vòng eo 88-92cm)'];

    const colors = has('tay au', 'kaki')
      ? ['Đen Công Sở', 'Xám Tro', 'Xanh Navy', 'Be Thanh Lịch']
      : ['Xanh Denim Nhạt', 'Xanh Indigo Đậm', 'Đen Tuyển', 'Xám Khói'];

    return {
      sizes,
      colors,
      highlights: [
        'Chất vải co giãn nhẹ, giữ phom dáng chuẩn không bai dão',
        'Công nghệ wash sinh học chống phai màu, an toàn cho da',
        'Khóa kéo đồng YKK cao cấp, đường may viền đúp chịu lực'
      ],
      description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Phom dáng Slimfit / Regular tôn dáng chuẩn mực, giúp chân thon dài và che khuyết điểm.
• Chất liệu vải cao cấp pha sợi co giãn nhẹ, tạo cảm giác cử động linh hoạt, dễ chịu.
• Thiết kế túi sâu tiện lợi, cất vừa điện thoại màn hình lớn mà không bị cộm.
• Khóa kéo và phụ kiện cúc đồng chống rỉ sét sáng bóng bền bỉ.

📏 BẢNG HƯỚNG DẪN CHỌN SIZE QUẦN:
• Size 29 (S): 48kg - 55kg (Vòng bụng 73 - 75cm)
• Size 30 (M): 55kg - 62kg (Vòng bụng 76 - 79cm)
• Size 31 (L): 62kg - 69kg (Vòng bụng 80 - 83cm)
• Size 32 (XL): 70kg - 77kg (Vòng bụng 84 - 87cm)
• Size 33 (XXL): 78kg - 86kg (Vòng bụng 88 - 92cm)

🧼 HƯỚNG DẪN BẢO QUẢN:
• Lộn trái quần khi giặt và phơi để giữ màu sắc bền lâu.
• Không ngâm trong nước tẩy javel mạnh.
• Ủi ở nhiệt độ trung bình dưới 150°C.

🛡️ CHÍNH SÁCH CAM KẾT ZSHOP:
• Đảm bảo vải đẹp đúng như mô tả, cam kết không bai xù.
• Hỗ trợ đổi size trong vòng 7 ngày.`
    };
  }

  // 3. Váy / Đầm / Chân váy / Set nữ
  if (has('vay', 'dam', 'chan vay', 'yem', 'set bo vest nu')) {
    const sizes = ['XS (40-45kg)', 'S (46-51kg)', 'M (52-57kg)', 'L (58-63kg)', 'XL (64-70kg)'];
    const colors = ['Trắng Tiểu Thư', 'Đen Huyền Bí', 'Hồng Pastel', 'Be Nude Thanh Lịch', 'Đỏ Rượu Vang'];

    return {
      sizes,
      colors,
      highlights: [
        'Vải lụa / voan cát / tweet 2 lớp mềm mại bay bổng',
        'Thiết kế tôn eo hack dáng, đường may giọt lệ tinh tế',
        'Phù hợp đa phong cách từ dạo phố đến dự tiệc trang trọng'
      ],
      description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Thiết kế phong cách thời trang duyên dáng, nữ tính, tôn trọn vẻ đẹp đường cong phái đẹp.
• Chất liệu vải cao cấp 2 lớp mềm mịn, lót lụa habutai thoáng mát, không dính da.
• Từng đường kim mũi chỉ được may công phu tỉ mỉ, khóa kéo giọt lệ ẩn sau lưng tinh tế.
• Phù hợp diện trong các dịp lễ tiệc, hẹn hò, công sở hay du lịch sống ảo.

📏 BẢNG HƯỚNG DẪN CHỌN SIZE:
• Size XS: Ngực 80-82cm | Eo 62-64cm | Cân nặng 40-45kg
• Size S: Ngực 84-86cm | Eo 66-68cm | Cân nặng 46-51kg
• Size M: Ngực 88-90cm | Eo 70-72cm | Cân nặng 52-57kg
• Size L: Ngực 92-94cm | Eo 74-76cm | Cân nặng 58-63kg
• Size XL: Ngực 96-98cm | Eo 78-82cm | Cân nặng 64-70kg

🧼 HƯỚNG DẪN BẢO QUẢN:
• Nên giặt bằng tay hoặc dùng túi giặt khi giặt máy với chế độ quay nhẹ.
• Phơi nơi râm mát, không vắt xoắn làm nhăn vải.
• Ủi bằng bàn là hơi nước để nếp vải mềm mịn tự nhiên.

🛡️ CHÍNH SÁCH CAM KẾT ZSHOP:
• Cam kết 100% hình ảnh độc quyền tự chụp.
• Đổi trả hàng trong 7 ngày nếu không vừa size.`
    };
  }

  // 4. Túi xách / Balo / Cặp da / Ví
  if (has('tui', 'balo', 'vi', 'cap', 'clutch')) {
    const isWallet = has('vi', 'bop', 'clutch');
    const sizes = isWallet
      ? ['Tiêu Chuẩn (19cm x 9.5cm)']
      : ['Size Mini (20cm)', 'Size Vừa (26cm)', 'Size Lớn (32cm)'];

    const colors = ['Đen Cổ Điển', 'Nâu Bò Vintage', 'Trắng Kem', 'Hồng Khói'];

    return {
      sizes,
      colors,
      highlights: [
        'Da PU / Da bò sáp vi sợi chống trầy chống thấm nước',
        'Khoen khóa hợp kim mạ tĩnh điện sáng bóng chống rỉ',
        'Ngăn chứa đa năng phân chia khoa học, bảo vệ đồ dùng'
      ],
      description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Thiết kế thời trang thanh lịch, tối giản nhưng đầy cuốn hút, phù hợp nhiều phong cách.
• Chất liệu da cao cấp mềm mịn, bề mặt chống trầy xước và chống thấm nước khi gặp mưa nhẹ.
• Ngăn chứa đồ rộng rãi, thiết kế nhiều ngăn phụ thông minh đựng son phấn, điện thoại, ví tiền.
• Phụ kiện móc khóa kim loại mạ điện phân 5 lớp sáng bóng, chống oxy hóa rỉ sét.

📏 THÔNG SỐ SẢN PHẨM:
• Dây đeo có thể tháo rời và điều chỉnh độ dài linh hoạt từ 90cm - 120cm.
• Lót trong bằng vải polyester chống thấm bền bỉ.

🧼 HƯỚNG DẪN BẢO QUẢN:
• Lau chùi bề mặt da bằng khăn ẩm mềm hoặc xi chuyên dụng định kỳ.
• Tránh để sản phẩm tiếp xúc với nhiệt độ cao hoặc hóa chất bay hơi.
• Khi không sử dụng, nên nhét giấy giữ form và đặt trong túi bọc chống bụi.

🛡️ CHÍNH SÁCH CAM KẾT ZSHOP:
• Bảo hành khóa kéo phụ kiện 6 tháng.
• 1 đổi 1 trong vòng 7 ngày nếu có lỗi do vận chuyển hoặc sản xuất.`
    };
  }

  // 5. Phụ kiện (Kính mắt, Đồng hồ, Thắt lưng, Nón mũ, Trang sức)
  if (has('kinh', 'dong ho', 'that lung', 'mu', 'non', 'khuyen tai', 'vong tay', 'nhan', 'phu kien')) {
    let sizes = ['Tiêu Chuẩn (Freesize)'];
    let colors = ['Bạc Titan', 'Vàng Kim Gold', 'Đen Mờ Nhám'];

    if (has('dong ho')) {
      sizes = ['Mặt 38mm (Cổ tay nhỏ)', 'Mặt 40mm (Cổ tay vừa)', 'Mặt 42mm (Cổ tay lớn)'];
      colors = ['Bạc Dây Da Nâu', 'Đen Huyền Bí', 'Vàng Kim Dây Thép'];
    } else if (has('that lung')) {
      sizes = ['Bản 3.4cm (Dài 115cm)', 'Bản 3.8cm (Dài 125cm)'];
      colors = ['Đen Cổ Điển', 'Nâu Cafe'];
    } else if (has('kinh')) {
      colors = ['Gọng Vàng Tròng Đen', 'Gọng Bạc Tròng Đổi Màu', 'Đen Toàn Phần'];
    }

    return {
      sizes,
      colors,
      highlights: [
        'Vật liệu chọn lọc cao cấp đạt chuẩn độ bền quốc tế',
        'Thiết kế chạm khắc tinh xảo tôn vinh phong cách sang trọng',
        'Bảo hành chính hãng, đầy đủ phụ kiện hộp đựng cao cấp'
      ],
      description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Phụ kiện thời trang đẳng cấp, điểm nhấn hoàn hảo cho mọi set đồ của bạn.
• Chế tác từ vật liệu cao cấp (Thép không gỉ 316L / Da thật / Hợp kim chống oxy hóa).
• Tinh tế trong từng góc cạnh, mang lại vẻ ngoài lịch lãm và quý phái.

🛡️ CHÍNH SÁCH CAM KẾT ZSHOP:
• 100% hình ảnh thực tế, hộp đựng sang trọng thích hợp làm quà tặng.
• Bảo hành 6 tháng, hỗ trợ kiểm tra hàng trước khi thanh toán.`
    };
  }

  // 6. Áo (Áo polo, Áo thun, Áo sơ mi, Áo hoodie, Áo khoác, Áo len, Áo dạ, Bộ quần áo...) & Mặc định
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Đen Classic', 'Trắng Basic', 'Xanh Navy', 'Xám Tiêu', 'Be Nude', 'Xanh Rêu'];

  return {
    sizes,
    colors,
    highlights: [
      'Chất liệu 100% Cotton Compact chải kỹ 250gsm mát mịn',
      'Đường may 2 kim bọc viền cổ dệt bo gân chống bai nhão',
      'Công nghệ Cool-Air thoáng khí thấm hút mồ hôi 4 chiều'
    ],
    description: `✨ ĐẶC ĐIỂM NỔI BẬT:
• Form dáng chuẩn mực tôn vinh vóc dáng người mặc, đường may 2 kim tỉ mỉ chắc chắn.
• Chất liệu 100% Cotton Compact chải kỹ định lượng 250gsm, sợi vải mềm mịn mát mẻ và co giãn 4 chiều linh hoạt.
• Ứng dụng công nghệ xử lý sợi Cool-Air thoáng khí, thấm hút mồ hôi tối đa không để lại mùi khó chịu.
• Thiết kế basic thời thượng, phối đồ linh hoạt cùng quần jeans, quần short, quần tây hoặc áo khoác ngoài.

📏 BẢNG HƯỚNG DẪN CHỌN SIZE ÁO CHUẨN ZSHOP:
• Size S: Cân nặng 45kg - 55kg | Chiều cao 1m50 - 1m62
• Size M: Cân nặng 56kg - 64kg | Chiều cao 1m60 - 1m68
• Size L: Cân nặng 65kg - 73kg | Chiều cao 1m68 - 1m75
• Size XL: Cân nặng 74kg - 82kg | Chiều cao 1m75 - 1m82
• Size XXL: Cân nặng 83kg - 95kg | Chiều cao 1m80 - 1m90
*(Nếu bạn thích mặc phom rộng rãi phong cách Oversize cá tính, vui lòng tăng lên 1 size nhé!)*

🧼 HƯỚNG DẪN GIẶT ỦI & BẢO QUẢN:
• Lộn trái áo trước khi giặt và khi phơi để giữ độ bền màu sắc tươi mới.
• Không sử dụng hóa chất tẩy rửa có chứa clo mạnh.
• Phơi ở nơi râm mát thoáng gió, tránh ánh nắng mặt trời gắt chiếu trực tiếp.
• Là ủi ở nhiệt độ trung bình dưới 150°C.

🛡️ CHÍNH SÁCH CAM KẾT ZSHOP MALL:
• 100% sản phẩm chính hãng đúng như hình ảnh và mô tả.
• Hỗ trợ đổi size miễn phí trong 7 ngày nếu không vừa vặn.
• Miễn phí hoàn tiền 100% nếu phát hiện sản phẩm lỗi do nhà sản xuất.`
  };
}

/**
 * Làm giàu dữ liệu sản phẩm với đầy đủ sizes, colors, description chuyên nghiệp
 */
export function enrichProduct<T extends { name?: string; category?: string; sizes?: string[]; colors?: string[]; description?: string }>(product: T): T {
  if (!product) return product;
  const meta = generateProductMeta(product.name || '', product.category || '');

  const normName = normalizeVietnamese(product.name || '');
  const normCat = normalizeVietnamese(product.category || '');
  const isSpecialCategory = 
    normName.includes('giay') || normName.includes('sneaker') || normName.includes('sandal') || normName.includes('dep') ||
    normName.includes('tui') || normName.includes('balo') || normName.includes('vi ') || normName.includes('dong ho') ||
    normName.includes('that lung') || normName.includes('kinh') || normCat.includes('giay') || normCat.includes('tui') ||
    normCat.includes('phu kien') || (normName.includes('quan') && !normName.includes('bo quan ao'));

  // Nếu sản phẩm chỉ có size mẫu ['FREESIZE'] hoặc giày dép/túi xách mà lại gắn size S/M/L/XL -> chuẩn hóa lại size chuẩn
  const isGenericSizes = !product.sizes || 
    product.sizes.length === 0 || 
    product.sizes[0] === 'FREESIZE' ||
    (isSpecialCategory && product.sizes.every(s => ['S', 'M', 'L', 'XL'].includes(s)));

  const finalSizes = isGenericSizes ? meta.sizes : product.sizes;

  // Nếu màu sắc là mặc định ('Đen', 'Trắng', 'Xanh' lặp lại hoặc 'Mặc định') -> dùng bảng màu phong phú theo loại
  const isGenericColors = !product.colors || 
    product.colors.length === 0 || 
    product.colors[0] === 'Mặc định' ||
    (product.colors.length === 3 && product.colors[0] === 'Đen' && product.colors[1] === 'Trắng' && product.colors[2] === 'Xanh');

  const finalColors = isGenericColors ? meta.colors : product.colors;

  // Làm giàu mô tả chuẩn E-commerce
  const hasRichDescription = product.description && product.description.includes('ĐẶC ĐIỂM NỔI BẬT');
  let finalDescription = product.description || '';
  if (!hasRichDescription) {
    if (product.description && product.description.trim().length > 0 && !product.description.includes('Sản phẩm chính hãng')) {
      finalDescription = `${product.description}\n\n${meta.description}`;
    } else {
      finalDescription = meta.description;
    }
  }

  return {
    ...product,
    sizes: finalSizes,
    colors: finalColors,
    description: finalDescription
  };
}
