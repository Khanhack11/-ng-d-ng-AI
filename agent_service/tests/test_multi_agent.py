import sys
from pathlib import Path
import pytest

# Thêm đường dẫn gốc dự án vào sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from agent_service.message_bus.bus import StructuredMessageBus, AgentMessage, MessageChannel
from agent_service.agents.analyst_agent import AnalystAgent
from agent_service.agents.database_agent import DatabaseAgent
from agent_service.agents.rag_agent import RagAgent
from agent_service.agents.critic_agent import CriticAgent
from agent_service.agents.orchestrator import OrchestratorAgent
from agent_service.app import app

def test_message_bus():
    bus = StructuredMessageBus()
    received = []

    def handler(msg: AgentMessage):
        received.append(msg.payload)

    bus.subscribe(MessageChannel.ANALYST, handler)
    msg = AgentMessage(
        sender="Tester",
        recipient="Analyst",
        channel=MessageChannel.ANALYST,
        payload={"data": "hello"}
    )
    bus.publish(msg)

    assert len(received) == 1
    assert received[0]["data"] == "hello"
    assert len(bus.get_history()) == 1

def test_analyst_agent_intent_and_price():
    bus = StructuredMessageBus()
    analyst = AnalystAgent(bus)

    res = analyst.process("Tìm cho tôi củ sạc nhanh GaN dưới 500k", correlation_id="test-1")
    assert res["intent"] == "PRODUCT_SEARCH"
    assert res["entities"]["max_price"] == 500000
    assert "củ sạc" in res["entities"]["keywords"] or "sạc" in res["entities"]["keywords"] or "gan" in res["entities"]["keywords"]

def test_database_agent():
    bus = StructuredMessageBus()
    db_agent = DatabaseAgent(bus)

    analysis_mock = {
        "intent": "PRODUCT_SEARCH",
        "entities": {
            "keywords": ["củ sạc"],
            "max_price": 15000000
        }
    }
    output = db_agent.process(analysis_mock, correlation_id="test-2")
    assert "products" in output
    assert len(output["products"]) > 0

def test_rag_agent_chroma():
    bus = StructuredMessageBus()
    rag_agent = RagAgent(bus)

    output = rag_agent.process("Chính sách đổi trả và bảo hành như thế nào?", correlation_id="test-3")
    assert "hits" in output
    assert len(output["hits"]) > 0
    assert "bảo hành" in output["context_text"].lower() or "đổi trả" in output["context_text"].lower()

def test_critic_agent_accept():
    bus = StructuredMessageBus()
    critic = CriticAgent(bus)

    reasoning_mock = {
        "draft_message": "Dưới đây là các củ sạc GaN phù hợp với bạn.",
        "candidate_products": [{"id": "CHARGER-001", "name": "Củ Sạc GaN 65W Ba Cổng", "price": 400000}],
        "entities": {"max_price": 500000},
        "intent": "PRODUCT_SEARCH"
    }
    res = critic.evaluate(reasoning_mock, correlation_id="test-4")
    assert res["decision"] == "ACCEPT"
    assert res["accepted"] is True
    assert res["quality_score"] >= 0.8
    assert len(res["verified_products"]) == 1

def test_orchestrator_end_to_end():
    orchestrator = OrchestratorAgent()
    result = orchestrator.handle_request("Tôi muốn mua củ sạc nhanh 65W giá dưới 500k")

    assert "text" in result
    assert "skillResult" in result
    assert result["skillResult"]["skill"] == "PRODUCT_SEARCH_RECOMMEND"
    assert len(result["skillResult"]["products"]) > 0
    assert result["skillResult"]["multiAgentTrace"]["status"] == "APPROVED_BY_CRITIC"
    assert len(result["busTrace"]) >= 5

def test_flask_api():
    client = app.test_client()

    # Test Health Check
    health = client.get('/api/health')
    assert health.status_code == 200
    assert health.json["components"]["orchestrator"] == "ACTIVE"

    # Test Chat Endpoint
    chat_resp = client.post('/api/chat', json={"text": "Tư vấn chính sách vận chuyển freeship"})
    assert chat_resp.status_code == 200
    data = chat_resp.json
    assert "freeship" in data["text"].lower() or "vận chuyển" in data["text"].lower()
    assert "skillResult" in data

