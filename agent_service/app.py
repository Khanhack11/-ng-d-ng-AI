from flask import Flask, request, jsonify, make_response
from .config import config
from .agents.orchestrator import OrchestratorAgent
from .message_bus.bus import StructuredMessageBus
from .database.mysql_client import get_db_client
from .vector_db.chroma_store import get_vector_store

app = Flask(__name__)

# Khởi tạo Message Bus và Orchestrator Agent toàn cục
message_bus = StructuredMessageBus()
orchestrator = OrchestratorAgent(bus=message_bus)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        return response

@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return response

@app.route('/api/health', methods=['GET'])
def health_check():
    db = get_db_client()
    vs = get_vector_store()
    stats = vs.get_collection_stats()
    return jsonify({
        "status": "healthy",
        "service": "Flask Multi-Agent RAG Service",
        "components": {
            "orchestrator": "ACTIVE",
            "message_bus": "ACTIVE",
            "mysql": "CONNECTED" if db.is_connected else "FALLBACK_IN_MEMORY",
            "chroma_vector_db": f"ACTIVE ({stats.get('total_vectors', 0)} vectors across {len(stats.get('collections', {}))} collections)"
        },
        "vector_db": stats
    })

@app.route('/api/vector-db/status', methods=['GET'])
def get_vector_db_status():
    """Lấy trạng thái và thống kê số lượng vector của ChromaDB."""
    vs = get_vector_store()
    return jsonify(vs.get_collection_stats())

@app.route('/api/vector-db/reindex', methods=['POST'])
def reindex_vector_db():
    """Kích hoạt nạp lại toàn bộ vector vào ChromaDB."""
    vs = get_vector_store()
    count = vs.index_all_products()
    return jsonify({
        "status": "SUCCESS",
        "message": f"Đã vector hóa thành công {count} sản phẩm vào ChromaDB.",
        "stats": vs.get_collection_stats()
    })

@app.route('/api/vector-db/search', methods=['POST'])
def search_vector_db():
    """Thực hiện truy vấn Semantic Search thử nghiệm trên ChromaDB."""
    data = request.get_json(force=True, silent=True) or {}
    query = data.get("query", "").strip()
    q_type = data.get("type", "products")
    top_k = int(data.get("top_k", 5))
    category = data.get("category")
    max_price = data.get("max_price")
    min_price = data.get("min_price")

    if not query:
        return jsonify({"error": "Vui lòng cung cấp tham số 'query'"}), 400

    vs = get_vector_store()
    if q_type == "knowledge":
        hits = vs.search_knowledge(query, top_k=top_k)
    else:
        hits = vs.search_products(
            query=query,
            top_k=top_k,
            category=category,
            max_price=max_price,
            min_price=min_price
        )

    return jsonify({
        "query": query,
        "type": q_type,
        "total_hits": len(hits),
        "hits": hits
    })

@app.route('/api/logs', methods=['GET'])
def get_system_logs():
    """Lấy danh sách các dòng log gần nhất của hệ thống Multi-Agent."""
    from .utils.logger import get_recent_logs
    limit = int(request.args.get('limit', 50))
    logs = get_recent_logs(limit=limit)
    return jsonify({
        "limit": limit,
        "total": len(logs),
        "logs": logs
    })

@app.route('/api/audit-trail', methods=['GET'])
def get_audit_trail_endpoint():
    """Lấy danh sách sự kiện audit trail JSONL gần nhất."""
    from .utils.logger import get_recent_audit_trail
    limit = int(request.args.get('limit', 20))
    events = get_recent_audit_trail(limit=limit)
    return jsonify({
        "limit": limit,
        "total": len(events),
        "events": events
    })

@app.route('/api/benchmark/run', methods=['GET', 'POST'])
def run_benchmark_endpoint():
    """Chạy bài benchmark so sánh định lượng Single-Agent vs Multi-Agent."""
    from .evaluation.benchmark import run_benchmark
    report = run_benchmark()
    return jsonify(report)

@app.route('/api/agent/architecture', methods=['GET'])
def get_architecture():
    """
    Trả về cấu trúc sơ đồ mô hình và trạng thái của từng Agent trong hệ thống
    """
    return jsonify({
        "model": "Multi-Agent System with Critic Pattern, Reflection Loop & Structured Message Bus",
        "layers": {
            "client": "Browser (React 19 + TypeScript)",
            "api_gateway": "Flask Web API",
            "orchestrator": "ORCHESTRATOR AGENT",
            "message_bus": "Structured Message Bus",
            "worker_agents": [
                {"name": "Analyst Agent", "role": "Ý định & Bóc tách thực thể"},
                {"name": "Database Agent", "role": "Truy vấn CSDL quan hệ (MySQL)"},
                {"name": "RAG Agent", "role": "Truy vấn Vector DB (ChromaDB)"},
                {"name": "Recommendation Agent", "role": "Gợi ý phối đồ, Cross-sell & Up-sell"},
                {"name": "Reasoning Agent", "role": "Tư duy tổng hợp & Đề xuất giải pháp"},
                {"name": "Critic Agent", "role": "Thẩm định, kiểm tra chéo & Ra quyết định ACCEPT / REVISE"}
            ],
            "reflection_loop": {
                "enabled": True,
                "max_retries": 2,
                "mechanism": "Self-Correction via Actionable Critic Feedback"
            },
            "decision_gate": "ACCEPT",
            "output_agent": "Response Agent",
            "end_user": "User"
        }
    })

@app.route('/api/chat', methods=['POST'])
def handle_chat():
    """
    Endpoint chính tiếp nhận yêu cầu từ Browser (ChatBot UI)
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        
        # Hỗ trợ cả định dạng messages mảng hoặc chuỗi text đơn
        query = ""
        if "messages" in data and isinstance(data["messages"], list) and len(data["messages"]) > 0:
            query = data["messages"][-1].get("text", "")
        if not query:
            query = data.get("text", "") or data.get("query", "") or data.get("message", "")

        query = query.strip()
        if not query:
            return jsonify({
                "text": "Xin chào! Tôi là Trợ lý Multi-Agent AI ZShop. Tôi có thể hỗ trợ gì cho bạn?",
                "skillResult": {
                    "skill": "GENERAL_CONSULT",
                    "message": "Xin chào! Tôi là Trợ lý Multi-Agent AI ZShop. Tôi có thể hỗ trợ gì cho bạn?",
                    "products": []
                }
            })

        context = data.get("context", {})
        api_key = data.get("apiKey", "")
        persona = data.get("persona") or data.get("mode") or "STYLIST"

        # Chuyển tiếp tới Orchestrator Agent để phân phối công việc qua Message Bus
        result = orchestrator.handle_request(
            query=query,
            persona=persona,
            context=context,
            custom_api_key=api_key
        )

        return jsonify(result)

    except Exception as e:
        print(f"[Flask API Error] {e}")
        return jsonify({
            "text": "Hệ thống Agent đang xử lý dữ liệu. Vui lòng gửi lại câu hỏi sau giây lát!",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print(f"[Flask] Khoi dong Flask Multi-Agent Server tai http://{config.HOST}:{config.PORT}...")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
