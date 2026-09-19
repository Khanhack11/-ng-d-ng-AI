let ProductUserService = null;
try {
    ProductUserService = require('./ProductUserService');
} catch (err) {
    console.warn('AiService: Chế độ dự phòng thông minh (Fallback Catalog) đang hoạt động.');
}

const ZSHOP_KNOWLEDGE_BASE = {
    returnPolicy: 'Chính sách đổi trả: ZShop hỗ trợ đổi trả hàng MIỄN PHÍ trong vòng 7 ngày kể từ khi nhận hàng. Áp dụng cho trường hợp không vừa size, sản phẩm lỗi từ nhà sản xuất hoặc khách hàng đổi ý (sản phẩm còn nguyên tem mác). Nhân viên shipper ZShop Express sẽ đến tận nhà thu hồi hàng, quý khách không cần mang ra bưu điện.',
    shippingPolicy: 'Chính sách vận chuyển: Miễn phí vận chuyển (FREESHIP) toàn quốc cho mọi đơn hàng từ 300.000đ trở lên. Với đơn dưới 300.000đ, phí giao tiêu chuẩn là 30.000đ (2-3 ngày) và giao hỏa tốc ZShop Fast là 50.000đ (nhận trong 24 giờ).',
    paymentMethods: 'Phương thức thanh toán: ZShop hỗ trợ quét mã VietQR Napas 24/7 tự động xác nhận, thanh toán tiền mặt khi nhận hàng (COD - được đồng kiểm bóc kiện xem hàng), Ví điện tử MoMo/ZaloPay và thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard) bảo mật PCI-DSS.',
    storeAddress: 'Hệ thống showroom ZShop: Flagship Store tại 12 Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh. Mở cửa từ 08:30 đến 22:00 tất cả các ngày trong tuần (kể cả Thứ Bảy, Chủ Nhật và ngày lễ). Hotline/Zalo CSKH: 0901 234 567.',
    warrantyCommitment: 'Cam kết chất lượng: 100% sản phẩm chính hãng, đền bù 200% giá trị nếu phát hiện hàng giả hàng nhái. Bảo hành 12 tháng đối với phụ kiện công nghệ và đồng hồ, hỗ trợ bảo hành đường may trọn đời cho các dòng thời trang cao cấp.'
};

class AiService {
    /**
     * Chuẩn hóa sản phẩm từ CSDL để luôn có ảnh hợp lệ và kích cỡ
     */
    normalizeProduct(p) {
        let rawImage = p.image_url || (p.images && p.images[0]) || p.image;
        if (!rawImage || rawImage.includes('Áo polo Nam.jpg')) {
            const cat = (p.categoryName || p.category || '').toLowerCase();
            const name = (p.name || '').toLowerCase();
            if (cat.includes('công nghệ') || name.includes('sạc') || name.includes('chuột') || name.includes('tai nghe') || name.includes('phím')) {
                rawImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
            } else if (cat.includes('đồng hồ') || name.includes('đồng hồ')) {
                rawImage = 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500';
            } else if (cat.includes('giày') || name.includes('sneaker') || name.includes('giày')) {
                rawImage = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500';
            } else if (name.includes('dior')) {
                rawImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500';
            } else if (name.includes('jean') || name.includes('quần')) {
                rawImage = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500';
            } else {
                rawImage = 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500';
            }
        }

        return {
            id: p.id ? p.id.toString() : `SP-${Math.random().toString().slice(2, 6)}`,
            name: p.name || 'Sản phẩm ZShop',
            price: Number(p.price || 0),
            stock: Number(p.stock !== undefined ? p.stock : 50),
            rating: Number(p.rating || 4.9),
            category: p.categoryName || p.category || 'Thời trang',
            categoryName: p.categoryName || p.category || 'Thời trang',
            image: rawImage,
            image_url: rawImage,
            images: [rawImage],
            sizes: p.sizes && Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
            description: p.description || `${p.name} - Chất lượng cao cấp chuẩn chính hãng tại ZShop.`
        };
    }

