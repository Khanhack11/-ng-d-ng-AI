import json

# 25 mẫu iPhone từ iPhone 4s đến iPhone 18 Pro Max tại THẾ GIỚI IPHONE
# QUY TẮC BẮT BUỘC:
# - Mỗi 1 mã iPhone (25 mã) mang 1 MÀU ĐẶC TRƯNG ĐẦU TIÊN (colors[0]) KHÁC NHAU HOÀN TOÀN (25 màu không trùng lặp)
# - Mỗi 1 mã iPhone dùng 1 URL hình ảnh CDN CellphoneS RIÊNG BIỆT (25 ảnh khác nhau 100%, đúng tông màu)

IPHONE_CATALOG = [
    {
        "id": "ip-18-promax",
        "name": "iPhone 18 Pro Max 256GB Chính Hãng VN/A",
        "price": 38990000,
        "originalPrice": 42990000,
        "discountRate": 9,
        "rating": 5.0,
        "reviewCount": 186,
        "soldCount": 410,
        "stock": 35,
        "category": "iPhone 18 Series (Flagship 2026)",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_4_1_1_1_1.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_4_1_1_1_1.jpg",
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3.jpg"
        ],
        "colors": ["Đỏ Rượu Vang Burgundy Titan", "Vàng Titan Sa Mạc", "Đen Titan", "Trắng Titan"],
        "sizes": ["256GB", "512GB", "1TB", "2TB"],
        "description": "Siêu phẩm đỉnh cao nhất nhà Apple tại Thế Giới iPhone: iPhone 18 Pro Max phiên bản màu Đỏ Rượu Vang Burgundy Titan độc quyền 2026. Trang bị chip Apple A20 Pro tiến trình 2nm siêu tốc độ, RAM 12GB xử lý trọn vẹn Apple Intelligence tiếng Việt. Cụm 3 camera 48MP ProRAW có khẩu độ biến thiên cơ học và ống kính tiềm vọng Zoom quang 10x sắc nét từng chi tiết, màn hình 6.9 inch Super Retina XDR 3000 nits."
    },
    {
        "id": "ip-18-pro",
        "name": "iPhone 18 Pro 256GB Chính Hãng VN/A",
        "price": 33990000,
        "originalPrice": 36990000,
        "discountRate": 8,
        "rating": 5.0,
        "reviewCount": 142,
        "soldCount": 320,
        "stock": 30,
        "category": "iPhone 18 Series (Flagship 2026)",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb_2_2.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_512gb_2_2.jpg"
        ],
        "colors": ["Xanh Lục Bảo Emerald Titan", "Đỏ Burgundy Titan", "Bạc Platinum"],
        "sizes": ["256GB", "512GB", "1TB"],
        "description": "iPhone 18 Pro màu Xanh Lục Bảo Emerald Titan chính hãng VN/A tại Thế Giới iPhone: Thiết kế nhỏ gọn 6.3 inch viền siêu mỏng, trang bị chip A20 Pro 2nm, RAM 12GB, cụm 3 camera 48MP toàn diện cùng Face ID ẩn dưới màn hình thế hệ mới."
    },
    {
        "id": "ip-17-promax",
        "name": "iPhone 17 Pro Max 256GB Chính Hãng VN/A",
        "price": 31990000,
        "originalPrice": 35990000,
        "discountRate": 11,
        "rating": 4.9,
        "reviewCount": 385,
        "soldCount": 820,
        "stock": 40,
        "category": "iPhone 17 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3_1.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3_1.jpg"
        ],
        "colors": ["Cam Sa Mạc Vũ Trụ", "Xanh Cobalt Titan", "Bạc Titan"],
        "sizes": ["256GB", "512GB", "1TB"],
        "description": "iPhone 17 Pro Max màu Cam Sa Mạc Vũ Trụ (Cosmic Desert Orange) chính hãng VN/A tại Thế Giới iPhone: Chip Apple A19 Pro 3nm cực mạnh, nâng cấp cả 3 ống kính sau lên 48MP (Main + Ultra Wide + Telephoto 5x), màn hình 6.9 inch ProMotion 120Hz chống chói, tản nhiệt buồng hơi Vapor Chamber."
    },
    {
        "id": "ip-17-pro",
        "name": "iPhone 17 Pro 256GB Chính Hãng VN/A",
        "price": 27990000,
        "originalPrice": 31990000,
        "discountRate": 12,
        "rating": 4.9,
        "reviewCount": 240,
        "soldCount": 510,
        "stock": 28,
        "category": "iPhone 17 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1_1_1_1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1_1_1_1.png"
        ],
        "colors": ["Xanh Lam Cobalt Titan", "Đen Graphite Titan", "Bạc Titan"],
        "sizes": ["256GB", "512GB", "1TB"],
        "description": "iPhone 17 Pro màu Xanh Lam Cobalt Titan chính hãng VN/A: Sức mạnh chuẩn Pro trong thân hình 6.3 inch vừa tay, chip A19 Pro, RAM 12GB, 3 camera 48MP quay video 4K 120fps Dolby Vision."
    },
    {
        "id": "ip-17-air",
        "name": "iPhone 17 Air 256GB Siêu Mỏng Chính Hãng VN/A",
        "price": 24990000,
        "originalPrice": 27990000,
        "discountRate": 11,
        "rating": 4.9,
        "reviewCount": 198,
        "soldCount": 460,
        "stock": 25,
        "category": "iPhone 17 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2_1_2.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2_1_2.jpg"
        ],
        "colors": ["Xanh Băng Giá", "Trắng Sương Mù", "Đen Không Gian"],
        "sizes": ["256GB", "512GB"],
        "description": "iPhone 17 Air màu Xanh Băng Giá (Sky Ice) — Chiếc iPhone mỏng nhất lịch sử Apple (chỉ 5.5mm), trọng lượng siêu nhẹ 145g, màn hình 6.6 inch OLED 120Hz ProMotion, chip A19 mạnh mẽ, cực hợp GenZ yêu thích thời trang thanh lịch."
    },
    {
        "id": "ip-17",
        "name": "iPhone 17 128GB Chính Hãng VN/A",
        "price": 21990000,
        "originalPrice": 24990000,
        "discountRate": 12,
        "rating": 4.8,
        "reviewCount": 260,
        "soldCount": 620,
        "stock": 45,
        "category": "iPhone 17 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_3_1_1_1_1.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_3_1_1_1_1.jpg"
        ],
        "colors": ["Tím Oải Hương", "Xanh Matcha", "Trắng Ngọc"],
        "sizes": ["128GB", "256GB", "512GB"],
        "description": "iPhone 17 tiêu chuẩn màu Tím Oải Hương (Lavender) chính hãng VN/A: Lần đầu tiên dòng thường có màn hình ProMotion 120Hz mượt mà, camera selfie nâng cấp 24MP cực nét, chip A19 tiết kiệm pin vượt trội."
    },
    {
        "id": "ip-16-promax",
        "name": "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
        "price": 28990000,
        "originalPrice": 34990000,
        "discountRate": 17,
        "rating": 4.9,
        "reviewCount": 920,
        "soldCount": 2450,
        "stock": 50,
        "category": "iPhone 16 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_1_2_1.png"
        ],
        "colors": ["Vàng Titan Sa Mạc", "Titan Tự Nhiên", "Titan Đen"],
        "sizes": ["256GB", "512GB", "1TB"],
        "description": "Best-seller quốc dân tại Thế Giới iPhone: iPhone 16 Pro Max 256GB VN/A màu Vàng Titan Sa Mạc (Desert Titanium) sang trọng, màn hình 6.9 inch, nút Camera Control cảm ứng lực thông minh, chip A18 Pro, quay 4K 120fps."
    },
    {
        "id": "ip-16-pro",
        "name": "iPhone 16 Pro 128GB Chính Hãng VN/A",
        "price": 24490000,
        "originalPrice": 28990000,
        "discountRate": 16,
        "rating": 4.9,
        "reviewCount": 540,
        "soldCount": 1280,
        "stock": 35,
        "category": "iPhone 16 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_4_1_1.png"
        ],
        "colors": ["Trắng Ngọc Titan", "Titan Tự Nhiên", "Titan Sa Mạc"],
        "sizes": ["128GB", "256GB", "512GB"],
        "description": "iPhone 16 Pro 128GB VN/A màu Trắng Ngọc Titan (White Titanium): Màn hình 6.3 inch 120Hz, có đầy đủ ống kính tiềm vọng Zoom quang 5x như bản Pro Max, nút Camera Control và chip A18 Pro."
    },
    {
        "id": "ip-16-plus",
        "name": "iPhone 16 Plus 128GB Chính Hãng VN/A",
        "price": 21490000,
        "originalPrice": 25990000,
        "discountRate": 17,
        "rating": 4.8,
        "reviewCount": 310,
        "soldCount": 790,
        "stock": 30,
        "category": "iPhone 16 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png"
        ],
        "colors": ["Xanh Lưu Ly", "Hồng Đậm", "Trắng"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 16 Plus màu Xanh Lưu Ly (Ultramarine) chính hãng VN/A: Màn hình lớn 6.7 inch, thời lượng pin trâu hàng đầu, cụm camera dọc mới hỗ trợ quay Spatial Video, nút Action Button & Camera Control."
    },
    {
        "id": "ip-16",
        "name": "iPhone 16 128GB Chính Hãng VN/A",
        "price": 18990000,
        "originalPrice": 22990000,
        "discountRate": 17,
        "rating": 4.8,
        "reviewCount": 490,
        "soldCount": 1350,
        "stock": 42,
        "category": "iPhone 16 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1_4_1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1_4_1.png"
        ],
        "colors": ["Xanh Mòng Két", "Xanh Lưu Ly", "Hồng"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 16 128GB VN/A màu Xanh Mòng Két (Teal): Chip A18 nhảy vọt 2 thế hệ hỗ trợ Apple Intelligence, camera Fusion 48MP chụp đêm xuất sắc, thiết kế trẻ trung hiện đại."
    },
    {
        "id": "ip-15-promax",
        "name": "iPhone 15 Pro Max 256GB Chính Hãng VN/A",
        "price": 25490000,
        "originalPrice": 30990000,
        "discountRate": 18,
        "rating": 4.9,
        "reviewCount": 1240,
        "soldCount": 3400,
        "stock": 28,
        "category": "iPhone 15 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
        ],
        "colors": ["Titan Tự Nhiên", "Titan Xanh", "Titan Đen"],
        "sizes": ["256GB", "512GB", "1TB"],
        "description": "iPhone 15 Pro Max 256GB VN/A màu Titan Tự Nhiên (Natural Titanium): Khung viền Titanium siêu nhẹ, cổng sạc USB-C 3.0 tốc độ cao, nút Action Button, camera Telephoto 5x và chip A17 Pro 3nm."
    },
    {
        "id": "ip-15-pro",
        "name": "iPhone 15 Pro 128GB Chính Hãng VN/A",
        "price": 21490000,
        "originalPrice": 25990000,
        "discountRate": 17,
        "rating": 4.8,
        "reviewCount": 420,
        "soldCount": 980,
        "stock": 20,
        "category": "iPhone 15 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-256gb_1__1_2_1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-256gb_1__1_2_1.png"
        ],
        "colors": ["Titan Xanh", "Titan Tự Nhiên", "Titan Trắng"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 15 Pro 128GB màu Titan Xanh (Blue Titanium): Nhỏ gọn 6.1 inch khung viền Titan, màn hình 120Hz ProMotion, chip A17 Pro chiến mượt mọi tựa game AAA."
    },
    {
        "id": "ip-15-plus",
        "name": "iPhone 15 Plus 128GB Chính Hãng VN/A",
        "price": 18490000,
        "originalPrice": 22990000,
        "discountRate": 20,
        "rating": 4.8,
        "reviewCount": 390,
        "soldCount": 910,
        "stock": 25,
        "category": "iPhone 15 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb-color-pink-image_3_1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb-color-pink-image_3_1.png"
        ],
        "colors": ["Hồng Phấn Pastel", "Xanh Lá Nhạt", "Đen"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 15 Plus 128GB màu Hồng Phấn Pastel (Pink): Màn hình Dynamic Island 6.7 inch rộng rãi, cổng USB-C tiện lợi, camera 48MP zoom 2x sắc nét và mặt lưng kính pha màu nhám cực xinh."
    },
    {
        "id": "ip-15",
        "name": "iPhone 15 128GB Chính Hãng VN/A",
        "price": 15990000,
        "originalPrice": 19990000,
        "discountRate": 20,
        "rating": 4.8,
        "reviewCount": 680,
        "soldCount": 1890,
        "stock": 35,
        "category": "iPhone 15 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-mini-xanh-la-15-200x200_32.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-mini-xanh-la-15-200x200_32.jpg"
        ],
        "colors": ["Xanh Mint Pastel", "Hồng Phấn", "Vàng Nhạt"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 15 128GB VN/A màu Xanh Mint Pastel: Có Dynamic Island hiện đại, cổng sạc USB-C, camera chính 48MP chụp chân dung thế hệ mới."
    },
    {
        "id": "ip-14-promax",
        "name": "iPhone 14 Pro Max 128GB Likenew 99% Zin Áp",
        "price": 19990000,
        "originalPrice": 24990000,
        "discountRate": 20,
        "rating": 4.9,
        "reviewCount": 890,
        "soldCount": 2750,
        "stock": 22,
        "category": "iPhone 14 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18_1_3_2.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18_1_3_2.png"
        ],
        "colors": ["Tím Đậm Deep Purple", "Vàng Gold", "Đen Space Black"],
        "sizes": ["128GB", "256GB", "512GB"],
        "description": "iPhone 14 Pro Max màu Tím Đậm (Deep Purple) đặc trưng: Màn hình Dynamic Island 120Hz Always-On Display, khung thép không gỉ sáng bóng sang trọng, camera 48MP và chip A16 Bionic cực mượt."
    },
    {
        "id": "ip-14-pro",
        "name": "iPhone 14 Pro 128GB Likenew 99% Zin",
        "price": 16990000,
        "originalPrice": 20990000,
        "discountRate": 19,
        "rating": 4.8,
        "reviewCount": 340,
        "soldCount": 920,
        "stock": 18,
        "category": "iPhone 14 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/_/v_ng_20_2_1_2_1.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/_/v_ng_20_2_1_2_1.png"
        ],
        "colors": ["Vàng Gold Hoàng Gia", "Tím Đậm Deep Purple", "Bạc Silver"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 14 Pro 128GB màu Vàng Gold Hoàng Gia khung thép: Có Dynamic Island, màn 120Hz ProMotion, camera 48MP sắc nét trong tầm giá dưới 17 triệu tại Thế Giới iPhone."
    },
    {
        "id": "ip-14",
        "name": "iPhone 14 128GB Chính Hãng VN/A",
        "price": 12990000,
        "originalPrice": 15990000,
        "discountRate": 19,
        "rating": 4.8,
        "reviewCount": 410,
        "soldCount": 1150,
        "stock": 26,
        "category": "iPhone 14 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg"
        ],
        "colors": ["Xanh Dương Storm Blue", "Tím Nhạt", "Trắng Starlight"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 14 128GB VN/A màu Xanh Dương Storm Blue: RAM 6GB đa nhiệm mượt mà, chip A15 Bionic 5 nhân GPU, camera Action Mode chống rung đỉnh cao."
    },
    {
        "id": "ip-13-promax",
        "name": "iPhone 13 Pro Max 128GB Likenew 99% Zin",
        "price": 14490000,
        "originalPrice": 17990000,
        "discountRate": 19,
        "rating": 4.9,
        "reviewCount": 760,
        "soldCount": 2310,
        "stock": 20,
        "category": "iPhone 13 Series",
        "image": "https://cdn2.cellphones.com.vn/200x/media/catalog/product/i/p/iphone-13-pro-max.png",
        "images": [
            "https://cdn2.cellphones.com.vn/200x/media/catalog/product/i/p/iphone-13-pro-max.png"
        ],
        "colors": ["Xanh Sierra Blue", "Xanh Rừng Thông", "Vàng Gold"],
        "sizes": ["128GB", "256GB"],
        "description": "Huyền thoại giữ giá tại Thế Giới iPhone: iPhone 13 Pro Max màu Xanh Dương Sierra (Sierra Blue) trứ danh, màn hình 6.7 inch 120Hz ProMotion siêu mượt, thời lượng pin trâu, khung thép sang trọng."
    },
    {
        "id": "ip-13",
        "name": "iPhone 13 128GB Chính Hãng VN/A",
        "price": 10990000,
        "originalPrice": 13990000,
        "discountRate": 21,
        "rating": 4.8,
        "reviewCount": 980,
        "soldCount": 3120,
        "stock": 35,
        "category": "iPhone 13 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/4/14_1_12_1.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/4/14_1_12_1.jpg"
        ],
        "colors": ["Trắng Ánh Sao Starlight", "Hồng Phấn", "Đen Midnight"],
        "sizes": ["128GB", "256GB"],
        "description": "Ông vua tầm giá 10 triệu: iPhone 13 128GB VN/A màu Trắng Ánh Sao (Starlight) mới nguyên seal, camera chéo nhận diện đặc trưng, chip A15 Bionic bền bỉ 4-5 năm tới."
    },
    {
        "id": "ip-12-promax",
        "name": "iPhone 12 Pro Max 128GB Likenew 99%",
        "price": 11490000,
        "originalPrice": 14490000,
        "discountRate": 21,
        "rating": 4.8,
        "reviewCount": 520,
        "soldCount": 1680,
        "stock": 16,
        "category": "iPhone 12 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-duong-new-600x600-200x200-1_7.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-duong-new-600x600-200x200-1_7.jpg"
        ],
        "colors": ["Xanh Đại Dương Pacific", "Vàng Gold", "Xám Graphite"],
        "sizes": ["128GB", "256GB"],
        "description": "iPhone 12 Pro Max màu Xanh Đại Dương (Pacific Blue): Khung viền thép vuông vức sang trọng, màn hình lớn 6.7 inch OLED, 3 camera kèm cảm biến LiDAR, hỗ trợ 5G."
    },
    {
        "id": "ip-12",
        "name": "iPhone 12 64GB Likenew 99% Zin",
        "price": 7490000,
        "originalPrice": 9490000,
        "discountRate": 21,
        "rating": 4.7,
        "reviewCount": 430,
        "soldCount": 1420,
        "stock": 20,
        "category": "iPhone 12 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-mini-do-200x200_29.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-mini-do-200x200_29.jpg"
        ],
        "colors": ["Đỏ Ruby Product RED", "Tím Khoai Môn", "Trắng"],
        "sizes": ["64GB", "128GB"],
        "description": "iPhone 12 64GB màu Đỏ Ruby (Product RED) nổi bật: Màn hình OLED Super Retina XDR sắc nét, viền vuông hiện đại, kết nối 5G, lựa chọn kinh tế cho học sinh - sinh viên."
    },
    {
        "id": "ip-11-promax",
        "name": "iPhone 11 Pro Max 64GB Likenew 99%",
        "price": 8290000,
        "originalPrice": 10490000,
        "discountRate": 21,
        "rating": 4.8,
        "reviewCount": 610,
        "soldCount": 1950,
        "stock": 15,
        "category": "iPhone 11 Series",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-pro-max-midnight-green-select-2019_1_3.png",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-pro-max-midnight-green-select-2019_1_3.png"
        ],
        "colors": ["Xanh Bóng Đêm Midnight", "Vàng Gold", "Xám Space Gray"],
        "sizes": ["64GB", "256GB"],
        "description": "iPhone 11 Pro Max màu Xanh Bóng Đêm (Midnight Green): Mặt lưng kính nhám đầu tiên của Apple kết hợp cụm 3 camera mắt trâu, khung viền bo cong cầm cực êm tay."
    },
    {
        "id": "ip-xs-max",
        "name": "iPhone XS Max 64GB Likenew 99%",
        "price": 5990000,
        "originalPrice": 7490000,
        "discountRate": 20,
        "rating": 4.7,
        "reviewCount": 380,
        "soldCount": 1240,
        "stock": 12,
        "category": "iPhone Cổ Điển & Sưu Tầm (4s - XS Max)",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple_iphone_xs_max_64gb_3_3.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple_iphone_xs_max_64gb_3_3.jpg"
        ],
        "colors": ["Vàng Hồng Champagne", "Trắng Silver", "Đen Space Gray"],
        "sizes": ["64GB", "256GB"],
        "description": "iPhone XS Max 64GB màu Vàng Hồng Champagne (Sunset Gold): Màn hình OLED 6.5 inch, Face ID nhạy, khung thép bóng bẩy, máy phụ cao cấp giá dưới 6 triệu tại Thế Giới iPhone."
    },
    {
        "id": "ip-8-plus",
        "name": "iPhone 8 Plus 64GB Zin Đẹp 99% (Nút Home Touch ID)",
        "price": 3490000,
        "originalPrice": 4490000,
        "discountRate": 22,
        "rating": 4.8,
        "reviewCount": 450,
        "soldCount": 1580,
        "stock": 14,
        "category": "iPhone Cổ Điển & Sưu Tầm (4s - XS Max)",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/8/-/8-plus-gold_27.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/8/-/8-plus-gold_27.jpg"
        ],
        "colors": ["Vàng Kim Lưng Kính", "Đỏ Product RED", "Trắng Bạc"],
        "sizes": ["64GB", "128GB"],
        "description": "Huyền thoại nút Home vật lý Touch ID: iPhone 8 Plus 64GB màu Vàng Kim Lưng Kính (Gold Glass) hỗ trợ sạc không dây, camera kép xóa phông ấm áp."
    },
    {
        "id": "ip-4s",
        "name": "iPhone 4s 16GB Sưu Tầm Nguyên Zin (Kiệt Tác Steve Jobs)",
        "price": 990000,
        "originalPrice": 1490000,
        "discountRate": 34,
        "rating": 5.0,
        "reviewCount": 290,
        "soldCount": 860,
        "stock": 8,
        "category": "iPhone Cổ Điển & Sưu Tầm (4s - XS Max)",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-7-black_2_12.jpg",
        "images": [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-7-black_2_12.jpg"
        ],
        "colors": ["Đen Khung Thép Cổ Điển", "Trắng Sứ Cổ Điển"],
        "sizes": ["16GB", "32GB"],
        "description": "Phiên bản sưu tầm kỷ niệm iPhone 4 / 4s màu Đen Khung Thép Cổ Điển tại Thế Giới iPhone: Kiệt tác thiết kế khung thép kẹp 2 mặt kính của cố CEO Steve Jobs, màn hình Retina 3.5 inch hoài niệm, chụp ảnh vibe CCD Vintage cực chất cho GenZ."
    }
]

