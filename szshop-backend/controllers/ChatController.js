const AiService = require('../services/AiService');

class ChatController {
    async handleChat(req, res) {
        console.log('Chat request received:', req.body);
        try {
            const { messages, mode, persona, context, apiKey, userRole } = req.body;
            const text = (messages && messages[0] && messages[0].text) 
                ? messages[0].text 
                : (req.body.text || req.body.message || '');

            const currentPersona = persona || mode || 'STYLIST';

            if (!text.trim()) {
                return res.json({ 
                    text: "Xin chào! Tôi là Trợ lý AI ZShop. Tôi có thể giúp gì cho bạn hôm nay?",
                    skillResult: {
                        skill: 'GENERAL_CONSULT',
                        message: "Xin chào! Tôi là Trợ lý AI ZShop. Tôi có thể giúp gì cho bạn hôm nay?"
                    }
                });
            }

            // Gọi AiService thực thi kỹ năng AI tương ứng với Persona và Context
            const skillResult = await AiService.processChat(text, currentPersona, context, apiKey);

            // Trả về cả skillResult và text để tương thích 100% với giao diện mới và cũ
            return res.json({
                text: skillResult.message,
                skillResult: skillResult
            });

        } catch (error) {
            console.error('Lỗi ChatController:', error);
            res.status(500).json({ 
                text: "Xin lỗi, hệ thống AI đang gặp trục trặc kỹ thuật. Vui lòng thử lại sau nhé!",
                error: error.message 
            });
        }
    }

    async getSkillsList(req, res) {
        return res.json({
            success: true,
            skills: [
                {
                    id: 'PRODUCT_SEARCH_RECOMMEND',
                    name: 'Tìm kiếm & Gợi ý sản phẩm thông minh',
                    description: 'Phân tích ngôn ngữ tự nhiên để lọc theo ngân sách, danh mục và phong cách.',
                    endpoint: 'POST /api/chat'
                },
                {
                    id: 'QUICK_ADD_TO_CART',
                    name: 'Đặt hàng nhanh & Thêm vào giỏ',
                    description: 'Tương tác 1-chạm đưa sản phẩm vào giỏ hàng ngay trong hội thoại.',
                    endpoint: 'POST /api/chat'
                },
                {
                    id: 'TRACK_ORDER',
                    name: 'Tra cứu hành trình đơn hàng',
                    description: 'Kiểm tra trạng thái vận chuyển và mốc thời gian giao hàng theo mã đơn.',
                    endpoint: 'POST /api/chat'
                },
                {
                    id: 'SALES_ANALYTICS',
                    name: 'Báo cáo bán hàng & Cảnh báo tồn kho',
                    description: 'Thống kê doanh số, phân tích sản phẩm bán chạy và cảnh báo tồn kho thấp cho Admin.',
                    endpoint: 'POST /api/chat'
                },
                {
                    id: 'AI_COPYWRITER',
                    name: 'Sáng tạo nội dung bán hàng AI',
                    description: 'Tự động tạo tiêu đề, mô tả chuẩn SEO và hashtag cho người bán.',
                    endpoint: 'POST /api/chat'
                },
                {
                    id: 'PROMOTION_ADVISOR',
                    name: 'Tư vấn khuyến mãi & Voucher',
                    description: 'Gợi ý mã giảm giá tốt nhất cho đơn hàng hiện tại.',
                    endpoint: 'POST /api/chat'
                }
            ]
        });
    }
}

module.exports = new ChatController();
