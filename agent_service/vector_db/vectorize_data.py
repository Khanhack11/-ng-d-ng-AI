"""
Script Vector Hóa Toàn Bộ Dữ Liệu ZShop vào ChromaDB Vector Database.
Sử dụng:
    python agent_service/vector_db/vectorize_data.py
hoặc:
    python -m agent_service.vector_db.vectorize_data
"""
import sys
import os
import time
from pathlib import Path

# Đảm bảo mã hóa UTF-8 cho console Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Đảm bảo import được module agent_service
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from agent_service.vector_db.chroma_store import get_vector_store

def run_vectorization():
    print("=" * 70)
    print(">>> [ZShop Vector DB] KHỞI ĐỘNG TIẾN TRÌNH VECTOR HÓA DỮ LIỆU CHỨNG THỰC")
    print("=" * 70)

    start_time = time.time()
    store = get_vector_store()

    # Nạp / Cập nhật lại toàn bộ 50 sản phẩm
    print("\n[1] Đang vector hóa 50 sản phẩm từ all_50_products.json vào 'zshop_products'...")
    num_products = store.index_all_products()
    print(f"    -> Hoàn tất nạp {num_products} sản phẩm vào Vector Database.")

    # Lấy thống kê
    stats = store.get_collection_stats()
    elapsed = time.time() - start_time
    print("\n" + "-" * 70)
    print(">>> [THỐNG KÊ VECTOR DATABASE]")
    print(f"    - Engine:            {stats.get('engine')}")
    print(f"    - Trạng thái:        {stats.get('status')}")
    print(f"    - Thư mục lưu trữ:   {stats.get('persist_dir')}")
    print(f"    - Tri thức (kb):     {stats.get('collections', {}).get('zshop_knowledge')} documents")
    print(f"    - Sản phẩm catalog:  {stats.get('collections', {}).get('zshop_products')} products")
    print(f"    - Tổng số vectors:   {stats.get('total_vectors')} vectors")
    print(f"    - Thời gian xử lý:   {elapsed:.2f} giây")
    print("-" * 70)

    # Chạy thử nghiệm các câu truy vấn Semantic Search để kiểm chứng chất lượng Vector DB
    test_queries = [
        {"q": "áo sơ mi lụa công sở thoáng mát cao cấp", "type": "products"},
        {"q": "tai nghe bluetooth chống ồn pin trâu", "type": "products"},
        {"q": "đồng hồ nam mặt sapphire sang trọng dự tiệc", "type": "products"},
        {"q": "chính sách đổi trả hàng và freeship", "type": "knowledge"}
    ]

    print("\n>>> [DEMO KIỂM THỬ SEMANTIC SEARCH TRÊN CHROMADB]")
    for item in test_queries:
        query_text = item["q"]
        q_type = item["type"]
        print(f"\n? Query: '{query_text}' (Loại: {q_type.upper()})")

        if q_type == "products":
            hits = store.search_products(query_text, top_k=2)
            for idx, h in enumerate(hits, 1):
                print(f"   [{idx}] {h['name']} | Giá: {h['price']:,}đ | Similarity: {h['similarity_score']} (dist: {h['vector_distance']:.4f})")
                print(f"       -> Danh mục: {h['category']} | Mô tả: {h['description'][:70]}...")
        else:
            hits = store.search_knowledge(query_text, top_k=2)
            for idx, h in enumerate(hits, 1):
                topic = h.get("metadata", {}).get("topic", "N/A")
                content = h.get("content", "")[:90]
                dist = h.get("distance", 0.0)
                print(f"   [{idx}] Chủ đề: {topic} (dist: {dist:.4f})")
                print(f"       -> Nội dung: {content}...")

    print("\n" + "=" * 70)
    print(">>> [HOÀN TẤT] Dữ liệu đã được lưu trữ bền vững tại ChromaDB!")
    print("=" * 70)

if __name__ == "__main__":
    run_vectorization()
