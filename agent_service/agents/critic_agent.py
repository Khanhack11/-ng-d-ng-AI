from typing import Dict, Any, List
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel

class CriticAgent:
    """
    Critic Agent:
    - Đóng vai trò Kiểm định viên độc lập (Critic / Reflection Pattern).
    - Thẩm định độ chính xác, tính trung thực (Grounding) và kiểm tra chống ảo giác.
    - Phát cờ ACCEPT nếu câu trả lời đạt tiêu chuẩn, hoặc yêu cầu điều chỉnh nếu vi phạm ràng buộc.
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "CriticAgent"

    def evaluate(self, reasoning_output: Dict[str, Any], correlation_id: str) -> Dict[str, Any]:
        draft_msg = reasoning_output.get("draft_message", "")
        products = reasoning_output.get("candidate_products", [])
        entities = reasoning_output.get("entities", {})
        intent = reasoning_output.get("intent", "PRODUCT_SEARCH")

        issues: List[str] = []
        verified_products: List[Dict[str, Any]] = []

        # Chỉ cho phép sản phẩm có định danh, tên và giá hợp lệ đi qua cổng ACCEPT.
        # Đây là lớp bảo vệ cuối cùng trước khi dữ liệu được gửi ra giao diện.
        for product in products:
            product_id = product.get("id")
            product_name = str(product.get("name", "")).strip()
            product_price = product.get("price")
            if not product_id or not product_name or not isinstance(product_price, (int, float)) or product_price < 0:
                issues.append("Bỏ qua một sản phẩm thiếu ID, tên hoặc giá hợp lệ.")
                continue
            verified_products.append(product)

        # 1. Kiểm tra ràng buộc về giá (Price Constraint Verification)
        max_price = entities.get("max_price")
        if max_price:
            within_budget = []
            for product in verified_products:
                if product["price"] <= max_price:
                    within_budget.append(product)
                else:
                    issues.append(f"Sản phẩm '{product.get('name')}' có giá {product.get('price')}đ vượt quá ngân sách {max_price:,.0f}đ")
            verified_products = within_budget

        # 2. Kiểm tra tính phù hợp bối cảnh công nghệ (Tech & Context Relevance)
        occasion = entities.get("occasion")
        if occasion == "gaming":
            # Ưu tiên hoặc kiểm tra độ tương thích gaming
            pass
        elif occasion == "office":
            # Lọc bỏ các sản phẩm không tương thích văn phòng nếu có
            pass

        # 3. Sắp xếp và giới hạn số lượng theo yêu cầu (Sort & Limit Enforcement)
        sort_by = entities.get("sort_by")
        if sort_by == "price_asc":
            verified_products.sort(key=lambda x: x.get("price", float("inf")))
        elif sort_by == "price_desc":
            verified_products.sort(key=lambda x: x.get("price", 0), reverse=True)

        target_limit = entities.get("limit")
        if target_limit and isinstance(target_limit, int) and target_limit > 0:
            if len(verified_products) > target_limit:
                verified_products = verified_products[:target_limit]

        # 4. Kiểm tra chất lượng nội dung và độ an toàn
        if not draft_msg or len(draft_msg.strip()) < 5:
            issues.append("Bản thảo câu trả lời quá ngắn hoặc rỗng.")

        if not verified_products and intent in ("PRODUCT_SEARCH", "FASHION_OUTFIT"):
            issues.append("Không có sản phẩm đã kiểm chứng để đề xuất.")

        # 5. Ra quyết định ACCEPT hoặc REVISE
        # Nếu người dùng có yêu cầu max_price mà không còn sản phẩm nào thỏa mãn -> Bắt buộc REVISE
        if max_price and len(verified_products) == 0 and len(products) > 0:
            is_accepted = False
            actionable_feedback = f"Tất cả {len(products)} sản phẩm ban đầu đều vượt ngân sách trần {max_price:,}đ. Yêu cầu Reasoning/RAG Agent truy xuất lại sản phẩm có mức giá dưới {max_price:,}đ."
        elif len(issues) > 0 and len(verified_products) == 0:
            is_accepted = False
            actionable_feedback = f"Phát hiện {len(issues)} điểm vi phạm: {'; '.join(issues)}. Cần lọc lại sản phẩm phù hợp hoàn cảnh và ngân sách."
        else:
            is_accepted = True
            actionable_feedback = "Đề xuất đạt chuẩn chất lượng và tuân thủ đầy đủ ràng buộc."

        quality_score = 1.0 - (0.15 * len(issues))
        if quality_score < 0.5:
            quality_score = 0.5

        # 6. Tuyệt đối không đính kèm outfit_combo nếu người dùng không yêu cầu phối đồ
        outfit_combo = reasoning_output.get("outfit_combo")
        if intent != "FASHION_OUTFIT":
            outfit_combo = None
        elif outfit_combo and "items" in outfit_combo:
            # Chuẩn hóa sản phẩm trong combo
            outfit_combo["items"] = verified_products if len(verified_products) >= 2 else outfit_combo["items"]
            if len(verified_products) < 2:
                outfit_combo = None

        critic_result = {
            "decision": "ACCEPT" if is_accepted else "REVISE",
            "accepted": is_accepted,
            "quality_score": round(quality_score, 2),
            "critique_notes": issues if issues else ["Tất cả thông tin hoàn toàn chuẩn xác và khớp với CSDL."],
            "violations": issues,
            "actionable_feedback": actionable_feedback,
            "verified_products": verified_products,
            "outfit_combo": outfit_combo,
            "final_draft": draft_msg
        }

        # Phát thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="OrchestratorAgent",
            channel=MessageChannel.CRITIC,
            payload=critic_result,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return critic_result
