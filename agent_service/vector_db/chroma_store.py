import os
import json
from typing import List, Dict, Any, Optional
import chromadb
from ..config import config

KNOWLEDGE_DOCS = [
    {
        "id": "kb-return-policy",
        "topic": "Chính sách đổi trả hàng",
        "content": "Chính sách đổi trả: ZShop hỗ trợ đổi trả hàng MIỄN PHÍ trong vòng 7 ngày kể từ khi nhận hàng. Áp dụng cho trường hợp không vừa size, sản phẩm lỗi từ nhà sản xuất hoặc khách hàng muốn đổi mẫu khác. Shipper ZShop Express sẽ đến tận nhà thu hồi hàng, quý khách không cần mang ra bưu điện."
    },
    {
        "id": "kb-shipping-policy",
        "topic": "Chính sách giao hàng và vận chuyển",
        "content": "Chính sách vận chuyển: Miễn phí vận chuyển (FREESHIP) toàn quốc cho mọi đơn hàng từ 300.000đ trở lên. Với đơn dưới 300.000đ, phí giao tiêu chuẩn là 30.000đ (nhận hàng sau 2-3 ngày) và giao hỏa tốc ZShop Fast là 50.000đ (nhận hàng trong 24 giờ)."
    },
    {
        "id": "kb-payment-methods",
        "topic": "Phương thức thanh toán",
        "content": "Phương thức thanh toán: ZShop hỗ trợ quét mã VietQR Napas 24/7 tự động xác nhận đơn trong 3 giây, thanh toán tiền mặt khi nhận hàng (COD - khách hàng được đồng kiểm, bóc kiện xem hàng trước khi trả tiền), Ví điện tử MoMo/ZaloPay và thẻ tín dụng/ghi nợ quốc tế Visa/Mastercard."
    },
    {
        "id": "kb-showroom-hotline",
        "topic": "Địa chỉ showroom và hotline chăm sóc khách hàng",
        "content": "Hệ thống showroom ZShop: Flagship Store tại 12 Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh. Mở cửa từ 08:30 đến 22:00 tất cả các ngày trong tuần (kể cả Thứ Bảy, Chủ Nhật và ngày lễ). Hotline/Zalo CSKH: 0901 234 567."
    },
    {
        "id": "kb-warranty-quality",
        "topic": "Cam kết chất lượng và bảo hành",
        "content": "Cam kết chất lượng: 100% sản phẩm phân phối tại ZShop là hàng chính hãng, cam kết đền bù 200% giá trị nếu phát hiện hàng giả hàng nhái. Bảo hành 12 tháng đối với phụ kiện công nghệ và đồng hồ, hỗ trợ bảo hành đường may trọn đời cho các dòng thời trang cao cấp."
    },
    {
        "id": "kb-size-guide",
        "topic": "Hướng dẫn chọn size quần áo thời trang",
        "content": "Bảng chọn size chuẩn ZShop: Size S (dưới 55kg, cao dưới 1m65), Size M (55-65kg, cao 1m65-1m72), Size L (65-75kg, cao 1m70-1m78), Size XL (75-85kg, cao 1m75-1m85). Nếu bạn thích mặc form rộng (Oversize), vui lòng chọn tăng 1 size."
    },
    {
        "id": "kb-styling-office",
        "topic": "Tư vấn phối set đồ công sở thanh lịch nam nữ",
        "content": "Gợi ý phối đồ công sở thanh lịch chuẩn Stylist: Sự kết hợp hoàn hảo giữa Áo sơ mi lụa dài tay chống nhăn và Quần tây âu co giãn Hàn Quốc, phối cùng Giày sneaker basic trắng hoặc giày da. Bộ trang phục mang phong cách Smart Casual lịch thiệp, giữ nếp chỉn chu suốt 8 tiếng làm việc mà vẫn thông thoáng dễ chịu."
    },
    {
        "id": "kb-styling-streetwear",
        "topic": "Tư vấn phối đồ dạo phố cuối tuần năng động",
        "content": "Gợi ý phối đồ dạo phố cuối tuần năng động: Kết hợp Áo thun cotton cao cấp cùng Quần Jeans Slimfit rách gối cá tính và Áo Hoodie streetwear nỉ bông. Đi cùng giày sneaker trắng tạo nên diện mạo trẻ trung, khỏe khoắn và phóng khoáng."
    },
    {
        "id": "kb-styling-party",
        "topic": "Tư vấn phối đồ đi tiệc hẹn hò sang trọng",
        "content": "Gợi ý phối đồ đi tiệc và hẹn hò sang trọng: Kết hợp Áo Polo lụa thượng hạng hoặc Sơ mi lụa cùng Quần Tây Âu và Áo Khoác Dạ dáng dài Hàn Quốc. Gam màu trung tính sang trọng thu hút mọi ánh nhìn."
    },
    {
        "id": "kb-tech-accessories",
        "topic": "Phụ kiện công nghệ và đồng hồ thông minh",
        "content": "Các sản phẩm thiết bị công nghệ và phụ kiện cao cấp tại ZShop bao gồm tai nghe Bluetooth chống ồn ANC, đồng hồ nam nữ mạ vàng Sapphire, sạc dự phòng không dây MagSafe và balo thời trang chống nước. Tất cả đều bảo hành 1 đổi 1 trong 12 tháng."
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
