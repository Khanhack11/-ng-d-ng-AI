import re
from typing import Dict, Any, List, Optional
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel

class AnalystAgent:
    """
    Analyst Agent:
    - Tiếp nhận câu hỏi người dùng từ Message Bus.
    - Phân tích cú pháp, trích xuất Intent và Entity.
    - Phát thông điệp phân tích lên Structured Message Bus.
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "AnalystAgent"

    def process(self, text: str, correlation_id: str, persona: str = "STYLIST", context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        text_clean = text.strip().lower()
        
        # 1. Trích xuất Intent
        intent = self._detect_intent(text_clean, persona=persona)

        # 2. Trích xuất Occasion (nếu là phối đồ)
        occasion = self._detect_occasion(text_clean)

        # 3. Trích xuất Thứ tự sắp xếp và Số lượng yêu cầu
        sort_by = self._extract_sort_by(text_clean)
        limit = self._extract_limit(text_clean)

        # 4. Trích xuất Entities
        entities = {
            "keywords": self._extract_keywords(text_clean),
            "max_price": self._extract_max_price(text_clean),
            "min_price": self._extract_min_price(text_clean),
            "category": self._detect_category(text_clean),
            "order_id": self._extract_order_id(text),
            "measurements": self._extract_measurements(text_clean),
            "occasion": occasion,
            "persona": persona,
            "sort_by": sort_by,
            "limit": limit,
            "is_superlative": sort_by is not None
        }

        analysis_result = {
            "intent": intent,
            "entities": entities,
            "raw_query": text,
            "persona": persona,
            "context": context or {}
        }

        # Phát thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="OrchestratorAgent",
            channel=MessageChannel.ANALYST,
            payload=analysis_result,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return analysis_result

    def _detect_intent(self, text: str, persona: str = "STYLIST") -> str:
        # Nếu hỏi về set đồ, phối đồ, công sở, dạo phố, đi tiệc, phong cách
        if re.search(r'(set đồ|set do|phối đồ|phoi do|mix đồ|mix do|outfit|combo|công sở|cong so|thanh lịch|thanh lich|lịch lãm|lich lam|dạo phố|dao pho|đi tiệc|di tiec|hẹn hò|hen ho|gu ăn mặc|phong cách)', text):
            return "FASHION_OUTFIT"
        if re.search(r'(chính sách|chinh sach|quy định|quy dinh|hướng dẫn|huong dan|đổi trả|doi tra|hoàn tiền|hoan tien|bảo hành|bao hanh|freeship|giao hàng|giao hang|phí ship|phi ship|thanh toán|thanh toan|momo|vietqr|địa chỉ|dia chi|showroom|cửa hàng|cua hang)', text):
            return "POLICY_INQUIRY"
        if re.search(r'(đơn hàng|don hang|mã đơn|ma don|tra cứu|tra cuu|kiểm tra đơn|kiem tra don|tình trạng đơn|ord-\d+)', text):
            return "ORDER_TRACKING"
        if re.search(r'(size|chiều cao|chieu cao|cân nặng|can nang|cao \d+|nặng \d+|nang \d+|mặc vừa|mac vua|form)', text):
            return "FITTING_ADVICE"
        if re.search(r'^(chào|chao|hello|hi|alo|bạn là ai|ban la ai)', text):
            return "GENERAL_GREETING"
        return "PRODUCT_SEARCH"

    def _detect_occasion(self, text: str) -> Optional[str]:
        if any(w in text for w in ["công sở", "cong so", "đi làm", "di lam", "thanh lịch", "thanh lich", "lịch lãm", "lich lam", "office"]):
            return "office"
        if any(w in text for w in ["dạo phố", "dao pho", "cuối tuần", "cuoi tuan", "streetwear", "năng động", "nang dong", "cafe"]):
            return "streetwear"
        if any(w in text for w in ["tiệc", "tiec", "party", "sang trọng", "sang trong", "hẹn hò", "hen ho"]):
            return "party"
        return None

    def _extract_sort_by(self, text: str) -> Optional[str]:
        if re.search(r'(rẻ nhất|re nhat|thấp nhất|thap nhat|tiết kiệm nhất|tiet kiem nhat|giá rẻ|gia re|giá thấp|gia thap|bình dân|binh dan)', text):
            return "price_asc"
        if re.search(r'(đắt nhất|dat nhat|cao nhất|cao nhat|sang nhất|sang nhat|sang trọng nhất|sang trong nhat|cao cấp nhất|cao cap nhat|giá cao|gia cao)', text):
            return "price_desc"
        if re.search(r'(bán chạy nhất|ban chay nhat|hot nhất|hot nhat|ưa chuộng nhất|ua chuong nhat|mua nhiều nhất|mua nhieu nhat)', text):
            return "popularity_desc"
        if re.search(r'(đánh giá cao nhất|danh gia cao nhat|tốt nhất|tot nhat|review tốt|review tot)', text):
            return "rating_desc"
        return None

    def _extract_limit(self, text: str) -> int:
        match_num = re.search(r'(\d+)\s*(?:sản phẩm|san pham|món|mon|cái|cai|bộ|bo|mẫu|mau)', text)
        if match_num:
            try:
                return max(1, min(10, int(match_num.group(1))))
            except Exception:
                pass
        if re.search(r'\b(?:1|một|mot)\s*(?:sản phẩm|san pham|món|mon|cái|cai|mẫu|mau)\b', text) or re.search(r'\b(?:chỉ|chi|duy nhất|duy nhat|top)\s*1\b', text):
            return 1
        if re.search(r'\b(?:rẻ nhất|re nhat|đắt nhất|dat nhat|cao nhất|cao nhat|thấp nhất|thap nhat|tốt nhất|tot nhat)\b', text):
            return 1
        return 6

    def _extract_keywords(self, text: str) -> List[str]:
        known_kw = [
            "công sở", "cong so", "thanh lịch", "thanh lich", "lịch lãm", "lich lam",
            "áo sơ mi", "ao so mi", "sơ mi", "so mi",
            "quần tây", "quan tay", "quần âu", "quan au",
            "áo polo", "ao polo", "áo thun", "ao thun", "áo hoodie", "ao hoodie", "áo khoác", "ao khoac", "áo", "ao",
            "quần jeans", "quan jeans", "quần jean", "quan jean", "quần", "quan",
            "giày sneaker", "giay sneaker", "giày thể thao", "giay the thao", "giày", "giay",
            "tai nghe", "tai nghe bluetooth", "sạc dự phòng", "sac du phong", "sạc", "sac",
            "set đồ", "set do", "outfit", "dạo phố", "dao pho"
        ]
        found = []
        for kw in known_kw:
            if kw in text:
                found.append(kw)
        return found

    def _extract_max_price(self, text: str) -> Optional[float]:
        # Ví dụ: "dưới 500k", "duoi 500k", "< 1tr", "tầm 500000", "tam 500k"
        match_k = re.search(r'(?:dưới|duoi|<|<=|nhỏ hơn|nho hon|tầm|tam|khoảng|khoang)\s*(\d+(?:\.\d+)?)\s*(?:k|nghìn|ngàn|nghin|ngan)', text)
        if match_k:
            return float(match_k.group(1)) * 1000
        match_m = re.search(r'(?:dưới|duoi|<|<=|nhỏ hơn|nho hon|tầm|tam|khoảng|khoang)\s*(\d+(?:\.\d+)?)\s*(?:tr|triệu|trieu)', text)
        if match_m:
            return float(match_m.group(1)) * 1000000
        match_num = re.search(r'(?:dưới|duoi|<|<=)\s*(\d{5,9})', text)
        if match_num:
            return float(match_num.group(1))
        # Nếu có từ "dưới" / "duoi" và theo sau là số k:
        match_standalone = re.search(r'(?:dưới|duoi)\s+(\d{2,4})k', text)
        if match_standalone:
            return float(match_standalone.group(1)) * 1000
        return None

    def _extract_min_price(self, text: str) -> Optional[float]:
        match_k = re.search(r'(?:trên|tren|>|>=|từ|tu|lớn hơn|lon hon)\s*(\d+(?:\.\d+)?)\s*(?:k|nghìn|ngàn|nghin|ngan)', text)
        if match_k:
            return float(match_k.group(1)) * 1000
        match_m = re.search(r'(?:trên|tren|>|>=|từ|tu|lớn hơn|lon hon)\s*(\d+(?:\.\d+)?)\s*(?:tr|triệu|trieu)', text)
        if match_m:
            return float(match_m.group(1)) * 1000000
        return None

    def _detect_category(self, text: str) -> Optional[str]:
        if any(w in text for w in ["áo", "quần", "jeans", "polo", "hoodie", "sơ mi"]):
            return "Thời trang"
        if any(w in text for w in ["giày", "sneaker"]):
            return "Giày dép"
        if any(w in text for w in ["tai nghe", "sạc", "bluetooth", "công nghệ"]):
            return "Thiết bị công nghệ & Phụ kiện"
        return None

    def _extract_order_id(self, text: str) -> Optional[str]:
        match = re.search(r'(ORD-[\w-]+)', text, re.IGNORECASE)
        if match:
            return match.group(1).upper()
        return None

    def _extract_measurements(self, text: str) -> Dict[str, Any]:
        h_match = re.search(r'(?:cao|m8|m7|m6)?\s*(\d{2,3})\s*(?:cm)?', text)
        w_match = re.search(r'(?:nặng)?\s*(\d{2})\s*(?:kg)?', text)
        return {
            "height": int(h_match.group(1)) if h_match else None,
            "weight": int(w_match.group(1)) if w_match else None
        }
