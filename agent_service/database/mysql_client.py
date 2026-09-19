import pymysql
from typing import List, Dict, Any, Optional
from ..config import config

import json
from pathlib import Path

_DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "all_50_products.json"
SAMPLE_PRODUCTS: List[Dict[str, Any]] = []
if _DATA_FILE.exists():
    try:
        with open(_DATA_FILE, "r", encoding="utf-8") as f:
            SAMPLE_PRODUCTS = json.load(f)
    except Exception:
        SAMPLE_PRODUCTS = []

SAMPLE_ORDERS = [
    {
        "order_id": "ORD-2026-9812",
        "customer_name": "Nguyễn Văn A",
        "status": "ĐANG GIAO HỎA TỐC 2H",
        "carrier": "ZShop Express Hỏa Tốc",
        "tracking_code": "ZS-EXPRESS-9921",
        "total_amount": 34990000,
        "items": "iPhone 16 Pro Max 256GB Titan Tự Nhiên (Bảo hành chính hãng 24 tháng theo IMEI: 358921098231901)",
        "expected_delivery": "Trong 2 giờ tới (trước 17:00 hôm nay)"
    },
    {
        "order_id": "ORD-2026-8831",
        "customer_name": "Lê Thị B",
        "status": "ĐÃ GIAO HÀNG THÀNH CÔNG",
        "carrier": "Giao Hàng Nhanh (GHN)",
        "tracking_code": "GHN11223344",
        "total_amount": 2180000,
        "items": "Củ Sạc Apple 35W Dual USB-C Port Chính Hãng + Cáp Sạc Apple USB-C Đan Dù 1m",
        "expected_delivery": "Đã nhận hàng thành công (Bảo hành 1 đổi 1 trong 30 ngày)"
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
            match_score = 0
            if keywords:
                p_name_lower = p.get("name", "").lower()
                p_desc_lower = p.get("description", "").lower()
                p_cat_lower = p.get("category", "").lower()
                p_tags = [t.lower() for t in p.get("tags", [])]
                for kw in keywords:
                    kw_lower = kw.lower()
                    if kw_lower in p_name_lower:
                        match_score += 10
                    elif kw_lower in p_cat_lower:
                        match_score += 5
                    elif any(kw_lower in tag for tag in p_tags):
                        match_score += 4
                    elif kw_lower in p_desc_lower:
                        match_score += 2
                if match_score == 0:
                    continue
            results.append((p, match_score))

        # Nếu lọc rỗng nhưng không có tiêu chí khắt khe, trả về danh mục gốc
        if not results and not max_price and not keywords:
            results = [(x, 0) for x in source_data]

        # Sắp xếp kết quả
        if keywords and not sort_by:
            results.sort(key=lambda x: x[1], reverse=True)
            output_products = [dict(x[0]) for x in results]
        else:
            output_products = [dict(x[0]) for x in results]
            if sort_by == "price_asc":
                output_products.sort(key=lambda x: float(x.get("price", 0)))
            elif sort_by == "price_desc":
                output_products.sort(key=lambda x: float(x.get("price", 0)), reverse=True)
            elif sort_by == "popularity_desc":
                output_products.sort(key=lambda x: float(x.get("soldCount", 0)), reverse=True)
            elif sort_by == "rating_desc":
                output_products.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)

        return output_products[:limit]

    def query_outfit(self, occasion: Optional[str]) -> List[Dict[str, Any]]:
        """
        Truy vấn chính xác các món tạo nên 1 combo công nghệ phối hoàn hảo theo nhu cầu
        """
        occ = (occasion or "office").lower()
        pool = self.all_products if hasattr(self, 'all_products') and self.all_products else SAMPLE_PRODUCTS
        if any(w in occ for w in ["công sở", "cong so", "đi làm", "di lam", "doanh nhân", "doanh nhan", "magsafe", "office"]):
            # Combo công sở / doanh nhân: iPhone 16 Pro Max (PHONE-035) + Củ sạc 35W Dual (APPLE-ACC-002) + Ốp Silicone MagSafe (APPLE-ACC-009)
            target_ids = ["PHONE-035", "APPLE-ACC-002", "APPLE-ACC-009"]
            matched = [p for p in pool if p["id"] in target_ids]
            return matched if len(matched) >= 2 else pool[:3]
        elif any(w in occ for w in ["gaming", "chơi game", "choi game", "game thủ", "game thu"]):
            # Combo gaming: iPhone 16 Pro Max (PHONE-035) + Cáp USB-C dù (APPLE-ACC-003) + AirPods Pro 2 (APPLE-ACC-007)
            target_ids = ["PHONE-035", "APPLE-ACC-003", "APPLE-ACC-007"]
            matched = [p for p in pool if p["id"] in target_ids]
            return matched if len(matched) >= 2 else pool[:3]
        elif any(w in occ for w in ["creator", "vlog", "livestream", "quay video"]):
            # Combo creator / media: iPhone 16 Pro Max (PHONE-035) + AirPods Max (APPLE-ACC-008) + Pin MagSafe (APPLE-ACC-006)
            target_ids = ["PHONE-035", "APPLE-ACC-008", "APPLE-ACC-006"]
            matched = [p for p in pool if p["id"] in target_ids]
            return matched if len(matched) >= 2 else pool[:3]
        # Combo cơ bản / tiết kiệm mặc định: iPhone 6s (PHONE-003) + Củ sạc Apple 20W (APPLE-ACC-001) + Kính cường lực Apple Care+ (APPLE-ACC-010)
        target_ids = ["PHONE-003", "APPLE-ACC-001", "APPLE-ACC-010"]
        matched = [p for p in pool if p["id"] in target_ids]
        return matched if len(matched) >= 2 else pool[:3]

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
