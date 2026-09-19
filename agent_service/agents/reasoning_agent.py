from typing import Dict, Any, List, Optional
import requests
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel
from ..config import config

class ReasoningAgent:
    """
    Reasoning Agent:
    - Thu nhận dữ liệu từ Analyst Agent, Database Agent và RAG Agent qua Message Bus.
    - Tổng hợp thông tin, lập luận logic và tạo bản thảo giải pháp (Candidate Solution).
    - Chuyển tiếp đề xuất sang Critic Agent để kiểm định trước khi nghiệm thu.
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "ReasoningAgent"

    def process(
        self,
        analysis: Dict[str, Any],
        db_data: Dict[str, Any],
        rag_data: Dict[str, Any],
        correlation_id: str,
        custom_api_key: Optional[str] = None,
        critic_feedback: Optional[str] = None,
        recommendation_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        intent = analysis.get("intent", "PRODUCT_SEARCH")
        raw_query = analysis.get("raw_query", "")
        entities = analysis.get("entities", {})
        products = list(db_data.get("products", []))
        chroma_product_hits = rag_data.get("product_hits", [])
        order = db_data.get("order")
        rag_context = rag_data.get("context_text", "")

        draft_message = ""
        reasoning_logic = []
        outfit_combo = None
        cross_sell_items = []
        if recommendation_data:
            cross_sell_items = recommendation_data.get("cross_sell_items", [])
            if not outfit_combo and recommendation_data.get("outfit_combo"):
                outfit_combo = recommendation_data.get("outfit_combo")

        # Cơ chế Tự sửa lỗi (Self-Correction Reflection Loop) nếu nhận feedback từ Critic
        if critic_feedback:
            reasoning_logic.append(f"Reflection Loop: Nhận phản biện '{critic_feedback}' -> Tiến hành hiệu chỉnh ứng viên.")
            max_price = entities.get("max_price")
            if max_price:
                # Lọc bỏ triệt để sản phẩm vượt ngân sách
                products = [p for p in products if p.get("price", 0) <= max_price]
                # Nếu lọc xong bị rỗng, tìm kiếm lại trong ChromaDB với bộ lọc giá trần
                if not products:
                    from ..vector_db.chroma_store import get_vector_store
                    vs = get_vector_store()
                    fallback_products = vs.search_products(query=raw_query, top_k=4, max_price=max_price)
                    if fallback_products:
                        products = fallback_products
                        reasoning_logic.append(f"Đã truy xuất lại {len(products)} sản phẩm trong tầm giá <= {max_price:,}đ từ Vector DB.")

        # Hybrid Search: Hợp nhất sản phẩm từ CSDL SQL và Vector DB Chroma
        if intent in ("PRODUCT_SEARCH", "GENERAL"):
            if not products and chroma_product_hits:
                products = list(chroma_product_hits)
                reasoning_logic.append(f"Truy xuất {len(products)} sản phẩm tương đồng cao nhất từ ChromaDB Vector Database.")
            elif products and chroma_product_hits:
                existing_ids = {p.get("id") for p in products}
                added_count = 0
                for cp in chroma_product_hits:
                    if cp.get("id") not in existing_ids:
                        products.append(cp)
                        existing_ids.add(cp.get("id"))
                        added_count += 1
                if added_count > 0:
                    reasoning_logic.append(f"Hợp nhất Hybrid Search: {len(db_data.get('products', []))} từ CSDL + {added_count} từ ChromaDB Vector DB.")
                else:
                    reasoning_logic.append(f"Lọc được {len(products)} sản phẩm từ CSDL và đối chiếu khớp với ChromaDB.")

        # Sắp xếp và giới hạn số lượng sản phẩm theo entities
        sort_by = entities.get("sort_by")
        limit = entities.get("limit")

        if sort_by == "price_asc":
            products.sort(key=lambda x: float(x.get("price", 0)))
        elif sort_by == "price_desc":
            products.sort(key=lambda x: float(x.get("price", 0)), reverse=True)
        elif sort_by == "popularity_desc":
            products.sort(key=lambda x: float(x.get("soldCount", 0)), reverse=True)
        elif sort_by == "rating_desc":
            products.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)

        if limit and limit > 0:
            products = products[:limit]

        # TUYỆT ĐỐI KHÔNG sinh outfit_combo nếu intent không phải FASHION_OUTFIT
        if intent != "FASHION_OUTFIT":
            outfit_combo = None

        if intent == "ORDER_TRACKING":
            if order:
                draft_message = (
                    f"📦 Thông tin đơn hàng **{order['order_id']}**:\n"
                    f"- Người nhận: {order['customer_name']}\n"
                    f"- Trạng thái: **{order['status']}**\n"
                    f"- Đơn vị vận chuyển: {order['carrier']} (Mã vận đơn: `{order['tracking_code']}`)\n"
                    f"- Dự kiến giao: {order['expected_delivery']}\n"
                    f"- Sản phẩm: {order['items']} (Tổng tiền: {order['total_amount']:,}đ)"
                )
                reasoning_logic.append("Tìm thấy mã đơn trong MySQL và đối chiếu trạng thái thành công.")
            else:
                order_id_input = entities.get("order_id", "của bạn")
                draft_message = f"ZShop chưa tìm thấy thông tin đơn hàng `{order_id_input}` trên hệ thống. Bạn vui lòng kiểm tra lại mã đơn (ví dụ: ORD-2026-9812) hoặc liên hệ hotline 0901 234 567 để được hỗ trợ nhé!"
                reasoning_logic.append("Không tìm thấy mã đơn trong hệ thống CSDL.")

        elif intent == "POLICY_INQUIRY":
            if rag_context:
                draft_message = (
                    f"Dạ ZShop xin thông tin đến bạn:\n\n{rag_context}\n\n"
                    f"Nếu bạn cần thêm sự trợ giúp, đội ngũ ZShop luôn sẵn sàng hỗ trợ bạn qua Hotline 0901 234 567!"
                )
                reasoning_logic.append("Trích xuất thông tin chính xác từ Vector DB Chroma.")
            else:
                draft_message = "ZShop luôn hỗ trợ đổi trả miễn phí trong 7 ngày và freeship cho đơn hàng từ 300.000đ. Bạn cần thêm thông tin gì nữa không ạ?"
                reasoning_logic.append("Sử dụng chính sách cơ bản mặc định.")

        elif intent == "FASHION_OUTFIT":
            occasion = entities.get("occasion", "office")
            total_price = sum(p.get("price", 0) for p in products)
            discount_price = int(total_price * 0.9)

            if occasion == "office":
                outfit_title = "Set Đồ Smart Casual & Công Sở Thanh Lịch"
                outfit_style = "Smart Casual / Minimalist Office"
                outfit_occasion = "Đi làm hàng ngày, gặp đối tác, hội thảo chuyên nghiệp"
                outfit_desc = "Sự kết hợp giữa phom dáng đứng đắn của Áo Sơ Mi Lụa và Quần Tây Âu co giãn giúp bạn giữ vẻ ngoài chỉn chu suốt 8 tiếng mà không hề gò bó."
                draft_message = (
                    f"👗 **Stylist Emma** đã thiết kế riêng cho bạn **{outfit_title}** cực kỳ lịch lãm và chuẩn mực:\n"
                    f"- **Phong cách chủ đạo**: {outfit_style}\n"
                    f"- **Hoàn cảnh khuyên dùng**: {outfit_occasion}\n"
                    f"- **Lời khuyên phối đồ**: Áo sơ mi lụa chống nhăn đóng thùng cùng quần tây âu dáng Hàn Quốc, đi cùng giày sneaker trắng tạo điểm nhấn trẻ trung hoặc giày da lịch sự."
                )
            elif occasion == "streetwear":
                outfit_title = "Set Đồ Streetwear Năng Động Dạo Phố"
                outfit_style = "Urban Streetwear"
                outfit_occasion = "Đi chơi dạo phố cafe, dã ngoại cuối tuần"
                outfit_desc = "Phom dáng thoải mái phóng khoáng, mang lại năng lượng trẻ trung bứt phá."
                draft_message = (
                    f"👗 **Stylist Emma** gợi ý cho bạn **{outfit_title}**:\n"
                    f"- **Phong cách chủ đạo**: {outfit_style}\n"
                    f"- **Lời khuyên phối đồ**: Áo thun cotton mix cùng quần jeans slimfit và khoác ngoài áo hoodie unisex cá tính."
                )
            else:
                outfit_title = "Set Trang Phục Dạ Tiệc & Hẹn Hò Sang Trọng"
                outfit_style = "Luxury Chic"
                outfit_occasion = "Dự tiệc tối, sự kiện đặc biệt, hẹn hò lãng mạn"
                outfit_desc = "Tông màu thời thượng và chất liệu cao cấp tạo ấn tượng cuốn hút."
                draft_message = (
                    f"👗 **Stylist Emma** gợi ý cho bạn **{outfit_title}**:\n"
                    f"- **Phong cách chủ đạo**: {outfit_style}\n"
                    f"- **Lời khuyên phối đồ**: Áo polo lụa sang trọng phối cùng quần tây âu may đo và áo măng tô dạ dáng dài thanh lịch."
                )

            outfit_combo = {
                "id": f"combo-{occasion}-01",
                "title": outfit_title,
                "style": outfit_style,
                "occasion": outfit_occasion,
                "description": outfit_desc,
                "items": products,
                "totalPrice": total_price,
                "discountPrice": discount_price
            }
            reasoning_logic.append(f"Tạo thành công Lookbook Outfit Combo theo phong cách {occasion} với {len(products)} món đồ ăn ý.")

        elif intent == "FITTING_ADVICE":
            meas = entities.get("measurements", {})
            h = meas.get("height")
            w = meas.get("weight")
            recommended_size = "M"
            if w:
                if w < 55:
                    recommended_size = "S"
                elif 55 <= w <= 65:
                    recommended_size = "M"
                elif 65 < w <= 75:
                    recommended_size = "L"
                else:
                    recommended_size = "XL"
            
            detail_meas = f"Với chiều cao {h}cm và cân nặng {w}kg" if h and w else "Với số đo của bạn"
            oversize_val = 'XXL' if recommended_size == 'XL' else ('XL' if recommended_size == 'L' else 'L')
            draft_message = (
                f"📏 {detail_meas}, ZShop gợi ý bạn nên chọn **Size {recommended_size}** để mặc vừa vặn và tôn dáng nhất.\n"
                f"- Form Slimfit / Ôm: Giữ nguyên size **{recommended_size}**\n"
                f"- Form Oversize / Rộng rãi thoải mái: Bạn có thể chọn tăng 1 size thành **Size {oversize_val}** nhé!"
            )
            reasoning_logic.append(f"Áp dụng bảng quy đổi size thông minh: Gợi ý Size {recommended_size}.")

        else: # PRODUCT_SEARCH or GENERAL
            kw_str = ", ".join(entities.get("keywords", []))
            kw_desc = f" liên quan đến '{kw_str}'" if kw_str else ""
            if products:
                if sort_by == "price_asc" and len(products) == 1:
                    p = products[0]
                    orig_p_str = f" (tiết kiệm hơn so với giá gốc {p['originalPrice']:,}đ)" if p.get('originalPrice') and p['originalPrice'] > p['price'] else ""
                    draft_message = (
                        f"Dạ, sản phẩm có giá rẻ nhất hiện có tại ZShop là **{p.get('name')}** "
                        f"thuộc danh mục **{p.get('category')}** với mức giá chỉ **{p.get('price', 0):,}đ**{orig_p_str}.\n\n"
                        f"📌 **Thông tin chi tiết:**\n"
                        f"- Tình trạng: Còn hàng ({p.get('stock', 50)} sản phẩm sẵn sàng giao)\n"
                        f"- Đánh giá: ⭐ {p.get('rating', 4.8)}/5.0 ({p.get('soldCount', 0)} lượt đã mua)\n"
                        f"- Mô tả: {p.get('description', '')}"
                    )
                    reasoning_logic.append(f"Đã trích xuất chính xác 1 sản phẩm có giá rẻ nhất ({p.get('name')} - {p.get('price'):,}đ).")
                elif sort_by == "price_desc" and len(products) == 1:
                    p = products[0]
                    draft_message = (
                        f"Dạ, sản phẩm cao cấp / sang trọng nhất tại ZShop hiện có là **{p.get('name')}** "
                        f"thuộc danh mục **{p.get('category')}** với giá **{p.get('price', 0):,}đ**.\n\n"
                        f"- Đánh giá: ⭐ {p.get('rating', 4.9)}/5.0 ({p.get('soldCount', 0)} lượt mua)\n"
                        f"- Mô tả: {p.get('description', '')}"
                    )
                    reasoning_logic.append(f"Đã trích xuất sản phẩm cao cấp nhất ({p.get('name')}).")
                else:
                    count_text = f"{len(products)} sản phẩm" if len(products) > 1 else "1 sản phẩm"
                    draft_message = (
                        f"ZShop đã tìm thấy {count_text}{kw_desc} phù hợp nhất với yêu cầu của bạn. "
                        f"Tất cả đều cam kết chính hãng 100% với giá tốt nhất hôm nay:"
                    )
                    if not any("CSDL" in l or "ChromaDB" in l for l in reasoning_logic):
                        reasoning_logic.append(f"Lọc được {len(products)} sản phẩm phù hợp tiêu chí.")
            else:
                draft_message = (
                    f"Rất tiếc ZShop chưa tìm thấy sản phẩm khớp hoàn toàn với yêu cầu '{raw_query}'. "
                    f"Bạn có thể tham khảo thêm các sản phẩm hot đang bán chạy tại cửa hàng nhé!"
                )
                reasoning_logic.append("Không có sản phẩm nào thỏa mãn hoàn toàn bộ lọc.")

        # Tùy chọn nâng cao: Dùng Gemini LLM để tinh chỉnh văn phong nếu có API key
        api_key = custom_api_key or config.GEMINI_API_KEY
        if config.ENABLE_GEMINI_REFINEMENT and api_key and api_key.strip():
            llm_refined = self._refine_with_llm(raw_query, draft_message, products, rag_context, api_key)
            if llm_refined:
                draft_message = llm_refined
                reasoning_logic.append("Đã tinh chỉnh ngôn ngữ tự nhiên qua Gemini LLM.")

        reasoning_output = {
            "draft_message": draft_message,
            "candidate_products": products,
            "outfit_combo": outfit_combo,
            "cross_sell_items": cross_sell_items,
            "reasoning_logic": reasoning_logic,
            "intent": intent,
            "entities": entities
        }

        # Phát thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="CriticAgent",
            channel=MessageChannel.REASONING,
            payload=reasoning_output,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return reasoning_output

    def _refine_with_llm(self, query: str, base_answer: str, products: List[Dict[str, Any]], rag_context: str, api_key: str) -> Optional[str]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key.strip()}"
            prompt = (
                f"Bạn là Trợ lý AI ZShop bán hàng thông minh và lịch sự.\n"
                f"Khách hỏi: '{query}'\n"
                f"Ngữ cảnh Vector DB (nguồn sự thật duy nhất): {rag_context}\n"
                f"Danh sách sản phẩm gợi ý (chỉ được dùng đúng các trường này): {products}\n"
                f"Bản thảo trả lời: {base_answer}\n"
                f"Nhiệm vụ: Chỉ viết lại văn phong bằng tiếng Việt. Tuyệt đối không thêm, sửa hoặc suy diễn tên, ID, giá, tồn kho, rating, size, chính sách, thời gian hay cam kết. Nếu không có dữ liệu thì phải nói rõ là chưa có dữ liệu."
            )
            resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=4)
            if resp.status_code == 200:
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        except Exception:
            pass
        return None