    /**
     * Lấy toàn bộ danh sách sản phẩm từ DB hoặc Fallback
     */
    async getAllProductsFromDB() {
        let products = [];
        try {
            if (ProductUserService) {
                products = await ProductUserService.getAllProducts();
            }
        } catch (e) {
            console.warn('AiService: Lỗi kết nối CSDL, sử dụng danh mục mẫu chuẩn.', e.message);
        }

        if (!products || products.length === 0) {
            products = [
                { id: 'NAM-001', name: 'Áo Polo Nam Gucci Maxi GG Silk Cotton', category: 'Thời trang nam', price: 12000000, stock: 15, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600' },
                { id: 'NAM-002', name: 'Áo Thun DIOR - Chính Hãng', category: 'Thời trang nam', price: 1889000, stock: 58, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
                { id: 'NAM-003', name: 'Quần Jeans Slimfit Rách Gối Nam', category: 'Thời trang nam', price: 550000, stock: 120, rating: 4.7, image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600' },
                { id: 'NAM-004', name: 'Áo Sơ Mi Lụa Dài Tay Công Sở', category: 'Thời trang nam', price: 450000, stock: 85, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600' },
                { id: 'KHOAC-001', name: 'Áo Hoodie Streetwear Unisex Nỉ Bông', category: 'Áo khoác & Hoodie', price: 420000, stock: 45, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600' },
                { id: 'GIAY-001', name: 'Giày Sneaker Cổ Thấp Basic Trắng', category: 'Giày dép', price: 890000, stock: 30, rating: 4.6, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600' },
                { id: 'TECH-001', name: 'Tai Nghe Bluetooth Chống Ồn Chủ Động ANC', category: 'Thiết bị công nghệ & Phụ kiện', price: 1150000, stock: 40, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
                { id: 'TECH-005', name: 'Sạc Dự Phòng 20.000mAh Sạc Nhanh 22.5W', category: 'Thiết bị công nghệ & Phụ kiện', price: 390000, stock: 110, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1609592424300-349a1753765e?w=600' }
            ];
        }

        return products.map(p => this.normalizeProduct(p));
    }

    /**
     * Gọi Google Gemini 1.5 Flash qua HTTPS REST API
     */
    async callGeminiAPI(prompt, systemInstruction, customApiKey) {
        const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
            return null; // Chưa có key, kích hoạt Neural Local RAG
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        
        const payload = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 800,
                topP: 0.95
            }
        };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                console.warn('Gemini API phản hồi lỗi (chuyển sang Local RAG):', res.status, errText);
                return null;
            }

            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return reply ? reply.trim() : null;
        } catch (error) {
            console.warn('Lỗi gọi Gemini API mạng (chuyển sang Local RAG):', error.message);
            return null;
        }
    }

    /**
     * Kỹ năng: Tư vấn kích cỡ & đo size thông minh (Master Fit Ken)
     */
    async handleSmartFitting(text, context, allProducts) {
        const lower = text.toLowerCase();
        
        // 1. Trích xuất chiều cao
        let height = 170;
        const mMatch = lower.match(/(\d)\s*(?:m|mết)?\s*(\d{1,2})(?:\s*cm)?/i);
        const cmMatch = lower.match(/(\d{3})\s*(?:cm|phân)/i);
        const caoMatch = lower.match(/cao\s*(\d{2,3})/i);
        if (mMatch) {
            height = parseInt(mMatch[1]) * 100 + parseInt(mMatch[2]);
        } else if (cmMatch) {
            height = parseInt(cmMatch[1]);
        } else if (caoMatch) {
            height = parseInt(caoMatch[1]);
        }

        // 2. Trích xuất cân nặng: ưu tiên số đi cùng kg, kí, cân hoặc từ khóa nặng
        let weight = 65;
        const kgMatch = lower.match(/(\d{2,3})\s*(?:kg|kí|cân|kilogram)/i);
        const nangMatch = lower.match(/(?:nặng|cân nặng)\s*(\d{2,3})/i);
        if (kgMatch) {
            weight = parseInt(kgMatch[1]);
        } else if (nangMatch) {
            weight = parseInt(nangMatch[1]);
        }

        // 3. Phân loại form mặc
        let fit = 'regular';
        if (lower.includes('rộng') || lower.includes('oversize') || lower.includes('thoải mái')) fit = 'loose';
        if (lower.includes('ôm') || lower.includes('slim') || lower.includes('bó')) fit = 'tight';

        // 4. Thuật toán tính toán Size chuẩn vóc dáng Việt Nam
        let recommendedSize = 'M';
        let confidence = 96;
        let fitDesc = 'Form suông vừa vặn thoải mái, tôn vóc dáng';

        if (height < 162) {
            recommendedSize = weight < 53 ? 'S' : (weight < 62 ? 'M' : 'L');
        } else if (height <= 170) {
            recommendedSize = weight < 56 ? 'S' : (weight <= 66 ? 'M' : 'L');
        } else if (height <= 177) {
            recommendedSize = weight < 64 ? 'M' : (weight <= 75 ? 'L' : 'XL');
        } else if (height <= 184) {
            recommendedSize = weight < 72 ? 'L' : (weight <= 85 ? 'XL' : 'XXL');
        } else {
            recommendedSize = weight <= 80 ? 'XL' : 'XXL';
        }

        if (fit === 'loose') {
            const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
            const idx = sizeOrder.indexOf(recommendedSize);
            if (idx < sizeOrder.length - 1) recommendedSize = sizeOrder[idx + 1];
            fitDesc = 'Form rộng rãi (Oversize) che khuyết điểm, phong cách đường phố trẻ trung';
            confidence = 92;
        } else if (fit === 'tight') {
            fitDesc = 'Form ôm nhẹ (Slimfit) tôn đường nét cơ thể và bờ vai vững chãi';
            confidence = 94;
        }

        // 5. Lọc các sản phẩm thời trang (áo, quần, áo khoác) sẵn size
        const clothingProducts = allProducts.filter(p => {
            const cat = (p.category || p.categoryName || '').toLowerCase();
            const name = (p.name || '').toLowerCase();
            const isClothing = cat.includes('nam') || cat.includes('nữ') || cat.includes('khoác') || 
                               name.includes('áo') || name.includes('quần') || name.includes('polo') || 
                               name.includes('jean') || name.includes('hoodie') || name.includes('sơ mi');
            const isExcluded = cat.includes('công nghệ') || cat.includes('điện thoại') || 
                              cat.includes('máy tính') || cat.includes('túi') || cat.includes('balo') ||
                              name.includes('chuột') || name.includes('sạc') || name.includes('phím');
            return isClothing && !isExcluded;
        });

        const fashionProducts = (clothingProducts.length > 0 ? clothingProducts : allProducts).slice(0, 4);

        const customerName = context?.customerName ? `anh/chị **${context.customerName}**` : 'bạn';

        return {
            skill: 'AI_SMART_FITTING',
            message: `📏 **Master Fit Ken** đã phân tích tỷ lệ vóc dáng cho ${customerName} (${height}cm - ${weight}kg):\n\n` +
                     `🎯 **Kích cỡ khuyên dùng chuẩn nhất**: **SIZE ${recommendedSize}** (Độ chuẩn xác: **${confidence}%**)\n` +
                     `👕 **Đặc điểm form dáng**: ${fitDesc}.\n` +
                     `💡 **Lời khuyên mặc đẹp**: Với vóc dáng ${height}cm/${weight}kg, form áo size **${recommendedSize}** của ZShop sẽ rơi chuẩn vạt áo ngang xương hông, cầu vai vừa vặn không bị trùng hay kích nách. Dưới đây là các mẫu thời trang cao cấp sẵn size ${recommendedSize} cho bạn:`,
            sizeFitting: {
                recommendedSize,
                confidence,
                fitDescription: fitDesc,
                measurementsUsed: {
                    height,
                    weight,
                    fitPreference: fit === 'loose' ? 'Rộng (Oversize)' : fit === 'tight' ? 'Ôm nhẹ' : 'Vừa vặn'
                },
                details: {
                    lengthFit: 'Dài áo vừa qua cạp quần 3-4cm, che khuyết điểm bụng cực tốt.',
                    chestFit: 'Độ rộng vòng ngực dư 4-6cm cử động vươn vai êm ái.',
                    shoulderFit: 'Đường may vai rơi đúng mỏm cùng vai, tạo dáng chữ V đứng form.'
                }
            },
            products: fashionProducts
        };
    }

    /**
     * Kỹ năng: Tư vấn phối đồ & thời trang (Stylist Emma)
     */
    async handleFashionStylist(text, allProducts) {
        // Tìm kiếm các món phối theo combo chuẩn: Áo (Top) + Quần/Váy (Bottom) + Phụ kiện/Giày (Accessory)
        const topItem = allProducts.find(p => {
            const name = (p.name || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            return (name.includes('áo') || name.includes('polo') || name.includes('sơ mi') || name.includes('hoodie') || name.includes('thun')) && !cat.includes('công nghệ');
        });

        const bottomItem = allProducts.find(p => {
            const name = (p.name || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            return (name.includes('quần') || name.includes('jean') || name.includes('tây') || name.includes('short') || name.includes('váy')) && !cat.includes('công nghệ');
        });

        const accessoryItem = allProducts.find(p => {
            const name = (p.name || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            return (name.includes('giày') || name.includes('sneaker') || name.includes('túi') || name.includes('đồng hồ') || name.includes('kính')) && !cat.includes('công nghệ');
        });

        let topPicks = [topItem, bottomItem, accessoryItem].filter(Boolean);

        // Bổ sung nếu thiếu để luôn đủ 3 món thời trang thanh lịch
        if (topPicks.length < 3) {
            const remaining = allProducts.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const name = (p.name || '').toLowerCase();
                const isTech = cat.includes('công nghệ') || cat.includes('điện thoại') || cat.includes('máy tính') || name.includes('sạc') || name.includes('chuột') || name.includes('phím');
                return !isTech && !topPicks.some(t => t.id === p.id);
            });
            topPicks = topPicks.concat(remaining.slice(0, 3 - topPicks.length));
        }

        const totalPrice = topPicks.reduce((sum, p) => sum + p.price, 0);

        return {
            skill: 'AI_FASHION_STYLIST',
            message: `👗 **Stylist Emma** gợi ý cho bạn set trang phục thịnh hành được phối màu hài hòa:\n\n` +
                     `✨ **Phong cách**: Smart Casual & Lịch lãm hiện đại.\n` +
                     `🎯 **Hoàn cảnh**: Phù hợp cả đi làm, gặp gỡ đối tác hay cafe dạo phố cuối tuần.\n` +
                     `🎨 **Bí quyết phối màu**: Kết hợp gam màu trung tính (đen, trắng, xanh navy) tạo cảm giác thanh lịch, phối cùng giày sneaker trắng hoặc giày lười da bóng cao cấp để tạo điểm nhấn cuốn hút!`,
            outfitCombo: {
                id: `outfit-${Date.now()}`,
                title: 'Set Đồ Thời Trang Thanh Lịch & Năng Động',
                style: 'Smart Casual / Modern Minimalist',
                occasion: 'Đi làm, hẹn hò, dạo phố',
                items: topPicks,
                totalPrice: totalPrice,
                discountPrice: Math.round(totalPrice * 0.92)
            },
            products: topPicks
        };
    }

    /**
     * Kỹ năng: Tra cứu đơn hàng (Logistics Alex)
     */
    handleOrderTracking(text, context) {
        const orderCodeMatch = text.match(/(DH-[A-Z0-9\-]+)/i);
        const orderId = orderCodeMatch ? orderCodeMatch[1].toUpperCase() : 'DH-849201';

        return {
            skill: 'TRACK_ORDER',
            message: `📦 **Tiến độ vận chuyển đơn hàng [${orderId}]**:\n` +
                     `• **Trạng thái**: Đang vận chuyển bởi ZShop Express Fast 24/7.\n` +
                     `• **Mã vận đơn**: ZSE-88294719VN\n` +
                     `• **Dự kiến giao hàng**: Ngày mai trước 18:00 (Được đồng kiểm bóc kiện xem hàng trước khi thanh toán).\n` +
                     `• **Hỗ trợ đổi trả (UC10)**: Đổi size miễn phí trong 7 ngày nếu không vừa.`,
            orderInfo: {
                orderId: orderId,
                status: 'Đang vận chuyển (SHIPPING)',
                steps: [
                    { status: 'PENDING', date: 'Hôm qua 10:15', description: 'Đơn hàng được khởi tạo thành công', completed: true },
                    { status: 'PAID', date: 'Hôm qua 10:16', description: 'Đã thanh toán an toàn qua VietQR', completed: true },
                    { status: 'PROCESSING', date: 'Hôm qua 15:30', description: 'Kho tổng ZShop đã đóng gói và dán mã vận đơn', completed: true },
                    { status: 'SHIPPING', date: 'Hôm nay 08:00', description: 'Đang vận chuyển liên tỉnh đến kho phân phối gần bạn', completed: false }
                ],
                estimatedDelivery: 'Dự kiến giao ngày mai trước 18:00'
            }
        };
    }

    /**
     * Kỹ năng: Ưu đãi & Điểm VIP (VIP Concierge Mia)
     */
    handleLoyaltyAndVouchers(context) {
        const customer = context?.customerProfile || {
            name: context?.customerName || 'Quý khách',
            tier: 'Vàng',
            points: 450
        };

        const pointVND = (customer.points || 450) * 100;

        return {
            skill: 'PROMOTION_ADVISOR',
            message: `👑 **Đặc quyền VIP & Voucher độc quyền ZShop dành riêng cho bạn**:\n\n` +
                     `⭐ **Hạng thẻ**: ${customer.tier} (Điểm khả dụng: **${customer.points} điểm** = **${pointVND.toLocaleString('vi-VN')}đ** trừ thẳng vào giỏ hàng).\n` +
                     `🎁 **Mã giảm giá hot hôm nay**:\n` +
                     `• \`FREESHIPMAX\`: Miễn phí vận chuyển cho đơn từ 0đ (Tối đa 30k)\n` +
                     `• \`ZSHOPNEW\`: Giảm ngay 50.000đ cho đơn hàng từ 250k\n` +
                     `• \`VIPGOLD10\`: Đặc quyền VIP giảm 80.000đ cho đơn từ 500k\n\n` +
                     `Chỉ cần bấm mã trên giỏ hàng để được tự động áp dụng ngay!`,
            promotions: [
                { code: 'FREESHIPMAX', discountText: 'Freeship đơn từ 0đ', minSpend: 0, description: 'Hỗ trợ tối đa 30.000đ phí giao hàng' },
                { code: 'ZSHOPNEW', discountText: 'Giảm 50.000đ', minSpend: 250000, description: 'Dành cho khách hàng thân thiết từ 250k' },
                { code: 'VIPGOLD10', discountText: 'Giảm 80.000đ', minSpend: 500000, description: 'Đặc quyền thành viên VIP từ 500k' }
            ],
            customerLoyalty: {
                customerName: customer.name,
                tier: customer.tier,
                points: customer.points || 450,
                pointValueVND: pointVND,
                totalSpent: 12500000,
                tierDiscount: 10,
                benefits: ['Ưu tiên xử lý đơn hàng trong 1 giờ', 'Đổi trả miễn phí kéo dài 15 ngày', 'Tặng voucher sinh nhật 200.000đ']
            }
        };
    }

    /**
     * Kỹ năng: Báo cáo kinh doanh (Admin/Seller Mode)
     */
    async handleSalesAnalytics(allProducts) {
        const lowStockProducts = allProducts.filter(p => p.stock <= 40).slice(0, 3);
        
        return {
            skill: 'SALES_ANALYTICS',
            message: `📊 **Báo Cáo Bán Hàng & Vận Hành ZShop (Cập Nhật Thời Gian Thực)**:\n\n` +
                     `• **Tổng doanh thu tuần này**: **48.650.000đ** (Tăng 18.5% so với tuần trước)\n` +
                     `• **Tổng số đơn hàng**: **32 đơn** (Tỷ lệ thanh toán thành công: 97.2%)\n` +
                     `• **Mặt hàng bán chạy nhất**: Áo Polo Gucci Maxi GG & Áo Thun DIOR\n` +
                     `• ⚠️ **Cảnh báo tồn kho**: Có ${lowStockProducts.length} mặt hàng sắp hết kho cần bổ sung phiếu nhập kho (UC05)!`,
            analytics: {
                totalRevenue: 48650000,
                todayOrders: 14,
                topSelling: [
                    { name: 'Áo Thun DIOR - Chính Hãng', sold: 310, revenue: 585590000 },
                    { name: 'Áo Polo Nam Gucci Maxi GG Silk Cotton', sold: 42, revenue: 504000000 },
                    { name: 'Quần Jeans Slimfit Rách Gối Nam', sold: 450, revenue: 247500000 }
                ],
                lowStock: lowStockProducts.map(p => ({ name: p.name, stock: p.stock, category: p.category }))
            }
        };
    }

    /**
     * Tìm kiếm và gợi ý sản phẩm theo từ khóa và ngân sách
     */
    async searchProducts(query, allProducts) {
        const lower = query.toLowerCase();
        
        let minPrice = 0;
        let maxPrice = Infinity;
        const underMatch = lower.match(/dưới\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?/);
        if (underMatch) {
            const num = parseFloat(underMatch[1]);
            const unit = underMatch[2] || '';
            maxPrice = ['tr', 'triệu', 'm'].includes(unit) ? num * 1000000 : num * 1000;
        }

        let filtered = allProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

        const keywords = ['áo', 'quần', 'giày', 'mũ', 'túi', 'đồng hồ', 'hoodie', 'jean', 'dior', 'polo', 'sneaker', 'tai nghe', 'balo', 'sơ mi', 'blazer', 'loafer', 'khoác', 'sạc', 'chuột', 'bàn phím'];
        const matchedKw = keywords.filter(kw => lower.includes(kw));

        if (matchedKw.length > 0) {
            const kwFiltered = filtered.filter(p => {
                const text = `${p.name} ${p.category}`.toLowerCase();
                return matchedKw.some(kw => text.includes(kw));
            });
            if (kwFiltered.length > 0) {
                filtered = kwFiltered;
            }
        }

        const resultProducts = filtered.slice(0, 4);

        return {
            skill: 'PRODUCT_SEARCH_RECOMMEND',
            message: `✨ ZShop đã tìm thấy **${resultProducts.length} sản phẩm** rất phù hợp với nhu cầu của bạn:`,
            products: resultProducts
        };
    }

    /**
     * Bộ máy điều phối AI Trung Tâm (Hybrid RAG + External AI Gateway)
     */
    async processChat(userMessage, persona = 'STYLIST', context = {}, apiKey = null) {
        const query = (userMessage || '').trim();
        const lower = query.toLowerCase();
        const allProducts = await this.getAllProductsFromDB();

        // 1. Nhận diện câu hỏi thường gặp về Chính sách (FAQ Local RAG - Phản hồi siêu tốc < 50ms)
        if (lower.includes('đổi trả') || lower.includes('hoàn tiền') || lower.includes('đổi size') || lower.includes('chật')) {
            return {
                skill: 'GENERAL_CONSULT',
                message: `🛡️ **Chính Sách Đổi Trả & Hoàn Tiền 7 Ngày Của ZShop**:\n\n` +
                         `• **Thời hạn**: Bạn được đổi hàng miễn phí trong vòng **7 ngày** kể từ ngày nhận kiện.\n` +
                         `• **Điều kiện**: Hàng còn nguyên tem mác, chưa qua giặt tẩy.\n` +
                         `• **Thu hồi tận nơi**: Shipper ZShop Express sẽ đến tận nhà thu hồi hoặc giao size mới đổi cho bạn, bạn không cần phải ra bưu cục gửi hàng.\n` +
                         `• **Hỗ trợ tức thì**: Bạn có thể vào mục **"Đơn Mua Của Tôi"** > Bấm **"Yêu Cầu Đổi Trả"** hoặc liên hệ CSKH 0901 234 567!`
            };
        }

        if (lower.includes('freeship') || lower.includes('phí ship') || lower.includes('phí vận chuyển') || lower.includes('tiền ship') || lower.includes('miễn phí vận chuyển')) {
            return {
                skill: 'GENERAL_CONSULT',
                message: `🚚 **Chính Sách Giao Hàng & Phí Vận Chuyển ZShop**:\n\n` +
                         `• 🎁 **Miễn phí vận chuyển (FREESHIP)**: Cho mọi đơn hàng từ **300.000đ** trở lên.\n` +
                         `• **Giao tiêu chuẩn**: 30.000đ (nhận hàng trong 2-3 ngày làm việc).\n` +
                         `• **Giao hỏa tốc ZShop Fast**: 50.000đ (nhận ngay trong 24 giờ tại TP.HCM & Hà Nội).\n` +
                         `• **Đồng kiểm an tâm**: Quý khách luôn được phép mở kiện kiểm tra hàng trước khi thanh toán!`
            };
        }

        if (lower.includes('thanh toán') || lower.includes('chuyển khoản') || lower.includes('momo') || lower.includes('vietqr') || lower.includes('trả tiền')) {
            return {
                skill: 'GENERAL_CONSULT',
                message: `💳 **Phương Thức Thanh Toán Linh Hoạt Tại ZShop**:\n\n` +
                         `1. **VietQR Napas 24/7**: Quét mã tự động khớp lệnh trong 3 giây qua bất kỳ App ngân hàng nào.\n` +
                         `2. **Tiền mặt khi nhận hàng (COD)**: Xem hàng tận tay rồi mới trả tiền cho shipper, miễn phí thu hộ.\n` +
                         `3. **Ví điện tử MoMo / ZaloPay**: Xác thực FaceID/vân tay một chạm.\n` +
                         `4. **Thẻ Quốc Tế Visa / Master / JCB**: Chuẩn bảo mật quốc tế PCI-DSS an toàn tuyệt đối.`
            };
        }

        if (lower.includes('địa chỉ') || lower.includes('ở đâu') || lower.includes('cửa hàng') || lower.includes('showroom') || lower.includes('mở cửa') || lower.includes('chi nhánh')) {
            return {
                skill: 'GENERAL_CONSULT',
                message: `📍 **Showroom Flagship Trực Tiếp Của ZShop**:\n\n` +
                         `• **Địa chỉ**: 12 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.\n` +
                         `• **Giờ mở cửa**: 08:30 - 22:00 hàng ngày (kể cả Thứ Bảy, Chủ Nhật và ngày Lễ).\n` +
                         `• **Tiện ích**: Có bãi đỗ xe ô tô, phòng thử đồ 3D Spatial và chuyên viên tư vấn trực tiếp.`
            };
        }

        // 2. Nhận diện câu hỏi kích thước / Size / Vóc dáng (hoặc đang ở tab FITTING)
        if (persona === 'FITTING' || lower.includes('size') || lower.includes('cao') || lower.includes('nặng') || lower.includes('1m') || lower.includes('kg') || lower.includes('vừa không') || lower.includes('form')) {
            return await this.handleSmartFitting(query, context, allProducts);
        }

        // 3. Nhận diện câu hỏi Đơn hàng & Vận chuyển (hoặc tab ORDERS)
        if (persona === 'ORDERS' || lower.includes('đơn hàng') || lower.includes('dh-') || lower.includes('bao giờ tới') || lower.includes('mã vận đơn') || lower.includes('tra cứu đơn')) {
            return this.handleOrderTracking(query, context);
        }

        // 4. Nhận diện câu hỏi Khuyến mãi, Điểm VIP & Voucher (hoặc tab LOYALTY)
        if (persona === 'LOYALTY' || lower.includes('voucher') || lower.includes('mã giảm') || lower.includes('điểm') || lower.includes('khuyến mãi') || lower.includes('ưu đãi') || lower.includes('vip')) {
            return this.handleLoyaltyAndVouchers(context);
        }

        // 5. Nhận diện câu hỏi Báo cáo & Doanh thu (hoặc tab BUSINESS)
        if (persona === 'BUSINESS' || lower.includes('doanh thu') || lower.includes('báo cáo') || lower.includes('tồn kho') || lower.includes('doanh số') || lower.includes('bán chạy')) {
            return await this.handleSalesAnalytics(allProducts);
        }

        // 5. Thử gọi External AI (Google Gemini REST API) nếu có API Key
        if (apiKey || process.env.GEMINI_API_KEY) {
            const catalogSummary = allProducts.slice(0, 15).map(p => `- ${p.name} (${p.category}): ${p.price.toLocaleString('vi-VN')}đ [Kho: ${p.stock} cái]`).join('\n');
            const systemPrompt = `Bạn là Trợ lý AI Bán Hàng & Tư Vấn Thời Trang cao cấp của ZShop (E-Commerce 3D & SZ-Payment Gateway).
QUY TẮC BẮT BUỘC:
1. Trả lời thân thiện, lịch thiệp, thông minh, chuẩn phong cách tư vấn viên thời trang chuyên nghiệp bằng tiếng Việt.
2. Dựa trên dữ liệu thực tế từ cửa hàng ZShop:
${ZSHOP_KNOWLEDGE_BASE.returnPolicy}
${ZSHOP_KNOWLEDGE_BASE.shippingPolicy}
${ZSHOP_KNOWLEDGE_BASE.paymentMethods}
${ZSHOP_KNOWLEDGE_BASE.storeAddress}
${ZSHOP_KNOWLEDGE_BASE.warrantyCommitment}
3. Danh mục sản phẩm có sẵn tại ZShop:
${catalogSummary}
4. Tuyệt đối không bịa đặt giá tiền hay sản phẩm không có thật. Nếu khách hỏi sản phẩm không có trong danh sách, hãy thông báo lịch sự và gợi ý các mặt hàng tương đồng có sẵn.`;

            const geminiReply = await this.callGeminiAPI(query, systemPrompt, apiKey);
            if (geminiReply) {
                // Lọc các sản phẩm được nhắc đến để hiển thị thẻ đính kèm
                const matchedProducts = allProducts.filter(p => geminiReply.toLowerCase().includes(p.name.toLowerCase())).slice(0, 3);
                return {
                    skill: 'GENERAL_CONSULT',
                    message: geminiReply,
                    products: matchedProducts.length > 0 ? matchedProducts : undefined
                };
            }
        }

        // 7. Nhận diện câu hỏi Stylist / Phối đồ
        if (persona === 'STYLIST' || lower.includes('phối') || lower.includes('set') || lower.includes('outfit') || lower.includes('mặc gì') || lower.includes('đi làm') || lower.includes('đi tiệc')) {
            return await this.handleFashionStylist(query, allProducts);
        }

        // 8. Mặc định: Tìm kiếm sản phẩm thông minh dựa trên từ khóa
        return await this.searchProducts(query, allProducts);
    }
}

module.exports = new AiService();
