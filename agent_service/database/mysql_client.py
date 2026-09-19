import pymysql
from typing import List, Dict, Any, Optional
from ..config import config

SAMPLE_PRODUCTS = [
    {
        "id": "NAM-001",
        "name": "Áo Polo Nam Gucci Maxi GG Silk Cotton",
        "category": "Thời trang nam",
        "price": 12000000,
        "stock": 15,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
        "sizes": ["M", "L", "XL"],
        "description": "Áo Polo nam lụa tơ tằm cao cấp chuẩn phong cách Ý, thoáng mát và sang trọng."
    },
    {
        "id": "NAM-002",
        "name": "Áo Thun DIOR - Chính Hãng",
        "category": "Thời trang nam",
        "price": 1889000,
        "stock": 58,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        "sizes": ["S", "M", "L"],
        "description": "Áo thun cotton 100% thoáng mát, dập nổi họa tiết thương hiệu cao cấp."
    },
    {
        "id": "NAM-003",
        "name": "Quần Jeans Slimfit Rách Gối Nam",
        "category": "Thời trang nam",
        "price": 550000,
        "stock": 120,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
        "sizes": ["29", "30", "31", "32"],
        "description": "Quần Jeans co giãn nhẹ, form ôm dáng trẻ trung năng động."
    },
    {
        "id": "NAM-004",
        "name": "Áo Sơ Mi Lụa Dài Tay Công Sở",
        "category": "Thời trang nam",
        "price": 450000,
        "stock": 85,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
        "sizes": ["M", "L", "XL", "XXL"],
        "tags": ["công sở", "thanh lịch", "sơ mi", "lịch lãm", "đi làm", "nam"],
        "description": "Áo sơ mi lụa chống nhăn cao cấp, bề mặt mềm mịn, mang lại vẻ lịch lãm chuẩn công sở."
    },
    {
        "id": "NAM-005",
        "name": "Quần Tây Âu Co Giãn Hàn Quốc",
        "category": "Thời trang nam",
        "price": 380000,
        "stock": 95,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600",
        "sizes": ["29", "30", "31", "32", "33"],
        "tags": ["công sở", "thanh lịch", "quần tây", "quần âu", "lịch lãm", "đi làm", "nam"],
        "description": "Quần âu may đo phong cách Hàn Quốc, cạp chun thông minh co giãn nhẹ, giữ ly cả ngày."
    },
    {
        "id": "GIAY-001",
        "name": "Giày Sneaker Cổ Thấp Basic Trắng",
        "category": "Giày dép",
        "price": 890000,
        "stock": 30,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
        "sizes": ["39", "40", "41", "42", "43"],
        "tags": ["giày", "sneaker", "thanh lịch", "công sở", "dạo phố", "unisex"],
        "description": "Giày thể thao da mềm êm chân, dễ phối đồ mọi hoàn cảnh từ công sở đến dạo phố."
    },
    {
        "id": "KHOAC-004",
        "name": "Áo Khoác Dạ Dáng Dài Hàn Quốc",
        "category": "Áo khoác & Hoodie",
        "price": 890000,
        "stock": 35,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600",
        "sizes": ["M", "L", "XL"],
        "tags": ["tiệc", "sang trọng", "áo khoác", "thanh lịch", "lịch lãm"],
        "description": "Măng tô dạ dáng dài chuẩn phong cách Hàn Quốc, giữ ấm và tôn dáng cực tốt."
    },
    {
        "id": "KHOAC-001",
        "name": "Áo Hoodie Streetwear Unisex Nỉ Bông",
        "category": "Áo khoác & Hoodie",
        "price": 420000,
        "stock": 45,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
        "sizes": ["Freesize", "L", "XL"],
        "tags": ["dạo phố", "streetwear", "năng động", "unisex", "hoodie"],
        "description": "Áo khoác nỉ dày ấm, mũ 2 lớp phong cách thời thượng."
    },
    {
        "id": "TECH-001",
        "name": "Tai Nghe Bluetooth Chống Ồn Chủ Động ANC",
        "category": "Thiết bị công nghệ & Phụ kiện",
        "price": 1150000,
        "stock": 40,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "sizes": ["Tiêu chuẩn"],
        "tags": ["công nghệ", "tai nghe", "phụ kiện"],
        "description": "Chống ồn chủ động đỉnh cao, thời lượng pin 35 giờ liên tục."
    },
    {
        "id": "NAM-006",
        "name": "Áo Thun Trơn Cổ Tròn Cotton 100%",
        "category": "Thời trang nam",
        "price": 149000,
        "stock": 220,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600",
        "sizes": ["S", "M", "L", "XL"],
        "tags": ["áo thun", "ao thun", "thun", "cotton", "basic", "dạo phố", "dưới 500k"],
        "description": "Áo thun trơn basic cotton 220gsm định lượng dày dặn, thấm hút mồ hôi tối đa."
    },
    {
        "id": "NAM-008",
        "name": "Bộ Quần Áo Đũi Nam Mùa Hè Thoáng Mát",
        "category": "Thời trang nam",
        "price": 320000,
        "stock": 65,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
        "sizes": ["S", "M", "L", "XL"],
        "tags": ["bộ đũi", "quần áo", "mùa hè", "dạo phố", "nam"],
        "description": "Bộ đũi cộc tay tự nhiên, phong cách phóng khoáng cực mát mẻ cho mùa hè."
    }
]

