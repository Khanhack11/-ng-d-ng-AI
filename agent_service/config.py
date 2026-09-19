import os
from pathlib import Path
from dotenv import load_dotenv

# Tự động tải biến môi trường nếu có file .env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

class Config:
    # Flask Web API
    HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_PORT', 5001))
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')

    # MySQL Database Config
    MYSQL_HOST = os.getenv('MYSQL_HOST', '127.0.0.1')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'root')
    MYSQL_DB = os.getenv('MYSQL_DATABASE', 'He_Thong_Thuong_Mai')

    # Vector DB (ChromaDB) Config
    CHROMA_PERSIST_DIR = str(BASE_DIR / 'data' / 'chroma_db')

    # Google Gemini API (Tuỳ chọn)
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    # Chỉ bật khi cần dùng Gemini để biên tập văn phong; dữ liệu nghiệp vụ
    # mặc định phải do pipeline RAG/CSDL tạo ra để tránh phát sinh thông tin mới.
    ENABLE_GEMINI_REFINEMENT = os.getenv('ENABLE_GEMINI_REFINEMENT', 'false').lower() in ('true', '1', 't')

config = Config()