def test_tech_combo_office_expert():
    client = app.test_client()
    resp = client.post('/api/chat', json={
        "text": "Combo sạc nhanh văn phòng đa thiết bị",
        "persona": "STYLIST"
    })
    assert resp.status_code == 200
    data = resp.json
    assert data["skillResult"]["skill"] == "AI_TECH_COMBO_EXPERT"
    assert "outfitCombo" in data["skillResult"]
    assert "công sở" in data["skillResult"]["outfitCombo"]["title"].lower() or "magsafe" in data["skillResult"]["outfitCombo"]["title"].lower()
    items = data["skillResult"]["outfitCombo"]["items"]
    item_names = [it["name"] for it in items]
    assert any("GaN" in name or "Sạc" in name or "Cáp" in name or "MagSafe" in name for name in item_names)

def test_chroma_vector_db_indexing():
    from agent_service.vector_db.chroma_store import get_vector_store
    store = get_vector_store()
    stats = store.get_collection_stats()

    assert stats["status"] == "ONLINE"
    assert stats["engine"] == "ChromaDB"
    assert stats["collections"]["zshop_products"] == 50
    assert stats["collections"]["zshop_knowledge"] >= 10
    assert stats["total_vectors"] >= 60

def test_chroma_semantic_product_search():
    from agent_service.vector_db.chroma_store import get_vector_store
    store = get_vector_store()

    # Truy vấn ngữ nghĩa 1: Tai nghe bluetooth
    tech_hits = store.search_products("tai nghe bluetooth chống ồn pin trâu", top_k=2)
    assert len(tech_hits) > 0
    assert "Tai Nghe" in tech_hits[0]["name"]
    assert tech_hits[0]["source"] == "VectorDB_Chroma"
    assert tech_hits[0]["similarity_score"] > 0.5

    # Truy vấn ngữ nghĩa 2: Lọc giá trần max_price
    cheap_chargers = store.search_products("củ sạc", top_k=3, max_price=500000)
    assert len(cheap_chargers) > 0
    for p in cheap_chargers:
        assert p["price"] <= 500000

def test_vector_db_api_endpoints():
    client = app.test_client()

    # Test GET /api/vector-db/status
    status_resp = client.get('/api/vector-db/status')
    assert status_resp.status_code == 200
    s_data = status_resp.json
    assert s_data["collections"]["zshop_products"] == 50

    # Test POST /api/vector-db/search
    search_resp = client.post('/api/vector-db/search', json={
        "query": "củ sạc nhanh GaN 65W",
        "type": "products",
        "top_k": 3
    })
    assert search_resp.status_code == 200
    sr_data = search_resp.json
    assert sr_data["total_hits"] > 0
    assert sr_data["hits"][0]["price"] > 0

def test_recommendation_agent_cross_sell():
    from agent_service.agents.recommendation_agent import RecommendationAgent
    bus = StructuredMessageBus()
    rec_agent = RecommendationAgent(bus)

    # Test Cross-sell: Mua Smartphone -> gợi ý củ sạc GaN / Cáp / Ốp
    primary = {"id": "PHONE-001", "name": "iPhone 16 Pro Max 256GB Titan Tự Nhiên", "category": "Điện Thoại"}
    cross_sell = rec_agent.recommend_cross_sell(primary, top_k=2)
    assert len(cross_sell) > 0
    # Không gợi ý lại đúng chiếc điện thoại đó
    assert all(it["id"] != primary["id"] for it in cross_sell)

    # Test Combo recommendation
    combo = rec_agent.recommend_outfit(occasion="office", max_price=2000000)
    assert "items" in combo
    assert len(combo["items"]) >= 2
    assert combo["totalPrice"] > 0

