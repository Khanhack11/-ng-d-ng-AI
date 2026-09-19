import os
import sys
from pathlib import Path

# Thêm đường dẫn gốc dự án vào PYTHONPATH
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

# Cấu hình UTF-8 cho Windows Console
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from agent_service.app import app
from agent_service.config import config

if __name__ == '__main__':
    print("=" * 65)
    print(">>> ZSHOP MULTI-AGENT RAG ARCHITECTURE ENGINE")
    print(f">>> Flask Web API Server: http://localhost:{config.PORT}")
    print(">>> Cac Agent hoat dong:")
    print("   1. ORCHESTRATOR AGENT")
    print("   2. Structured Message Bus")
    print("   3. Analyst Agent")
    print("   4. Database Agent (MySQL)")
    print("   5. RAG Agent (Vector DB - ChromaDB)")
    print("   6. Recommendation Agent (Outfit & Cross-sell)")
    print("   7. Reasoning Agent")
    print("   8. Critic Agent (ACCEPT Gate & Reflection Loop)")
    print("   9. Response Agent -> User")
    print("=" * 65)
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
