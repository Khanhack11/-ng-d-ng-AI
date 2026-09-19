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
            # iPhone Models (iPhone 18 down to iPhone 6)
            "iphone 18 pro max", "iphone 18 pro", "iphone 18", "18 pro max", "18prm", "18 pro", "ip18",
            "iphone 17 pro max", "iphone 17 pro", "iphone 17", "17 pro max", "17prm", "17 pro", "ip17",
            "iphone 16 pro max", "iphone 16 pro", "iphone 16 plus", "iphone 16", "16 pro max", "16prm", "16 pro", "ip16",
            "iphone 15 pro max", "iphone 15 pro", "iphone 15 plus", "iphone 15", "15 pro max", "15prm", "15 pro", "ip15",
            "iphone 14 pro max", "iphone 14 pro", "iphone 14 plus", "iphone 14", "14 pro max", "14prm", "14 pro", "ip14",
            "iphone 13 pro max", "iphone 13 pro", "iphone 13 mini", "iphone 13", "13 pro max", "13prm", "13 pro", "ip13",
            "iphone 12 pro max", "iphone 12 pro", "iphone 12 mini", "iphone 12", "12 pro max", "12prm", "12 pro", "ip12",
            "iphone 11 pro max", "iphone 11 pro", "iphone 11", "11 pro max", "11prm", "11 pro", "ip11",
            "iphone xs max", "iphone xs", "iphone xr", "iphone x", "xs max", "ipx", "ipxr", "ipxs",
            "iphone 8 plus", "iphone 8", "8 plus", "8p", "ip8",
            "iphone 7 plus", "iphone 7", "7 plus", "7p", "ip7",
            "iphone 6s plus", "iphone 6s", "iphone 6 plus", "iphone 6", "6s plus", "6 plus", "ip6", "ip6s", "iphone", "apple",
            # Apple Colors
            "titan sa mạc", "desert titanium", "titan tự nhiên", "natural titanium", "deep purple", "tím đậm",
            "sierra blue", "xanh sierra", "pacific blue", "xanh thái bình dương", "midnight green", "xanh bóng đêm",
            "rose gold", "vàng hồng", "jet black", "đen bóng", "product red", "gốm", "ceramic",
            # Apple Accessories & Power
            "sạc apple 20w", "sạc 20w", "củ sạc apple", "củ sạc 35w", "củ sạc nhanh", "củ sạc", "sạc nhanh", "sạc", "gan",
            "cáp type-c apple", "cáp lightning", "cáp sạc bọc dù", "cáp sạc", "dây sạc",
            "magsafe", "sạc magsafe", "pin magsafe", "battery pack",
            "airpods pro 2", "airpods max", "airpods pro", "airpods", "tai nghe apple", "tai nghe",
            "ốp silicone apple", "ốp magsafe", "ốp lưng apple", "ốp lưng",
            "kính cường lực apple", "cường lực apple", "kính cường lực", "cường lực", "miếng dán",
            "combo", "bộ phụ kiện", "combo apple"
        ]
        found = []
        for kw in known_kw:
            if kw in text:
                found.append(kw)
        
        # Nếu đã có từ khóa model iPhone cụ thể (như "iphone 18", "iphone 6"), loại bỏ từ khóa chung "iphone", "apple"
        has_specific_iphone = any(kw.startswith("iphone ") or kw.startswith("ip") or "plus" in kw or "pro" in kw for kw in found if kw not in ["iphone", "apple"])
        if has_specific_iphone:
            found = [kw for kw in found if kw not in ["iphone", "apple"]]

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
        if any(w in text for w in ["phụ kiện", "phu kien", "tai nghe", "airpods", "củ sạc", "cu sac", "cáp sạc", "cap sac", "magsafe", "ốp", "op", "cường lực", "cuong luc", "dán"]):
            return "Phụ Kiện"
        if any(w in text for w in ["iphone", "ip", "điện thoại", "dien thoai", "smartphone", "máy"]):
            return "iPhone"
        return None

    def _extract_order_id(self, text: str) -> Optional[str]:
        match = re.search(r'(ORD-[\w-]+)', text, re.IGNORECASE)
        if match:
            return match.group(1).upper()
        return None

    def _extract_measurements(self, text: str) -> Dict[str, Any]:
        h_match = re.search(r'(?:cao\s*(\d{2,3})\s*(?:cm)?)|(?:1m(\d{2}))|(?:(\d{3})\s*cm)', text)
        height = None
        if h_match:
            if h_match.group(1):
                height = int(h_match.group(1))
            elif h_match.group(2):
                height = 100 + int(h_match.group(2))
            elif h_match.group(3):
                height = int(h_match.group(3))

        w_match = re.search(r'(?:nặng\s*(\d{2,3})\s*(?:kg|kí|ký)?)|(?:(\d{2,3})\s*(?:kg|kí|ký))', text)
        weight = int(w_match.group(1) or w_match.group(2)) if w_match else None
        return {
            "height": height,
            "weight": weight
        }
