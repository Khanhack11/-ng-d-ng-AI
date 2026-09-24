import { ProductDetail, CartItem, Order, PaymentMethodType, PaymentMethodConfig } from './types';

// DANH MỤC 45 SẢN PHẨM ĐIỆN THOẠI IPHONE (25 MẪU GỐC + 20 MẪU IPHONE ĐỜI CAO MỚI NHẤT)
// ĐỒNG BỘ MÀU SẮC & HÌNH ẢNH CHUẨN APPLE.COM — IPHONE 18 PRO MAX MÀU MỚI NHẤT (KHÔNG DÙNG MÀU CAM)
export const MOCK_PRODUCTS_LIST: ProductDetail[] = [
  {
    id: "ip-18-promax",
    name: "iPhone 18 Pro Max 256GB Chính Hãng VN/A",
    price: 38990000,
    originalPrice: 42990000,
    discountRate: 9,
    rating: 5.0,
    reviewCount: 386,
    soldCount: 910,
    stock: 45,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2_1_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
    ],
    colors: [
      "Đỏ Rượu Vang Burgundy Titan (Mới)",
      "Xanh Băng Hà Glacier Blue Titan (Mới)",
      "Cà Phê Mocha Titan (Mới)",
      "Bạc Platinum Titan",
      "Đen Không Gian Titan",
      "Vàng Sa Mạc Titan"
    ],
    sizes: ["256GB", "512GB", "1TB", "2TB"],
    description: "Siêu phẩm đỉnh cao nhất nhà Apple (Apple.com 2026): iPhone 18 Pro Max chính hãng VN/A với 3 phối màu hoàn toàn mới: Đỏ Rượu Vang Burgundy Titan, Xanh Băng Hà Glacier Blue Titan và Cà Phê Mocha Titan. Trang bị chip Apple A20 Pro tiến trình 2nm siêu tốc độ, RAM 12GB xử lý trọn vẹn Apple Intelligence tiếng Việt. Cụm 3 camera 48MP ProRAW có khẩu độ biến thiên cơ học và ống kính tiềm vọng Zoom quang 10x sắc nét từng chi tiết, màn hình 6.9 inch Super Retina XDR 3000 nits.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18-ultra",
    name: "iPhone 18 Ultra 1TB Titanium Đặc Biệt Chính Hãng VN/A",
    price: 45990000,
    originalPrice: 49990000,
    discountRate: 8,
    rating: 5.0,
    reviewCount: 128,
    soldCount: 295,
    stock: 20,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-duo-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png"
    ],
    colors: [
      "Xanh Băng Hà Glacier Blue Titan (Mới)",
      "Đỏ Rượu Vang Burgundy Titan (Mới)",
      "Cà Phê Mocha Titan (Mới)",
      "Bạc Platinum Titan",
      "Đen Không Gian Titan"
    ],
    sizes: ["512GB", "1TB", "2TB"],
    description: "Phiên bản thượng đỉnh iPhone 18 Ultra 1TB VN/A: Khung viền Titanium Cấp 5 siêu bền kết hợp mặt kính Sapphire chống trầy tuyệt đối, chip A20 Ultra 2nm 8 nhân GPU, pin 5500mAh trụ vững 2 ngày, hỗ trợ quay video 8K ProRes và kết nối vệ tinh toàn cầu.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18-promax-1tb",
    name: "iPhone 18 Pro Max 1TB Chính Hãng VN/A",
    price: 43990000,
    originalPrice: 47990000,
    discountRate: 8,
    rating: 5.0,
    reviewCount: 164,
    soldCount: 380,
    stock: 25,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2_1_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png"
    ],
    colors: [
      "Đỏ Rượu Vang Burgundy Titan (Mới)",
      "Xanh Băng Hà Glacier Blue Titan (Mới)",
      "Cà Phê Mocha Titan (Mới)",
      "Bạc Platinum Titan",
      "Đen Không Gian Titan"
    ],
    sizes: ["1TB", "2TB"],
    description: "iPhone 18 Pro Max dung lượng khủng 1TB chính hãng VN/A dành cho nhà sáng tạo nội dung chuyên nghiệp: Lưu trữ thoải mái hàng ngàn giờ video 4K 120fps ProRes Log, chip A20 Pro 2nm, RAM 12GB và Zoom quang tiềm vọng 10x.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18-promax-512gb",
    name: "iPhone 18 Pro Max 512GB Chính Hãng VN/A",
    price: 41490000,
    originalPrice: 44990000,
    discountRate: 8,
    rating: 5.0,
    reviewCount: 215,
    soldCount: 520,
    stock: 32,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png"
    ],
    colors: [
      "Xanh Băng Hà Glacier Blue Titan (Mới)",
      "Đỏ Rượu Vang Burgundy Titan (Mới)",
      "Cà Phê Mocha Titan (Mới)",
      "Bạc Platinum Titan",
      "Đen Không Gian Titan",
      "Vàng Sa Mạc Titan"
    ],
    sizes: ["512GB", "1TB"],
    description: "iPhone 18 Pro Max 512GB VN/A màu Xanh Băng Hà Glacier Blue Titan & Đỏ Burgundy mới nhất trên Apple.com: Dung lượng 512GB cân bằng hoàn hảo cho nhu cầu quay chụp 4K và chiến mọi tựa game AAA trong 5 năm tới.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18-pro",
    name: "iPhone 18 Pro 256GB Chính Hãng VN/A",
    price: 33990000,
    originalPrice: 36990000,
    discountRate: 8,
    rating: 5.0,
    reviewCount: 182,
    soldCount: 410,
    stock: 30,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb_2_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1_1_1_1.png"
    ],
    colors: [
      "Xanh Lục Bảo Emerald Titan (Mới)",
      "Đỏ Rượu Vang Burgundy Titan (Mới)",
      "Xanh Băng Hà Glacier Blue Titan (Mới)",
      "Bạc Platinum Titan",
      "Đen Không Gian Titan",
      "Vàng Sa Mạc Titan"
    ],
    sizes: ["256GB", "512GB", "1TB"],
    description: "iPhone 18 Pro 256GB chính hãng VN/A: Thiết kế nhỏ gọn 6.3 inch viền siêu mỏng, trang bị chip A20 Pro 2nm, RAM 12GB, cụm 3 camera 48MP toàn diện cùng Face ID ẩn dưới màn hình thế hệ mới.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18-pro-512gb",
    name: "iPhone 18 Pro 512GB Chính Hãng VN/A",
    price: 36990000,
    originalPrice: 39990000,
    discountRate: 8,
    rating: 5.0,
    reviewCount: 112,
    soldCount: 245,
    stock: 24,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb_2_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png"
    ],
    colors: [
      "Cà Phê Mocha Titan (Mới)",
      "Đỏ Rượu Vang Burgundy Titan (Mới)",
      "Xanh Băng Hà Glacier Blue Titan (Mới)",
      "Bạc Platinum Titan",
      "Đen Không Gian Titan"
    ],
    sizes: ["512GB", "1TB"],
    description: "iPhone 18 Pro 512GB VN/A màu Cà Phê Mocha Titan sang trọng: Sức mạnh ngang ngửa bản Pro Max trong kích thước 6.3 inch cầm gọn một tay, bộ nhớ 512GB thoải mái quay phim 4K.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18-plus",
    name: "iPhone 18 Plus 256GB Chính Hãng VN/A",
    price: 29990000,
    originalPrice: 32990000,
    discountRate: 9,
    rating: 4.9,
    reviewCount: 145,
    soldCount: 330,
    stock: 35,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-duo-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg"
    ],
    colors: [
      "Xanh Ngọc Bích Jade (Mới)",
      "Tím Ánh Sao Starlight Purple (Mới)",
      "Hồng Đào Coral Pink (Mới)",
      "Xanh Lưu Ly Ultramarine",
      "Trắng Ngọc Trai",
      "Đen Midnight"
    ],
    sizes: ["256GB", "512GB"],
    description: "iPhone 18 Plus 256GB VN/A: Màn hình lớn 6.7 inch OLED ProMotion 120Hz siêu mượt, thời lượng pin trâu vô địch phân khúc cùng chip Apple A20 2nm thế hệ mới.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18",
    name: "iPhone 18 256GB Chính Hãng VN/A",
    price: 26490000,
    originalPrice: 28990000,
    discountRate: 9,
    rating: 4.9,
    reviewCount: 190,
    soldCount: 470,
    stock: 40,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_3.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-duo-01.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1_4_1.png"
    ],
    colors: [
      "Tím Ánh Sao Starlight Purple (Mới)",
      "Xanh Ngọc Bích Jade (Mới)",
      "Hồng Đào Coral Pink (Mới)",
      "Trắng Ngọc Trai",
      "Đen Midnight"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 18 tiêu chuẩn 256GB chính hãng VN/A: Nâng cấp toàn diện với màn hình 120Hz ProMotion, RAM 12GB chạy mượt Apple Intelligence, cụm camera kép 48MP Fusion chụp đêm rực rỡ.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-18e",
    name: "iPhone 18e 128GB Chính Hãng VN/A",
    price: 17990000,
    originalPrice: 19990000,
    discountRate: 10,
    rating: 4.8,
    reviewCount: 135,
    soldCount: 390,
    stock: 42,
    category: "iPhone 18 Series (Flagship 2026)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e-128gb.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17e_pink_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e-128gb_2.png"
    ],
    colors: [
      "Hồng Phấn Sakura (Mới)",
      "Xanh Bạc Hà Mint (Mới)",
      "Trắng Tinh Khôi (Mới)",
      "Đen Nhám Matte Black"
    ],
    sizes: ["128GB", "256GB"],
    description: "iPhone 18e 128GB VN/A: Chiếc iPhone thế hệ 2026 có mức giá dễ tiếp cận nhất của Apple, trang bị chip A19 mạnh mẽ, màn hình OLED 6.1 inch tràn viền và thời lượng pin ấn tượng.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-promax",
    name: "iPhone 17 Pro Max 256GB Chính Hãng VN/A",
    price: 31990000,
    originalPrice: 35990000,
    discountRate: 11,
    rating: 4.9,
    reviewCount: 485,
    soldCount: 1120,
    stock: 40,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3_1.jpg"
    ],
    colors: [
      "Xanh Lam Cobalt Titan (Mới)",
      "Xanh Lá Trà Xanh Teal Titan (Mới)",
      "Bạc Trắng Platinum Titan (Mới)",
      "Vàng Đồng Desert Titan",
      "Titan Tự Nhiên",
      "Đen Graphite Titan"
    ],
    sizes: ["256GB", "512GB", "1TB", "2TB"],
    description: "iPhone 17 Pro Max 256GB chính hãng VN/A: Chip Apple A19 Pro 3nm cực mạnh, nâng cấp cả 3 ống kính sau lên 48MP (Main + Ultra Wide + Telephoto 5x), màn hình 6.9 inch ProMotion 120Hz chống chói, tản nhiệt buồng hơi Vapor Chamber.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-promax-1tb",
    name: "iPhone 17 Pro Max 1TB Chính Hãng VN/A",
    price: 36990000,
    originalPrice: 40990000,
    discountRate: 10,
    rating: 4.9,
    reviewCount: 175,
    soldCount: 410,
    stock: 22,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb.png"
    ],
    colors: [
      "Bạc Trắng Platinum Titan (Mới)",
      "Xanh Lam Cobalt Titan (Mới)",
      "Xanh Lá Trà Xanh Teal Titan (Mới)",
      "Titan Tự Nhiên",
      "Đen Graphite Titan"
    ],
    sizes: ["1TB", "2TB"],
    description: "iPhone 17 Pro Max 1TB VN/A: Bộ nhớ siêu khủng 1024GB kết hợp 3 camera 48MP quay video ProRes 4K 120fps, tản nhiệt buồng hơi Vapor Chamber giữ máy luôn mát mẻ.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-promax-512gb",
    name: "iPhone 17 Pro Max 512GB Chính Hãng VN/A",
    price: 34490000,
    originalPrice: 38490000,
    discountRate: 10,
    rating: 4.9,
    reviewCount: 230,
    soldCount: 590,
    stock: 30,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3_1_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb.jpg"
    ],
    colors: [
      "Xanh Lá Trà Xanh Teal Titan (Mới)",
      "Xanh Lam Cobalt Titan (Mới)",
      "Bạc Trắng Platinum Titan (Mới)",
      "Titan Tự Nhiên",
      "Đen Graphite Titan"
    ],
    sizes: ["512GB", "1TB"],
    description: "iPhone 17 Pro Max 512GB chính hãng VN/A: Phiên bản dung lượng 512GB bán chạy hàng đầu, trang bị RAM 12GB, chip A19 Pro và màn hình 6.9 inch chống phản chiếu.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-pro",
    name: "iPhone 17 Pro 256GB Chính Hãng VN/A",
    price: 27990000,
    originalPrice: 31990000,
    discountRate: 12,
    rating: 4.9,
    reviewCount: 290,
    soldCount: 640,
    stock: 28,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb_2_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1_1_1_1.png"
    ],
    colors: [
      "Xanh Lam Cobalt Titan (Mới)",
      "Xanh Lá Trà Xanh Teal Titan (Mới)",
      "Bạc Trắng Platinum Titan (Mới)",
      "Titan Tự Nhiên",
      "Đen Graphite Titan"
    ],
    sizes: ["256GB", "512GB", "1TB"],
    description: "iPhone 17 Pro 256GB chính hãng VN/A: Sức mạnh chuẩn Pro trong thân hình 6.3 inch vừa tay, chip A19 Pro, RAM 12GB, 3 camera 48MP quay video 4K 120fps Dolby Vision.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-pro-512gb",
    name: "iPhone 17 Pro 512GB Chính Hãng VN/A",
    price: 30990000,
    originalPrice: 34490000,
    discountRate: 10,
    rating: 4.9,
    reviewCount: 156,
    soldCount: 370,
    stock: 25,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb_2_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb_2_2.jpg"
    ],
    colors: [
      "Xanh Lam Cobalt Titan (Mới)",
      "Xanh Lá Trà Xanh Teal Titan (Mới)",
      "Bạc Trắng Platinum Titan (Mới)",
      "Titan Tự Nhiên",
      "Đen Graphite Titan"
    ],
    sizes: ["512GB", "1TB"],
    description: "iPhone 17 Pro 512GB VN/A: Phiên bản nhỏ gọn 6.3 inch dung lượng cao 512GB, trang bị đầy đủ ống kính Telephoto 5x 48MP và chip A19 Pro.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-air",
    name: "iPhone 17 Air 256GB Siêu Mỏng Chính Hãng VN/A",
    price: 24990000,
    originalPrice: 27990000,
    discountRate: 11,
    rating: 4.9,
    reviewCount: 248,
    soldCount: 580,
    stock: 30,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_air-3_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2_1_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg"
    ],
    colors: [
      "Xanh Băng Giá Sky Ice (Mới)",
      "Trắng Sương Mù Cloud White (Mới)",
      "Vàng Ánh Kim Champagne (Mới)",
      "Hồng Phấn Sakura",
      "Đen Không Gian"
    ],
    sizes: ["256GB", "512GB"],
    description: "iPhone 17 Air 256GB — Chiếc iPhone mỏng nhất lịch sử Apple (chỉ 5.5mm), trọng lượng siêu nhẹ 145g, màn hình 6.6 inch OLED 120Hz ProMotion, chip A19 mạnh mẽ, cực hợp GenZ yêu thích thời trang thanh lịch.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17-plus",
    name: "iPhone 17 Plus 256GB Chính Hãng VN/A",
    price: 24490000,
    originalPrice: 27490000,
    discountRate: 11,
    rating: 4.8,
    reviewCount: 185,
    soldCount: 440,
    stock: 32,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_3.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png"
    ],
    colors: [
      "Xanh Matcha Sage (Mới)",
      "Tím Oải Hương Lavender (Mới)",
      "Xanh Băng Giá Sky Ice (Mới)",
      "Hồng Phấn Pastel",
      "Trắng Ngọc"
    ],
    sizes: ["256GB", "512GB"],
    description: "iPhone 17 Plus 256GB VN/A: Màn hình 6.7 inch 120Hz ProMotion rộng rãi cùng viên pin dung lượng cao nhất dòng tiêu chuẩn, đáp ứng trọn vẹn 2 ngày sử dụng liên tục.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17",
    name: "iPhone 17 128GB Chính Hãng VN/A",
    price: 21990000,
    originalPrice: 24990000,
    discountRate: 12,
    rating: 4.8,
    reviewCount: 260,
    soldCount: 620,
    stock: 45,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_3_1_1_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17e_pink_1.png"
    ],
    colors: [
      "Tím Oải Hương Lavender (Mới)",
      "Xanh Matcha Sage (Mới)",
      "Hồng Đào Peony (Mới)",
      "Trắng Ngọc",
      "Đen Midnight"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 17 tiêu chuẩn màu Tím Oải Hương (Lavender) & Xanh Matcha chính hãng VN/A: Lần đầu tiên dòng thường có màn hình ProMotion 120Hz mượt mà, camera selfie nâng cấp 24MP cực nét, chip A19 tiết kiệm pin vượt trội.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-17e",
    name: "iPhone 17e 128GB Chính Hãng VN/A",
    price: 15990000,
    originalPrice: 18490000,
    discountRate: 14,
    rating: 4.8,
    reviewCount: 168,
    soldCount: 490,
    stock: 38,
    category: "iPhone 17 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17e_pink_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e-128gb.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_3.jpg"
    ],
    colors: [
      "Hồng Phấn Rose Pink (Mới)",
      "Xanh Băng Ice Blue (Mới)",
      "Trắng Sứ White (Mới)",
      "Đen Không Gian"
    ],
    sizes: ["128GB", "256GB"],
    description: "iPhone 17e 128GB VN/A màu Hồng Phấn Rose Pink trẻ trung: Trang bị chip A19 hỗ trợ Apple Intelligence, camera 48MP Fusion 2-trong-1 sắc nét và thiết kế gọn nhẹ bền bỉ.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16-promax",
    name: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
    price: 28990000,
    originalPrice: 34990000,
    discountRate: 17,
    rating: 4.9,
    reviewCount: 920,
    soldCount: 2450,
    stock: 50,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_2_1_1.png"
    ],
    colors: [
      "Vàng Titan Sa Mạc Desert (Mới)",
      "Titan Tự Nhiên Natural (Mới)",
      "Trắng Ngọc White Titan (Mới)",
      "Đen Không Gian Black Titan",
      "Xám Khói Titanium"
    ],
    sizes: ["256GB", "512GB", "1TB"],
    description: "Best-seller quốc dân tại Thế Giới iPhone: iPhone 16 Pro Max 256GB VN/A màu Vàng Titan Sa Mạc (Desert Titanium) sang trọng, màn hình 6.9 inch, nút Camera Control cảm ứng lực thông minh, chip A18 Pro, quay 4K 120fps.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16-promax-1tb",
    name: "iPhone 16 Pro Max 1TB Chính Hãng VN/A",
    price: 33990000,
    originalPrice: 39990000,
    discountRate: 15,
    rating: 4.9,
    reviewCount: 315,
    soldCount: 780,
    stock: 26,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_2_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png"
    ],
    colors: [
      "Vàng Titan Sa Mạc Desert (Mới)",
      "Titan Tự Nhiên Natural (Mới)",
      "Trắng Ngọc White Titan (Mới)",
      "Đen Không Gian Black Titan"
    ],
    sizes: ["1TB"],
    description: "iPhone 16 Pro Max 1TB VN/A: Phiên bản bộ nhớ tối đa 1TB cho phép quay video 4K 120fps Dolby Vision không giới hạn, khung viền Titanium Cấp 5 bền bỉ.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16-promax-512gb",
    name: "iPhone 16 Pro Max 512GB Chính Hãng VN/A",
    price: 31490000,
    originalPrice: 36990000,
    discountRate: 15,
    rating: 4.9,
    reviewCount: 440,
    soldCount: 1150,
    stock: 34,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png"
    ],
    colors: [
      "Titan Tự Nhiên Natural (Mới)",
      "Vàng Titan Sa Mạc Desert (Mới)",
      "Trắng Ngọc White Titan (Mới)",
      "Đen Không Gian Black Titan"
    ],
    sizes: ["512GB", "1TB"],
    description: "iPhone 16 Pro Max 512GB chính hãng VN/A: Dung lượng 512GB rộng rãi, chip A18 Pro 3nm thế hệ 2, màn hình 6.9 inch viền mỏng nhất phân khúc.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16-pro",
    name: "iPhone 16 Pro 128GB Chính Hãng VN/A",
    price: 24490000,
    originalPrice: 28990000,
    discountRate: 16,
    rating: 4.9,
    reviewCount: 540,
    soldCount: 1280,
    stock: 35,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1_1_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png"
    ],
    colors: [
      "Trắng Ngọc White Titan (Mới)",
      "Vàng Titan Sa Mạc Desert (Mới)",
      "Titan Tự Nhiên Natural (Mới)",
      "Đen Không Gian Black Titan",
      "Xám Khói Titanium"
    ],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    description: "iPhone 16 Pro 128GB VN/A màu Trắng Ngọc Titan (White Titanium): Màn hình 6.3 inch 120Hz, có đầy đủ ống kính tiềm vọng Zoom quang 5x như bản Pro Max, nút Camera Control và chip A18 Pro.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16-pro-512gb",
    name: "iPhone 16 Pro 512GB Chính Hãng VN/A",
    price: 27990000,
    originalPrice: 32490000,
    discountRate: 14,
    rating: 4.9,
    reviewCount: 210,
    soldCount: 530,
    stock: 24,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1_1_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png"
    ],
    colors: [
      "Titan Tự Nhiên Natural (Mới)",
      "Vàng Titan Sa Mạc Desert (Mới)",
      "Trắng Ngọc White Titan (Mới)",
      "Đen Không Gian Black Titan"
    ],
    sizes: ["256GB", "512GB", "1TB"],
    description: "iPhone 16 Pro 512GB VN/A: Kết hợp hoàn hảo giữa thiết kế 6.3 inch gọn gàng và dung lượng lớn 512GB, 4 mic chuẩn стуdio thu âm Spatial Audio.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16-plus",
    name: "iPhone 16 Plus 128GB Chính Hãng VN/A",
    price: 21490000,
    originalPrice: 25990000,
    discountRate: 17,
    rating: 4.8,
    reviewCount: 310,
    soldCount: 790,
    stock: 30,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1_3_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1_4_1.png"
    ],
    colors: [
      "Xanh Lưu Ly Ultramarine (Mới)",
      "Xanh Mòng Két Teal (Mới)",
      "Hồng Cánh Sen Pink (Mới)",
      "Trắng White",
      "Đen Black"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 16 Plus màu Xanh Lưu Ly (Ultramarine) chính hãng VN/A: Màn hình lớn 6.7 inch, thời lượng pin trâu hàng đầu, cụm camera dọc mới hỗ trợ quay Spatial Video, nút Action Button & Camera Control.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16",
    name: "iPhone 16 128GB Chính Hãng VN/A",
    price: 18990000,
    originalPrice: 22990000,
    discountRate: 17,
    rating: 4.8,
    reviewCount: 490,
    soldCount: 1350,
    stock: 42,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1_4_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png"
    ],
    colors: [
      "Xanh Mòng Két Teal (Mới)",
      "Xanh Lưu Ly Ultramarine (Mới)",
      "Hồng Cánh Sen Pink (Mới)",
      "Trắng White",
      "Đen Black"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 16 128GB VN/A màu Xanh Mòng Két (Teal): Chip A18 nhảy vọt 2 thế hệ hỗ trợ Apple Intelligence, camera Fusion 48MP chụp đêm xuất sắc, thiết kế trẻ trung hiện đại.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-16e",
    name: "iPhone 16e 128GB Chính Hãng VN/A",
    price: 14990000,
    originalPrice: 16990000,
    discountRate: 12,
    rating: 4.8,
    reviewCount: 220,
    soldCount: 610,
    stock: 36,
    category: "iPhone 16 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e-128gb.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e-128gb_2.png"
    ],
    colors: [
      "Trắng Tinh Khôi Matte White (Mới)",
      "Đen Nhám Matte Black (Mới)",
      "Xanh Băng Ice Blue (Mới)",
      "Bạc Silver"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 16e 128GB chính hãng VN/A: Trang bị chip Apple A18 3nm chạy mượt Apple Intelligence, modem Apple C1 tiết kiệm pin vượt trội, camera 48MP Fusion.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-15-promax",
    name: "iPhone 15 Pro Max 256GB Chính Hãng VN/A",
    price: 25490000,
    originalPrice: 30990000,
    discountRate: 18,
    rating: 4.9,
    reviewCount: 1240,
    soldCount: 3400,
    stock: 28,
    category: "iPhone 15 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5_2_1_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-512gb_2_1_1.png"
    ],
    colors: [
      "Titan Tự Nhiên Natural (Mới)",
      "Titan Xanh Blue Titanium (Mới)",
      "Titan Trắng White (Mới)",
      "Titan Đen Black",
      "Xám Titan"
    ],
    sizes: ["256GB", "512GB", "1TB"],
    description: "iPhone 15 Pro Max 256GB VN/A màu Titan Tự Nhiên (Natural Titanium): Khung viền Titanium siêu nhẹ, cổng sạc USB-C 3.0 tốc độ cao, nút Action Button, camera Telephoto 5x và chip A17 Pro 3nm.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-15-promax-512gb",
    name: "iPhone 15 Pro Max 512GB Chính Hãng VN/A",
    price: 27990000,
    originalPrice: 33490000,
    discountRate: 16,
    rating: 4.9,
    reviewCount: 410,
    soldCount: 1080,
    stock: 22,
    category: "iPhone 15 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-512gb_2_1_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
    ],
    colors: [
      "Titan Xanh Blue Titanium (Mới)",
      "Titan Tự Nhiên Natural (Mới)",
      "Titan Trắng White (Mới)",
      "Titan Đen Black"
    ],
    sizes: ["512GB", "1TB"],
    description: "iPhone 15 Pro Max 512GB VN/A: Dung lượng 512GB cực kỳ dư dả cho người dùng lâu dài, khung viền Titan siêu bền nhẹ và camera tiềm vọng 5x sắc nét.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-15-promax-1tb",
    name: "iPhone 15 Pro Max 1TB Chính Hãng VN/A",
    price: 29990000,
    originalPrice: 36990000,
    discountRate: 19,
    rating: 4.9,
    reviewCount: 195,
    soldCount: 540,
    stock: 18,
    category: "iPhone 15 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-1tb-cu-dep_3_.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
    ],
    colors: [
      "Titan Tự Nhiên Natural (Mới)",
      "Titan Trắng White (Mới)",
      "Titan Xanh Blue Titanium",
      "Titan Đen Black"
    ],
    sizes: ["1TB"],
    description: "iPhone 15 Pro Max 1TB chính hãng VN/A: Mức giá tiết kiệm tới 7 triệu đồng cho phiên bản 1TB cao cấp nhất dòng 15 Series.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-15-pro",
    name: "iPhone 15 Pro 128GB Chính Hãng VN/A",
    price: 21490000,
    originalPrice: 25990000,
    discountRate: 17,
    rating: 4.8,
    reviewCount: 420,
    soldCount: 980,
    stock: 20,
    category: "iPhone 15 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-256gb_1__1_2_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro_2__2_1_1_1.png"
    ],
    colors: [
      "Titan Xanh Blue Titanium (Mới)",
      "Titan Tự Nhiên Natural (Mới)",
      "Titan Trắng White (Mới)",
      "Titan Đen Black"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 15 Pro 128GB màu Titan Xanh (Blue Titanium): Nhỏ gọn 6.1 inch khung viền Titan, màn hình 120Hz ProMotion, chip A17 Pro chiến mượt mọi tựa game AAA.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-15-plus",
    name: "iPhone 15 Plus 128GB Chính Hãng VN/A",
    price: 18490000,
    originalPrice: 22990000,
    discountRate: 20,
    rating: 4.8,
    reviewCount: 390,
    soldCount: 910,
    stock: 25,
    category: "iPhone 15 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb-color-pink-image_3_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb_3.png"
    ],
    colors: [
      "Hồng Phấn Pastel Pink (Mới)",
      "Xanh Lá Nhạt Mint (Mới)",
      "Xanh Dương Ice Blue (Mới)",
      "Vàng Nhạt Pastel",
      "Đen Nhám"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 15 Plus 128GB màu Hồng Phấn Pastel (Pink): Màn hình Dynamic Island 6.7 inch rộng rãi, cổng USB-C tiện lợi, camera 48MP zoom 2x sắc nét và mặt lưng kính pha màu nhám cực xinh.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-15",
    name: "iPhone 15 128GB Chính Hãng VN/A",
    price: 15990000,
    originalPrice: 19990000,
    discountRate: 20,
    rating: 4.8,
    reviewCount: 680,
    soldCount: 1890,
    stock: 35,
    category: "iPhone 15 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/n/vn_iphone_15_pink_pdp_image_position-1a_pink_color_2_2_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb_3.png"
    ],
    colors: [
      "Xanh Mint Pastel (Mới)",
      "Hồng Phấn Pink (Mới)",
      "Vàng Chanh Yellow (Mới)",
      "Xanh Dương Nhạt",
      "Đen Nhám"
    ],
    sizes: ["128GB", "256GB"],
    description: "iPhone 15 128GB VN/A màu Xanh Mint & Hồng Phấn Pastel: Có Dynamic Island hiện đại, cổng sạc USB-C, camera chính 48MP chụp chân dung thế hệ mới.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-14-promax",
    name: "iPhone 14 Pro Max 128GB Likenew 99% Zin Áp",
    price: 19990000,
    originalPrice: 24990000,
    discountRate: 20,
    rating: 4.9,
    reviewCount: 890,
    soldCount: 2750,
    stock: 22,
    category: "iPhone 14 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18_1_3_2.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/_/v_ng_20_2_1_2_1.png"
    ],
    colors: [
      "Tím Đậm Deep Purple (Mới)",
      "Vàng Gold Hoàng Gia (Mới)",
      "Trắng Bạc Silver (Mới)",
      "Đen Space Black"
    ],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    description: "iPhone 14 Pro Max màu Tím Đậm (Deep Purple) đặc trưng: Màn hình Dynamic Island 120Hz Always-On Display, khung thép không gỉ sáng bóng sang trọng, camera 48MP và chip A16 Bionic cực mượt.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-14-promax-512gb",
    name: "iPhone 14 Pro Max 512GB Likenew 99% Zin Áp",
    price: 21990000,
    originalPrice: 26990000,
    discountRate: 19,
    rating: 4.9,
    reviewCount: 310,
    soldCount: 860,
    stock: 16,
    category: "iPhone 14 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m-iphone-14-pro_2_1_1_2.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/_/v_ng_20_2_1_2_1.png"
    ],
    colors: [
      "Tím Đậm Deep Purple (Mới)",
      "Vàng Gold Hoàng Gia (Mới)",
      "Trắng Bạc Silver",
      "Đen Space Black"
    ],
    sizes: ["256GB", "512GB", "1TB"],
    description: "iPhone 14 Pro Max 512GB Zin Áp 100%: Khung viền thép không gỉ đầm tay, màn hình 120Hz Dynamic Island và bộ nhớ lớn 512GB giá cực hời.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-14-pro",
    name: "iPhone 14 Pro 128GB Likenew 99% Zin",
    price: 16990000,
    originalPrice: 20990000,
    discountRate: 19,
    rating: 4.8,
    reviewCount: 340,
    soldCount: 920,
    stock: 18,
    category: "iPhone 14 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/_/v_ng_20_2_1_2_1.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_12_1_3_2.png"
    ],
    colors: [
      "Vàng Gold Hoàng Gia (Mới)",
      "Tím Đậm Deep Purple (Mới)",
      "Trắng Bạc Silver (Mới)",
      "Đen Space Black"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 14 Pro 128GB màu Vàng Gold Hoàng Gia khung thép: Có Dynamic Island, màn 120Hz ProMotion, camera 48MP sắc nét trong tầm giá dưới 17 triệu tại Thế Giới iPhone.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-14-plus",
    name: "iPhone 14 Plus 256GB Chính Hãng VN/A",
    price: 14990000,
    originalPrice: 18490000,
    discountRate: 19,
    rating: 4.8,
    reviewCount: 275,
    soldCount: 740,
    stock: 22,
    category: "iPhone 14 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2022-09-28_21-58-51_4_1_2_2.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg"
    ],
    colors: [
      "Tím Khoai Môn Lilac (Mới)",
      "Vàng Chanh Yellow (Mới)",
      "Xanh Dương Storm Blue (Mới)",
      "Trắng Starlight",
      "Đen Midnight"
    ],
    sizes: ["128GB", "256GB"],
    description: "iPhone 14 Plus 256GB VN/A: Màn hình lớn 6.7 inch Super Retina XDR kết hợp viên pin siêu trâu, lựa chọn hoàn hảo cho giải trí và công việc.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-14",
    name: "iPhone 14 128GB Chính Hãng VN/A",
    price: 12990000,
    originalPrice: 15990000,
    discountRate: 19,
    rating: 4.8,
    reviewCount: 410,
    soldCount: 1150,
    stock: 26,
    category: "iPhone 14 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg"
    ],
    colors: [
      "Xanh Dương Storm Blue (Mới)",
      "Tím Nhạt Lilac (Mới)",
      "Vàng Chanh Yellow (Mới)",
      "Trắng Starlight",
      "Đen Midnight"
    ],
    sizes: ["128GB", "256GB"],
    description: "iPhone 14 128GB VN/A màu Xanh Dương Storm Blue: RAM 6GB đa nhiệm mượt mà, chip A15 Bionic 5 nhân GPU, camera Action Mode chống rung đỉnh cao.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-13-promax",
    name: "iPhone 13 Pro Max 128GB Likenew 99% Zin",
    price: 14490000,
    originalPrice: 17990000,
    discountRate: 19,
    rating: 4.9,
    reviewCount: 760,
    soldCount: 2310,
    stock: 20,
    category: "iPhone 13 Series",
    images: [
      "https://cdn2.cellphones.com.vn/200x/media/catalog/product/i/p/iphone-13-pro-max.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-pro-max-128gb-cu-dep_3_.png"
    ],
    colors: [
      "Xanh Dương Sierra Blue (Mới)",
      "Xanh Rừng Thông Alpine Green (Mới)",
      "Vàng Gold Hoàng Gia (Mới)",
      "Trắng Bạc Silver",
      "Xám Graphite"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "Huyền thoại giữ giá tại Thế Giới iPhone: iPhone 13 Pro Max màu Xanh Dương Sierra (Sierra Blue) trứ danh, màn hình 6.7 inch 120Hz ProMotion siêu mượt, thời lượng pin trâu, khung thép sang trọng.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-13",
    name: "iPhone 13 128GB Chính Hãng VN/A",
    price: 10990000,
    originalPrice: 13990000,
    discountRate: 21,
    rating: 4.8,
    reviewCount: 980,
    soldCount: 3120,
    stock: 35,
    category: "iPhone 13 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/4/14_1_12_1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_2.jpg"
    ],
    colors: [
      "Hồng Phấn Pink (Mới)",
      "Trắng Ánh Sao Starlight (Mới)",
      "Xanh Lá Alpine (Mới)",
      "Xanh Dương Blue",
      "Đen Midnight"
    ],
    sizes: ["128GB", "256GB"],
    description: "Ông vua tầm giá 10 triệu: iPhone 13 128GB VN/A màu Trắng Ánh Sao (Starlight) mới nguyên seal, camera chéo nhận diện đặc trưng, chip A15 Bionic bền bỉ 4-5 năm tới.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-12-promax",
    name: "iPhone 12 Pro Max 128GB Likenew 99%",
    price: 11490000,
    originalPrice: 14490000,
    discountRate: 21,
    rating: 4.8,
    reviewCount: 520,
    soldCount: 1680,
    stock: 16,
    category: "iPhone 12 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-duong-new-600x600-200x200-1_7.jpg"
    ],
    colors: [
      "Xanh Đại Dương Pacific Blue (Mới)",
      "Vàng Gold Hoàng Gia (Mới)",
      "Trắng Bạc Silver",
      "Xám Graphite"
    ],
    sizes: ["128GB", "256GB", "512GB"],
    description: "iPhone 12 Pro Max màu Xanh Đại Dương (Pacific Blue): Khung viền thép vuông vức sang trọng, màn hình lớn 6.7 inch OLED, 3 camera kèm cảm biến LiDAR, hỗ trợ 5G.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-12",
    name: "iPhone 12 64GB Likenew 99% Zin",
    price: 7490000,
    originalPrice: 9490000,
    discountRate: 21,
    rating: 4.7,
    reviewCount: 430,
    soldCount: 1420,
    stock: 20,
    category: "iPhone 12 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-mini-do-200x200_29.jpg"
    ],
    colors: [
      "Tím Khoai Môn Purple (Mới)",
      "Xanh Mint Green (Mới)",
      "Đỏ Ruby Product RED",
      "Trắng White",
      "Đen Black"
    ],
    sizes: ["64GB", "128GB", "256GB"],
    description: "iPhone 12 64GB màn hình OLED Super Retina XDR sắc nét, viền vuông hiện đại, kết nối 5G, lựa chọn kinh tế cho học sinh - sinh viên.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-11-promax",
    name: "iPhone 11 Pro Max 64GB Likenew 99%",
    price: 8290000,
    originalPrice: 10490000,
    discountRate: 21,
    rating: 4.8,
    reviewCount: 610,
    soldCount: 1950,
    stock: 15,
    category: "iPhone 11 Series",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-pro-max-midnight-green-select-2019_1_3.png"
    ],
    colors: [
      "Xanh Bóng Đêm Midnight Green (Mới)",
      "Vàng Gold (Mới)",
      "Trắng Silver",
      "Xám Space Gray"
    ],
    sizes: ["64GB", "256GB"],
    description: "iPhone 11 Pro Max màu Xanh Bóng Đêm (Midnight Green): Mặt lưng kính nhám đầu tiên của Apple kết hợp cụm 3 camera mắt trâu, khung viền bo cong cầm cực êm tay.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-xs-max",
    name: "iPhone XS Max 64GB Likenew 99%",
    price: 5990000,
    originalPrice: 7490000,
    discountRate: 20,
    rating: 4.7,
    reviewCount: 380,
    soldCount: 1240,
    stock: 12,
    category: "iPhone Cổ Điển & Sưu Tầm (4s - XS Max)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple_iphone_xs_max_64gb_3_3.jpg"
    ],
    colors: [
      "Vàng Hồng Champagne Gold (Mới)",
      "Trắng Bạc Silver",
      "Đen Space Gray"
    ],
    sizes: ["64GB", "256GB"],
    description: "iPhone XS Max 64GB màu Vàng Hồng Champagne (Sunset Gold): Màn hình OLED 6.5 inch, Face ID nhạy, khung thép bóng bẩy, máy phụ cao cấp giá dưới 6 triệu tại Thế Giới iPhone.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-8-plus",
    name: "iPhone 8 Plus 64GB Zin Đẹp 99% (Nút Home Touch ID)",
    price: 3490000,
    originalPrice: 4490000,
    discountRate: 22,
    rating: 4.8,
    reviewCount: 450,
    soldCount: 1580,
    stock: 14,
    category: "iPhone Cổ Điển & Sưu Tầm (4s - XS Max)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/8/-/8-plus-gold_27.jpg"
    ],
    colors: [
      "Vàng Kim Lưng Kính Gold (Mới)",
      "Đỏ Product RED (Mới)",
      "Trắng Bạc Silver",
      "Đen Space Gray"
    ],
    sizes: ["64GB", "128GB", "256GB"],
    description: "Huyền thoại nút Home vật lý Touch ID: iPhone 8 Plus 64GB màu Vàng Kim Lưng Kính (Gold Glass) hỗ trợ sạc không dây, camera kép xóa phông ấm áp.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  },
  {
    id: "ip-4s",
    name: "iPhone 4s 16GB Sưu Tầm Nguyên Zin (Kiệt Tác Steve Jobs)",
    price: 990000,
    originalPrice: 1490000,
    discountRate: 34,
    rating: 5.0,
    reviewCount: 290,
    soldCount: 860,
    stock: 8,
    category: "iPhone Cổ Điển & Sưu Tầm (4s - XS Max)",
    images: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-7-black_2_12.jpg"
    ],
    colors: [
      "Đen Khung Thép Cổ Điển",
      "Trắng Sứ Cổ Điển"
    ],
    sizes: ["16GB", "32GB"],
    description: "Phiên bản sưu tầm kỷ niệm iPhone 4 / 4s màu Đen Khung Thép Cổ Điển tại Thế Giới iPhone: Kiệt tác thiết kế khung thép kẹp 2 mặt kính của cố CEO Steve Jobs, màn hình Retina 3.5 inch hoài niệm, chụp ảnh vibe CCD Vintage cực chất cho GenZ.",
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  }
];

