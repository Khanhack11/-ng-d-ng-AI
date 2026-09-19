import { Order, PaymentMethodConfig, PaymentMethodType, ProductDetail, CartItem } from './types';

export const MOCK_ORDER: Order = {
  id: "DH-20260919",
  createdAt: new Date().toISOString(),
  shippingFee: 30000,
  discount: 50000,
  items: [
    {
      id: "PHONE-001",
      name: "iPhone 16 Pro Max 256GB Titan Tự Nhiên - Chính Hãng VN/A",
      price: 34990000,
      quantity: 1,
      variant: "256GB - Titan Tự Nhiên",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"
    },
    {
      id: "CHARGER-001",
      name: "Củ Sạc Nhanh Anker Prime 67W GaN 3 Cổng (2C1A)",
      price: 950000,
      quantity: 1,
      variant: "67W - Đen Xám",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
    }
  ]
};

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "c1",
    name: "iPhone 16 Pro Max 256GB Titan Tự Nhiên - Chính Hãng VN/A",
    size: "256GB",
    price: 34990000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"
  },
  {
    id: "c2",
    name: "Củ Sạc Nhanh Anker Prime 67W GaN 3 Cổng (2C1A)",
    size: "67W",
    price: 950000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
  }
];

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: PaymentMethodType.QR_CODE,
    title: "Quét mã VNPAY-QR (Khuyên dùng)",
    description: "Quét mã qua ứng dụng ngân hàng/Ví VNPAY",
    iconName: "qr"
  },
  {
    id: PaymentMethodType.DOMESTIC_CARD,
    title: "Thẻ ATM / Internet Banking",
    description: "Hỗ trợ 40+ ngân hàng tại Việt Nam",
    iconName: "credit-card"
  },
  {
    id: PaymentMethodType.INTERNATIONAL_CARD,
    title: "Thẻ Quốc tế (Visa/Master/JCB)",
    description: "Phí chuyển đổi ngoại tệ có thể áp dụng",
    iconName: "globe"
  },
  {
    id: PaymentMethodType.MOMO,
    title: "Ví điện tử MoMo",
    description: "Thanh toán qua ứng dụng MoMo",
    iconName: "wallet"
  },
  {
    id: PaymentMethodType.COD,
    title: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán tiền mặt cho Shipper khi nhận hàng",
    iconName: "money"
  }
];

export const MOCK_PRODUCT_DETAIL: ProductDetail = {
  id: "PHONE-001",
  name: "iPhone 16 Pro Max 256GB Titan Tự Nhiên - Chính Hãng VN/A",
  category: "Điện Thoại Thông Minh",
  rating: 5.0,
  reviewCount: 52,
  soldCount: 240,
  price: 34990000,
  originalPrice: 37990000,
  discountRate: 8,
  shippingFee: 0,
  shippingEstimate: "Hỏa tốc 2h - 48h",
  colors: ["Titan Tự Nhiên", "Titan Sa Mạc", "Titan Trắng", "Titan Đen"],
  sizes: ["256GB", "512GB", "1TB"],
  stock: 45,
  videoDuration: "00:45s",
  images: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"
  ],
  description: "Siêu phẩm flagship Apple A18 Pro mạnh mẽ, vỏ titan chuẩn hàng không vũ trụ, nút Điều khiển Camera cảm ứng lực mới, camera tiềm vọng 5x zoom quang học, pin trâu đến 33 giờ phát video, hỗ trợ sạc nhanh MagSafe 25W và chuẩn kháng nước bụi IP68."
};

