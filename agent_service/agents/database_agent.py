from typing import Dict, Any
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel
from ..database.mysql_client import get_db_client

class DatabaseAgent:
    """
    Database Agent:
    - Chuyên trách tương tác với Cơ sở dữ liệu quan hệ MySQL.
    - Chuyển đổi tham số từ Analyst Agent thành truy vấn CSDL.
    - Đảm bảo an toàn dữ liệu và xử lý fallback nếu CSDL gián đoạn.
    """
    def __init__(self, bus: StructuredMessageBus):
        self.bus = bus
        self.agent_name = "DatabaseAgent"
        self.db = get_db_client()

    def process(self, analysis_result: Dict[str, Any], correlation_id: str) -> Dict[str, Any]:
        intent = analysis_result.get("intent", "PRODUCT_SEARCH")
        entities = analysis_result.get("entities", {})

        db_output = {
            "source": "MySQL" if self.db.is_connected else "MySQL_Fallback_Catalog",
            "products": [],
            "order": None
        }

        if intent == "ORDER_TRACKING":
            order_id = entities.get("order_id")
            if order_id:
                db_output["order"] = self.db.query_order(order_id)
        elif intent == "FASHION_OUTFIT":
            occasion = entities.get("occasion", "office")
            products = self.db.query_outfit(occasion)
            db_output["products"] = products
            db_output["occasion"] = occasion
        else:
            # Truy vấn sản phẩm theo bộ lọc
            products = self.db.query_products(
                keywords=entities.get("keywords"),
                max_price=entities.get("max_price"),
                min_price=entities.get("min_price"),
                category=entities.get("category"),
                sort_by=entities.get("sort_by"),
                limit=entities.get("limit", 6)
            )
            db_output["products"] = products

        # Phát thông điệp lên Message Bus
        msg = AgentMessage(
            sender=self.agent_name,
            recipient="OrchestratorAgent",
            channel=MessageChannel.DATABASE,
            payload=db_output,
            correlation_id=correlation_id
        )
        self.bus.publish(msg)

        return db_output
