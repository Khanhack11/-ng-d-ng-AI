import json
import os
from typing import Dict, Any, List, Optional
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel
from ..vector_db.chroma_store import get_vector_store

class RecommendationAgent:
    """
    RECOMMENDATION AGENT:
    - Chuyên trách các thuật toán gợi ý cá nhân hóa, phối đồ thông minh (Outfit Matching).
    - Khám phá sản phẩm mua kèm (Cross-sell) & nâng cấp cao cấp (Up-sell).
    - Xếp hạng đa tiêu chí (Hybrid Scoring: Cosine Similarity + Rating + Popularity).
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "RecommendationAgent"
        self.vector_store = get_vector_store()
        self.catalog = self._load_catalog()

    def _load_catalog(self) -> List[Dict[str, Any]]:
        try:
            path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "all_50_products.json")
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception:
            pass
        return []

    def recommend_cross_sell(self, primary_product: Dict[str, Any], top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Gợi ý sản phẩm mua kèm hoàn hảo (Tech Cross-sell Complementary):
        - Mua Điện thoại -> Gợi ý Củ sạc nhanh GaN + Ốp lưng chống sốc / Cường lực
        - Mua Củ sạc -> Gợi ý Cáp sạc bọc dù bền bỉ
        - Mua Pin sạc dự phòng -> Gợi ý Cáp ngắn 0.25m + Củ sạc nạp
        - Mua Tai nghe -> Gợi ý Trạm sạc không dây 3-in-1
        """
        cat = primary_product.get("category", "")
        name = primary_product.get("name", "").lower()
        p_id = primary_product.get("id")

        target_categories = []
        if "điện thoại" in cat.lower():
            target_categories = ["Củ Sạc & Bộ Sạc Nhanh", "Ốp Lưng & Bao Da", "Kính Cường Lực & Dán Màn Hình"]
        elif "củ sạc" in cat.lower():
            target_categories = ["Cáp Sạc & Dây Cáp", "Pin Sạc Dự Phòng"]
        elif "cáp sạc" in cat.lower():
            target_categories = ["Củ Sạc & Bộ Sạc Nhanh", "Pin Sạc Dự Phòng"]
        elif "pin sạc" in cat.lower():
            target_categories = ["Cáp Sạc & Dây Cáp", "Củ Sạc & Bộ Sạc Nhanh"]
        elif "tai nghe" in cat.lower():
            target_categories = ["Giá Đỡ & Trạm Sạc", "Củ Sạc & Bộ Sạc Nhanh"]
        else:
            target_categories = ["Cáp Sạc & Dây Cáp", "Củ Sạc & Bộ Sạc Nhanh"]

        recommendations = []
        for p in self.catalog:
            if p.get("id") == p_id:
                continue
            if p.get("category") in target_categories:
                recommendations.append(p)
                if len(recommendations) >= top_k:
                    break

        return recommendations

    def recommend_outfit(
        self,
        occasion: str = "office",
        persona: str = "STYLIST",
        max_price: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Xây dựng Combo thiết bị & phụ kiện công nghệ đồng bộ theo nhu cầu và ngân sách.
        """
        occasion = (occasion or "office").lower()
        top_item = None
        bottom_item = None
        accessory_item = None

        if "gaming" in occasion:
            title = "Combo Smartphone Gaming & Phụ Kiện Độ Trễ Thấp"
            style = "High Performance Gaming"
            desc = "Sự phối hợp giữa Smartphone cấu hình mạnh, cáp sạc chữ L chống cấn tay và tai nghe gaming độ trễ siêu thấp."
            top_item = self._find_by_id_or_keyword(["PHONE-005", "PHONE-006", "PHONE-004"])
            bottom_item = self._find_by_id_or_keyword(["CABLE-005", "CHARGER-005"])
            accessory_item = self._find_by_id_or_keyword(["AUDIO-005", "POWER-003"])

        elif "creator" in occasion or "vlogger" in occasion:
            title = "Combo Sáng Tạo Nội Dung & Vlogger Chuyên Nghiệp"
            style = "Pro Content Creator"
            desc = "Trang bị Flagship camera siêu nét kết hợp Gimbal chống rung 3 trục AI và pin sạc dự phòng dung lượng lớn."
            top_item = self._find_by_id_or_keyword(["PHONE-001", "PHONE-003"])
            bottom_item = self._find_by_id_or_keyword(["STAND-002", "STAND-001"])
            accessory_item = self._find_by_id_or_keyword(["POWER-002", "AUDIO-001"])

        elif "budget" in occasion or "tiết kiệm" in occasion:
            title = "Combo Phụ Kiện Cơ Bản Tiết Kiệm (Starter Pack)"
            style = "Essential Daily Pack"
            desc = "Bộ ba phụ kiện không thể thiếu: Củ sạc nhanh 30W nhỏ gọn, Cáp sạc bọc dù chống đứt và Kính cường lực KingKong."
            top_item = self._find_by_id_or_keyword(["CHARGER-006", "CHARGER-003"])
            bottom_item = self._find_by_id_or_keyword(["CABLE-001", "CABLE-003"])
            accessory_item = self._find_by_id_or_keyword(["SCREEN-001", "CASE-006"])

        else: # office / doanh nhân / mặc định
            title = "Combo Doanh Nhân & Công Sở Đa Năng MagSafe"
            style = "Smart Executive Tech"
            desc = "Điện thoại cao cấp kết hợp Củ sạc GaN 65W 3 cổng sạc đồng thời Laptop/Phone và Ốp lưng MagSafe kháng ố vàng."
            top_item = self._find_by_id_or_keyword(["PHONE-002", "PHONE-003", "PHONE-001"])
            bottom_item = self._find_by_id_or_keyword(["CHARGER-001", "CHARGER-004"])
            accessory_item = self._find_by_id_or_keyword(["CASE-002", "POWER-001"])

        items = [item for item in [top_item, bottom_item, accessory_item] if item is not None]

        # Kiểm tra ngân sách: Nếu vượt max_price, tự động thay thế bằng sản phẩm tương đương giá thấp hơn
        if max_price:
            total = sum(it.get("price", 0) for it in items)
            if total > max_price:
                items = self._fit_outfit_to_budget(items, max_price)

        total_price = sum(it.get("price", 0) for it in items)
        discount_price = int(total_price * 0.9)

        return {
            "id": f"combo-{occasion}-tech",
            "title": title,
            "style": style,
            "occasion": occasion,
            "description": desc,
            "items": items,
            "totalPrice": total_price,
            "discountPrice": discount_price,
            "stylistBadge": "Được đề xuất bởi Chuyên Gia Công Nghệ Alex TechPro & Recommendation Agent"
        }

    def _find_by_id_or_keyword(self, candidate_ids: List[str]) -> Optional[Dict[str, Any]]:
        for cid in candidate_ids:
            for p in self.catalog:
                if p.get("id") == cid:
                    return dict(p)
        return None

    def _fit_outfit_to_budget(self, items: List[Dict[str, Any]], max_budget: float) -> List[Dict[str, Any]]:
        """Thuật toán tự động hạ giá sản phẩm trong combo để khớp ngân sách khách hàng."""
        adjusted = list(items)
        # Sắp xếp sản phẩm đắt nhất giảm dần để tìm món thay thế kinh tế hơn
        for idx, it in enumerate(adjusted):
            current_total = sum(x.get("price", 0) for x in adjusted)
            if current_total <= max_budget:
                break
            # Tìm sản phẩm cùng danh mục giá rẻ hơn
            cheaper = [p for p in self.catalog if p.get("category") == it.get("category") and p.get("price", 0) < it.get("price", 0)]
            if cheaper:
                cheaper.sort(key=lambda x: x.get("price", 0))
                adjusted[idx] = dict(cheaper[0])
        return adjusted

    def rank_products_hybrid(
        self,
        candidates: List[Dict[str, Any]],
        max_price: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Thuật toán Hybrid Scoring đa tiêu chí:
        Score = 0.5 * Similarity + 0.3 * (Rating / 5.0) + 0.2 * (Sold / 300)
        """
        ranked = []
        for p in candidates:
            price = float(p.get("price", 0))
            if max_price and price > max_price:
                continue

            sim = float(p.get("similarity_score", 0.7))
            rating_norm = float(p.get("rating", 4.5)) / 5.0
            sold_norm = min(1.0, float(p.get("soldCount", 50)) / 300.0)

            score = round(0.5 * sim + 0.3 * rating_norm + 0.2 * sold_norm, 4)
            p_copy = dict(p)
            p_copy["recommendation_score"] = score
            ranked.append(p_copy)

        ranked.sort(key=lambda x: x.get("recommendation_score", 0), reverse=True)
        return ranked

    def process(
        self,
        primary_products: List[Dict[str, Any]],
        correlation_id: str,
        occasion: Optional[str] = None,
        max_price: Optional[float] = None,
        intent: str = "PRODUCT_SEARCH"
    ) -> Dict[str, Any]:
        """Xử lý yêu cầu và phát thông điệp lên Message Bus."""
        cross_sell_items = []
        if primary_products and intent != "FASHION_OUTFIT":
            cross_sell_items = self.recommend_cross_sell(primary_products[0], top_k=2)

        outfit = None
        # CHỈ sinh outfit combo khi intent là FASHION_OUTFIT và có occasion rõ ràng
        if intent == "FASHION_OUTFIT" and occasion:
            outfit = self.recommend_outfit(occasion=occasion, max_price=max_price)

        rec_output = {
            "source": "RecommendationAgent",
            "cross_sell_items": cross_sell_items,
            "outfit_combo": outfit,
            "total_recommended": len(cross_sell_items)
        }

        # Bắn thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="ReasoningAgent",
            channel=MessageChannel.RECOMMENDATION,
            payload=rec_output,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return rec_output
