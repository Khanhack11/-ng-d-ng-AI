import os
import json
from typing import List, Dict, Any, Optional
import chromadb
from ..config import config

KNOWLEDGE_DOCS = [
    {
        "id": "kb-warranty-tech",
        "topic": "Chính sách bảo hành điện tử chính hãng và lỗi 1 đổi 1",
        "content": "Chính sách bảo hành ZShop: 100% điện thoại và phụ kiện được bảo hành điện tử chính hãng từ 12 đến 24 tháng theo số IMEI hoặc Serial Number. Đặc biệt áp dụng chính sách 'LỖI 1 ĐỔI 1 TRONG 30 NGÀY ĐẦU' nếu thiết bị phát sinh lỗi phần cứng từ nhà sản xuất. Khách hàng chỉ cần đọc số điện thoại đặt hàng, không cần giữ lại hóa đơn giấy."
    },
    {
        "id": "kb-compatibility-return",
        "topic": "Chính sách đổi trả phụ kiện không tương thích trong 7 ngày",
        "content": "Chính sách đổi trả: ZShop hỗ trợ đổi trả MIỄN PHÍ trong vòng 7 ngày nếu phụ kiện (củ sạc, cáp sạc, ốp lưng, kính cường lực) không tương thích với thiết bị của bạn hoặc không vừa kích thước. Khách hàng được hoàn tiền 100% hoặc đổi sang mã phụ kiện tương thích. Shipper ZShop Express sẽ hỗ trợ lấy hàng tận nơi."
    },
    {
        "id": "kb-shipping-express",
        "topic": "Giao hàng hỏa tốc 2 giờ và freeship toàn quốc",
        "content": "Chính sách vận chuyển: Miễn phí vận chuyển (FREESHIP) toàn quốc cho mọi đơn hàng từ 300.000đ trở lên. Đối với khách hàng cần gấp củ sạc, cáp hoặc pin sạc dự phòng, ZShop cung cấp dịch vụ 'GIAO HỎA TỐC 2 GIỜ' trong khu vực nội thành với phí cố định chỉ 35.000đ."
    },
    {
        "id": "kb-trade-in-policy",
        "topic": "Chương trình Thu cũ Đổi mới (Trade-in) trợ giá lên đời máy",
        "content": "Chương trình Thu cũ Đổi mới (Trade-in): ZShop hỗ trợ thu mua điện thoại cũ lên đời iPhone 16/15 hoặc Samsung S24 Series với mức trợ giá thêm lên tới 2.000.000đ. Đội ngũ kỹ thuật viên hỗ trợ sao lưu chuyển toàn bộ dữ liệu, danh bạ, ảnh sang máy mới hoàn toàn miễn phí tại chỗ."
    },
    {
        "id": "kb-charging-standards",
        "topic": "Hướng dẫn chuẩn sạc nhanh Power Delivery (PD), PPS và MagSafe",
        "content": "Tư vấn chuẩn sạc nhanh: iPhone 15/16 hỗ trợ sạc nhanh chuẩn Power Delivery (PD) tối ưu ở mức 20W - 35W qua cổng Type-C. Dòng Samsung Galaxy S24/S23 Ultra yêu cầu củ sạc hỗ trợ chuẩn PPS (Super Fast Charging 2.0) đạt công suất tối đa 45W. Sạc không dây từ tính MagSafe và Qi2 hỗ trợ công suất chuẩn 15W hít chắc vào lưng máy."
    },
    {
        "id": "kb-port-compatibility",
        "topic": "Phân biệt cổng kết nối Type-C và Lightning trên các dòng máy",
        "content": "Tương thích cổng kết nối: Toàn bộ iPhone 15 Series, iPhone 16 Series, các dòng điện thoại Samsung Galaxy, Xiaomi và iPad mới đều đã chuyển đổi đồng bộ sang cổng USB Type-C. Cổng Lightning chỉ sử dụng cho các dòng iPhone 14 Series trở về trước và một số dòng phụ kiện AirPods cũ."
    },
    {
        "id": "kb-screen-protector-guide",
        "topic": "Hướng dẫn chọn kính cường lực và dán bảo vệ màn hình",
        "content": "Tư vấn miếng dán: Kính cường lực KingKong Chống Nhìn Trộm (Privacy) có góc nghiêng 28 độ chống soi thông tin nơi công cộng; Kính Hoda Sapphire đạt độ cứng 9H chống trầy xước chìa khóa; Miếng dán dẻo PPF tự phục hồi vết xước dăm khi gặp nhiệt độ ấm thích hợp dán viền và mặt lưng máy trần."
    },
    {
        "id": "kb-case-protection",
        "topic": "Hướng dẫn chọn ốp lưng chống sốc và ốp MagSafe",
        "content": "Tư vấn ốp lưng: Ốp UAG Monarch chuẩn quân đội chống va đập rơi rớt ở độ cao 5 mét; Ốp trong suốt MagSafe phủ nano kháng tia UV chống ố vàng 6 tháng khoe trọn màu máy sang trọng; Ốp Liquid Silicone mềm mịn chống bám mồ hôi và dấu vân tay hiệu quả."
    },
    {
        "id": "kb-payment-methods",
        "topic": "Phương thức thanh toán và trả góp 0% lãi suất",
        "content": "Phương thức thanh toán: Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của 25 ngân hàng, thanh toán quét mã VietQR Napas 24/7 xác nhận đơn tức thì, ví MoMo, ZaloPay và thanh toán tiền mặt COD (được mở hộp đồng kiểm tra máy và phụ kiện trước khi thanh toán)."
    },
    {
        "id": "kb-store-hotline",
        "topic": "Trung tâm trải nghiệm công nghệ ZShop và hotline hỗ trợ kỹ thuật",
        "content": "Trung tâm công nghệ ZShop Flagship: 12 Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh. Khách hàng được trải nghiệm trực tiếp máy demo và phụ kiện sạc thử tại bàn. Hotline kỹ thuật & CSKH: 0901 234 567 (hỗ trợ 8h00 - 22h00 hàng ngày)."
    }
]