def test_critic_agent_revise_decision():
    from agent_service.agents.critic_agent import CriticAgent
    bus = StructuredMessageBus()
    critic = CriticAgent(bus)

    # Giả lập sản phẩm vi phạm ngân sách khách yêu cầu (ngân sách 200k, sản phẩm 30tr)
    reasoning_mock = {
        "draft_message": "Gợi ý smartphone cao cấp",
        "candidate_products": [{"id": "PHONE-001", "name": "iPhone 16 Pro Max", "price": 34990000}],
        "entities": {"max_price": 200000},
        "intent": "PRODUCT_SEARCH"
    }
    critic_res = critic.evaluate(reasoning_mock, correlation_id="test-revise-1")
    assert critic_res["decision"] == "REVISE"
    assert critic_res["accepted"] is False
    assert len(critic_res["violations"]) > 0
    assert "actionable_feedback" in critic_res

def test_critic_rejects_unverified_product_shape():
    bus = StructuredMessageBus()
    critic = CriticAgent(bus)

    result = critic.evaluate({
        "draft_message": "Tôi đã tìm thấy sản phẩm phù hợp.",
        "candidate_products": [{"name": "Sản phẩm tự sinh", "price": "không rõ"}],
        "entities": {},
        "intent": "PRODUCT_SEARCH"
    }, correlation_id="test-unverified-product")

    assert result["accepted"] is False
    assert result["verified_products"] == []

def test_retry_reflection_loop_orchestrator():
    orchestrator = OrchestratorAgent()
    # Query có ràng buộc giá: Orchestrator qua vòng lặp Reflection Loop phải trả về sản phẩm đạt chuẩn
    result = orchestrator.handle_request("Tìm cáp sạc giá dưới 100k")
    assert "skillResult" in result
    trace = result["skillResult"]["multiAgentTrace"]
    assert trace["status"] == "APPROVED_BY_CRITIC"
    products = result["skillResult"]["products"]
    if products:
        for p in products:
            assert p["price"] <= 100000

def test_logging_and_audit_endpoints():
    client = app.test_client()

    # Test GET /api/logs
    logs_resp = client.get('/api/logs?limit=10')
    assert logs_resp.status_code == 200
    assert "logs" in logs_resp.json
    assert len(logs_resp.json["logs"]) > 0

    # Test GET /api/audit-trail
    audit_resp = client.get('/api/audit-trail?limit=5')
    assert audit_resp.status_code == 200
    assert "events" in audit_resp.json
    assert len(audit_resp.json["events"]) > 0
    latest_event = audit_resp.json["events"][-1]
    assert "correlation_id" in latest_event
    assert "agent_chain" in latest_event

def test_benchmark_api():
    client = app.test_client()
    resp = client.get('/api/benchmark/run')
    assert resp.status_code == 200
    data = resp.json
    assert data["status"] == "COMPLETED"
    assert "metrics_comparison" in data
    assert "anti_hallucination_rate" in data["metrics_comparison"]

def test_cheapest_single_product_no_hallucination_outfit():
    """Kiểm tra chống ảo giác: Yêu cầu '1 sản phẩm giá rẻ nhất' phải trả đúng 1 sản phẩm rẻ nhất và KHÔNG có outfit_combo."""
    client = app.test_client()
    resp = client.post('/api/chat', json={
        "message": "tôi cần tìm 1 sản phẩm giá rẻ nhất",
        "persona": "STYLIST"
    })
    assert resp.status_code == 200
    data = resp.json
    skill_result = data.get("skillResult", {})
    products = skill_result.get("products", [])

    # 1. Phải trả về đúng 1 sản phẩm
    assert len(products) == 1
    # 2. Sản phẩm phải là món rẻ nhất trong cửa hàng (Miếng Dán Màn Hình Trong Suốt 25k)
    assert products[0]["price"] <= 35000
    # 3. Tuyệt đối không có outfitCombo (không ảo giác combo phụ kiện đắt tiền)
    assert skill_result.get("outfitCombo") is None
    # 4. Câu trả lời định dạng đúng trọng tâm
    assert "rẻ nhất" in data.get("text", "").lower()
