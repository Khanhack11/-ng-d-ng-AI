# BÁO CÁO ĐÁNH GIÁ ĐỊNH LƯỢNG: SINGLE-AGENT VS MULTI-AGENT
**Thời điểm thực hiện**: 2026-09-19 08:18:37
**Số kịch bản kiểm thử**: 5

## 1. BẢNG SO SÁNH CHỈ SỐ ĐỊNH LƯỢNG
| Tiêu Chí Đánh Giá | Single-Agent (Naive LLM) | Multi-Agent (ZShop Architecture) | Kết Luận & Ưu Thế |
| :--- | :---: | :---: | :--- |
| **Chống ảo giác (Anti-Hallucination)** | 40.0% | **100.0%** | Multi-Agent (+60% độ chính xác) |
| **Tuân thủ ngân sách (Constraint Adherence)** | 80.0% | **100.0%** | Multi-Agent (100% tuân thủ ngân sách) |
| **Khả năng tự sửa lỗi (Self-Correction)** | 0% (Không có Reflection Loop) | **100% (Critic Gate + Reflection Loop 2 vòng)** | Multi-Agent |
| **Thời gian phản hồi trung bình (Latency)** | 40.3 ms | 495.1 ms | Multi-Agent có bước suy luận & kiểm định |

## 2. KẾT LUẬN THỰC NGHIỆM
- **Single-Agent Model** gặp hạn chế nghiêm trọng về **ảo giác giá** (gợi ý sản phẩm vượt hàng chục lần ngân sách người dùng) và bịa đặt thông tin chính sách bảo hành.
- **Multi-Agent Architecture** giải quyết triệt để 100% các hạn chế nhờ sự phối hợp của:
  1. **Database Agent & RAG Agent**: Neo giữ dữ liệu thật (Grounding) từ MySQL và ChromaDB.
  2. **Recommendation Agent**: Xếp hạng thông minh kết hợp đa tiêu chí.
  3. **Critic Agent & Reflection Loop**: Cổng gác chặn đứng hoàn toàn dữ liệu sai trước khi xuất bản ra Client.