class ChromaStore:
    """
    Quản lý Vector Database (ChromaDB) phục vụ RAG Agent.
    Quản lý 2 Collections:
      1. 'zshop_knowledge': Lưu chính sách, hướng dẫn size, phong cách phối đồ.
      2. 'zshop_products': Toàn bộ 50 sản phẩm ZShop phục vụ Semantic Product Search.
    """
    def __init__(self):
        os.makedirs(config.CHROMA_PERSIST_DIR, exist_ok=True)
        self.client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
        
        # Collection 1: Tri thức cửa hàng
        self.knowledge_collection = self.client.get_or_create_collection(
            name="zshop_knowledge",
            metadata={"hnsw:space": "cosine", "description": "ZShop Policies & Store Knowledge"}
        )

        # Collection 2: Danh mục 50 sản phẩm
        self.products_collection = self.client.get_or_create_collection(
            name="zshop_products",
            metadata={"hnsw:space": "cosine", "description": "ZShop 50 Catalog Products"}
        )

        self._seed_data_if_needed()

    def _seed_data_if_needed(self):
        """Khởi tạo hoặc cập nhật vector data khi khởi động."""
        try:
            # Seed Knowledge Docs
            if self.knowledge_collection.count() < len(KNOWLEDGE_DOCS):
                ids = [doc["id"] for doc in KNOWLEDGE_DOCS]
                documents = [f"{doc['topic']}: {doc['content']}" for doc in KNOWLEDGE_DOCS]
                metadatas = [{"topic": doc["topic"], "id": doc["id"]} for doc in KNOWLEDGE_DOCS]
                self.knowledge_collection.upsert(
                    ids=ids,
                    documents=documents,
                    metadatas=metadatas
                )
                print(f"[ChromaStore] [OK] Da cap nhat {len(ids)} tai lieu vao zshop_knowledge!")

            # Seed 50 Products
            if self.products_collection.count() < 50:
                self.index_all_products()
        except Exception as e:
            print(f"[ChromaStore Error] Loi khoi tao Vector DB: {e}")

    def index_all_products(self, products_json_path: Optional[str] = None) -> int:
        """
        Nạp toàn bộ 50 sản phẩm vào ChromaDB Collection 'zshop_products'.
        """
        if not products_json_path:
            products_json_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                "data",
                "all_50_products.json"
            )

        if not os.path.exists(products_json_path):
            print(f"[ChromaStore Warning] Khong tim thay file san pham: {products_json_path}")
            return 0

        with open(products_json_path, "r", encoding="utf-8") as f:
            products = json.load(f)

        ids = []
        documents = []
        metadatas = []

        for p in products:
            pid = str(p["id"])
            name = p.get("name", "")
            cat = p.get("category", "")
            price = float(p.get("price", 0))
            orig_price = float(p.get("originalPrice", price))
            stock = int(p.get("stock", 0))
            rating = float(p.get("rating", 5.0))
            sold = int(p.get("soldCount", 0))
            desc = p.get("description", "")
            images = p.get("images", [])
            img = images[0] if (images and len(images) > 0) else p.get("image_url", "")

            # Văn bản ngữ nghĩa phong phú phục vụ mô hình vector embedding
            doc_text = (
                f"Sản phẩm: {name}. "
                f"Danh mục: {cat}. "
                f"Mức giá: {int(price):,} VNĐ. "
                f"Đánh giá: {rating}/5 sao ({sold} lượt đã bán). "
                f"Tồn kho: {stock} cái. "
                f"Mô tả chi tiết: {desc}"
            )

            meta = {
                "id": pid,
                "name": name,
                "category": cat,
                "price": price,
                "originalPrice": orig_price,
                "stock": stock,
                "rating": rating,
                "soldCount": sold,
                "image": img,
                "description": desc
            }

            ids.append(pid)
            documents.append(doc_text)
            metadatas.append(meta)

        self.products_collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        print(f"[ChromaStore] [OK] Da vector hoa thanh cong {len(ids)} san pham vao collection 'zshop_products'!")
        return len(ids)

    def search_knowledge(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Tìm kiếm ngữ nghĩa (Semantic Search) tri thức trên collection 'zshop_knowledge'.
        """
        try:
            results = self.knowledge_collection.query(
                query_texts=[query],
                n_results=top_k
            )
            hits = []
            if results and "documents" in results and results["documents"]:
                docs = results["documents"][0]
                metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
                dists = results["distances"][0] if "distances" in results and results["distances"] else [0] * len(docs)
                for doc, meta, dist in zip(docs, metas, dists):
                    hits.append({
                        "content": doc,
                        "metadata": meta,
                        "distance": dist
                    })
            return hits
        except Exception as e:
            print(f"[ChromaStore Error] Loi truy van zshop_knowledge: {e}")
            q_lower = query.lower()
            fallback_hits = []
            for doc in KNOWLEDGE_DOCS:
                if any(w in doc["content"].lower() for w in q_lower.split() if len(w) > 2):
                    fallback_hits.append({
                        "content": f"{doc['topic']}: {doc['content']}",
                        "metadata": {"topic": doc["topic"]},
                        "distance": 0.5
                    })
                    if len(fallback_hits) >= top_k:
                        break
            return fallback_hits

    def search_products(
        self,
        query: str,
        top_k: int = 6,
        category: Optional[str] = None,
        max_price: Optional[float] = None,
        min_price: Optional[float] = None,
        sort_by: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Tìm kiếm sản phẩm theo ngữ nghĩa (Semantic Vector Search) trên collection 'zshop_products'.
        Hỗ trợ lọc kết hợp metadata (Category, Max Price, Min Price) và sắp xếp (sort_by).
        """
        try:
            # Lấy nhiều ứng viên để đủ sau lọc và sắp xếp
            fetch_count = min(max(top_k * 4, 20), 50)
            results = self.products_collection.query(
                query_texts=[query],
                n_results=fetch_count
            )

            hits = []
            if results and "documents" in results and results["documents"] and results["metadatas"]:
                docs = results["documents"][0]
                metas = results["metadatas"][0]
                dists = results["distances"][0] if "distances" in results and results["distances"] else [0.0] * len(docs)

                for doc, meta, dist in zip(docs, metas, dists):
                    p_price = float(meta.get("price", 0))
                    p_cat = meta.get("category", "")

                    # Lọc theo giá tối đa nếu có
                    if max_price is not None and p_price > max_price:
                        continue
                    # Lọc theo giá tối thiểu nếu có
                    if min_price is not None and p_price < min_price:
                        continue
                    # Lọc theo danh mục nếu có
                    if category and category.lower() not in p_cat.lower():
                        continue

                    similarity = round(max(0.0, 1.0 - (dist if dist is not None else 0.0)), 4)

                    product_item = {
                        "id": meta.get("id"),
                        "name": meta.get("name"),
                        "category": meta.get("category"),
                        "price": int(p_price),
                        "originalPrice": int(meta.get("originalPrice", p_price)),
                        "stock": int(meta.get("stock", 0)),
                        "rating": float(meta.get("rating", 5.0)),
                        "soldCount": int(meta.get("soldCount", 0)),
                        "image": meta.get("image", ""),
                        "images": [meta.get("image", "")] if meta.get("image") else [],
                        "image_url": meta.get("image", ""),
                        "description": meta.get("description", ""),
                        "vector_distance": dist,
                        "similarity_score": similarity,
                        "source": "VectorDB_Chroma"
                    }
                    hits.append(product_item)

            # Sắp xếp kết quả nếu có yêu cầu
            if sort_by == "price_asc":
                hits.sort(key=lambda x: x["price"])
            elif sort_by == "price_desc":
                hits.sort(key=lambda x: x["price"], reverse=True)
            elif sort_by == "popularity_desc":
                hits.sort(key=lambda x: x["soldCount"], reverse=True)
            elif sort_by == "rating_desc":
                hits.sort(key=lambda x: x["rating"], reverse=True)

            return hits[:top_k]
        except Exception as e:
            print(f"[ChromaStore Error] Loi truy van zshop_products: {e}")
            return []

    def get_collection_stats(self) -> Dict[str, Any]:
        """Thống kê chi tiết trạng thái của Vector Database."""
        try:
            k_count = self.knowledge_collection.count()
            p_count = self.products_collection.count()
            return {
                "status": "ONLINE",
                "engine": "ChromaDB",
                "persist_dir": config.CHROMA_PERSIST_DIR,
                "collections": {
                    "zshop_knowledge": k_count,
                    "zshop_products": p_count
                },
                "total_vectors": k_count + p_count
            }
        except Exception as e:
            return {
                "status": "ERROR",
                "error": str(e),
                "collections": {}
            }

_chroma_instance = None

def get_vector_store() -> ChromaStore:
    global _chroma_instance
    if _chroma_instance is None:
        _chroma_instance = ChromaStore()
    return _chroma_instance
