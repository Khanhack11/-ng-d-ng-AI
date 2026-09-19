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
        Gợi ý sản phẩm mua kèm hoàn hảo (Cross-sell Complementary):
        - Mua Áo -> gợi ý Quần + Giày
        - Mua Bàn phím cơ -> gợi ý Chuột + Tai nghe
        - Mua Đầm váy -> gợi ý Túi xách + Trang sức
        """
        cat = primary_product.get("category", "")
        name = primary_product.get("name", "").lower()
        p_id = primary_product.get("id")

        target_categories = []
        if "thời trang nam" in cat.lower() or "áo khoác" in cat.lower():
            if "áo" in name:
                target_categories = ["Giày dép", "Thời trang nam", "Đồng hồ & Trang sức"]
            elif "quần" in name:
                target_categories = ["Giày dép", "Thời trang nam", "Áo khoác & Hoodie"]
            else:
                target_categories = ["Giày dép", "Phụ kiện"]
        elif "thời trang nữ" in cat.lower():
            target_categories = ["Túi xách & Balo", "Đồng hồ & Trang sức", "Giày dép"]
        elif "thiết bị công nghệ" in cat.lower() or "phụ kiện" in cat.lower():
            target_categories = ["Thiết bị công nghệ & Phụ kiện", "Đồng hồ & Trang sức"]
        else:
            target_categories = ["Thời trang nam", "Phụ kiện"]

        recommendations = []
        for p in self.catalog:
            if p.get("id") == p_id:
                continue
            if p.get("category") in target_categories:
                # Không gợi ý lại cùng loại (vd áo đã mua thì không gợi ý thêm áo khác trong cross-sell)
                if "áo" in name and "áo" in p.get("name", "").lower():
                    continue
                if "quần" in name and "quần" in p.get("name", "").lower():
                    continue
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
        Xây dựng Combo trang phục 3 món chuẩn Stylist theo hoàn cảnh và ngân sách.
        """
        occasion = occasion.lower()
        top_item = None
        bottom_item = None
        accessory_item = None

        if "streetwear" in occasion or "dạo phố" in occasion:
            title = "Set Đồ Streetwear Cá Tính Dạo Phố"
            style = "Urban Streetwear"
            desc = "Phối áo thun cotton unisex cùng quần jeans rách gối và áo hoodie nỉ năng động."
            # Áo
            top_item = self._find_by_id_or_keyword(["HOODIE-001", "NAM-002", "NAM-006"])
            # Quần
            bottom_item = self._find_by_id_or_keyword(["NAM-003", "NAM-005"])
            # Giày / Phụ kiện
            accessory_item = self._find_by_id_or_keyword(["GIAY-001", "TECH-001"])

        elif "party" in occasion or "tiệc" in occasion or "hẹn hò" in occasion:
            title = "Set Dạ Tiệc & Hẹn Hò Sang Trọng"
            style = "Luxury Chic"
            desc = "Sự kết hợp đẳng cấp giữa Áo Polo Gucci / Sơ Mi Lụa cùng Quần Tây Âu và Măng Tô Dạ dáng dài."
            top_item = self._find_by_id_or_keyword(["NAM-001", "NAM-004"])
            bottom_item = self._find_by_id_or_keyword(["NAM-005", "KHOAC-004"])
            accessory_item = self._find_by_id_or_keyword(["WATCH-001", "GIAY-001"])

        else: # office / công sở
            title = "Set Đồ Smart Casual Công Sở Thanh Lịch"
            style = "Smart Casual Minimalist"
            desc = "Áo sơ mi lụa chống nhăn phối cùng quần âu Hàn Quốc và giày sneaker trắng thanh lịch."
            top_item = self._find_by_id_or_keyword(["NAM-004", "NAM-001"])
            bottom_item = self._find_by_id_or_keyword(["NAM-005"])
            accessory_item = self._find_by_id_or_keyword(["GIAY-001", "WATCH-001"])

        items = [item for item in [top_item, bottom_item, accessory_item] if item is not None]

        # Kiểm tra ngân sách: Nếu vượt max_price, tự động thay thế bằng sản phẩm tương đương giá thấp hơn
        if max_price:
            total = sum(it.get("price", 0) for it in items)
            if total > max_price:
                items = self._fit_outfit_to_budget(items, max_price)

        total_price = sum(it.get("price", 0) for it in items)
        discount_price = int(total_price * 0.9)

        return {
            "id": f"combo-{occasion}-opt",
            "title": title,
            "style": style,
            "occasion": occasion,
            "description": desc,
            "items": items,
            "totalPrice": total_price,
            "discountPrice": discount_price,
            "stylistBadge": "Được tuyển chọn bởi Stylist Emma & Recommendation Agent"
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
