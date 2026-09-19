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
        if "iphone" in cat.lower():
            target_categories = ["Phụ Kiện Apple Chính Hãng"]
        elif "phụ kiện" in cat.lower() or "sạc" in cat.lower():
            target_categories = ["iPhone 16 Series", "iPhone 15 Series", "iPhone 14 Series", "iPhone 13 Series"]
        else:
            target_categories = ["Phụ Kiện Apple Chính Hãng"]

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
        Xây dựng Combo thiết bị & phụ kiện Apple chính hãng đồng bộ theo nhu cầu và ngân sách.
        """
        occasion = (occasion or "office").lower()
        top_item = None
        bottom_item = None
        accessory_item = None

        if "gaming" in occasion:
            title = "Combo iPhone Gaming Hiệu Năng Đỉnh Cao & AirPods Pro"
            style = "Pro Apple Gaming & Entertainment"
            desc = "Sự kết hợp giữa iPhone chip Apple A-Series Pro mượt mà, Cáp bọc dù siêu bền và Tai nghe AirPods Pro 2 chống ồn độ trễ thấp."
            top_item = self._find_by_id_or_keyword(["PHONE-035", "PHONE-040", "PHONE-034", "PHONE-030"])
            bottom_item = self._find_by_id_or_keyword(["APPLE-ACC-003", "APPLE-ACC-002"])
            accessory_item = self._find_by_id_or_keyword(["APPLE-ACC-007", "APPLE-ACC-009"])

        elif "creator" in occasion or "vlogger" in occasion:
            title = "Combo Sáng Tạo Nội Dung & Quay Phim Điện Ảnh Apple"
            style = "Apple Cinematic & Content Pro"
            desc = "iPhone Pro Max camera tiềm vọng 5x/10x quay phim Log chuẩn điện ảnh kết hợp Tai nghe AirPods Max và Sạc MagSafe từ tính."
            top_item = self._find_by_id_or_keyword(["PHONE-035", "PHONE-038", "PHONE-040", "PHONE-031"])
            bottom_item = self._find_by_id_or_keyword(["APPLE-ACC-008", "APPLE-ACC-007"])
            accessory_item = self._find_by_id_or_keyword(["APPLE-ACC-006", "APPLE-ACC-005"])

        elif "budget" in occasion or "tiết kiệm" in occasion or "cổ" in occasion:
            title = "Combo iPhone Tiết Kiệm & Phụ Kiện Cơ Bản (Starter Pack)"
            style = "Essential Apple Pack"
            desc = "Bộ ba tối ưu chi phí: iPhone máy phụ bền đẹp, Củ sạc Apple 20W chuẩn an toàn và Kính cường lực Apple Care+ Shield."
            top_item = self._find_by_id_or_keyword(["PHONE-003", "PHONE-005", "PHONE-007", "PHONE-013"])
            bottom_item = self._find_by_id_or_keyword(["APPLE-ACC-001", "APPLE-ACC-004"])
            accessory_item = self._find_by_id_or_keyword(["APPLE-ACC-010", "APPLE-ACC-009"])

        else: # office / doanh nhân / mặc định
            title = "Combo Doanh Nhân & Công Sở Đa Năng MagSafe"
            style = "Smart Executive Tech"
            desc = "iPhone Flagship kết hợp Củ sạc Apple 35W Dual sạc đồng thời máy & tai nghe, cùng Ốp lưng Apple Silicone MagSafe sang trọng."
            top_item = self._find_by_id_or_keyword(["PHONE-035", "PHONE-034", "PHONE-040", "PHONE-031"])
            bottom_item = self._find_by_id_or_keyword(["APPLE-ACC-002", "APPLE-ACC-001"])
            accessory_item = self._find_by_id_or_keyword(["APPLE-ACC-009", "APPLE-ACC-005", "APPLE-ACC-006"])

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
