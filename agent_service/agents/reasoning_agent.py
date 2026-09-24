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
            rec_combo = recommendation_data.get("outfit_combo") if recommendation_data else None
            combo_items = rec_combo.get("items", []) if (rec_combo and rec_combo.get("items")) else products
            total_price = sum(p.get("price", 0) for p in combo_items)
            discount_price = int(total_price * 0.9)

            if occasion == "gaming":
                outfit_title = "Combo Smartphone Gaming & Phụ Kiện Hiệu Năng Cao"
                outfit_style = "High Performance Gaming"
                outfit_occasion = "Chơi game đồ họa nặng, leo rank mượt mà không nóng máy"
                outfit_desc = "Sự kết hợp giữa Smartphone hiệu năng cao cùng Cáp sạc chữ L chống cấn tay và Tai nghe gaming độ trễ cực thấp 60ms."
                draft_message = (
                    f"🎮 **Alex TechPro** đề xuất cho bạn **{outfit_title}** tối ưu trải nghiệm chiến game:\n"
                    f"- **Phong cách thiết bị**: {outfit_style}\n"
                    f"- **Nhu cầu khuyên dùng**: {outfit_occasion}\n"
                    f"- **Chi tiết trang bị**: Smartphone chip mạnh + Cáp sạc gập chữ L 100W chơi game ngang tay không cấn + Tai nghe chống ồn độ trễ siêu thấp."
                )
            elif occasion == "creator":
                outfit_title = "Combo Sáng Tạo Nội Dung & Vlogger Chuyên Nghiệp"
                outfit_style = "Pro Content Creator"
                outfit_occasion = "Quay video 4K, livestream TikTok, chụp ảnh sáng tạo nội dung"
                outfit_desc = "Flagship camera đỉnh cao kết hợp Gimbal chống rung 3 trục AI và Sạc dự phòng siêu tốc 65W cho cả ngày quay ngoài trời."
                draft_message = (
                    f"🎬 **Alex TechPro** gợi ý cho bạn **{outfit_title}** cho nhà sáng tạo:\n"
                    f"- **Đặc điểm nổi bật**: {outfit_style}\n"
                    f"- **Trang bị chủ lực**: Điện thoại camera chuyên nghiệp chống rung OIS + Gimbal tracking khuôn mặt tự động + Pin dự phòng dung lượng lớn."
                )
            elif occasion == "budget":
                outfit_title = "Combo Phụ Kiện Cơ Bản Tiết Kiệm (Starter Pack)"
                outfit_style = "Essential Daily Pack"
                outfit_occasion = "Trang bị đầy đủ phụ kiện cần thiết cho điện thoại mới với chi phí tiết kiệm nhất"
                outfit_desc = "Củ sạc nhanh GaN 30W nhỏ gọn cùng Cáp bọc dù siêu bền 100W và Kính cường lực KingKong chống va đập."
                draft_message = (
                    f"⚡ **Alex TechPro** gợi ý **{outfit_title}** bảo vệ và sạc tối ưu cho máy:\n"
                    f"- **Ưu điểm**: Chi phí kinh tế, phụ kiện chính hãng 100%, bảo hành 12 tháng 1 đổi 1."
                )
            else: # office / doanh nhân
                outfit_title = "Combo Doanh Nhân & Công Sở Đa Năng MagSafe"
                outfit_style = "Smart Executive Tech"
                outfit_occasion = "Làm việc văn phòng, họp hành công tác, sạc đa thiết bị tiện lợi"
                outfit_desc = "Củ sạc GaN 65W 3 cổng sạc Laptop & Phone cùng lúc, kết hợp Ốp lưng MagSafe chống ố vàng và Pin dự phòng hít từ tính."
                draft_message = (
                    f"💼 **Alex TechPro** thiết kế riêng cho bạn **{outfit_title}** sang trọng và tiện lợi:\n"
                    f"- **Phong cách công nghệ**: {outfit_style}\n"
                    f"- **Tính năng nổi bật**: Củ sạc nhỏ gọn công suất lớn sạc được cả MacBook và iPhone, ốp lưng từ tính MagSafe cao cấp."
                )

            outfit_combo = {
                "id": rec_combo.get("id", f"combo-{occasion}-01") if rec_combo else f"combo-{occasion}-01",
                "title": rec_combo.get("title", outfit_title) if rec_combo else outfit_title,
                "style": rec_combo.get("style", outfit_style) if rec_combo else outfit_style,
                "occasion": outfit_occasion,
                "description": outfit_desc,
                "items": combo_items,
                "totalPrice": rec_combo.get("totalPrice", total_price) if rec_combo else total_price,
                "discountPrice": rec_combo.get("discountPrice", discount_price) if rec_combo else discount_price
            }
            products = combo_items
            reasoning_logic.append(f"Tạo thành công Combo công nghệ {outfit_combo['title']} với {len(combo_items)} thiết bị/phụ kiện đồng bộ.")

        elif intent == "SPECS_COMPATIBILITY":
            draft_message = (
                f"🔬 **Ken TechSpec** - Chuyên viên Tương thích & Thông số Kỹ thuật ZShop giải đáp:\n\n"
            )
            if rag_context:
                draft_message += f"{rag_context}\n\n"
            draft_message += (
                f"💡 **Khuyến nghị kỹ thuật:**\n"
                f"- iPhone 15/16 Series và Samsung S24 đều dùng cổng **USB Type-C**.\n"
                f"- Với Samsung, bạn nên chọn củ sạc hỗ trợ chuẩn **PPS 45W** để kích hoạt 'Super Fast Charging 2.0'.\n"
                f"- Với iPhone, củ sạc chuẩn **PD 20W - 35W** là tốc độ an toàn và bảo vệ pin tốt nhất.\n"
                f"Nếu cần test thử độ tương thích thực tế, bạn có thể ghé Showroom ZShop 12 Lê Lợi hoặc yêu cầu giao hỏa tốc 2h có hỗ trợ đổi trả 7 ngày nhé!"
            )
            reasoning_logic.append("Giải đáp chi tiết tương thích chuẩn sạc và cổng kết nối kỹ thuật.")

        elif intent == "FITTING_ADVICE":
            draft_message = (
                f"📏 **Ken TechSpec** tư vấn thông số kích thước & dung lượng:\n"
                f"- Nếu dùng thông thường, chụp ảnh cơ bản: Dung lượng **128GB - 256GB** là thoải mái.\n"
                f"- Nếu quay video 4K, chơi game nặng: Nên chọn **256GB - 512GB** trở lên.\n"
                f"- Kích thước màn hình: 6.1 inch nhỏ gọn một tay hoặc 6.7 - 6.8 inch giải trí đỉnh cao."
            )
            reasoning_logic.append("Tư vấn thông số dung lượng và kích thước thiết bị.")

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
        prompt = (
            f"Bạn là Trợ lý AI ZShop chuyên biệt về Điện thoại iPhone (từ iPhone 4 đến iPhone 18 Pro Max) hiểu chuẩn ngôn ngữ GenZ (18prm, 17prm, 16prm...).\n"
            f"Khách hỏi: '{query}'\n"
            f"Ngữ cảnh Vector DB (nguồn sự thật duy nhất): {rag_context}\n"
            f"Danh sách sản phẩm iPhone gợi ý (chỉ được dùng đúng các trường này): {products}\n"
            f"Bản thảo trả lời: {base_answer}\n"
            f"Nhiệm vụ: Trả lời tự nhiên, trẻ trung chuẩn GenZ bằng tiếng Việt, tuyệt đối bám sát dữ liệu Database ZShop (giá, cấu hình, tồn kho)."
        )
        for model_name in ("gemini-2.5-flash", "gemini-2.0-flash"):
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key.strip()}"
                resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=4)
                if resp.status_code == 200:
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"].strip()
            except Exception:
                continue
        return None

