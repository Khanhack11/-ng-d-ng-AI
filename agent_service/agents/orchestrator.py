import uuid
import time
from typing import Dict, Any, Optional, List
from ..message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel
from .analyst_agent import AnalystAgent
from .database_agent import DatabaseAgent
from .rag_agent import RagAgent
from .recommendation_agent import RecommendationAgent
from .reasoning_agent import ReasoningAgent
from .critic_agent import CriticAgent
from .response_agent import ResponseAgent
from ..utils.logger import get_agent_logger, log_audit_event

class OrchestratorAgent:
    """
    ORCHESTRATOR AGENT:
    - Tiếp nhận yêu cầu từ Flask Web API.
    - Điều phối toàn bộ vòng đời tác vụ qua Structured Message Bus.
    - Quản lý quy trình đa tác tử kết hợp Reflection Loop:
        Analyst Agent -> Database Agent (MySQL) + RAG Agent (Vector DB)
        -> Recommendation Agent (Phối đồ & Cross-sell)
        -> [Reflection Loop max_retries=2]:
             Reasoning Agent -> Critic Agent (Kiểm định)
             ├── ACCEPT -> Sang Response Agent
             └── REVISE -> Phản hồi Critic Feedback -> Tự sửa lỗi (Retry)
    """
    def __init__(self, bus: Optional[StructuredMessageBus] = None):
        self.bus = bus or StructuredMessageBus()
        self.agent_name = "OrchestratorAgent"
        self.logger = get_agent_logger("Orchestrator")

        # Khởi tạo các Agent chuyên biệt trong kiến trúc Multi-Agent
        self.analyst = AnalystAgent(self.bus)
        self.database_agent = DatabaseAgent(self.bus)
        self.rag_agent = RagAgent(self.bus)
        self.recommendation_agent = RecommendationAgent(self.bus)
        self.reasoning = ReasoningAgent(self.bus)
        self.critic = CriticAgent(self.bus)
        self.response_agent = ResponseAgent(self.bus)

    def handle_request(
        self,
        query: str,
        persona: str = "STYLIST",
        context: Optional[Dict[str, Any]] = None,
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        correlation_id = f"corr-{uuid.uuid4().hex[:8]}"

        self.logger.info(f"[{correlation_id}] Bat dau xu ly query='{query}' | persona={persona}")

        # Bước 1: Orchestrator phát lệnh khởi động tiến trình lên Message Bus
        init_msg = AgentMessage(
            sender=self.agent_name,
            recipient="StructuredMessageBus",
            channel=MessageChannel.ORCHESTRATOR,
            payload={"query": query, "persona": persona, "status": "STARTED"},
            correlation_id=correlation_id
        )
        self.bus.publish(init_msg)

        # Bước 2: Kích hoạt Analyst Agent phân tích câu hỏi (Intent & Entities)
        analysis = self.analyst.process(query, correlation_id=correlation_id, persona=persona, context=context)

        # Bước 3: Điều phối song song Database Agent (MySQL) và RAG Agent (Vector DB)
        db_data = self.database_agent.process(analysis, correlation_id=correlation_id)
        rag_data = self.rag_agent.process(
            query,
            correlation_id=correlation_id,
            filters=analysis.get("entities", {})
        )

        # Bước 4: Kích hoạt Recommendation Agent (Gợi ý phối đồ, Cross-sell)
        primary_products = db_data.get("products", []) or rag_data.get("product_hits", [])
        rec_data = self.recommendation_agent.process(
            primary_products=primary_products,
            correlation_id=correlation_id,
            occasion=analysis.get("entities", {}).get("occasion"),
            max_price=analysis.get("entities", {}).get("max_price"),
            intent=analysis.get("intent", "PRODUCT_SEARCH")
        )

        # Bước 5: Vòng lặp Phản biện Tự sửa lỗi (Reflection Loop / Retry Mechanism)
        max_retries = 2
        attempt = 0
        critic_result = None
        critic_feedback = None
        reflection_history: List[Dict[str, Any]] = []

        while attempt <= max_retries:
            # 5a. Reasoning Agent sinh giải pháp (tổng hợp CSDL + Vector DB + Gợi ý + Feedback)
            reasoning_output = self.reasoning.process(
                analysis=analysis,
                db_data=db_data,
                rag_data=rag_data,
                correlation_id=correlation_id,
                custom_api_key=custom_api_key,
                critic_feedback=critic_feedback,
                recommendation_data=rec_data
            )

            # 5b. Critic Agent kiểm định chéo
            critic_result = self.critic.evaluate(
                reasoning_output=reasoning_output,
                correlation_id=correlation_id
            )

            # 5c. Đánh giá kết quả kiểm định
            if critic_result.get("accepted", False):
                self.logger.info(
                    f"[{correlation_id}] Critic ACCEPT tai vong lap {attempt} "
                    f"(Quality Score: {critic_result.get('quality_score')})"
                )
                break
            else:
                attempt += 1
                critic_feedback = critic_result.get(
                    "actionable_feedback",
                    "Can dieu chinh san pham theo dung rang buoc."
                )
                reflection_history.append({
                    "attempt": attempt,
                    "feedback": critic_feedback,
                    "violations": critic_result.get("violations", [])
                })
                self.logger.warning(
                    f"[{correlation_id}] Critic REVISE tai vong lap {attempt}. Feedback: {critic_feedback}"
                )
                if attempt > max_retries:
                    self.logger.warning(f"[{correlation_id}] Da dat nguong {max_retries} lan retry. Tra ve ket qua khong co du lieu chua kiem chung.")
                    # Không mở cổng ACCEPT sau khi retry thất bại. Response Agent sẽ
                    # trả lời minh bạch và không hiển thị ứng viên chưa được kiểm chứng.
                    critic_result["accepted"] = False
                    critic_result["verified_products"] = []
                    critic_result["final_draft"] = (
                        "Xin lỗi, hiện tôi chưa tìm thấy dữ liệu sản phẩm phù hợp đã được kiểm chứng. "
                        "Bạn hãy thử điều chỉnh từ khóa hoặc ngân sách nhé."
                    )
                    break

        # Bước 6: Cổng ACCEPT -> Chuyển sang Response Agent định dạng kết quả
        final_output = self.response_agent.format_response(
            critic_result=critic_result or {},
            analysis_result=analysis,
            correlation_id=correlation_id,
            retry_count=len(reflection_history),
            reflection_history=reflection_history,
            cross_sell_items=rec_data.get("cross_sell_items", [])
        )

        elapsed_ms = (time.time() - start_time) * 1000
        self.logger.info(
            f"[{correlation_id}] Hoan tat xu ly trong {elapsed_ms:.1f}ms "
            f"(Retries: {len(reflection_history)} | Score: {critic_result.get('quality_score', 1.0)})"
        )

        # Ghi vết Audit Trail JSONL
        log_audit_event(
            correlation_id=correlation_id,
            query=query,
            persona=persona,
            agent_chain=[
                "AnalystAgent", "DatabaseAgent", "RagAgent",
                "RecommendationAgent", "ReasoningAgent", "CriticAgent", "ResponseAgent"
            ],
            retries=len(reflection_history),
            critic_verdict=critic_result.get("decision", "ACCEPT"),
            latency_ms=elapsed_ms,
            quality_score=critic_result.get("quality_score", 1.0),
            status="SUCCESS"
        )

        # Ghi vết kết thúc lên Message Bus
        complete_msg = AgentMessage(
            sender=self.agent_name,
            recipient="FlaskWebAPI",
            channel=MessageChannel.ORCHESTRATOR,
            payload={
                "status": "COMPLETED",
                "latency_ms": elapsed_ms,
                "retries": len(reflection_history),
                "summary": final_output.get("text", "")[:100]
            },
            correlation_id=correlation_id
        )
        self.bus.publish(complete_msg)

        # Đính kèm trace lịch sử bus vào kết quả
        output_copy = dict(final_output)
        output_copy["busTrace"] = self.bus.get_history(correlation_id=correlation_id)
        return output_copy