# Kiểm tra tính duy nhất của 25 màu đặc trưng (colors[0]) và 25 URL ảnh
primary_colors = [p["colors"][0] for p in IPHONE_CATALOG]
primary_images = [p["image"] for p in IPHONE_CATALOG]
assert len(set(primary_colors)) == 25, f"Có màu trùng lặp! {len(set(primary_colors))}/25"
assert len(set(primary_images)) == 25, f"Có ảnh trùng lặp! {len(set(primary_images))}/25"

# 1. Ghi ra file JSON cho AI Backend (agent_service/data/all_50_products.json)
backend_products = []
for p in IPHONE_CATALOG:
    backend_products.append({
        "id": p["id"],
        "name": p["name"],
        "price": p["price"],
        "originalPrice": p["originalPrice"],
        "discountRate": p["discountRate"],
        "rating": p["rating"],
        "reviewCount": p["reviewCount"],
        "soldCount": p["soldCount"],
        "stock": p["stock"],
        "category": p["category"],
        "image": p["image"],
        "images": p["images"],
        "colors": p["colors"],
        "sizes": p["sizes"],
        "description": p["description"],
        "shippingFee": 0,
        "shippingEstimate": "Giao hỏa tốc 2h nội thành",
        "videoDuration": ""
    })

with open("agent_service/data/all_50_products.json", "w", encoding="utf-8") as f:
    json.dump(backend_products, f, ensure_ascii=False, indent=2)

