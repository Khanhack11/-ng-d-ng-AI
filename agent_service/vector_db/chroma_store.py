import os
import json
from typing import List, Dict, Any, Optional
import chromadb
from ..config import config

KNOWLEDGE_DOCS = [
    {
        "id": "kb-warranty-tech",
        "topic": "Chính sách bảo hành Apple Care+ và lỗi 1 đổi 1 chính hãng",
        "content": "Chính sách bảo hành ZShop Apple Authorized: 100% các dòng iPhone từ iPhone 6 đến iPhone 18 Pro Max và phụ kiện Apple đều được bảo hành điện tử chính hãng theo số Serial Number và IMEI trên hệ thống Apple. Áp dụng chính sách 'LỖI 1 ĐỔI 1 TRONG 30 NGÀY ĐẦU' cho mọi lỗi phần cứng. Khách hàng chỉ cần đọc số điện thoại đặt hàng để tra cứu bảo hành, không cần giữ hóa đơn giấy."
    },
    {
        "id": "kb-compatibility-return",
        "topic": "Chính sách đổi trả phụ kiện Apple chính hãng trong 7 ngày",
        "content": "Chính sách đổi trả: ZShop hỗ trợ đổi trả MIỄN PHÍ trong vòng 7 ngày nếu phụ kiện Apple (củ sạc 20W/35W, cáp sạc USB-C/Lightning, sạc MagSafe, ốp lưng, kính cường lực) không tương thích với thiết bị của bạn hoặc khách hàng muốn đổi màu sắc khác. Hoàn tiền 100% hoặc đổi mới tận nơi qua Shipper ZShop Express."
    },
    {
        "id": "kb-shipping-express",
        "topic": "Giao hàng hỏa tốc 2 giờ và freeship toàn quốc cho thiết bị Apple",
        "content": "Chính sách vận chuyển: Miễn phí vận chuyển (FREESHIP) toàn quốc cho mọi đơn hàng từ 300.000đ trở lên. Đối với khách hàng mua iPhone hoặc phụ kiện cần nhận ngay, ZShop cung cấp dịch vụ 'GIAO HỎA TỐC 2 GIỜ' có bảo hiểm nguyên seal niêm phong trong khu vực nội thành với phí chỉ 35.000đ."
    },
    {
        "id": "kb-trade-in-policy",
        "topic": "Chương trình Thu cũ Đổi mới (Trade-in) lên đời iPhone 16/17/18 Pro Max",
        "content": "Chương trình Thu cũ Đổi mới (Apple Trade-in): ZShop hỗ trợ thu mua toàn bộ các đời iPhone cũ từ iPhone 6, 7, 8, X, 11, 12, 13, 14, 15 để lên đời iPhone 16 Pro Max, iPhone 17 hay iPhone 18 Pro Max với mức trợ giá thêm lên tới 3.000.000đ. Đội ngũ chuyên viên Apple hỗ trợ sao lưu toàn bộ dữ liệu iCloud, hình ảnh, tin nhắn sang máy mới miễn phí 100% tại chỗ."
    },
    {
        "id": "kb-charging-standards",
        "topic": "Hướng dẫn củ sạc Apple chính hãng 20W, 35W Dual và sạc MagSafe",
        "content": "Tư vấn sạc Apple: iPhone 8 đến iPhone 14 Pro Max hỗ trợ sạc nhanh PD qua cáp Type-C to Lightning. iPhone 15, 16, 17, 18 Series sử dụng cổng Type-C hỗ trợ củ sạc Apple 20W và 35W Dual USB-C sạc 50% pin trong 25-30 phút. Công nghệ sạc không dây từ tính Apple MagSafe và Qi2 hỗ trợ công suất 15W - 25W hít chắc vào lưng máy từ dòng iPhone 12 trở lên."
    },
    {
        "id": "kb-port-compatibility",
        "topic": "Phân biệt cổng sạc Type-C và Lightning trên các thế hệ iPhone",
        "content": "Tương thích cổng sạc: Toàn bộ iPhone 15 Series, iPhone 16 Series, iPhone 17 Series và iPhone 18 Series sử dụng chuẩn USB-C quốc tế tốc độ cao. Các dòng iPhone 14, iPhone 13, 12, 11, X, 8, 7, 6 Series sử dụng cổng kết nối Lightning truyền thống của Apple."
    },
    {
        "id": "kb-battery-health",
        "topic": "Chính sách kiểm tra tình trạng pin (Battery Health) và thay pin chính hãng",
        "content": "Chính sách pin Apple: Mọi máy iPhone bán ra tại ZShop đều được cam kết tình trạng pin (Battery Health) từ 85% đến 100%. Trong thời gian bảo hành, nếu dung lượng pin tụt dưới 80% theo thông báo 'Bảo trì' của iOS, ZShop hỗ trợ thay pin mới miễn phí 100% theo tiêu chuẩn Apple."
    },
    {
        "id": "kb-vintage-iphone",
        "topic": "Tư vấn chọn mua các dòng iPhone cổ điển và sưu tầm (iPhone 6, 7, 8, X)",
        "content": "Dòng máy iPhone cổ điển & sưu tầm: iPhone 6/6 Plus, 6s/6s Plus, iPhone 7/7 Plus và iPhone 8/8 Plus sở hữu nút Home Touch ID truyền thống, thích hợp làm máy phụ nghe gọi, phát Wifi, máy cho người lớn tuổi hoặc phụ huynh mua cho con học tập. ZShop cam kết nguyên bản 100% vỏ đẹp likenew 99%."
    },
    {
        "id": "kb-payment-methods",
        "topic": "Phương thức thanh toán và trả góp 0% lãi suất Apple",
        "content": "Phương thức thanh toán: Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của 25 ngân hàng hoặc duyệt hồ sơ online trong 5 phút. Hỗ trợ thanh toán mã VietQR Napas 24/7, ví MoMo, Apple Pay và giao hàng tiền mặt COD (được mở hộp kiểm tra đúng model, màu sắc và số IMEI trước khi thanh toán)."
    },
    {
        "id": "kb-store-hotline",
        "topic": "Trung tâm trải nghiệm Apple ZShop Flagship và hotline kỹ thuật",
        "content": "Trung tâm trải nghiệm Apple ZShop Store: 12 Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh. Khách hàng được trải nghiệm trực tiếp đầy đủ các dòng iPhone từ iPhone 6 đến iPhone 18 Pro Max trên bàn trải nghiệm. Hotline hỗ trợ kỹ thuật Apple & CSKH: 0901 234 567 (hoạt động 8h00 - 22h00 hàng ngày)."
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