export const MOCK_PRODUCT: ProductDetail = MOCK_PRODUCTS_LIST[0];

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'ip-18-promax',
    name: 'iPhone 18 Pro Max 256GB Chính Hãng VN/A',
    price: 38990000,
    quantity: 1,
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg',
    selectedColor: 'Đỏ Rượu Vang Burgundy Titan (Mới)',
    selectedSize: '256GB',
    availableColors: [
      'Đỏ Rượu Vang Burgundy Titan (Mới)',
      'Xanh Băng Hà Glacier Blue Titan (Mới)',
      'Cà Phê Mocha Titan (Mới)',
      'Bạc Platinum Titan',
      'Đen Không Gian Titan',
      'Vàng Sa Mạc Titan'
    ],
    availableSizes: ['256GB', '512GB', '1TB', '2TB'],
    stock: 45,
    selected: true
  }
];

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: PaymentMethodType.QR_CODE,
    title: 'Chuyển khoản Ngân hàng (VietQR)',
    description: 'Quét mã QR ngân hàng tự động xác nhận trong 5 giây',
    iconName: 'QrCode'
  },
  {
    id: PaymentMethodType.MOMO,
    title: 'Ví điện tử MoMo',
    description: 'Thanh toán siêu tốc qua ứng dụng MoMo',
    iconName: 'Wallet'
  },
  {
    id: PaymentMethodType.DOMESTIC_CARD,
    title: 'Thẻ ATM / Ngân hàng nội địa',
    description: 'Hỗ trợ hơn 40 ngân hàng nội địa Việt Nam',
    iconName: 'CreditCard'
  },
  {
    id: PaymentMethodType.COD,
    title: 'Thanh toán khi nhận máy (COD)',
    description: 'Kiểm tra nguyên seal VN/A & test máy trước khi thanh toán',
    iconName: 'Truck'
  }
];

export const MOCK_ORDER: Order = {
  id: 'TGIP-2026-8899',
  items: [
    {
      id: 'ip-18-promax',
      name: 'iPhone 18 Pro Max 256GB Chính Hãng VN/A',
      price: 38990000,
      quantity: 1,
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg',
      variant: 'Đỏ Rượu Vang Burgundy Titan • 256GB'
    }
  ],
  shippingFee: 0,
  discount: 500000,
  createdAt: new Date().toISOString()
};