# 2. Ghi ra constants.ts cho Frontend
ts_content = """import { ProductDetail, CartItem, Order, PaymentMethodType, PaymentMethodConfig } from './types';

// DANH MỤC 25 SẢN PHẨM ĐIỆN THOẠI IPHONE (TỪ IPHONE 4s ĐẾN IPHONE 18 PRO MAX)
// THẾ GIỚI IPHONE — MỖI MÃ 1 MÀU ĐẶC TRƯNG & 1 HÌNH ẢNH RIÊNG BIỆT KHÔNG TRÙNG LẶP
export const MOCK_PRODUCTS_LIST: ProductDetail[] = [
"""

for p in backend_products:
    ts_content += f"""  {{
    id: {json.dumps(p['id'])},
    name: {json.dumps(p['name'], ensure_ascii=False)},
    price: {p['price']},
    originalPrice: {p['originalPrice']},
    discountRate: {p['discountRate']},
    rating: {p['rating']},
    reviewCount: {p['reviewCount']},
    soldCount: {p['soldCount']},
    stock: {p['stock']},
    category: {json.dumps(p['category'], ensure_ascii=False)},
    images: {json.dumps(p['images'], ensure_ascii=False)},
    colors: {json.dumps(p['colors'], ensure_ascii=False)},
    sizes: {json.dumps(p['sizes'], ensure_ascii=False)},
    description: {json.dumps(p['description'], ensure_ascii=False)},
    shippingFee: 0,
    shippingEstimate: "Hỏa tốc 2h nội thành",
    videoDuration: ""
  }},
"""

ts_content += """];

export const MOCK_PRODUCT: ProductDetail = MOCK_PRODUCTS_LIST[0];

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'ip-18-promax',
    name: 'iPhone 18 Pro Max 256GB Chính Hãng VN/A',
    price: 38990000,
    originalPrice: 42990000,
    quantity: 1,
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3_1.jpg',
    selectedColor: 'Cam Vũ Trụ Titan',
    selectedSize: '256GB',
    availableColors: ['Cam Vũ Trụ Titan', 'Vàng Titan Sa Mạc', 'Đen Titan'],
    availableSizes: ['256GB', '512GB', '1TB'],
    stock: 35,
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
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3_1.jpg',
      variant: 'Cam Vũ Trụ Titan • 256GB'
    }
  ],
  shippingFee: 0,
  discount: 500000,
  createdAt: new Date().toISOString()
};
"""

with open("constants.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"[OK] Generated {len(backend_products)} iPhone models with 25 UNIQUE colors and 25 UNIQUE images!")


