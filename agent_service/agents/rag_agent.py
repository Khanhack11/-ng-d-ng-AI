from typing import Dict, Any, Optional
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel
from ..vector_db.chroma_store import get_vector_store

class RagAgent:
    """
    RAG Agent:
    - Chuyên trách kết nối và truy vấn Vector Database (ChromaDB).
    - Thực hiện Semantic Search tìm kiếm chính sách cửa hàng và thông tin hỗ trợ khách hàng ('zshop_knowledge').
    - Thực hiện Semantic Product Retrieval tìm kiếm sản phẩm theo ngữ nghĩa ('zshop_products').
    - Cung cấp ngữ cảnh tham chiếu phi ảo giác cho Reasoning Agent.
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "RagAgent"
        self.vector_store = get_vector_store()

    def process(
        self,
        query: str,
        correlation_id: str,
        top_k: int = 2,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        filters = filters or {}
        max_price = filters.get("max_price")
        category = filters.get("category")

        # 1. Truy vấn Semantic Search trên tri thức chính sách cửa hàng
        knowledge_hits = self.vector_store.search_knowledge(query, top_k=top_k)

        # 2. Truy vấn Semantic Search trên danh mục 50 sản phẩm ChromaDB
        product_hits = self.vector_store.search_products(
            query=query,
            top_k=max(filters.get("limit", 4), 4),
            category=category,
            max_price=max_price,
            sort_by=filters.get("sort_by")
        )

        context_lines = []
        if knowledge_hits:
            context_lines.extend([f"[Chính sách] {h['content']}" for h in knowledge_hits])
        if product_hits:
            p_summaries = [
                f"[Sản phẩm Vector DB] {p['name']} ({p['category']}) - Giá: {p['price']:,}đ (Độ khớp ngữ nghĩa: {int(p.get('similarity_score', 0)*100)}%)"
                for p in product_hits[:3]
            ]
            context_lines.extend(p_summaries)

        rag_output = {
            "source": "VectorDB_Chroma",
            "hits": knowledge_hits, # Giữ tương thích ngược
            "knowledge_hits": knowledge_hits,
            "product_hits": product_hits,
            "context_text": "\n---\n".join(context_lines)
        }

        # Phát thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="OrchestratorAgent",
            channel=MessageChannel.RAG,
            payload=rag_output,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return rag_output