SAMPLE_ORDERS = [
    {
        "order_id": "ORD-2026-9812",
        "customer_name": "Nguyễn Văn A",
        "status": "ĐANG GIAO HÀNG",
        "carrier": "ZShop Express Hỏa Tốc",
        "tracking_code": "VNPOST889921",
        "total_amount": 1889000,
        "items": "Áo Thun DIOR - Chính Hãng (Size L)",
        "expected_delivery": "Trong ngày hôm nay (trước 17:00)"
    },
    {
        "order_id": "ORD-2026-8831",
        "customer_name": "Lê Thị B",
        "status": "ĐÃ GIAO HÀNG THÀNH CÔNG",
        "carrier": "Giao Hàng Tiết Kiệm",
        "tracking_code": "GHTK11223344",
        "total_amount": 420000,
        "items": "Áo Hoodie Streetwear Unisex Nỉ Bông",
        "expected_delivery": "Đã giao hôm qua"
    }
]

class MySQLClient:
    """
    Quản lý kết nối và truy vấn CSDL MySQL cho Database Agent.
    Tự động chuyển sang Mock Database nếu MySQL Server chưa kích hoạt.
    """
    def __init__(self):
        self.is_connected = False
        self._conn = None
        self.all_products = self._load_all_products()
        self._init_connection()

    def _load_all_products(self) -> List[Dict[str, Any]]:
        import os
        import json
        try:
            p_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "all_50_products.json")
            if os.path.exists(p_path):
                with open(p_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if data and len(data) > 0:
                        return data
        except Exception:
            pass
        return SAMPLE_PRODUCTS

    def _init_connection(self):
        try:
            self._conn = pymysql.connect(
                host=config.MYSQL_HOST,
                port=config.MYSQL_PORT,
                user=config.MYSQL_USER,
                password=config.MYSQL_PASSWORD,
                database=config.MYSQL_DB,
                cursorclass=pymysql.cursors.DictCursor,
                connect_timeout=2
            )
            self.is_connected = True
            print("[MySQLClient] [OK] Ket noi thanh cong toi MySQL Database!")
        except Exception as e:
            self.is_connected = False
            print(f"[MySQLClient] [INFO] MySQL chua san sang ({e}). Chuyen sang In-Memory Database.")

    def query_products(
        self,
        keywords: Optional[List[str]] = None,
        max_price: Optional[float] = None,
        min_price: Optional[float] = None,
        category: Optional[str] = None,
        sort_by: Optional[str] = None,
        limit: int = 6
    ) -> List[Dict[str, Any]]:
        # Nếu có MySQL live
        if self.is_connected and self._conn:
            try:
                with self._conn.cursor() as cursor:
                    sql = "SELECT * FROM Products WHERE 1=1"
                    params = []
                    if category:
                        sql += " AND (category LIKE %s OR categoryName LIKE %s)"
                        params.extend([f"%{category}%", f"%{category}%"])
                    if max_price:
                        sql += " AND price <= %s"
                        params.append(max_price)
                    if min_price:
                        sql += " AND price >= %s"
                        params.append(min_price)
                    if keywords:
                        for kw in keywords:
                            sql += " AND (name LIKE %s OR description LIKE %s)"
                            params.extend([f"%{kw}%", f"%{kw}%"])
                    if sort_by == "price_asc":
                        sql += " ORDER BY price ASC"
                    elif sort_by == "price_desc":
                        sql += " ORDER BY price DESC"
                    elif sort_by == "popularity_desc":
                        sql += " ORDER BY soldCount DESC"
                    elif sort_by == "rating_desc":
                        sql += " ORDER BY rating DESC"

                    sql += " LIMIT %s"
                    params.append(limit)
                    cursor.execute(sql, tuple(params))
                    results = cursor.fetchall()
                    if results:
                        return results
            except Exception as ex:
                print(f"[MySQLClient Error] Lỗi truy vấn MySQL: {ex}. Sử dụng dữ liệu Fallback.")

        # In-Memory / Fallback filtering trên toàn bộ kho 50 sản phẩm
        results = []
        source_data = self.all_products if hasattr(self, 'all_products') and self.all_products else SAMPLE_PRODUCTS
        for p in source_data:
            p_price = float(p.get("price", 0))
            if max_price is not None and p_price > max_price:
                continue
            if min_price is not None and p_price < min_price:
                continue
            if category and category.lower() not in p.get("category", "").lower():
                continue
            if keywords:
                matched = False
                p_tags = [t.lower() for t in p.get("tags", [])]
                for kw in keywords:
                    kw_lower = kw.lower()
                    if (kw_lower in p.get("name", "").lower() or 
                        kw_lower in p.get("description", "").lower() or 
                        kw_lower in p.get("category", "").lower() or
                        any(kw_lower in tag for tag in p_tags)):
                        matched = True
                        break
                if not matched:
                    continue
            results.append(dict(p))

        # Nếu lọc rỗng nhưng không có tiêu chí khắt khe, trả về danh mục gốc
        if not results and not max_price and not keywords:
            results = [dict(x) for x in source_data]

        # Sắp xếp theo sort_by
        if sort_by == "price_asc":
            results.sort(key=lambda x: float(x.get("price", 0)))
        elif sort_by == "price_desc":
            results.sort(key=lambda x: float(x.get("price", 0)), reverse=True)
        elif sort_by == "popularity_desc":
            results.sort(key=lambda x: float(x.get("soldCount", 0)), reverse=True)
        elif sort_by == "rating_desc":
            results.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)

        return results[:limit]

    def query_outfit(self, occasion: str) -> List[Dict[str, Any]]:
        """
        Truy vấn chính xác các món tạo nên 1 set đồ phối hoàn hảo theo sự kiện/phong cách
        """
        occ = occasion.lower()
        if any(w in occ for w in ["công sở", "cong so", "đi làm", "di lam", "lịch lãm", "lich lam", "thanh lịch", "thanh lich", "sơ mi", "so mi", "office"]):
            # Set công sở: Sơ mi lụa (NAM-004) + Quần tây âu (NAM-005) + Giày sneaker trắng (GIAY-001)
            target_ids = ["NAM-004", "NAM-005", "GIAY-001"]
            matched = [p for p in SAMPLE_PRODUCTS if p["id"] in target_ids]
            return matched if len(matched) >= 2 else SAMPLE_PRODUCTS[:3]
        elif any(w in occ for w in ["dạo phố", "dao pho", "streetwear", "cuối tuần", "cuoi tuan", "năng động", "nang dong"]):
            # Set dạo phố: Áo thun Dior (NAM-002) + Quần Jeans Slimfit (NAM-003) + Áo Hoodie (KHOAC-001)
            target_ids = ["NAM-002", "NAM-003", "KHOAC-001"]
            matched = [p for p in SAMPLE_PRODUCTS if p["id"] in target_ids]
            return matched if len(matched) >= 2 else SAMPLE_PRODUCTS[:3]
        elif any(w in occ for w in ["tiệc", "tiec", "party", "sang trọng", "sang trong", "hẹn hò", "hen ho"]):
            # Set dạ tiệc: Áo Polo Gucci (NAM-001) + Quần Tây Âu (NAM-005) + Áo Khoác Dạ Dài (KHOAC-004)
            target_ids = ["NAM-001", "NAM-005", "KHOAC-004"]
            matched = [p for p in SAMPLE_PRODUCTS if p["id"] in target_ids]
            return matched if len(matched) >= 2 else SAMPLE_PRODUCTS[:3]
        return SAMPLE_PRODUCTS[:3]

    def query_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        clean_id = order_id.upper().strip()
        for ord_item in SAMPLE_ORDERS:
            if clean_id in ord_item["order_id"]:
                return ord_item
        return None

_db_instance = None

def get_db_client() -> MySQLClient:
    global _db_instance
    if _db_instance is None:
        _db_instance = MySQLClient()
    return _db_instance
