# Kiến trúc Chatbot RAG (Chatbot Architecture)

## 1. Các Khối Chức năng
1. **Chat UI (`components/ChatBot.tsx`)**:
   - Giao diện nổi góc dưới bên phải.
   - Thẻ sản phẩm tương tác trực tiếp (Quick Add to Cart, View Detail).
   - Nút chuyển đổi nhanh chế độ Khách hàng / Quản trị.
2. **Chat Controller (`szshop-backend/controllers/ChatController.js`)**:
   - Endpoint: `POST /api/chat`.
   - Endpoint: `GET /api/ai/skills`.
3. **AI Service Engine (`szshop-backend/services/AiService.js`)**:
   - Tích hợp 6 AI Business Skills.
   - Trích xuất Intent & Entity.
   - Truy vấn CSDL thực tế.
   - Đóng gói phản hồi chuẩn hóa `AISkillResult`.
4. **Client-Side AI Engine Fallback (`aiSkills.ts`)**:
   - Đảm bảo Chatbot hoạt động liên tục ngay cả khi ngắt kết nối mạng hoặc server đang khởi động lại.
