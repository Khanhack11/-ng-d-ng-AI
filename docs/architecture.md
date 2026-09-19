# Tài liệu Kiến trúc Hệ thống (Architecture Document)

## 1. Tổng quan Kiến trúc

Hệ thống ZShop được thiết kế theo mô hình **Client-Server Phân tầng (Layered Architecture)** kết hợp kiến trúc **RAG (Retrieval-Augmented Generation)** cho Chatbot AI:

```text
┌─────────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER (FRONTEND)                 │
│      React 19 + TypeScript + Vite + Tailwind CSS + Three.js │
│   - Shopee Storefront UI, 3D Spatial Canvas, Glassmorphism   │
│   - ChatBot Component (Chế độ Kép: Shopping / Admin)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST API (Port 5000)
┌──────────────────────────────▼──────────────────────────────┐
│                  API & CONTROLLER LAYER                     │
│               Express.js Router & Controllers               │
│  - ChatController, ProductController, CartController, ...   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      SERVICE LAYER                          │
│  - AiService (Question Analysis + RAG Pipeline)             │
│  - ProductUserService, CartService, OrderService            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    REPOSITORY LAYER                         │
│  - ProductRepository, CartRepository, OrderRepository       │
│  - Parameterized SQL Queries (Chống SQL Injection)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ MSSQL Driver (Port 53504)
┌──────────────────────────────▼──────────────────────────────┐
│                      DATABASE LAYER                         │
│        Microsoft SQL Server (Database: He_Thong_Thuong_Mai) │
│  - Roles, Users, Customers, Sellers, Categories, Products,  │
│    Carts, CartItems, Orders, OrderItems                     │
└─────────────────────────────────────────────────────────────┘
```

## 2. Luồng Dữ liệu Chatbot AI RAG (Retrieval-Augmented Generation)

```text
[User Query] ("tìm áo dưới 500k")
      │
      ▼
[Question Analyzer] (Trích xuất Intent: category='Thời trang nam', max_price=500000, keyword='áo')
      │
      ▼
[Product Retriever] (Parameterized SQL: SELECT * FROM Products WHERE price <= 500000 AND ...)
      │
      ▼
[Context Builder] (Định dạng danh sách sản phẩm thành văn bản ngắn gọn, chính xác)
      │
      ▼
[Prompt Builder] (Gắn System Role + Quy tắc Grounding + Ngữ cảnh CSDL + Câu hỏi)
      │
      ▼
[Gemini / AI Engine] (Sinh câu trả lời tiếng Việt chính xác 100%, không bịa đặt)
      │
      ▼
[Chatbot UI] (Hiển thị tin nhắn và Thẻ sản phẩm tương tác 1-chạm vào giỏ hàng)
```
