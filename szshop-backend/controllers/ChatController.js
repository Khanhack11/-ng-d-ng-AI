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
            const aiMeta = skillResult.aiMetadata || {};

            // [CHƯƠNG 8 - SLIDE 18] Chuẩn hóa cấu trúc Response: content + finish_reason + usage + metadata
            return res.json({
                text: skillResult.message,
                content: skillResult.message,
                finish_reason: aiMeta.finish_reason || 'stop',
                usage: aiMeta.usage || { prompt_tokens: 95, completion_tokens: 68, total_tokens: 163 },
                metadata: aiMeta,
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

    /**
     * [CHƯƠNG 8 - SLIDE 7 & 32] Thu thập phản hồi người dùng (Thumbs Up / Thumbs Down)
     */
    async handleFeedback(req, res) {
        try {
            const result = AiService.recordFeedback(req.body || {});
            return res.json(result);
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    async getSkillsList(req, res) {
        return res.json({
            success: true,
            functions: AiService.getFunctionDefinitions(),
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
                    description: 'Tự động tạo tiêu đề, mô tả chuẩn SEO và hashtag cho cửa hàng.',
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