export const MOCK_PRODUCTS_LIST: ProductDetail[] = [
  {
    "id": "PHONE-001",
    "name": "iPhone 16 Pro Max 256GB Titan Tự Nhiên - Chính Hãng VN/A",
    "category": "Điện Thoại Thông Minh",
    "price": 34990000,
    "originalPrice": 37990000,
    "stock": 45,
    "rating": 5.0,
    "soldCount": 240,
    "colors": [
      "Titan Tự Nhiên",
      "Titan Sa Mạc",
      "Titan Trắng",
      "Titan Đen"
    ],
    "sizes": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"
    ],
    "description": "Siêu phẩm flagship Apple A18 Pro mạnh mẽ, vỏ titan chuẩn hàng không vũ trụ, nút Điều khiển Camera cảm ứng lực mới, camera tiềm vọng 5x zoom quang học, pin trâu đến 33 giờ phát video, hỗ trợ sạc nhanh MagSafe 25W và chuẩn kháng nước bụi IP68.",
    "reviewCount": 52,
    "discountRate": 8,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-002",
    "name": "iPhone 15 128GB Xanh Pastel - Chính Hãng VN/A",
    "category": "Điện Thoại Thông Minh",
    "price": 19490000,
    "originalPrice": 22990000,
    "stock": 60,
    "rating": 4.9,
    "soldCount": 580,
    "colors": [
      "Xanh Pastel",
      "Hồng Nhạt",
      "Vàng",
      "Đen"
    ],
    "sizes": [
      "128GB",
      "256GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600"
    ],
    "description": "iPhone 15 sở hữu màn hình Dynamic Island đột phá, camera chính 48MP nâng cấp chụp chân dung siêu nét thế hệ 2, cổng kết nối chuẩn USB-C tiện lợi đồng bộ hệ sinh thái, chip A16 Bionic 5 nhân đồ họa mạnh mẽ, mặt lưng kính pha màu mờ sang trọng.",
    "reviewCount": 127,
    "discountRate": 15,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-003",
    "name": "Samsung Galaxy S24 Ultra 5G 256GB Xám Titan - Chính Hãng",
    "category": "Điện Thoại Thông Minh",
    "price": 29990000,
    "originalPrice": 33990000,
    "stock": 38,
    "rating": 4.9,
    "soldCount": 310,
    "colors": [
      "Xám Titan",
      "Đen Titan",
      "Tím Titan",
      "Vàng Titan"
    ],
    "sizes": [
      "256GB",
      "512GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"
    ],
    "description": "Kỷ nguyên Galaxy AI đỉnh cao với tính năng Khoanh vùng tìm kiếm đa năng, dịch trực tiếp cuộc gọi hai chiều. Khung viền Titan siêu cứng, kính Corning Gorilla Armor chống phản chiếu 75%, bút S-Pen quyền năng tích hợp, sạc siêu nhanh 45W, pin 5000mAh.",
    "reviewCount": 68,
    "discountRate": 12,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-004",
    "name": "Samsung Galaxy A55 5G 128GB Xanh Iceblue - Chính Hãng",
    "category": "Điện Thoại Thông Minh",
    "price": 8990000,
    "originalPrice": 10490000,
    "stock": 85,
    "rating": 4.8,
    "soldCount": 750,
    "colors": [
      "Xanh Iceblue",
      "Tím Lilac",
      "Đen Navy"
    ],
    "sizes": [
      "128GB",
      "256GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600"
    ],
    "description": "Quán quân phân khúc cận cao cấp với khung kim loại vát phẳng thời thượng, màn hình Super AMOLED 6.6 inch 120Hz mượt mà, chip Exynos 1480 có GPU AMD, bảo mật Samsung Knox Vault chuẩn quốc tế, kháng nước kháng bụi chuẩn IP67.",
    "reviewCount": 165,
    "discountRate": 14,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-005",
    "name": "Xiaomi 14 5G 256GB Đen Nhám - Camera Leica Chính Hãng",
    "category": "Điện Thoại Thông Minh",
    "price": 18990000,
    "originalPrice": 22990000,
    "stock": 30,
    "rating": 4.9,
    "soldCount": 190,
    "colors": [
      "Đen Nhám",
      "Xanh Ngọc",
      "Trắng"
    ],
    "sizes": [
      "256GB",
      "512GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
    ],
    "description": "Flagship nhỏ gọn đỉnh cao với ống kính quang học Leica Summilux khẩu độ lớn f/1.6, chip Snapdragon 8 Gen 3 đầu bảng, màn hình CrystalRes 1.5K 120Hz độ sáng 3000 nits, công nghệ sạc nhanh HyperCharge 90W nạp đầy pin chỉ trong 31 phút.",
    "reviewCount": 41,
    "discountRate": 17,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-006",
    "name": "Xiaomi Redmi Note 13 Pro 4G 128GB Tím Cực Quang",
    "category": "Điện Thoại Thông Minh",
    "price": 5490000,
    "originalPrice": 7290000,
    "stock": 120,
    "rating": 4.8,
    "soldCount": 1100,
    "colors": [
      "Tím Cực Quang",
      "Xanh Rừng Sâu",
      "Đen"
    ],
    "sizes": [
      "128GB",
      "256GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600"
    ],
    "description": "Vua phân khúc tầm trung sở hữu camera chính 200MP siêu độ phân giải tích hợp chống rung kép OIS + EIS, màn hình AMOLED 120Hz viền siêu mỏng, cảm biến vân tay dưới màn hình, pin trâu 5000mAh hỗ trợ sạc Turbo 67W.",
    "reviewCount": 242,
    "discountRate": 25,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-007",
    "name": "OPPO Reno11 F 5G 256GB Xanh Cọ Chân Dung Chuyên Nghiệp",
    "category": "Điện Thoại Thông Minh",
    "price": 8290000,
    "originalPrice": 9990000,
    "stock": 65,
    "rating": 4.7,
    "soldCount": 420,
    "colors": [
      "Xanh Cọ",
      "Tím Thạch Anh"
    ],
    "sizes": [
      "256GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600"
    ],
    "description": "Thiết kế lưng vân kim sa lấp lánh lấy cảm hứng từ thiên nhiên, màn hình tràn viền 120Hz không viền đen, camera chuyên gia chân dung 64MP nét căng, sạc siêu tốc SUPERVOOC 67W bền bỉ đến 4 năm tuổi thọ pin.",
    "reviewCount": 92,
    "discountRate": 17,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "PHONE-008",
    "name": "vivo V30e 5G 128GB Nâu Mây - Vòng Sáng Aura 3.0",
    "category": "Điện Thoại Thông Minh",
    "price": 7990000,
    "originalPrice": 9490000,
    "stock": 50,
    "rating": 4.8,
    "soldCount": 380,
    "colors": [
      "Nâu Mây",
      "Trắng Lông Vũ"
    ],
    "sizes": [
      "128GB",
      "256GB"
    ],
    "images": [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600"
    ],
    "description": "Vòng sáng Aura thế hệ 3.0 kích thước lớn hỗ trợ chụp chân dung ban đêm tự nhiên không chói gắt, thiết kế siêu mỏng nhẹ thời thượng, viên pin dung lượng lớn 5500mAh cho thời gian sử dụng liên tục đến 2 ngày.",
    "reviewCount": 83,
    "discountRate": 16,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-001",
    "name": "Củ Sạc Nhanh Anker Prime 67W GaN 3 Cổng (2C1A)",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 950000,
    "originalPrice": 1250000,
    "stock": 90,
    "rating": 4.9,
    "soldCount": 850,
    "colors": [
      "Đen Xám",
      "Bạc"
    ],
    "sizes": [
      "67W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
    ],
    "description": "Công nghệ GaNPrime tối ưu hóa điện năng và giảm 50% kích thước so với sạc truyền thống. 2 cổng Type-C và 1 cổng USB-A cho phép sạc đồng thời Laptop MacBook, iPhone và iPad với công suất phân bổ thông minh PowerIQ 4.0.",
    "reviewCount": 187,
    "discountRate": 24,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-002",
    "name": "Củ Sạc Nhanh Baseus GaN5 Pro 100W 4 Cổng Đa Năng",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 1250000,
    "originalPrice": 1690000,
    "stock": 60,
    "rating": 4.8,
    "soldCount": 540,
    "colors": [
      "Đen Nhám",
      "Trắng"
    ],
    "sizes": [
      "100W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"
    ],
    "description": "Sức mạnh 100W vượt trội trang bị chip bán dẫn GaN thế hệ 5, hỗ trợ toàn bộ chuẩn sạc nhanh PD 3.0, QC 4+, PPS, SCP. Sạc đầy pin cho MacBook Pro 16 inch và điện thoại cùng lúc, kiểm soát nhiệt độ an toàn BCT.",
    "reviewCount": 118,
    "discountRate": 26,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-003",
    "name": "Củ Sạc Apple 20W Type-C Chính Hãng VN/A",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 490000,
    "originalPrice": 690000,
    "stock": 250,
    "rating": 5.0,
    "soldCount": 3200,
    "colors": [
      "Trắng"
    ],
    "sizes": [
      "20W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600"
    ],
    "description": "Củ sạc chính hãng Apple chuẩn công suất 20W cổng Type-C tối ưu tốt nhất cho iPhone 11 đến iPhone 16 Series và iPad, sạc 50% pin chỉ trong 30 phút, bảo vệ pin tối đa và chống chai pin hiệu quả.",
    "reviewCount": 704,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-004",
    "name": "Củ Sạc Samsung 45W Type-C Siêu Nhanh 2.0 (Kèm Cáp 5A)",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 790000,
    "originalPrice": 1050000,
    "stock": 110,
    "rating": 4.9,
    "soldCount": 980,
    "colors": [
      "Đen",
      "Trắng"
    ],
    "sizes": [
      "45W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Bộ sạc công suất 45W chuẩn Super Fast Charging 2.0 kèm dây cáp chịu tải 5A C-to-C chính hãng, được thiết kế chuyên biệt cho Samsung Galaxy S24 Ultra, S23 Ultra, Tab S9 Series nạp pin thần tốc an toàn.",
    "reviewCount": 215,
    "discountRate": 25,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-005",
    "name": "Củ Sạc GaN Ugreen Nexode Robot 65W Màn Hình LED Biểu Cảm",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 890000,
    "originalPrice": 1190000,
    "stock": 75,
    "rating": 4.9,
    "soldCount": 670,
    "colors": [
      "Đen Không Gian",
      "Tím Pastel"
    ],
    "sizes": [
      "65W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"
    ],
    "description": "Thiết kế Robot Cyberpunk độc đáo với màn hình LED hiển thị biểu cảm khuôn mặt thông báo trạng thái sạc, công suất 65W mạnh mẽ với 3 cổng cắm sạc được laptop, điện thoại và tai nghe cùng lúc.",
    "reviewCount": 147,
    "discountRate": 25,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-006",
    "name": "Củ Sạc Mini Siêu Nhỏ Anker Nano 30W Type-C",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 390000,
    "originalPrice": 520000,
    "stock": 180,
    "rating": 4.9,
    "soldCount": 1600,
    "colors": [
      "Trắng",
      "Đen",
      "Tím",
      "Xanh Lam"
    ],
    "sizes": [
      "30W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
    ],
    "description": "Kích thước siêu nhỏ gọn chỉ bằng củ sạc 5W cũ nhưng mang sức mạnh 30W chuẩn GaN II, chân cắm gập tiện lợi mang đi làm đi học, hỗ trợ sạc nhanh cho mọi dòng smartphone và iPad Air/Pro.",
    "reviewCount": 352,
    "discountRate": 25,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-007",
    "name": "Bộ Tẩu Sạc Xe Hơi Nhanh Baseus 65W Hợp Kim Nhôm 2 Cổng",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 320000,
    "originalPrice": 450000,
    "stock": 95,
    "rating": 4.8,
    "soldCount": 510,
    "colors": [
      "Xám Titan"
    ],
    "sizes": [
      "65W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600"
    ],
    "description": "Tẩu sạc ô tô vỏ kim loại cao cấp tản nhiệt tốt, công suất 65W cổng Type-C PD và cổng USB-A Quick Charge, đèn LED hiển thị điện áp bình ắc quy xe thời gian thực bảo vệ an toàn hệ thống điện.",
    "reviewCount": 112,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CHARGER-008",
    "name": "Củ Sạc Nhanh Xiaomi 67W Type-A Quick Charge Chính Hãng",
    "category": "Củ Sạc & Bộ Sạc Nhanh",
    "price": 350000,
    "originalPrice": 490000,
    "stock": 140,
    "rating": 4.8,
    "soldCount": 890,
    "colors": [
      "Trắng"
    ],
    "sizes": [
      "67W"
    ],
    "images": [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"
    ],
    "description": "Củ sạc chuẩn công nghệ sạc Turbo 67W của Xiaomi, tương thích hoàn hảo các dòng Redmi Note, Xiaomi 13/14, POCO, mạch bảo vệ chống đoản mạch quá dòng an toàn đạt chuẩn CE.",
    "reviewCount": 195,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CABLE-001",
    "name": "Cáp Sạc C to C 100W Anker PowerLine III Bọc Dù Siêu Bền 1.8m",
    "category": "Cáp Sạc & Dây Cáp",
    "price": 290000,
    "originalPrice": 390000,
    "stock": 200,
    "rating": 4.9,
    "soldCount": 2100,
    "colors": [
      "Đen",
      "Trắng"
    ],
    "sizes": [
      "1.8m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Dây cáp bọc sợi nylon kép chịu được hơn 25.000 lần uốn cong, chip E-Marker thông minh chịu tải dòng điện 100W 5A, hỗ trợ sạc nhanh từ smartphone flagship đến laptop MacBook và truyền dữ liệu 480Mbps.",
    "reviewCount": 462,
    "discountRate": 26,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CABLE-002",
    "name": "Cáp Sạc Type-C to Lightning Apple Chính Hãng MFi 1m",
    "category": "Cáp Sạc & Dây Cáp",
    "price": 390000,
    "originalPrice": 550000,
    "stock": 170,
    "rating": 4.9,
    "soldCount": 1800,
    "colors": [
      "Trắng"
    ],
    "sizes": [
      "1m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Cáp sạc chính hãng chứng chỉ Apple MFi đảm bảo 100% không báo phụ kiện không hỗ trợ, tương thích sạc nhanh PD cho iPhone 8 đến iPhone 14 Pro Max và tai nghe AirPods.",
    "reviewCount": 396,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CABLE-003",
    "name": "Cáp Sạc Nhanh C to C Baseus 240W PD3.1 Dây Dù 1m",
    "category": "Cáp Sạc & Dây Cáp",
    "price": 190000,
    "originalPrice": 280000,
    "stock": 220,
    "rating": 4.8,
    "soldCount": 1400,
    "colors": [
      "Đen",
      "Xanh Rêu"
    ],
    "sizes": [
      "1m",
      "2m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Chuẩn Power Delivery 3.1 thế hệ mới với công suất truyền tải lên tới 240W (48V/5A), hỗ trợ sạc siêu tốc cho mọi thiết bị Type-C từ smartphone đến laptop gaming cao cấp.",
    "reviewCount": 308,
    "discountRate": 32,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CABLE-004",
    "name": "Cáp Sạc Đa Năng 3 Trong 1 Baseus (Type-C, Lightning, Micro) 1.2m",
    "category": "Cáp Sạc & Dây Cáp",
    "price": 180000,
    "originalPrice": 260000,
    "stock": 250,
    "rating": 4.8,
    "soldCount": 2700,
    "colors": [
      "Đen",
      "Đỏ"
    ],
    "sizes": [
      "1.2m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Dây cáp tiện lợi tích hợp 3 đầu cắm phổ biến giúp sạc cùng lúc 3 thiết bị khác nhau chỉ với 1 củ sạc, dây bọc dù chống đứt gãy, giải pháp hoàn hảo khi đi du lịch hoặc dùng trên ô tô.",
    "reviewCount": 594,
    "discountRate": 31,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CABLE-005",
    "name": "Cáp Sạc Nhanh Type-C Đầu Chữ L Ugreen 100W Chuyên Gaming 1m",
    "category": "Cáp Sạc & Dây Cáp",
    "price": 150000,
    "originalPrice": 220000,
    "stock": 130,
    "rating": 4.9,
    "soldCount": 860,
    "colors": [
      "Đen"
    ],
    "sizes": [
      "1m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Thiết kế đầu cắm góc gập 90 độ chữ L công thái học giúp cầm nắm chơi game ngang màn hình thoải mái không bị cấn tay hay gãy gập chân sạc, truyền tải điện năng 100W ổn định mát máy.",
    "reviewCount": 189,
    "discountRate": 32,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CABLE-006",
    "name": "Cáp C to C Ngắn 0.25m Ugreen Chuyên Dùng Pin Dự Phòng",
    "category": "Cáp Sạc & Dây Cáp",
    "price": 85000,
    "originalPrice": 120000,
    "stock": 310,
    "rating": 4.8,
    "soldCount": 1950,
    "colors": [
      "Đen Nhám"
    ],
    "sizes": [
      "0.25m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Chiều dài lý tưởng 25cm không lo dây lòng thòng rối rắm khi cầm điện thoại kẹp chung với pin sạc dự phòng, hỗ trợ sạc nhanh 60W và bọc dù chống mài mòn cao cấp.",
    "reviewCount": 429,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "POWER-001",
    "name": "Pin Sạc Dự Phòng Hít Từ Tính MagSafe Anker 10.000mAh Có Chân Chống",
    "category": "Pin Sạc Dự Phòng",
    "price": 1150000,
    "originalPrice": 1550000,
    "stock": 80,
    "rating": 4.9,
    "soldCount": 780,
    "colors": [
      "Trắng",
      "Đen",
      "Xanh Bạc Hà"
    ],
    "sizes": [
      "10000mAh"
    ],
    "images": [
      "https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600"
    ],
    "description": "Lực hút nam châm từ tính MagSafe siêu mạnh 10N hít chắc vào lưng iPhone 12/13/14/15/16 không bị trượt, tích hợp chân chống kim loại gập mở tiện lợi xem video rảnh tay, dung lượng 10.000mAh sạc gần 2 lần cho iPhone.",
    "reviewCount": 171,
    "discountRate": 26,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "POWER-002",
    "name": "Pin Sạc Dự Phòng Siêu Nhanh 65W Baseus Blade 20.000mAh Mỏng Nhẹ",
    "category": "Pin Sạc Dự Phòng",
    "price": 1390000,
    "originalPrice": 1890000,
    "stock": 55,
    "rating": 4.9,
    "soldCount": 610,
    "colors": [
      "Đen Carbon"
    ],
    "sizes": [
      "20000mAh"
    ],
    "images": [
      "https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600"
    ],
    "description": "Thiết kế siêu mỏng dẹt chỉ 18mm dễ dàng nhét vừa balo cùng laptop, công suất đầu ra 65W chuẩn PD sạc được cho cả MacBook Pro và iPhone cùng lúc, màn hình LED hiển thị % pin và thời gian sạc chính xác.",
    "reviewCount": 134,
    "discountRate": 26,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "POWER-003",
    "name": "Pin Sạc Dự Phòng Xiaomi Power Bank 3 20.000mAh Sạc Nhanh 22.5W",
    "category": "Pin Sạc Dự Phòng",
    "price": 490000,
    "originalPrice": 690000,
    "stock": 190,
    "rating": 4.8,
    "soldCount": 2400,
    "colors": [
      "Trắng"
    ],
    "sizes": [
      "20000mAh"
    ],
    "images": [
      "https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600"
    ],
    "description": "Dung lượng pin thực tế lớn 20.000mAh lõi Polymer bền bỉ, 3 cổng đầu ra cho phép sạc đồng thời 3 máy, công nghệ sạc nhanh hai chiều 22.5W rút ngắn thời gian nạp đầy pin dự phòng chỉ còn 4.5 giờ.",
    "reviewCount": 528,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "POWER-004",
    "name": "Pin Sạc Dự Phòng Trong Suốt Shargeek Capsule 10.000mAh Cyberpunk",
    "category": "Pin Sạc Dự Phòng",
    "price": 1650000,
    "originalPrice": 2150000,
    "stock": 35,
    "rating": 5.0,
    "soldCount": 220,
    "colors": [
      "Trong Suốt Vàng"
    ],
    "sizes": [
      "10000mAh"
    ],
    "images": [
      "https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600"
    ],
    "description": "Phong cách khoa học viễn tưởng trong suốt lộ rõ bảng mạch điện tử cao cấp, màn hình màu IPS hiển thị chi tiết dòng điện V/A, công suất sạc 35W nhỏ gọn tiện lợi mang lên máy bay an toàn tuyệt đối.",
    "reviewCount": 48,
    "discountRate": 23,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "POWER-005",
    "name": "Pin Sạc Dự Phòng Ugreen 10.000mAh PD 20W Kèm Dây Cáp Type-C",
    "category": "Pin Sạc Dự Phòng",
    "price": 390000,
    "originalPrice": 550000,
    "stock": 145,
    "rating": 4.8,
    "soldCount": 1100,
    "colors": [
      "Xám Nhạt",
      "Xanh Rêu"
    ],
    "sizes": [
      "10000mAh"
    ],
    "images": [
      "https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600"
    ],
    "description": "Tích hợp sẵn dây cáp Type-C dẻo dai gọn gàng không sợ bỏ quên dây cáp ở nhà, kích thước nhỏ chỉ bằng tấm thẻ ngân hàng, hỗ trợ chuẩn sạc PD 20W và QC 3.0 cho mọi dòng smartphone.",
    "reviewCount": 242,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "POWER-006",
    "name": "Pin Sạc Dự Phòng Mini Bỏ Túi Anker 5.000mAh Chân Cắm Type-C Gập",
    "category": "Pin Sạc Dự Phòng",
    "price": 350000,
    "originalPrice": 490000,
    "stock": 160,
    "rating": 4.7,
    "soldCount": 1350,
    "colors": [
      "Hồng",
      "Đen",
      "Trắng",
      "Xanh Dương"
    ],
    "sizes": [
      "5000mAh"
    ],
    "images": [
      "https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600"
    ],
    "description": "Thiết kế dạng thỏi son siêu mini cắm trực tiếp vào đuôi điện thoại không cần dây nối rườm rà, chân cắm Type-C gập lại bảo vệ chống gãy, cứu sinh hoàn hảo khi điện thoại sắp cạn pin giữa ngày.",
    "reviewCount": 297,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "AUDIO-001",
    "name": "Tai Nghe Bluetooth Apple AirPods Pro 2 Type-C - Chính Hãng VN/A",
    "category": "Tai Nghe & Âm Thanh",
    "price": 5490000,
    "originalPrice": 6190000,
    "stock": 70,
    "rating": 5.0,
    "soldCount": 1500,
    "colors": [
      "Trắng"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"
    ],
    "description": "Trang bị chip Apple H2 mang lại khả năng Chống ồn chủ động ANC gấp 2 lần, tính năng Nhận biết cuộc hội thoại thông minh, âm thanh không gian cá nhân hóa Spatial Audio, hộp sạc chuẩn cổng USB-C và loa tìm kiếm Find My.",
    "reviewCount": 330,
    "discountRate": 11,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "AUDIO-002",
    "name": "Tai Nghe True Wireless Samsung Galaxy Buds FE Chống Ồn ANC",
    "category": "Tai Nghe & Âm Thanh",
    "price": 1490000,
    "originalPrice": 1990000,
    "stock": 95,
    "rating": 4.8,
    "soldCount": 820,
    "colors": [
      "Trắng Tinh Khôi",
      "Xám Graphite"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600"
    ],
    "description": "Thiết kế cánh đeo wing-tip công thái học bám chắc tai khi tập thể thao, âm bass mạnh mẽ sống động từ củ loa mới, công nghệ chống ồn chủ động ANC loại bỏ tạp âm xung quanh, thời lượng pin đến 30 giờ cùng hộp sạc.",
    "reviewCount": 180,
    "discountRate": 25,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "AUDIO-003",
    "name": "Tai Nghe Chụp Tai Chống Ồn Sony WH-1000XM5 Hi-Res Audio",
    "category": "Tai Nghe & Âm Thanh",
    "price": 7690000,
    "originalPrice": 8990000,
    "stock": 25,
    "rating": 5.0,
    "soldCount": 310,
    "colors": [
      "Đen",
      "Bạc Bạch Kim"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
    ],
    "description": "Đỉnh cao chống ồn thế giới với 2 bộ vi xử lý và 8 micro chuyên dụng, chất âm chi tiết chuẩn Hi-Res Audio Wireless codec LDAC, đệm tai da mềm êm ái đeo cả ngày không đau tai, pin 30 giờ liên tục.",
    "reviewCount": 68,
    "discountRate": 14,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "AUDIO-004",
    "name": "Loa Bluetooth Di Động JBL Go 3 Chống Nước Kháng Bụi IP67",
    "category": "Tai Nghe & Âm Thanh",
    "price": 890000,
    "originalPrice": 1090000,
    "stock": 110,
    "rating": 4.8,
    "soldCount": 1600,
    "colors": [
      "Đen",
      "Đỏ",
      "Xanh Rằn Ri",
      "Xanh Teal"
    ],
    "sizes": [
      "Mini"
    ],
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    ],
    "description": "Âm thanh nguyên bản JBL Pro Sound mạnh mẽ bùng nổ trong thân hình bỏ túi nhỏ gọn, vải bọc thể thao chống rách, chuẩn chống nước bụi IP67 thoải mái mang đi bơi hay dã ngoại ngoài trời.",
    "reviewCount": 352,
    "discountRate": 18,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "AUDIO-005",
    "name": "Tai Nghe Bluetooth Soundpeats Clear Trong Suốt Gaming Low-Latency",
    "category": "Tai Nghe & Âm Thanh",
    "price": 490000,
    "originalPrice": 690000,
    "stock": 130,
    "rating": 4.7,
    "soldCount": 940,
    "colors": [
      "Trắng Trong Suốt",
      "Đen Trong Suốt"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600"
    ],
    "description": "Thiết kế vỏ hộp trong suốt độc lạ thời thượng, driver sinh học 12mm cho âm thanh chi tiết, chế độ Game Mode độ trễ cực thấp chỉ 60ms cho trải nghiệm xem phim bắn súng chuẩn xác.",
    "reviewCount": 206,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "AUDIO-006",
    "name": "Tai Nghe Có Dây Cổng Type-C Samsung AKG Âm Bass Chắc Khỏe",
    "category": "Tai Nghe & Âm Thanh",
    "price": 190000,
    "originalPrice": 290000,
    "stock": 210,
    "rating": 4.8,
    "soldCount": 2100,
    "colors": [
      "Đen Nhám",
      "Trắng"
    ],
    "sizes": [
      "Dây 1.2m"
    ],
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
    ],
    "description": "Tai nghe dây cổng cắm Type-C nguyên bản được tinh chỉnh bởi chuyên gia âm thanh AKG, tích hợp chip giải mã DAC cho chất âm trong trẻo không bị rè, đàm thoại mic rõ nét không trễ.",
    "reviewCount": 462,
    "discountRate": 34,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CASE-001",
    "name": "Ốp Lưng Chống Sốc UAG Monarch Pro Kevlar Hỗ Trợ MagSafe",
    "category": "Ốp Lưng & Bao Da",
    "price": 1850000,
    "originalPrice": 2200000,
    "stock": 40,
    "rating": 5.0,
    "soldCount": 260,
    "colors": [
      "Đen Kevlar",
      "Xám Kim Loại"
    ],
    "sizes": [
      "iPhone 16 Pro Max",
      "iPhone 15 Pro Max",
      "S24 Ultra"
    ],
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
    ],
    "description": "Ốp lưng quân đội chuẩn độ bền rơi rớt gấp 5 lần chuẩn MIL-STD 810G, cấu tạo 5 lớp bảo vệ tối thượng sợi Kevlar chống đạn cao cấp, nam châm MagSafe hít cực chắc tương thích mọi phụ kiện từ tính.",
    "reviewCount": 57,
    "discountRate": 16,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CASE-002",
    "name": "Ốp Lưng MagSafe Trong Suốt Chống Ố Vàng Hoda Crystal",
    "category": "Ốp Lưng & Bao Da",
    "price": 450000,
    "originalPrice": 590000,
    "stock": 160,
    "rating": 4.9,
    "soldCount": 1700,
    "colors": [
      "Trong Suốt"
    ],
    "sizes": [
      "iPhone 16 Series",
      "iPhone 15 Series",
      "S24 Series"
    ],
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
    ],
    "description": "Chất liệu TPU Bayer Đức cao cấp phủ lớp nano kháng tia UV cam kết không ố vàng trong 6 tháng, viền gờ nâng cao bảo vệ cụm camera và màn hình, vòng từ tính MagSafe thẩm mỹ cao.",
    "reviewCount": 374,
    "discountRate": 24,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CASE-003",
    "name": "Ốp Lưng Silicon Mềm Chống Bám Vân Tay Cho Samsung S24 Ultra",
    "category": "Ốp Lưng & Bao Da",
    "price": 180000,
    "originalPrice": 250000,
    "stock": 190,
    "rating": 4.8,
    "soldCount": 1300,
    "colors": [
      "Xám Titan",
      "Đen",
      "Xanh Rêu"
    ],
    "sizes": [
      "S24 Ultra",
      "S24 Plus"
    ],
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
    ],
    "description": "Bề mặt phủ lớp Liquid Silicone mềm mịn như da em bé, lót nỉ nhung bên trong chống trầy xước lưng máy, chống bám mồ hôi và dấu vân tay tuyệt đối, vệ sinh lau chùi dễ dàng.",
    "reviewCount": 286,
    "discountRate": 28,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CASE-004",
    "name": "Ốp Lưng Chống Sốc Spigen Rugged Armor Cho Xiaomi 14 / Redmi Note",
    "category": "Ốp Lưng & Bao Da",
    "price": 320000,
    "originalPrice": 420000,
    "stock": 85,
    "rating": 4.8,
    "soldCount": 650,
    "colors": [
      "Đen Nhám"
    ],
    "sizes": [
      "Xiaomi 14",
      "Redmi Note 13"
    ],
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
    ],
    "description": "Họa tiết sợi carbon thể thao mạnh mẽ, công nghệ đệm khí Air Cushion độc quyền ở 4 góc phân tán lực va đập khi rơi rớt, cầm nắm đầm tay chắc chắn không trơn trượt.",
    "reviewCount": 143,
    "discountRate": 24,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CASE-005",
    "name": "Bao Da Ví Gập Cầm Tay Da Bò Khóa Nam Châm Cho Điện Thoại",
    "category": "Ốp Lưng & Bao Da",
    "price": 350000,
    "originalPrice": 490000,
    "stock": 75,
    "rating": 4.7,
    "soldCount": 420,
    "colors": [
      "Nâu Cổ Điển",
      "Đen Lịch Lãm"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
    ],
    "description": "Bao da ví phong cách doanh nhân sang trọng tích hợp các ngăn để thẻ ATM và tiền mặt, có thể gập ngang làm giá đỡ điện thoại xem phim, khóa hít nam châm đóng mở tiện lợi.",
    "reviewCount": 92,
    "discountRate": 29,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "CASE-006",
    "name": "Ốp Lưng Dẻo Trong Suốt Chống Sốc 4 Góc Airbag Siêu Tiết Kiệm",
    "category": "Ốp Lưng & Bao Da",
    "price": 49000,
    "originalPrice": 90000,
    "stock": 450,
    "rating": 4.7,
    "soldCount": 3800,
    "colors": [
      "Trong Suốt"
    ],
    "sizes": [
      "Tất cả dòng máy"
    ],
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
    ],
    "description": "Ốp dẻo TPU silicon trong suốt khoe trọn màu máy nguyên bản, 4 góc thiết kế gờ túi khí airbag hấp thụ xung lực khi va đập, bảo vệ điện thoại kinh tế và hiệu quả.",
    "reviewCount": 836,
    "discountRate": 46,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "SCREEN-001",
    "name": "Kính Cường Lực Chống Nhìn Trộm Privacy KingKong Khung Tự Dán",
    "category": "Kính Cường Lực & Dán Màn Hình",
    "price": 180000,
    "originalPrice": 250000,
    "stock": 280,
    "rating": 4.9,
    "soldCount": 2900,
    "colors": [
      "Viền Đen"
    ],
    "sizes": [
      "iPhone 16 Series",
      "iPhone 15 Series",
      "iPhone 14 Series"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Góc nghiêng 28 độ chống nhìn trộm bảo vệ sự riêng tư thông tin nơi công cộng, độ cứng 9H chống trầy xước chìa khóa, hộp khung trợ dán thông minh tự động hút khí không bong bóng.",
    "reviewCount": 638,
    "discountRate": 28,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "SCREEN-002",
    "name": "Kính Cường Lực Hoda Sapphire Siêu Cứng Chống Trầy 9H Đỉnh Cao",
    "category": "Kính Cường Lực & Dán Màn Hình",
    "price": 390000,
    "originalPrice": 520000,
    "stock": 110,
    "rating": 5.0,
    "soldCount": 890,
    "colors": [
      "Trong Suốt"
    ],
    "sizes": [
      "iPhone 16 Pro Max",
      "S24 Ultra"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Vật liệu tinh thể Sapphire nhân tạo đạt chứng nhận GIA có độ cứng chỉ sau kim cương, lớp phủ nano chống vân tay trơn láng mượt mà như màn hình trần, độ trong suốt quang học 99%.",
    "reviewCount": 195,
    "discountRate": 25,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "SCREEN-003",
    "name": "Kính Cường Lực Khung Tự Dán MIPOW Kingbull HD Chống Chói",
    "category": "Kính Cường Lực & Dán Màn Hình",
    "price": 290000,
    "originalPrice": 390000,
    "stock": 175,
    "rating": 4.9,
    "soldCount": 1400,
    "colors": [
      "Trong Suốt HD"
    ],
    "sizes": [
      "iPhone 16 Series",
      "iPhone 15 Series"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Kính cường lực vát cạnh 3D cong tràn mượt mà, công nghệ chống chói hiển thị rõ ràng dưới ánh nắng gắt, khung dán tự động chỉ mất 10 giây thao tác tại nhà.",
    "reviewCount": 308,
    "discountRate": 26,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "SCREEN-004",
    "name": "Bộ 2 Miếng Dán Dẻo PPF Mặt Lưng Nhám Tự Phục Hồi Vết Xước",
    "category": "Kính Cường Lực & Dán Màn Hình",
    "price": 99000,
    "originalPrice": 150000,
    "stock": 260,
    "rating": 4.8,
    "soldCount": 2100,
    "colors": [
      "Nhám Mờ"
    ],
    "sizes": [
      "Tất cả dòng máy"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Chất liệu màng PPF cao cấp tự co giãn phục hồi các vết xước dăm dưới tác động nhiệt, bề mặt nhám mịn chống bám mồ hôi và giúp cầm máy trần chắc chắn.",
    "reviewCount": 462,
    "discountRate": 34,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "SCREEN-005",
    "name": "Bộ Viền Kính Bảo Vệ Cụm Camera Sapphire Kim Loại Cho Điện Thoại",
    "category": "Kính Cường Lực & Dán Màn Hình",
    "price": 120000,
    "originalPrice": 180000,
    "stock": 310,
    "rating": 4.9,
    "soldCount": 2600,
    "colors": [
      "Titan Tự Nhiên",
      "Titan Đen",
      "Bạc",
      "Cầu Vồng"
    ],
    "sizes": [
      "iPhone 16 Pro/Pro Max",
      "S24 Ultra"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Khung viền hợp kim nhôm hàng không ôm khít từng mắt camera, kính sapphire quang học chống lóa AR chụp ảnh đêm không bị bóng mờ hay suy giảm chất lượng ảnh.",
    "reviewCount": 572,
    "discountRate": 33,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "SCREEN-006",
    "name": "Miếng Dán Màn Hình Trong Suốt Chống Bám Dầu Mỡ",
    "category": "Kính Cường Lực & Dán Màn Hình",
    "price": 25000,
    "originalPrice": 50000,
    "stock": 500,
    "rating": 4.6,
    "soldCount": 4500,
    "colors": [
      "Trong Suốt"
    ],
    "sizes": [
      "Phổ thông"
    ],
    "images": [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600"
    ],
    "description": "Miếng dán PET trong suốt siêu mỏng bảo vệ màn hình chống bụi bẩn và trầy xước nhẹ hàng ngày, cảm ứng mượt mà nhạy bén với mức giá rẻ nhất toàn bộ phụ kiện tại ZShop.",
    "reviewCount": 990,
    "discountRate": 50,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "STAND-001",
    "name": "Trạm Sạc Không Dây 3 Trong 1 Gập Gọn MagSafe 15W Tiện Lợi",
    "category": "Giá Đỡ & Trạm Sạc",
    "price": 890000,
    "originalPrice": 1190000,
    "stock": 90,
    "rating": 4.9,
    "soldCount": 730,
    "colors": [
      "Trắng Bắc Cực",
      "Đen Không Gian"
    ],
    "sizes": [
      "15W MagSafe"
    ],
    "images": [
      "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=600"
    ],
    "description": "Trạm sạc đa năng hỗ trợ sạc đồng thời 3 thiết bị: iPhone (15W MagSafe), Apple Watch và tai nghe AirPods, thiết kế khớp gập cơ học siêu gọn bỏ túi mang đi công tác du lịch.",
    "reviewCount": 160,
    "discountRate": 25,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "STAND-002",
    "name": "Gimbal Chống Rung 3 Trục Tracking Khuôn Mặt AI Cho Điện Thoại",
    "category": "Giá Đỡ & Trạm Sạc",
    "price": 1450000,
    "originalPrice": 1950000,
    "stock": 45,
    "rating": 4.9,
    "soldCount": 380,
    "colors": [
      "Xám Nhạt"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=600"
    ],
    "description": "Hệ thống chống rung cơ học 3 trục chuyên nghiệp cho video mượt mà như phim điện ảnh, cảm biến AI bám theo chủ thể tự động không cần qua app, tích hợp đèn chiếu sáng fill-light 3 chế độ.",
    "reviewCount": 83,
    "discountRate": 26,
    "shippingFee": 0,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "STAND-003",
    "name": "Giá Đỡ Điện Thoại Để Bàn Hợp Kim Nhôm Xoay 360 Độ",
    "category": "Giá Đỡ & Trạm Sạc",
    "price": 120000,
    "originalPrice": 180000,
    "stock": 230,
    "rating": 4.8,
    "soldCount": 1850,
    "colors": [
      "Bạc Kim Loại",
      "Xám Không Gian"
    ],
    "sizes": [
      "Freesize"
    ],
    "images": [
      "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=600"
    ],
    "description": "Hợp kim nhôm nguyên khối CNC chắc chắn chịu lực tốt, chân đế xoay 360 độ kèm âm thanh click vui tai, tùy chỉnh độ cao và góc nghiêng công thái học chống mỏi cổ khi làm việc.",
    "reviewCount": 407,
    "discountRate": 33,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  },
  {
    "id": "STAND-004",
    "name": "Đầu Chuyển Đổi OTG Type-C Ra Cổng USB-A Vỏ Kim Loại Mini",
    "category": "Giá Đỡ & Trạm Sạc",
    "price": 35000,
    "originalPrice": 60000,
    "stock": 400,
    "rating": 4.8,
    "soldCount": 3200,
    "colors": [
      "Xám Titan",
      "Đen"
    ],
    "sizes": [
      "Mini"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    ],
    "description": "Đầu chuyển đổi cổng USB Type-C sang cổng USB-A tiêu chuẩn, cắm chuột, bàn phím hoặc USB flash vào điện thoại hay iPad nhanh chóng, tốc độ truyền file 5Gbps ổn định mượt mà.",
    "reviewCount": 704,
    "discountRate": 42,
    "shippingFee": 15000,
    "shippingEstimate": "Hỏa tốc 2h - 48h",
    "videoDuration": "00:45s"
  }
];
