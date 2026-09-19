from typing import Dict, Any, List, Optional
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel

class ResponseAgent:
    """
    Response Agent:
    - Nhận dữ liệu đã qua cổng phê duyệt ACCEPT từ Critic Agent.
    - Định dạng câu trả lời hoàn thiện, đóng gói thẻ sản phẩm UI chuẩn hóa.
    - Chuẩn bị kết quả xuất bản gửi về cho Trình duyệt / User.
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "ResponseAgent"

    def format_response(
        self,
        critic_result: Dict[str, Any],
        analysis_result: Dict[str, Any],
        correlation_id: str,
        retry_count: int = 0,
        reflection_history: Optional[List[Dict[str, Any]]] = None,
        cross_sell_items: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        message_text = critic_result.get("final_draft", "")
        verified_products = critic_result.get("verified_products", [])
        intent = analysis_result.get("intent", "PRODUCT_SEARCH")

        # Chuẩn hóa sản phẩm theo interface ProductDetail của Frontend ZShop
        formatted_products: List[Dict[str, Any]] = []
        for p in verified_products:
            product = {
                "id": str(p.get("id")),
                "name": p.get("name", "Sản phẩm ZShop"),
                "price": int(p.get("price", 0)),
                "category": p.get("category", "Thời trang"),
                "description": p.get("description", "")
            }
            for field in ("stock", "rating", "image_url", "image", "sizes", "colors"):
                if field in p and p[field] is not None:
                    product[field] = p[field]
            if product.get("image_url") or product.get("image"):
                product["images"] = [product.get("image_url") or product.get("image")]
            formatted_products.append(product)

        # Chuẩn hóa gợi ý mua kèm (Cross-sell) từ Recommendation Agent
        formatted_cross_sell: List[Dict[str, Any]] = []
        if cross_sell_items:
            for cp in cross_sell_items:
                cross_sell = {
                    "id": str(cp.get("id")),
                    "name": cp.get("name", "Gợi ý mua kèm"),
                    "price": int(cp.get("price", 0)),
                    "category": cp.get("category", "")
                }
                if cp.get("image_url") or cp.get("image"):
                    cross_sell["image"] = cp.get("image_url") or cp.get("image")
                    cross_sell["image_url"] = cross_sell["image"]
                formatted_cross_sell.append(cross_sell)

        # Xác định tên kỹ năng hiển thị trên UI
        skill_name_map = {
            "FASHION_OUTFIT": "AI_FASHION_STYLIST",
            "ORDER_TRACKING": "TRACK_ORDER",
            "POLICY_INQUIRY": "POLICY_CONSULT",
            "FITTING_ADVICE": "AI_SMART_FITTING",
            "PRODUCT_SEARCH": "PRODUCT_SEARCH_RECOMMEND",
            "GENERAL_GREETING": "GENERAL_CONSULT"
        }
        skill_name = skill_name_map.get(intent, "PRODUCT_SEARCH_RECOMMEND")

        outfit_combo = critic_result.get("outfit_combo")
        if outfit_combo and "items" in outfit_combo:
            formatted_combo_items = []
            for item in outfit_combo["items"]:
                c_img = item.get("image_url") or item.get("image") or "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
                combo_item = {
                    "id": str(item.get("id")),
                    "name": item.get("name", "Sản phẩm ZShop"),
                    "price": int(item.get("price", 0)),
                    "category": item.get("category", "Thời trang"),
                    "image": c_img,
                    "image_url": c_img,
                    "images": [c_img],
                    "description": item.get("description", "")
                }
                for field in ("stock", "rating", "sizes", "colors"):
                    if field in item and item[field] is not None:
                        combo_item[field] = item[field]
                formatted_combo_items.append(combo_item)
            outfit_combo["items"] = formatted_combo_items

        suggested_actions = [
            "Xem cách phối đồ khác",
            "Tư vấn size cho tôi",
            "Chính sách đổi trả hàng"
        ]
        if outfit_combo:
            suggested_actions.insert(0, "Thêm cả combo vào giỏ hàng")

        skill_result_data = {
            "skill": skill_name,
            "message": message_text,
            "products": formatted_products,
            "suggestedActions": suggested_actions,
            "multiAgentTrace": {
                "architecture": "Flask + Orchestrator + Message Bus + 6 Agents (incl. Recommendation) + Critic Gate + Reflection Loop",
                "status": "APPROVED_BY_CRITIC",
                "qualityScore": critic_result.get("quality_score", 1.0),
                "critiqueNotes": critic_result.get("critique_notes", []),
                "reflectionRetries": retry_count,
                "reflectionHistory": reflection_history or [],
                "correlationId": correlation_id
            }
        }

        if formatted_cross_sell:
            skill_result_data["crossSellRecommendations"] = formatted_cross_sell

        if outfit_combo:
            skill_result_data["outfitCombo"] = outfit_combo

        final_response = {
            "text": message_text,
            "skillResult": skill_result_data
        }

        # Phát thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="Browser/User",
            channel=MessageChannel.RESPONSE,
            payload=final_response,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return final_response
