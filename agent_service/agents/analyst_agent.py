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
        # Nếu hỏi về combo thiết bị, phụ kiện, set đồ công nghệ
        if re.search(r'(combo|bộ phụ kiện|bo phu kien|set phụ kiện|set phu kien|set đồ|set do|phối đồ|phoi do|mix đồ|mix do|outfit|gaming|vlogger|livestream|tiết kiệm)', text):
            return "FASHION_OUTFIT"
        # Nếu hỏi về tương thích thông số, so sánh cấu hình, chuẩn sạc
        if re.search(r'(tương thích|tuong thich|sạc được không|sac duoc khong|dùng được không|dung duoc khong|vừa không|vua khong|so sánh|so sanh|cấu hình|cau hinh|thông số|thong so|công suất|cong suat|type-c|lightning|magsafe|pps|pd \d+w|chip|ram|pin trâu)', text):
            return "SPECS_COMPATIBILITY"
        if re.search(r'(chính sách|chinh sach|quy định|quy dinh|hướng dẫn|huong dan|đổi trả|doi tra|hoàn tiền|hoan tien|bảo hành|bao hanh|imei|1 đổi 1|freeship|giao hàng|giao hang|phí ship|phi ship|thanh toán|thanh toan|momo|vietqr|trade-in|thu cũ|thu cu|địa chỉ|dia chi|showroom|cửa hàng|cua hang)', text):
            return "POLICY_INQUIRY"
        if re.search(r'(đơn hàng|don hang|mã đơn|ma don|tra cứu|tra cuu|kiểm tra đơn|kiem tra don|tình trạng đơn|ord-\d+)', text):
            return "ORDER_TRACKING"
        if re.search(r'(size|chiều cao|chieu cao|cân nặng|can nang|cao \d+|nặng \d+|nang \d+|mặc vừa|mac vua|form)', text):
            return "FITTING_ADVICE"
        if re.search(r'^(chào|chao|hello|hi|alo|bạn là ai|ban la ai)', text):
            return "GENERAL_GREETING"
        return "PRODUCT_SEARCH"

    def _detect_occasion(self, text: str) -> Optional[str]:
        # Bối cảnh nhu cầu công nghệ & combo
        if any(w in text for w in ["gaming", "chơi game", "choi game", "game thủ", "game thu", "độ trễ thấp"]):
            return "gaming"
        if any(w in text for w in ["vlogger", "quay video", "tiktok", "livestream", "chụp ảnh", "chup anh", "sáng tạo"]):
            return "creator"
        if any(w in text for w in ["văn phòng", "van phong", "công sở", "cong so", "đi làm", "di lam", "macbook", "laptop", "office"]):
            return "office"
        if any(w in text for w in ["tiết kiệm", "tiet kiem", "học sinh", "hoc sinh", "sinh viên", "sinh vien", "cơ bản", "co ban", "starter"]):
            return "budget"
        if any(w in text for w in ["dạo phố", "dao pho", "du lịch", "du lich", "phượt", "phuot", "streetwear"]):
            return "travel"
        if any(w in text for w in ["tiệc", "tiec", "party", "sang trọng", "sang trong", "hẹn hò", "hen ho"]):
            return "party"
        return None

    def _extract_sort_by(self, text: str) -> Optional[str]:
        if re.search(r'(rẻ nhất|re nhat|thấp nhất|thap nhat|tiết kiệm nhất|tiet kiem nhat|giá rẻ|gia re|giá thấp|gia thap|bình dân|binh dan)', text):
            return "price_asc"
        if re.search(r'(đắt nhất|dat nhat|cao nhất|cao nhat|sang nhất|sang nhat|sang trọng nhất|sang trong nhat|cao cấp nhất|cao cap nhat|flagship|giá cao|gia cao)', text):
            return "price_desc"
        if re.search(r'(bán chạy nhất|ban chay nhat|hot nhất|hot nhat|ưa chuộng nhất|ua chuong nhat|mua nhiều nhất|mua nhieu nhat)', text):
            return "popularity_desc"
        if re.search(r'(đánh giá cao nhất|danh gia cao nhat|tốt nhất|tot nhat|review tốt|review tot)', text):
            return "rating_desc"
        return None

    def _extract_limit(self, text: str) -> int:
        match_num = re.search(r'(\d+)\s*(?:sản phẩm|san pham|món|mon|cái|cai|bộ|bo|mẫu|mau|chiếc|chiec)', text)
        if match_num:
            try:
                return max(1, min(10, int(match_num.group(1))))
            except Exception:
                pass
        if re.search(r'\b(?:1|một|mot)\s*(?:sản phẩm|san pham|món|mon|cái|cai|mẫu|mau|chiếc|chiec)\b', text) or re.search(r'\b(?:chỉ|chi|duy nhất|duy nhat|top)\s*1\b', text):
            return 1
        if re.search(r'\b(?:rẻ nhất|re nhat|đắt nhất|dat nhat|cao nhất|cao nhat|thấp nhất|thap nhat|tốt nhất|tot nhat)\b', text):
            return 1
        return 6

    def _extract_keywords(self, text: str) -> List[str]:
        known_kw = [
            # Smartphone Brands & Models
            "iphone 16", "iphone 15", "iphone", "galaxy s24", "s24 ultra", "galaxy a55", "samsung",
            "xiaomi 14", "redmi note", "xiaomi", "oppo reno", "oppo", "vivo v30", "vivo",
            # Chargers & Power
            "củ sạc nhanh", "cu sac nhanh", "củ sạc", "cu sac", "cốc sạc", "coc sac", "gan 65w", "gan 100w", "gan 30w", "gan",
            "anker", "baseus", "ugreen", "sạc 45w", "sac 45w", "sạc 20w", "sac 20w", "tẩu sạc", "tau sac",
            # Cables
            "cáp sạc", "cap sac", "dây sạc", "day sac", "c to c", "type-c to lightning", "cáp 3 trong 1", "cap 3 trong 1",
            # Power banks
            "sạc dự phòng", "sac du phong", "pin dự phòng", "pin du phong", "magsafe", "shargeek",
            # Audio
            "tai nghe bluetooth", "tai nghe", "airpods pro", "airpods", "galaxy buds", "buds fe", "sony wh-1000xm5", "sony", "loa bluetooth", "loa jbl", "jbl",
            # Cases & Protectors
            "ốp lưng", "op lung", "uag", "spigen", "hoda", "bao da", "kính cường lực", "kinh cuong luc", "cường lực", "cuong luc", "kingkong", "ppf",
            # Stands & Gadgets
            "trạm sạc", "tram sac", "gimbal", "giá đỡ", "gia do", "otg", "combo", "bộ phụ kiện"
        ]
        found = []
        for kw in known_kw:
            if kw in text:
                found.append(kw)
        return found

    def _extract_max_price(self, text: str) -> Optional[float]:
        match_k = re.search(r'(?:dưới|duoi|<|<=|nhỏ hơn|nho hon|tầm|tam|khoảng|khoang)\s*(\d+(?:\.\d+)?)\s*(?:k|nghìn|ngàn|nghin|ngan)', text)
        if match_k:
            return float(match_k.group(1)) * 1000
        match_m = re.search(r'(?:dưới|duoi|<|<=|nhỏ hơn|nho hon|tầm|tam|khoảng|khoang)\s*(\d+(?:\.\d+)?)\s*(?:tr|triệu|trieu)', text)
        if match_m:
            return float(match_m.group(1)) * 1000000
        match_num = re.search(r'(?:dưới|duoi|<|<=)\s*(\d{5,9})', text)
        if match_num:
            return float(match_num.group(1))
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
        if any(w in text for w in ["điện thoại", "dien thoai", "smartphone", "iphone", "samsung", "xiaomi", "redmi", "oppo", "vivo"]):
            return "Điện Thoại Thông Minh"
        if any(w in text for w in ["củ sạc", "cu sac", "cốc sạc", "coc sac", "bộ sạc", "bo sac", "sạc nhanh", "gan"]):
            return "Củ Sạc & Bộ Sạc Nhanh"
        if any(w in text for w in ["cáp sạc", "cap sac", "dây sạc", "day sac", "dây cáp", "day cap", "type-c", "lightning", "c to c"]):
            return "Cáp Sạc & Dây Cáp"
        if any(w in text for w in ["sạc dự phòng", "sac du phong", "pin dự phòng", "pin du phong", "powerbank"]):
            return "Pin Sạc Dự Phòng"
        if any(w in text for w in ["tai nghe", "airpods", "buds", "headphone", "loa", "jbl", "sony"]):
            return "Tai Nghe & Âm Thanh"
        if any(w in text for w in ["ốp lưng", "op lung", "bao da", "uag", "spigen"]):
            return "Ốp Lưng & Bao Da"
        if any(w in text for w in ["kính cường lực", "kinh cuong luc", "cường lực", "cuong luc", "dán màn hình", "dan man hinh", "ppf", "kingkong"]):
            return "Kính Cường Lực & Dán Màn Hình"
        if any(w in text for w in ["giá đỡ", "gia do", "gimbal", "trạm sạc", "tram sac", "otg"]):
            return "Giá Đỡ & Trạm Sạc"
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
