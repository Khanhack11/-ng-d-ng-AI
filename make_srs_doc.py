# -*- coding: utf-8 -*-
"""
Tạo tài liệu Đặc tả Yêu cầu Phần mềm (SRS) chuẩn IEEE 830 cho Hệ thống SZSHOP.
Bao gồm file Markdown (docs/SRS_SZSHOP_SPECIFICATION.md) và file Word (SRS_SZSHOP_SPECIFICATION.docx).
"""

import os
import shutil
import sys
import docx

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_markdown_content():
    content = """# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)
## HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ KHÔNG GIAN 3D & CỔNG THANH TOÁN SZ-PAYMENT (SZSHOP)
**Tiêu chuẩn áp dụng:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018  
**Phiên bản:** 2.0 (Bản hoàn thiện tích hợp 3D Spatial Canvas & AI Copilot)  
**Ngày phát hành:** 07/09/2026  
**Đơn vị thực hiện:** Nhóm Phát triển Nền tảng E-Commerce SZSHOP  

---

## MỤC LỤC TỔNG THỂ
1. [GIỚI THIỆU CHUNG](#1-giới-thiệu-chung)
   - [1.1 Mục đích](#11-mục-đích)
   - [1.2 Phạm vi](#12-phạm-vi)
   - [1.3 Các định nghĩa, thuật ngữ, từ viết tắt](#13-các-định-nghĩa-thuật-ngữ-từ-viết-tắt)
   - [1.4 Tài liệu tham khảo](#14-tài-liệu-tham-khảo)
2. [MÔ TẢ TỔNG QUAN ỨNG DỤNG](#2-mô-tả-tổng-quan-ứng-dụng)
   - [2.1 Mô hình Use Case tổng thể](#21-mô-hình-use-case-tổng-thể)
   - [2.2 Danh sách các tác nhân và mô tả](#22-danh-sách-các-tác-nhân-và-mô-tả)
   - [2.3 Danh sách Use Case và mô tả](#23-danh-sách-use-case-và-mô-tả)
   - [2.4 Các điều kiện phụ thuộc](#24-các-điều-kiện-phụ-thuộc)
3. [ĐẶC TẢ CÁC YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)](#3-đặc-tả-các-yêu-cầu-chức-năng-functional-requirements)
   - [3.1 UC001_Đăng ký, Đăng nhập & Xác thực Hệ thống](#31-uc001_đăng-ký-đăng-nhập--xác-thực-hệ-thống)
     - [3.1.1 Mô tả use case UC001](#311-mô-tả-use-case-uc001)
     - [3.1.2 Biểu đồ UC001](#312-biểu-đồ-uc001)
   - [3.2 UC002_Khám phá & Tìm kiếm Sản phẩm Không gian 3D](#32-uc002_khám-phá--tìm-kiếm-sản-phẩm-không-gian-3d)
     - [3.2.1 Mô tả use case UC002](#321-mô-tả-use-case-uc002)
     - [3.2.2 Biểu đồ UC002](#322-biểu-đồ-uc002)
   - [3.3 UC003_Quản lý Giỏ hàng Đa năng (Cart Management & MiniCart)](#33-uc003_quản-lý-giỏ-hàng-đa-năng-cart-management--minicart)
     - [3.3.1 Mô tả use case UC003](#331-mô-tả-use-case-uc003)
     - [3.3.2 Biểu đồ UC003](#332-biểu-đồ-uc003)
   - [3.4 UC004_Xác nhận Đơn hàng & Thiết lập Giao nhận (Checkout)](#34-uc004_xác-nhận-đơn-hàng--thiết-lập-giao-nhận-checkout)
     - [3.4.1 Mô tả use case UC004](#341-mô-tả-use-case-uc004)
     - [3.4.2 Biểu đồ UC004](#342-biểu-đồ-uc004)
   - [3.5 UC005_Thanh toán Trực tuyến Đa kênh SZ-Payment Gateway](#35-uc005_thanh-toán-trực-tuyến-đa-kênh-sz-payment-gateway)
     - [3.5.1 Mô tả use case UC005](#351-mô-tả-use-case-uc005)
     - [3.5.2 Biểu đồ UC005](#352-biểu-đồ-uc005)
   - [3.6 UC006_Tra cứu Tiến trình Vận đơn & Quản lý Đơn hàng](#36-uc006_tra-cứu-tiến-trình-vận-đơn--quản-lý-đơn-hàng)
     - [3.6.1 Mô tả use case UC006](#361-mô-tả-use-case-uc006)
     - [3.6.2 Biểu đồ UC006](#362-biểu-đồ-uc006)
   - [3.7 UC007_Trợ lý AI Mua sắm & Phân tích Doanh số ZShop Copilot](#37-uc007_trợ-lý-ai-mua-sắm--phân-tích-doanh-số-zshop-copilot)
     - [3.7.1 Mô tả use case UC007](#371-mô-tả-use-case-uc007)
     - [3.7.2 Biểu đồ UC007](#372-biểu-đồ-uc007)
    - [3.8 UC008_Quản lý Nhập kho, Tồn kho & AI Khuyến nghị Kho (Warehouse)](#38-uc008_quản-lý-nhập-kho-tồn-kho--ai-khuyến-nghị-kho-warehouse)
      - [3.8.1 Mô tả use case UC008](#381-mô-tả-use-case-uc008)
      - [3.8.2 Biểu đồ UC008](#382-biểu-đồ-uc008)
    - [3.9 UC009_Quản trị Cửa hàng, Nhân sự & AI Phân tích Kinh doanh (Admin)](#39-uc009_quản-trị-cửa-hàng-nhân-sự--ai-phân-tích-kinh-doanh-admin)
      - [3.9.1 Mô tả use case UC009](#391-mô-tả-use-case-uc009)
      - [3.9.2 Biểu đồ UC009](#392-biểu-đồ-uc009)
4. [CÁC THÔNG TIN HỖ TRỢ KHÁC](#4-các-thông-tin-hỗ-trợ-khác)
   - [4.1 Yêu cầu phi chức năng (Non-Functional Requirements)](#41-yêu-cầu-phi-chức-năng-non-functional-requirements)
   - [4.2 Thiết kế Cơ sở Dữ liệu Quan hệ Vật lý (11 Bảng SQL)](#42-thiết-kế-cơ-sở-dữ-liệu-quan-hệ-vật-lý-11-bảng-sql)
   - [4.3 Ràng buộc Thiết kế & Kiến trúc Triển khai](#43-ràng-buộc-thiết-kế--kiến-trúc-triển-khai)

---

# 1. GIỚI THIỆU CHUNG

## 1.1 Mục đích
Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification - SRS) này mô tả chi tiết, toàn diện và đầy đủ các yêu cầu nghiệp vụ, yêu cầu chức năng, yêu cầu phi chức năng, các ràng buộc kỹ thuật, kiến trúc giao diện tương tác 3D WebGL và cơ sở dữ liệu quan hệ của **Hệ thống Cửa hàng Thương mại Điện tử Không gian 3D & Bán lẻ Thông minh ZShop (SZSHOP - Single-Store Model)**.

Mục đích cụ thể của tài liệu:
1. **Chuẩn hóa nghiệp vụ & UML 2.5:** Thiết lập tài liệu cơ sở kỹ thuật chính thức theo tiêu chuẩn công nghiệp IEEE Std 830-1998 và chuẩn UML 2.5, thống nhất mô hình **Cửa hàng Đơn nhất (Single-Store)** với **4 Tác nhân chính**: **Admin (Chủ cửa hàng)**, **Nhân viên bán hàng (`SALES`)**, **Nhân viên kho (`WAREHOUSE`)**, và **Khách hàng (`CUSTOMER`)** (loại bỏ hoàn toàn mô hình nhà bán hàng có nhiều tài khoản đăng ký).
2. **Hướng dẫn thiết kế & phát triển:** Làm kim chỉ nam cho việc xây dựng kiến trúc frontend (React 19 + Three.js), backend (Node.js/Express v5), hệ thống cơ sở dữ liệu (Microsoft SQL Server) và tích hợp các mô hình trí tuệ nhân tạo (Google Gemini RAG AI Copilot).
3. **Tiêu chuẩn nghiệm thu:** Định nghĩa tiêu chuẩn kiểm thử tự động, kiểm thử chấp nhận người dùng (UAT), xác thực hiệu năng hệ thống đồ họa 3D và đối soát giao dịch cổng thanh toán thời gian thực.

## 1.2 Phạm vi
- **Tên sản phẩm:** Hệ thống Cửa hàng Thương mại Điện tử Tương tác Không gian 3D & Bán lẻ Thông minh (Tên thương mại: **SZSHOP**).
- **Phạm vi giải quyết bài toán:**
  - *Đột phá trải nghiệm người dùng:* Chuyển đổi mô hình hiển thị danh mục ảnh 2D tĩnh truyền thống sang không gian đồ họa tương tác 3D thời gian thực (Three.js WebGL canvas), cho phép người mua xoay 360°, phóng to chi tiết bề mặt vật liệu, tương tác thẻ sản phẩm Bento Grid 3D chiều sâu.
  - *Cổng thanh toán tự động & đa kênh SZ-Payment:* Tích hợp cơ chế thanh toán liên ngân hàng và tại quầy POS: VietQR Napas 247, VNPAY-QR, Thẻ quốc tế Visa/Mastercard, Ví MoMo và thanh toán khi nhận hàng (COD). Tự động sinh mã thanh toán kèm thời gian đếm ngược 15 phút, cập nhật trạng thái đơn hàng tức thời.
  - *Trợ lý trí tuệ nhân tạo ZShop Copilot (RAG):* Ứng dụng công nghệ RAG kết hợp Gemini LLM nhằm tự động hóa tư vấn sản phẩm theo ngân sách (`UC07`), AI Khuyến nghị nhập kho Stock Copilot cho Nhân viên kho (`UC08`), và AI Hỏi đáp kinh doanh (AI BI) cho Admin Chủ cửa hàng (`UC09`).
  - *Mô hình 4 Tác nhân Cửa hàng thống nhất:* Phục vụ trọn vẹn 4 tác nhân: **Khách hàng** (mua sắm 3D, tích điểm VIP, đổi trả), **Nhân viên bán hàng** (bán hàng tại quầy POS, quản lý CRM khách hàng, xử lý đổi trả hoàn tiền & thu hồi điểm), **Nhân viên kho** (quản lý danh mục sản phẩm, lập phiếu nhập kho, kiểm kê tồn kho, AI khuyến nghị nhập kho), và **Admin - Chủ cửa hàng** (quản lý nhân sự nội bộ, giám sát doanh thu toàn cửa hàng, xuất báo cáo Excel/PDF, AI phân tích kinh doanh).
- **Giới hạn phạm vi (Out of Scope):** Hệ thống vận hành cho một cửa hàng thương mại điện tử & bán lẻ duy nhất (Single-Store), không nhận đăng ký mở gian hàng từ các nhà bán hàng bên ngoài (Multi-vendor).

## 1.3 Các định nghĩa, thuật ngữ, từ viết tắt
| Thuật ngữ / Viết tắt | Tên tiếng Anh đầy đủ | Định nghĩa & Ý nghĩa kỹ thuật |
| :--- | :--- | :--- |
| **SRS** | Software Requirements Specification | Tài liệu đặc tả yêu cầu phần mềm theo tiêu chuẩn IEEE 830. |
| **UML** | Unified Modeling Language (v2.5) | Ngôn ngữ mô hình hóa thống nhất dùng để đặc tả Use Case, Sequence, Activity, Class Diagram. |
| **POS** | Point of Sale | Hệ thống điểm bán hàng và thu ngân trực tiếp tại quầy dành cho Nhân viên bán hàng. |
| **CRM** | Customer Relationship Management | Phân hệ quản lý hồ sơ khách hàng thân thiết và tích điểm thưởng VIP (Đồng, Bạc, Vàng, Kim Cương). |
| **RAG** | Retrieval-Augmented Generation | Kỹ thuật kết hợp truy xuất dữ liệu có cấu trúc từ cơ sở dữ liệu với mô hình ngôn ngữ lớn để trả lời chính xác, chống ảo giác (hallucination). |
| **VietQR** | Vietnam Quick Response Code Standard | Chuẩn mã QR thanh toán liên ngân hàng quốc gia do Napas và Ngân hàng Nhà nước Việt Nam ban hành. |
| **JWT** | JSON Web Token | Chuẩn mã hóa chuỗi ký tự an toàn truyền tải giữa client và server để xác thực phiên đăng nhập. |
| **SKU** | Stock Keeping Unit | Đơn vị định danh quản lý hàng hóa và thuộc tính biến thể trong kho hàng. |
| **ACID** | Atomicity, Consistency, Isolation, Durability | 4 thuộc tính bảo đảm tính toàn vẹn tuyệt đối của các giao dịch cơ sở dữ liệu quan hệ. |

## 1.4 Tài liệu tham khảo
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*, IEEE Computer Society, 1998.
2. OMG Unified Modeling Language (OMG UML) Version 2.5.1 Specification.
3. Napas: *Đặc tả tiêu chuẩn kết nối kỹ thuật chuyển mạch tài chính và Cổng thanh toán VietQR Napas 247*, 2023.
4. Google Cloud: *Gemini API Documentation & Prompt Engineering Best Practices for Enterprise RAG*, 2024.
5. Kho mã nguồn và tài liệu kiến trúc dự án SZSHOP: `_Web_ZShop-main` (Vite, React 19, Express 5, Microsoft SQL Server).

---

# 2. MÔ TẢ TỔNG QUAN ỨNG DỤNG

## 2.1 Mô hình Use Case tổng thể (Chuẩn UML 2.5)
Hệ thống SZSHOP thống nhất phục vụ **4 tác nhân con người chính (Primary Actors)**: **Khách hàng (`Customer`)**, **Nhân viên bán hàng (`Sales Staff`)**, **Nhân viên kho (`Warehouse Staff`)**, **Admin - Chủ cửa hàng (`Admin / Store Owner`)**, cùng **2 tác nhân hệ thống ngoài (Secondary Actors)**:

```mermaid
flowchart LR
    Customer(["👤 Khách hàng<br/>(Customer)"])
    Sales(["🎧 Nhân viên bán hàng<br/>(Sales Staff)"])
    Warehouse(["📦 Nhân viên kho<br/>(Warehouse Staff)"])
    Admin(["👑 Admin - Chủ cửa hàng<br/>(Store Owner)"])

    PaymentGW(["💳 Cổng Thanh toán<br/>SZ-Payment"])
    AIService(["🤖 Hệ thống AI<br/>Gemini RAG"])

    subgraph ZSHOP["HỆ THỐNG CỬA HÀNG THƯƠNG MẠI ĐIỆN TỬ 3D & BÁN LẺ ZSHOP"]
        direction TB
        UC01("UC01: Đăng ký, Đăng nhập & Quản lý Nhân sự")
        UC02("UC02: Quản lý Danh mục & Sản phẩm 3D")
        UC03("UC03: Quản lý Khách hàng CRM & Điểm tích lũy VIP")
        UC04("UC04: Bán hàng POS & Đặt hàng Trực tuyến")
        UC04_INC("Thanh toán Đa kênh SZ-Payment")
        UC05("UC05: Quản lý Nhập kho & Kiểm kê Tồn kho")
        UC06("UC06: Báo cáo Doanh thu & Tra cứu Vận đơn")
        UC06_EXT("Xuất báo cáo Excel / PDF")
        UC07("UC07: Tư vấn Mua sắm bằng Trợ lý AI RAG")
        UC07_INC("Truy xuất ngữ cảnh Sản phẩm & Tồn kho CSDL")
        UC08("UC08: AI Khuyến nghị Nhập kho (Stock Copilot)")
        UC09("UC09: AI Hỏi đáp & Phân tích Kinh doanh (AI BI)")
        UC10("UC10: Quản lý Đổi trả & Hoàn tiền")
        UC10_INC("Thu hồi điểm thưởng tích lũy (Points Clawback)")

        UC04 -. "<<include>>" .-> UC04_INC
        UC06_EXT -. "<<extend>>" .-> UC06
        UC07 -. "<<include>>" .-> UC07_INC
        UC10 -. "<<include>>" .-> UC10_INC
    end

    Customer --> UC01
    Customer --> UC02
    Customer --> UC03
    Customer --> UC04
    Customer --> UC06
    Customer --> UC07
    Customer --> UC10

    Sales --> UC01
    Sales --> UC03
    Sales --> UC04
    Sales --> UC06
    Sales --> UC10

    Warehouse --> UC01
    Warehouse --> UC02
    Warehouse --> UC05
    Warehouse --> UC08

    Admin --> UC01
    Admin --> UC02
    Admin --> UC03
    Admin --> UC05
    Admin --> UC06
    Admin --> UC08
    Admin --> UC09
    Admin --> UC10

    UC04_INC --> PaymentGW
    UC07_INC --> AIService
    UC08 --> AIService
    UC09 --> AIService
```

## 2.2 Danh sách các tác nhân và mô tả (4 Tác nhân Con người & 2 Tác nhân Hệ thống ngoài)
| STT | Tác nhân (Actor) | Phân loại UML | Vai trò & Trách nhiệm nghiệp vụ trong hệ thống |
| :---: | :--- | :---: | :--- |
| 1 | **Khách hàng (Customer)** | Primary Actor | Người mua sắm tại cửa hàng (bao gồm cả trạng thái chưa đăng nhập khi xem sản phẩm 3D và đã đăng nhập khi đặt hàng). Tự đăng ký tài khoản thành viên (`UC01`), khám phá sản phẩm 3D (`UC02`), tích điểm VIP (`UC03`), đặt hàng & thanh toán trực tuyến (`UC04`), tra cứu vận đơn (`UC06`), hỏi đáp Chatbot AI RAG (`UC07`), và gửi yêu cầu đổi trả/hoàn tiền (`UC10`). |
| 2 | **Nhân viên bán hàng (Sales Staff)** | Primary Actor | Nhân sự vận hành thương mại & chăm sóc khách hàng của cửa hàng. Truy cập `CSKHPortalPage` & `POSPage` để bán hàng trực tiếp tại quầy POS (`UC04`), quản lý hồ sơ khách hàng thân thiết & cộng điểm thưởng (`UC03`), tra cứu điều phối đơn hàng (`UC06`), và phê duyệt yêu cầu đổi trả hoàn tiền kèm thu hồi điểm tích lũy (`UC10`). |
| 3 | **Nhân viên kho (Warehouse Staff)** | Primary Actor | Nhân sự phụ trách kho vận của cửa hàng. Truy cập `WarehousePage` để thêm mới/cập nhật sản phẩm & danh mục (`UC02`), lập phiếu nhập kho từ nhà cung cấp & kiểm kê tồn kho (`UC05`), và sử dụng AI Khuyến nghị Kho (`UC08`) để bổ sung nguồn hàng kịp thời. |
| 4 | **Admin - Chủ cửa hàng (Admin / Store Owner)** | Primary Actor | Người sở hữu và quản trị cao nhất của cửa hàng ZShop. Truy cập `AdminDashboard` để cấp phát & quản lý tài khoản nhân sự nội bộ (Nhân viên bán hàng & Nhân viên kho) (`UC01`), quản lý danh mục hàng hóa (`UC02`), giám sát báo cáo doanh thu & xuất Excel/PDF (`UC06`), hỏi đáp chiến lược cùng AI Business Intelligence (`UC09`), và cấu hình chính sách tích điểm cửa hàng (`UC03`). |
| 5 | **Cổng thanh toán SZ-Payment (Payment Gateway)** | Secondary Actor | Hệ thống thanh toán ngoài (VietQR Napas 247, VNPAY, MoMo, Thẻ quốc tế) khởi tạo mã QR động và phản hồi trạng thái giao dịch. |
| 6 | **Hệ thống AI Gemini RAG (AI Service)** | Secondary Actor | Hệ thống LLM đám mây nhận ngữ cảnh CSDL cửa hàng để tư vấn khách hàng (`UC07`), gợi ý nhập kho (`UC08`) và phân tích doanh số (`UC09`). |

## 2.3 Danh sách Use Case và mô tả (Chuẩn hóa UC01 - UC10)
| Mã UC | Tên Ca Sử Dụng | Phân hệ (Module) | Tác nhân thực hiện | Quan hệ UML (`<<include>>` / `<<extend>>`) | Mức ưu tiên |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **UC01** | Đăng ký, Đăng nhập & Quản lý Nhân sự | Xác thực & Nhân sự | Khách hàng, Nhân viên bán hàng, Nhân viên kho, Admin (Chủ cửa hàng) | Khách hàng tự đăng ký; Admin cấp phát & kích hoạt tài khoản Nhân viên bán hàng và Nhân viên kho. | Rất cao |
| **UC02** | Quản lý Danh mục & Sản phẩm 3D | Sản phẩm (Catalog & 3D) | Khách hàng, Nhân viên kho, Admin (Chủ cửa hàng) | Xem mô hình 3D WebGL xoay 360°, tìm kiếm/lọc sản phẩm; Thêm, sửa, xóa danh mục & sản phẩm cửa hàng. | Rất cao |
| **UC03** | Quản lý Khách hàng CRM & Điểm tích lũy VIP | Khách hàng (CRM & Loyalty) | Nhân viên bán hàng, Admin (Chủ cửa hàng), Khách hàng | Quản lý hạng thẻ (Đồng, Bạc, Vàng, Kim Cương), tự động tích điểm thưởng trên mỗi đơn hàng. | Cao |
| **UC04** | Bán hàng POS & Đặt hàng Trực tuyến | Đơn hàng & POS | Khách hàng, Nhân viên bán hàng, Payment Gateway | `<<include>> Thanh toán Đa kênh SZ-Payment` (VietQR Napas 247, VNPAY, MoMo, COD, Thu ngân POS). | Rất cao |
| **UC05** | Quản lý Nhập kho & Kiểm kê Tồn kho | Kho vận (Warehouse) | Nhân viên kho, Admin (Chủ cửa hàng) | Lập phiếu nhập kho (`NK-YYYY-XXXX`) từ nhà cung cấp, cộng tồn kho tự động và kiểm kê kho. | Cao |
| **UC06** | Báo cáo Doanh thu & Tra cứu Vận đơn | Báo cáo & Vận đơn | Admin (Chủ cửa hàng), Nhân viên bán hàng, Khách hàng | Tra cứu tiến trình đơn hàng 5 mốc; Thống kê doanh thu cửa hàng `<<extend>> Xuất báo cáo Excel / PDF`. | Cao |
| **UC07** | Tư vấn Mua sắm bằng Trợ lý AI RAG | AI Copilot (Khách hàng) | Khách hàng, Gemini AI Service | `<<include>> Truy xuất ngữ cảnh Sản phẩm & Tồn kho từ CSDL` để tư vấn chính xác không ảo giác. | Cao |
| **UC08** | AI Khuyến nghị Nhập kho (Stock Copilot) | AI Kho vận (Warehouse AI) | Nhân viên kho, Admin (Chủ cửa hàng), Gemini AI Service | Phân tích tốc độ tiêu thụ và cảnh báo mặt hàng tồn kho thấp (`stock <= 40`) để gợi ý số lượng nhập. | Trung bình |
| **UC09** | AI Hỏi đáp & Phân tích Kinh doanh (AI BI) | AI Quản trị (Executive AI) | Admin (Chủ cửa hàng), Gemini AI Service | Trợ lý AI phân tích doanh số, tỷ lệ chuyển đổi, hiệu quả tích điểm và đề xuất chiến lược kinh doanh. | Trung bình |
| **UC10** | Quản lý Đổi trả, Hoàn tiền & Thu hồi Điểm | CSKH & Hậu mãi (Returns) | Khách hàng, Nhân viên bán hàng, Admin (Chủ cửa hàng) | Xử lý đổi size / hoàn tiền đơn hàng, bắt buộc `<<include>> Thu hồi điểm thưởng tích lũy (Points Clawback)`. | Cao |

## 2.4 Các điều kiện phụ thuộc
1. **Môi trường kết nối mạng & Băng thông:**
   - Hệ thống yêu cầu đường truyền Internet liên tục giữa máy khách và máy chủ với băng thông tối thiểu 2 Mbps để truyền tải mô hình 3D (file GLTF/OBJ/Textures dung lượng 1MB - 5MB) và nhận diện luồng phản hồi streaming từ mô hình trí tuệ nhân tạo.
2. **Yêu cầu hỗ trợ đồ họa phần cứng WebGL trên Client:**
   - Thiết bị người dùng (PC, Laptop, Smartphone, Tablet) phải sở hữu trình điều khiển đồ họa (GPU driver) hỗ trợ chuẩn WebGL 2.0. Các trình duyệt tương thích bao gồm: Google Chrome v100 trở lên, Microsoft Edge v100 trở lên, Mozilla Firefox v110 trở lên, Apple Safari v16 trở lên.
3. **Môi trường hạ tầng máy chủ & Cơ sở dữ liệu:**
   - Máy chủ ứng dụng Backend chạy môi trường thực thi Node.js (phiên bản khuyến nghị LTS v18.x hoặc v20.x, Express v5.2.1).
   - Hệ thống lưu trữ dữ liệu chính thức kết nối cơ sở dữ liệu quan hệ Microsoft SQL Server (MSSQL 2019 / 2022). Trong trường hợp ngắt kết nối mạng doanh nghiệp, tầng dịch vụ Frontend/Backend kích hoạt cơ chế Fallback sang kho lưu trữ cục bộ (In-Memory Mock Database) bảo đảm độ sẵn sàng 100% không bị gián đoạn trải nghiệm người dùng.
4. **Phụ thuộc vào các dịch vụ đám mây bên thứ ba:**
   - Dịch vụ xác thực danh tính Google OAuth 2.0 (Google Identity Services Client ID) và Apple Sign-in Services.
   - Cổng kết nối API Napas247 / VietQR để định dạng chuỗi mã QR thanh toán chuẩn EMVCo.
   - API Google Gemini 1.5 Flash / Pro (Google AI Studio) với hạn mức API Key hoạt động ổn định phục vụ tính năng AI Sales Copilot.

---

# 3. ĐẶC TẢ CÁC YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

## 3.1 UC001_Đăng ký, Đăng nhập & Xác thực Hệ thống

### 3.1.1 Mô tả use case UC001
- **Tên Use Case:** Đăng ký, Đăng nhập & Xác thực Hệ thống (User Authentication & SSO Module).
- **Mã định danh:** `UC001`.
- **Tác nhân tham gia:** Khách hàng (Customer), Nhân viên bán hàng (Sales Staff), Nhân viên kho (Warehouse Staff), Admin - Chủ cửa hàng (Admin).
- **Mục đích:** Cung cấp giải pháp nhận dạng, đăng ký tài khoản Khách hàng mới, xác thực thông tin đăng nhập đa kênh (Email/Mật khẩu và Single Sign-On qua Google/Facebook/Apple), đổi mật khẩu, khởi tạo phiên làm việc bảo mật (JWT) và phân quyền 4 tác nhân vào các phân hệ chức năng tương ứng (Cửa hàng mua sắm, Cổng Bán hàng POS & CSKH, Quản lý Kho hàng, và Admin Dashboard).
- **Tiền điều kiện:** Người dùng đã truy cập vào hệ thống SZSHOP và có kết nối Internet ổn định.
- **Hậu điều kiện:**
  - Nếu xác thực thành công: Hệ thống lưu phiên đăng nhập (JWT token và thông tin UserRole), giao diện chuyển hướng về trang đích tương ứng (Khách hàng về Trang chủ/Giỏ hàng; Nhân viên bán hàng về Cổng Bán hàng POS & CSKH; Nhân viên kho về Quản lý Kho hàng; Admin về AdminDashboard).
  - Nếu thất bại: Phiên làm việc không được cấp phát, hệ thống hiển thị thông báo lỗi cụ thể để người dùng thao tác lại.
- **Luồng sự kiện chính (Basic Flow - Đăng nhập chuẩn):**
  1. Người dùng bấm chọn nút "Đăng nhập" trên thanh điều hướng Header.
  2. Hệ thống hiển thị giao diện Màn hình Đăng nhập (`LoginPage.tsx`) gồm 4 nút chọn nhanh vai trò chuẩn UML (`Khách hàng`, `Nhân viên bán hàng`, `Nhân viên kho`, `Admin - Chủ cửa hàng`), ô nhập Email, Mật khẩu, nút "Đăng nhập", tùy chọn "Quên mật khẩu?", liên kết "Đăng ký ngay" và nút đăng nhập Google.
  3. Người dùng nhập địa chỉ Email và Mật khẩu hợp lệ, sau đó nhấn nút "ĐĂNG NHẬP".
  4. Hệ thống client kiểm tra định dạng dữ liệu (email đúng cấu trúc, mật khẩu không để trống), sau đó gửi yêu cầu `POST /api/auth/login` kèm payload `{ email, password }` đến Backend server.
  5. Backend thực hiện truy vấn bảng `Users` trong SQL Server theo email:
     - Kiểm tra sự tồn tại của tài khoản.
     - So khớp chuỗi băm mật khẩu (Hash verification).
     - Đọc vai trò tương ứng từ bảng `Roles` (`CUSTOMER`, `SALES`, `WAREHOUSE`, hoặc `ADMIN`).
  6. Backend khởi tạo mã JWT token chứa `userId`, `email`, `role` và phản hồi kết quả `{ success: true, token, user }`.
  7. Frontend lưu trữ token, cập nhật trạng thái `userRole` trên toàn bộ ứng dụng và chuyển hướng người dùng đến giao diện phù hợp:
     - Vai trò `ADMIN` (Admin - Chủ cửa hàng): Chuyển hướng đến `AdminDashboard`.
     - Vai trò `SALES` (Nhân viên bán hàng): Chuyển hướng đến `CSKHPortalPage` / `POSPage`.
     - Vai trò `WAREHOUSE` (Nhân viên kho): Chuyển hướng đến `WarehousePage`.
     - Vai trò `CUSTOMER` (Khách hàng): Giữ nguyên trang hiện tại hoặc chuyển về `ShopeeHomePage` với trạng thái đã đăng nhập.
- **Các luồng thay thế & Luồng ngoại lệ (Alternative & Exception Flows):**
  - *Luồng thay thế 1 (Đăng ký tài khoản Khách hàng mới):* Tại bước 2, khách hàng bấm "Đăng ký ngay". Hệ thống hiển thị `RegisterPage.tsx` (chỉ dành cho tác nhân Khách hàng `CUSTOMER`, không có đăng ký Nhà bán hàng đa gian hàng). Khách hàng nhập Họ tên, Email, Mật khẩu, Xác nhận mật khẩu. Frontend gọi `POST /api/auth/register`. Backend kiểm tra email chưa tồn tại, tạo bản ghi mới trong bảng `Users` và `Customers`, tự động gán vai trò `CUSTOMER` và trả về thông báo tạo tài khoản thành công.
  - *Luồng thay thế 2 (Đăng nhập một chạm Google OAuth SSO):* Tại bước 2, khách hàng bấm nút biểu tượng Google. Modal chọn tài khoản Google xuất hiện. Frontend gửi `POST /api/auth/social-login`. Nếu tài khoản chưa từng tồn tại, backend tự động khởi tạo User mới với vai trò `CUSTOMER`.
  - *Luồng thay thế 3 (Quên mật khẩu):* Tại bước 2, người dùng bấm "Quên mật khẩu?". Hệ thống hiển thị `ForgotPasswordPage.tsx` để gửi yêu cầu đặt lại mật khẩu.
  - *Luồng ngoại lệ 1 (Sai thông tin đăng nhập):* Tại bước 5, nếu email không tồn tại hoặc mật khẩu sai, Backend trả về mã lỗi HTTP 401 `{ success: false, error: 'Email hoặc mật khẩu không chính xác' }`.
  - *Luồng ngoại lệ 2 (Chế độ Smart Offline Fallback):* Nếu dịch vụ SQL Server chưa khởi động, hệ thống tự động kích hoạt chế độ Demo Offline với 4 tài khoản mẫu chuẩn UML (`customer@test.com`, `sales@test.com`, `warehouse@test.com`, `admin@test.com`).

### 3.1.2 Biểu đồ UC001

#### Biểu đồ hoạt động (Activity Diagram) - Xác thực & Phân quyền 4 Tác nhân UML
```mermaid
flowchart TD
    Start([Bắt đầu: Người dùng chọn Đăng nhập]) --> Choice{Chọn hình thức xác thực}
    
    Choice -- Email & Mật khẩu --> InputCreds[Nhập Email và Mật khẩu]
    InputCreds --> ValidateClient{Hợp lệ định dạng?}
    ValidateClient -- Không --> ShowErr1[Hiển thị cảnh báo lỗi nhập liệu] --> InputCreds
    ValidateClient -- Có --> SendAuthReq[Gửi POST /api/auth/login]
    SendAuthReq --> CheckDB{Kiểm tra CSDL SQL Server}
    CheckDB -- Sai Email/Mật khẩu --> ShowErr2[Báo lỗi: Sai thông tin tài khoản] --> InputCreds
    CheckDB -- Hợp lệ --> GenToken[Tạo JWT Token & Xác định Role]
    
    Choice -- Google SSO --> ClickGoogle[Bấm Đăng nhập Google]
    ClickGoogle --> SelectAccount[Chọn tài khoản Google]
    SelectAccount --> SendGoogleReq[Gửi POST /api/auth/social-login]
    SendGoogleReq --> GenToken

    GenToken --> SaveSession[Lưu JWT vào Storage]
    SaveSession --> RouteRole{Phân loại 4 Tác nhân UML}
    RouteRole -- ADMIN --> NavAdmin[Điều hướng đến AdminDashboard - Chủ cửa hàng] --> EndAuth([Đăng nhập thành công])
    RouteRole -- SALES --> NavSales[Điều hướng đến Cổng Nhân viên Bán hàng POS & CSKH] --> EndAuth
    RouteRole -- WAREHOUSE --> NavWarehouse[Điều hướng đến Quản lý Kho hàng - Nhân viên Kho] --> EndAuth
    RouteRole -- CUSTOMER --> NavHome[Điều hướng về Cửa hàng mua sắm 3D - Khách hàng] --> EndAuth
```

#### Biểu đồ tuần tự (Sequence Diagram) - Đăng nhập hệ thống 4 Tác nhân
```mermaid
sequenceDiagram
    autonumber
    actor User as Tác nhân (Customer / Sales / Warehouse / Admin)
    participant UI as Giao diện LoginPage
    participant Service as AuthService
    participant API as Express Router (/api/auth)
    participant DB as SQL Server Database

    User->>UI: Chọn tab vai trò hoặc nhập email, password và bấm "Đăng nhập"
    UI->>Service: login(email, password)
    Service->>API: POST /api/auth/login { email, password }
    API->>DB: SELECT * FROM Users WHERE email = @email
    alt Thông tin không hợp lệ
        DB-->>API: Trả về null hoặc sai mật khẩu
        API-->>Service: 401 Unauthorized
        Service-->>UI: Báo lỗi thất bại
        UI-->>User: Hiển thị thông báo: Sai tài khoản hoặc mật khẩu
    else Xác thực thành công
        API->>DB: SELECT name FROM Roles WHERE id = @role_id
        DB-->>API: Trả về RoleName ('CUSTOMER' | 'SALES' | 'WAREHOUSE' | 'ADMIN')
        API->>API: Ký sinh chuỗi JWT Token (hạn 24 giờ)
        API-->>Service: 200 OK { success: true, token, user }
        Service-->>UI: Phản hồi đăng nhập thành công
        UI-->>User: Điều hướng tới phân hệ của đúng tác nhân (Home / POS-CSKH / Warehouse / Admin)
    end
```

---

## 3.2 UC002_Khám phá & Tìm kiếm Sản phẩm Không gian 3D

### 3.2.1 Mô tả use case UC002
- **Tên Use Case:** Khám phá & Tìm kiếm Sản phẩm Không gian 3D (3D Spatial Catalog & Product Discovery).
- **Mã định danh:** `UC002`.
- **Tác nhân tham gia:** Khách vãng lai (Guest), Khách hàng (Customer).
- **Mục đích:** Cung cấp trải nghiệm thị giác đa chiều cho người dùng thông qua không gian 3D tương tác WebGL trên Landing Page, duyệt danh mục sản phẩm theo phong cách Bento Grid hiện đại, tìm kiếm từ khóa với gợi ý tức thì, xem chi tiết sản phẩm và tương tác chọn biến thể (màu sắc, size) phục vụ quyết định mua hàng.
- **Tiền điều kiện:** Người dùng truy cập trang chủ của ứng dụng SZSHOP.
- **Hậu điều kiện:** Người dùng xem được mô hình 3D, danh sách sản phẩm theo danh mục hoặc từ khóa mong muốn và mở trang chi tiết sản phẩm tương ứng.
- **Luồng sự kiện chính (Basic Flow):**
  1. Người dùng mở trang chủ `LandingPage3D.tsx` hoặc chuyển sang chế độ `ShopeeHomePage.tsx`.
  2. Tại giao diện Landing 3D, hệ thống khởi tạo khung nhìn đồ họa Three.js (`ThreeScene.tsx`):
     - Dựng không gian ánh sáng đa chiều (Ambient Light, Directional Light, Point Light).
     - Tải mô hình 3D sản phẩm thời trang/công nghệ và kích hoạt vòng lặp chuyển động quay 360° mượt mà (60 FPS).
     - Hiển thị khối Bento Grid tương tác với các hiệu ứng chiều sâu 3D (hover tilt, scale shadow).
  3. Người dùng nhấp chuột hoặc vuốt cảm ứng trên màn hình: mô hình 3D xoay theo góc tương tác của người dùng.
  4. Người dùng bấm "Khám phá Cửa hàng" để chuyển sang `ShopeeHomePage.tsx`:
     - Hệ thống tải banner khuyến mãi, danh mục phân loại (`Categories.tsx`), sản phẩm Flash Sale kèm bộ đếm ngược thời gian thực, và lưới sản phẩm tổng hợp (`ProductGrid.tsx`).
  5. Người dùng nhập từ khóa tìm kiếm (ví dụ: "Áo polo", "Giày", "Gucci") vào thanh tìm kiếm trên Header.
  6. Sau mỗi ký tự được nhập (debounce 250ms), hệ thống gọi hàm `SanPhamService.timKiemSanPham(tuKhoa)`. Bảng gợi ý thả xuống (Search Dropdown) hiển thị danh sách sản phẩm phù hợp kèm hình ảnh thu nhỏ và đơn giá.
  7. Người dùng bấm chọn một sản phẩm từ danh sách tìm kiếm hoặc từ lưới sản phẩm.
  8. Hệ thống điều hướng sang `ProductDetailPage.tsx`:
     - Tải đầy đủ thông tin: Tên sản phẩm, mã SKU, thương hiệu, đánh giá sao (rating), số lượt đã bán, khoảng giá khuyến mãi, chính sách giao hàng dự kiến.
     - Hiển thị bộ sưu tập ảnh và video sản phẩm.
     - Cho phép người dùng chọn Màu sắc (Color picker) và Kích thước (Size selector: S, M, L, XL, Freesize). Hệ thống cập nhật tình trạng tồn kho khả dụng tương ứng.
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng thay thế 1 (Lọc theo danh mục):* Người dùng bấm vào một biểu tượng danh mục trên thanh `Categories.tsx` (ví dụ: "Thời trang nam", "Giày dép", "Phụ kiện"). Hệ thống lọc lại danh sách sản phẩm trong `ProductGrid` theo đúng mã danh mục tương ứng.
  - *Luồng ngoại lệ 1 (Không tìm thấy sản phẩm):* Nếu từ khóa tìm kiếm không khớp với bất kỳ bản ghi nào trong hệ thống, dropdown hiển thị thông báo: "Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn" kèm icon hộp hàng trống và gợi ý từ khóa phổ biến.
  - *Luồng ngoại lệ 2 (Thiết bị không hỗ trợ WebGL):* Nếu GPU hoặc trình duyệt của người dùng bị tắt tính năng tăng tốc phần cứng WebGL, hệ thống tự động phát hiện qua `WEBGL.isWebGLAvailable()` và hiển thị banner ảnh 2D tĩnh chất lượng cao thay thế khung nhìn 3D nhằm đảm bảo tính toàn vẹn của trang web.

### 3.2.2 Biểu đồ UC002

#### Biểu đồ hoạt động (Activity Diagram) - Khám phá sản phẩm 3D & Tìm kiếm
```mermaid
flowchart TD
    Start([Bắt đầu: Truy cập SZSHOP]) --> CheckWebGL{Trình duyệt hỗ trợ WebGL?}
    CheckWebGL -- Có --> Render3D[Khởi tạo Three.js Scene: Quay 360 độ & Bento Grid 3D]
    CheckWebGL -- Không --> Render2D[Hiển thị giao diện 2D tĩnh dự phòng]
    Render3D --> Interact3D[Người dùng tương tác xoay góc nhìn 3D]
    Render2D --> GoStore[Bấm 'Khám phá Cửa hàng']
    Interact3D --> GoStore
    GoStore --> LoadHome[Tải ShopeeHomePage: Danh mục, Flash Sale, Lưới sản phẩm]
    
    LoadHome --> UserAction{Thao tác của người dùng}
    UserAction -- Chọn Danh mục --> FilterCat[Lọc danh mục tương ứng] --> UpdateGrid[Cập nhật lưới sản phẩm]
    UserAction -- Tìm kiếm từ khóa --> InputSearch[Gõ từ khóa trên Header]
    InputSearch --> Debounce[Debounce 250ms & Gọi SanPhamService]
    Debounce --> HasResult{Có kết quả khớp?}
    HasResult -- Có --> ShowDropdown[Hiển thị danh sách gợi ý sản phẩm]
    HasResult -- Không --> ShowEmptySearch[Báo: Không tìm thấy sản phẩm]
    
    ShowDropdown --> SelectItem[Bấm chọn sản phẩm cụ thể]
    UpdateGrid --> SelectItem
    SelectItem --> ViewDetail[Mở ProductDetailPage: Chi tiết, Tồn kho, Chọn Màu/Size]
    ViewDetail --> End([Kết thúc khám phá sản phẩm])
```

#### Biểu đồ tuần tự (Sequence Diagram) - Tìm kiếm & Xem chi tiết sản phẩm
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    participant Header as Component Header
    participant ProductGrid as Component ProductGrid
    participant Service as SanPhamService
    participant DB as HeThongBanHangDB / MSSQL
    participant DetailPage as ProductDetailPage

    Customer->>Header: Nhập từ khóa "Áo polo" vào ô tìm kiếm
    Header->>Service: timKiemSanPham("Áo polo")
    Service->>DB: searchSanPham("Áo polo")
    DB-->>Service: Trả về danh sách ProductDetail[] khớp tên/danh mục
    Service-->>Header: Danh sách 5 sản phẩm phù hợp nhất
    Header-->>Customer: Hiển thị danh sách gợi ý dạng Dropdown kết quả
    Customer->>Header: Nhấp chuột chọn sản phẩm "Áo Polo Nam Maxi GG"
    Header->>DetailPage: Điều hướng sang ProductDetailPage(id: "p1")
    DetailPage->>Service: layChiTietSanPham("p1")
    Service->>DB: getSanPhamById("p1")
    DB-->>Service: Trả về chi tiết đầy đủ (Ảnh, Video, Màu, Size, Giá, Tồn kho)
    Service-->>DetailPage: Dữ liệu ProductDetail hoàn chỉnh
    DetailPage-->>Customer: Render thông tin sản phẩm, chọn biến thể Màu: Đen, Size: L
```

---

## 3.3 UC003_Quản lý Giỏ hàng Đa năng (Cart Management & MiniCart)

### 3.3.1 Mô tả use case UC003
- **Tên Use Case:** Quản lý Giỏ hàng Đa năng (Cart Management & Slide-over MiniCart).
- **Mã định danh:** `UC003`.
- **Tác nhân tham gia:** Khách vãng lai (Guest), Khách hàng (Customer).
- **Mục đích:** Cho phép người dùng thêm các sản phẩm với tùy chọn thuộc tính cụ thể vào giỏ hàng, xem nhanh nội dung giỏ hàng thông qua bảng trượt MiniCart từ cạnh phải màn hình, cập nhật tăng giảm số lượng, xóa sản phẩm không mong muốn và tự động cập nhật tổng tiền thanh toán tạm tính.
- **Tiền điều kiện:** Người dùng đang ở màn hình xem chi tiết sản phẩm (`ProductDetailPage`) hoặc bất kỳ trang nào có nút mở giỏ hàng trên Header.
- **Hậu điều kiện:** Trạng thái giỏ hàng (`cartItems`) được cập nhật trên giao diện và đồng bộ với dịch vụ lưu trữ (State & Backend DB).
- **Luồng sự kiện chính (Basic Flow):**
  1. Tại trang chi tiết sản phẩm, sau khi đã chọn Màu sắc và Kích thước mong muốn, người dùng nhấn nút "Thêm vào giỏ hàng".
  2. Hệ thống gọi hàm `handleAddToCart`:
     - Kiểm tra sản phẩm và biến thể đã có trong giỏ hàng hay chưa.
     - Nếu đã tồn tại: Tăng số lượng (`quantity = quantity + 1`).
     - Nếu chưa tồn tại: Tạo mới phần tử `CartItem` gồm `id`, `name`, `price`, `quantity`, `image`, `variant` (kết hợp Màu + Size).
  3. Badge số lượng trên biểu tượng Giỏ hàng ở Header lập tức tăng tương ứng.
  4. Hệ thống mở bảng trượt `MiniCart.tsx` từ cạnh phải màn hình (slide-over animation 300ms) kèm hiệu ứng backdrop mờ nền.
  5. Bảng MiniCart hiển thị:
     - Danh sách từng mặt hàng (Ảnh thu nhỏ, tên, biến thể size/màu, đơn giá, bộ nút tăng `+` / giảm `-` số lượng, icon nút xóa thùng rác).
     - Khu vực chân trang: Số tiền "Tạm tính" (Subtotal = Tổng của đơn giá x số lượng) và nút "Thanh toán ngay".
  6. Người dùng nhấn nút tăng `+` hoặc giảm `-` trên một mặt hàng:
     - Hệ thống gọi `updateCartQuantity(itemId, newQty)`.
     - Tự động kiểm tra số lượng tồn kho khả dụng tối đa.
     - Tính toán lại giá trị Tạm tính trong thời gian thực.
  7. Người dùng bấm "Thanh toán ngay", hệ thống đóng MiniCart và chuyển tiếp sang trang Xác nhận Đơn hàng (`OrderConfirmationPage.tsx`).
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng thay thế 1 (Xóa mặt hàng):* Người dùng nhấn vào biểu tượng Thùng rác bên cạnh một sản phẩm trong MiniCart. Hệ thống gọi `removeFromCart(itemId)`, gỡ bỏ sản phẩm khỏi danh sách và cập nhật lại tổng tiền. Nếu giỏ hàng trống, MiniCart hiển thị hình ảnh giỏ hàng rỗng và nút "Tiếp tục mua sắm".
  - *Luồng ngoại lệ 1 (Thêm vượt quá số lượng tồn kho):* Nếu người dùng nhấn tăng số lượng vượt quá số lượng hàng có trong kho (`stock`), hệ thống vô hiệu hóa nút `+` và hiển thị thông báo nhỏ "Đã đạt giới hạn tồn kho của sản phẩm".

### 3.3.2 Biểu đồ UC003

#### Biểu đồ hoạt động (Activity Diagram) - Quản lý Giỏ hàng
```mermaid
flowchart TD
    Start([Bắt đầu: Thao tác giỏ hàng]) --> Action{Hành động của người dùng}
    
    Action -- Thêm vào giỏ từ Trang Chi tiết --> CheckSelect{Đã chọn Màu & Size?}
    CheckSelect -- Chưa --> ShowAlert[Yêu cầu người dùng chọn thuộc tính] --> EndCart([Kết thúc])
    CheckSelect -- Rồi --> CheckExist{Sản phẩm đã có trong giỏ?}
    CheckExist -- Đã có --> IncQty[Tăng số lượng mặt hàng trong giỏ]
    CheckExist -- Chưa có --> AddNewItem[Thêm CartItem mới vào danh sách]
    IncQty --> UpdateBadge[Cập nhật Badge số lượng trên Header]
    AddNewItem --> UpdateBadge
    UpdateBadge --> OpenMiniCart[Mở bảng trượt MiniCart từ bên phải]
    
    Action -- Mở trực tiếp MiniCart --> ClickCartIcon[Bấm icon Giỏ hàng trên Header] --> OpenMiniCart
    
    OpenMiniCart --> MiniCartAction{Tương tác trên MiniCart}
    MiniCartAction -- Bấm nút '+' --> CheckStock{Còn tồn kho?}
    CheckStock -- Còn --> Add1[Tăng quantity + 1] --> Recalc[Tính lại Tạm tính]
    CheckStock -- Hết --> AlertMaxStock[Báo hết hàng trong kho] --> MiniCartAction
    
    MiniCartAction -- Bấm nút '-' --> CheckMinQty{Số lượng > 1?}
    CheckMinQty -- Đúng --> Sub1[Giảm quantity - 1] --> Recalc
    CheckMinQty -- Sai --> ConfirmDel{Xác nhận xóa khỏi giỏ?}
    ConfirmDel -- Đồng ý --> RemoveItem[Xóa phần tử khỏi giỏ] --> Recalc
    ConfirmDel -- Hủy --> MiniCartAction
    
    MiniCartAction -- Bấm nút Thùng rác --> RemoveItem
    Recalc --> MiniCartAction
    
    MiniCartAction -- Bấm 'Thanh toán ngay' --> CheckLoginCart{Đã đăng nhập?}
    CheckLoginCart -- Chưa --> RedirectLogin[Chuyển hướng đến LoginPage]
    CheckLoginCart -- Rồi --> GoCheckout[Chuyển hướng đến OrderConfirmationPage]
    GoCheckout --> EndCart
```

#### Biểu đồ tuần tự (Sequence Diagram) - Thao tác Thêm & Cập nhật Giỏ hàng
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    participant PDP as ProductDetailPage
    participant App as App Component State
    participant MiniCart as Component MiniCart
    participant Service as GioHangService

    Customer->>PDP: Chọn Màu: "Trắng", Size: "M", bấm "Thêm vào giỏ hàng"
    PDP->>App: handleAddToCart(item)
    App->>Service: kiemTraTonKho(productId, quantity)
    Service-->>App: Tồn kho hợp lệ (Còn 45 sản phẩm)
    App->>App: Cập nhật cartItems (Thêm mới hoặc tăng quantity)
    App->>App: setIsMiniCartOpen(true)
    App-->>MiniCart: Truyền cartItems và hiển thị slide-over panel
    MiniCart-->>Customer: Hiển thị bảng giỏ hàng trượt và tổng tiền tạm tính
    Customer->>MiniCart: Nhấn nút '+' tăng số lượng sản phẩm lên 2
    MiniCart->>App: handleUpdateQuantity(id, 2)
    App->>App: Tính lại Subtotal = đơn giá x 2
    App-->>MiniCart: Render số lượng mới và tổng tạm tính cập nhật
    Customer->>MiniCart: Nhấp nút "Thanh toán ngay"
    MiniCart->>App: onCheckout()
    App->>App: setCurrentView('confirmation')
    App-->>Customer: Chuyển màn hình sang OrderConfirmationPage
```

---

## 3.4 UC004_Xác nhận Đơn hàng & Thiết lập Giao nhận (Checkout)

### 3.4.1 Mô tả use case UC004
- **Tên Use Case:** Xác nhận Đơn hàng & Thiết lập Giao nhận (Order Confirmation & Checkout).
- **Mã định danh:** `UC004`.
- **Tác nhân tham gia:** Khách hàng (Customer).
- **Mục đích:** Cung cấp quy trình kiểm tra thông tin kiện hàng, nhập thông tin liên hệ và địa chỉ nhận hàng, chọn mã giảm giá ưu đãi (Voucher), tính toán chi phí vận chuyển, cam kết điều khoản mua hàng và khởi tạo đơn hàng chính thức trong hệ thống.
- **Tiền điều kiện:** Giỏ hàng của khách hàng có ít nhất 01 sản phẩm hợp lệ và khách hàng đã đăng nhập.
- **Hậu điều kiện:** Đơn hàng được tạo thành công với mã định danh duy nhất (ví dụ: `DH-20241228`) ở trạng thái `PENDING` trong cơ sở dữ liệu.
- **Luồng sự kiện chính (Basic Flow):**
  1. Người dùng bấm "Thanh toán ngay" từ giỏ hàng, hệ thống hiển thị `OrderConfirmationPage.tsx`.
  2. Màn hình chia làm 2 cột nghiệp vụ:
     - **Cột trái:** Form "Thông tin giao hàng" gồm các trường: Họ và tên người nhận, Số điện thoại, Địa chỉ nhận hàng chi tiết, Ghi chú đơn hàng. Kèm theo phần chọn "Mã giảm giá SZSHOP" (`AVAILABLE_COUPONS`).
     - **Cột phải:** "Tóm tắt đơn hàng" hiển thị danh sách các món hàng, Tạm tính, Phí vận chuyển tiêu chuẩn (30.000 đ), Số tiền giảm giá từ Coupon, và "TỔNG CỘNG" thanh toán cuối cùng.
  3. Người dùng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.
  4. Người dùng bấm chọn mã khuyến mãi:
     - Mã `SZWELCOME`: Giảm 20.000 đ cho đơn hàng đầu tiên.
     - Mã `FREESHIP`: Miễn phí vận chuyển toàn quốc (tối đa 30.000 đ).
     - Mã `SALE50`: Giảm 50.000 đ cho các đơn hàng từ 1.000.000 đ trở lên.
  5. Hệ thống tính toán lại tổng tiền: `Tổng = Tạm tính + Phí ship - Giảm giá`.
  6. Người dùng tích chọn ô xác nhận: "Tôi đồng ý với điều khoản mua hàng của SZSHOP".
  7. Người dùng bấm nút "XÁC NHẬN ĐẶT HÀNG".
  8. Hệ thống gọi `DatHangService.taoDonHangNhap(cartItems, customerInfo)`:
     - Tạo bản ghi mới trong bảng `Orders` (trạng thái `Pending`).
     - Tạo các bản ghi chi tiết kiện hàng trong bảng `OrderItems`.
  9. Hệ thống chuyển tiếp người dùng sang trang Thanh toán Đa kênh `CheckoutPage.tsx`.
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng ngoại lệ 1 (Bỏ trống thông tin giao hàng):* Nếu người dùng chưa điền đầy đủ Họ tên, Số điện thoại hoặc Địa chỉ, nút "Xác nhận đặt hàng" hiển thị thông báo yêu cầu bổ sung thông tin bắt buộc.
  - *Luồng ngoại lệ 2 (Áp dụng coupon không đủ điều kiện):* Nếu người dùng chọn mã `SALE50` khi tổng đơn hàng nhỏ hơn 1.000.000 đ, hệ thống cảnh báo: "Mã giảm giá chỉ áp dụng cho đơn hàng từ 1.000.000 đ" và không trừ tiền giảm giá.

### 3.4.2 Biểu đồ UC004

#### Biểu đồ hoạt động (Activity Diagram) - Xác nhận Đơn hàng
```mermaid
flowchart TD
    Start([Bắt đầu: Mở trang OrderConfirmationPage]) --> DisplayReview[Hiển thị danh sách hàng & Form thông tin]
    DisplayReview --> InputCustomer[Nhập Họ tên, SĐT, Địa chỉ nhận hàng]
    InputCustomer --> ChooseCoupon{Có áp dụng Coupon?}
    ChooseCoupon -- Có --> CheckCondition{Đạt điều kiện Coupon?}
    CheckCondition -- Đạt --> ApplyDiscount[Trừ tiền giảm giá vào Tổng cộng]
    CheckCondition -- Không đạt --> ShowCouponErr[Báo lỗi điều kiện áp dụng] --> ApplyDiscount
    ChooseCoupon -- Không --> KeepTotal[Giữ nguyên Tổng cộng mặc định]
    
    ApplyDiscount --> CheckAgree{Tích chọn 'Đồng ý điều khoản'?}
    KeepTotal --> CheckAgree
    CheckAgree -- Chưa tích --> DisableBtn[Vô hiệu hóa nút Xác nhận Đặt hàng] --> CheckAgree
    CheckAgree -- Đã tích --> EnableBtn[Kích hoạt nút 'XÁC NHẬN ĐẶT HÀNG']
    
    EnableBtn --> ClickConfirm[Người dùng nhấn Xác nhận đặt hàng]
    ClickConfirm --> CallService[Gọi DatHangService.taoDonHangNhap]
    CallService --> InsertDB[Ghi dữ liệu vào Orders & OrderItems với status = PENDING]
    InsertDB --> NavPayment[Điều hướng sang trang Cổng thanh toán CheckoutPage]
    NavPayment --> End([Chuyển giao sang quy trình thanh toán])
```

#### Biểu đồ tuần tự (Sequence Diagram) - Xác nhận Đơn hàng
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    participant Page as OrderConfirmationPage
    participant Service as DatHangService
    participant DB as HeThongBanHangDB / MSSQL
    participant NextPage as CheckoutPage

    Customer->>Page: Nhập họ tên, SĐT, địa chỉ giao hàng
    Customer->>Page: Chọn Coupon "FREESHIP" (Giảm 30.000đ)
    Page->>Page: Kiểm tra điều kiện & Cập nhật Tổng tiền = Tạm tính - 30.000đ
    Customer->>Page: Tích chọn "Tôi đồng ý với điều khoản" và bấm "Xác nhận đặt hàng"
    Page->>Service: taoDonHangNhap(cartItems, formData)
    Service->>DB: INSERT INTO Orders (customer_id, total_amount, status) VALUES (...)
    DB-->>Service: Khởi tạo Order thành công (Mã: 'DH-20241228')
    Service->>DB: INSERT INTO OrderItems (order_id, product_id, quantity, unit_price...)
    DB-->>Service: Ghi nhận thành công các kiện hàng
    Service-->>Page: Trả về đối tượng Order hoàn chỉnh
    Page->>NextPage: Điều hướng sang CheckoutPage(orderId: 'DH-20241228')
    NextPage-->>Customer: Render giao diện lựa chọn cổng thanh toán SZ-Payment
```

---

## 3.5 UC005_Thanh toán Trực tuyến Đa kênh SZ-Payment Gateway

### 3.5.1 Mô tả use case UC005
- **Tên Use Case:** Thanh toán Trực tuyến Đa kênh SZ-Payment Gateway (Multi-Channel Payment Processing & Digital Receipt).
- **Mã định danh:** `UC005`.
- **Tác nhân tham gia:** Khách hàng (Customer), Cổng thanh toán bên thứ ba (VietQR/VNPAY/MoMo).
- **Mục đích:** Cung cấp giải pháp thanh toán điện tử an toàn, tiện lợi với đa dạng phương thức, tích hợp sinh mã QR động chuẩn quốc gia, đếm ngược thời gian phiên giao dịch 15 phút, xác thực trạng thái thanh toán và xuất hóa đơn điện tử 3D số kèm mã giao dịch `TRX`.
- **Tiền điều kiện:** Đơn hàng đã được khởi tạo ở trạng thái `PENDING` từ Use Case UC004.
- **Hậu điều kiện:** Đơn hàng được cập nhật trạng thái `PAID`, bản ghi thanh toán được lưu vết trong bảng `Payments`, và người dùng nhận được hóa đơn điện tử xác nhận.
- **Luồng sự kiện chính (Basic Flow - Quét mã VietQR/VNPAY):**
  1. Hệ thống hiển thị giao diện `CheckoutPage.tsx` gồm:
     - Tóm tắt đơn hàng và số tiền cần thanh toán.
     - Danh sách các phương thức thanh toán (`PaymentMethodList.tsx`):
       + 1. Quét mã VNPAY-QR (Khuyên dùng).
       + 2. Quét mã VietQR Napas 247.
       + 3. Thẻ ATM / Tài khoản ngân hàng nội địa.
       + 4. Thẻ tín dụng quốc tế (Visa, Mastercard, JCB).
       + 5. Ví điện tử MoMo.
       + 6. Thanh toán khi nhận hàng (COD).
  2. Người dùng chọn phương thức "Quét mã VNPAY-QR" hoặc "VietQR Napas 247".
  3. Người dùng nhấn nút "TIẾP TỤC THANH TOÁN".
  4. Hệ thống hiển thị bảng mã thanh toán số `QRCodePanel.tsx`:
     - Tự động sinh chuỗi mã hóa: `SZSHOP-PAYMENT-[MãĐơn]-[SốTiền]`.
     - Hiển thị hình ảnh mã QR động kèm logo đối tác bảo chứng.
     - Bắt đầu bộ đếm ngược thời gian hiệu lực 15:00 phút.
     - Hiển thị thông tin chuyển khoản: Tên chủ tài khoản, Số tài khoản, Ngân hàng thụ hưởng, Số tiền chính xác và Nội dung chuyển khoản (Mã đơn hàng).
     - Cung cấp nút tiện ích "Sao chép mã đơn" chỉ bằng 1 chạm.
  5. Người dùng mở ứng dụng Ngân hàng trên điện thoại (Mobile Banking) hoặc Ví điện tử, quét mã QR và xác nhận chuyển tiền.
  6. Cổng thanh toán gửi tín hiệu xác nhận thành công về Backend `POST /api/payment/confirm`.
  7. Backend cập nhật trạng thái đơn hàng trong bảng `Orders` sang `PAID` và ghi nhận một bản ghi vào bảng `Payments` (Mã giao dịch `TRX-99887766`, trạng thái `Success`).
  8. Frontend tự động điều hướng sang `TransactionResultPage.tsx`:
     - Kích hoạt hiệu ứng chúc mừng Confetti lung linh.
     - Hiển thị biểu tượng dấu tích xanh, thông báo: "Giao dịch thanh toán thành công!".
     - Hiển thị thẻ hóa đơn điện tử: Mã giao dịch ngân hàng, Ngày giờ thực hiện, Phương thức đã chọn, Số tiền đã trừ và Email nhận hóa đơn.
     - Cung cấp 2 nút hành động: "Xem chi tiết đơn hàng" và "Về trang chủ".
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng thay thế 1 (Thanh toán khi nhận hàng COD):* Người dùng chọn phương thức COD. Hệ thống kiểm tra quy tắc nghiệp vụ: Nếu tổng giá trị đơn hàng > 5.000.000 đ, hệ thống vô hiệu hóa tùy chọn COD và hiển thị badge màu đỏ: "Không hỗ trợ COD cho đơn > 5 triệu nhằm đảm bảo an toàn vận chuyển". Nếu đơn hàng <= 5.000.000 đ, người dùng được chọn COD bình thường và đơn hàng chuyển thẳng sang trạng thái sẵn sàng giao.
  - *Luồng ngoại lệ 1 (Hết hạn phiên giao dịch mã QR):* Đồng hồ đếm ngược 15:00 chạm mốc 00:00. Mã QR bị làm mờ, xuất hiện lớp phủ cảnh báo "Mã thanh toán đã hết hạn" kèm nút "Tạo mã QR mới". Người dùng nhấn tạo mới để gia hạn thêm 15 phút.
  - *Luồng ngoại lệ 2 (Giao dịch thất bại / Khách hủy giao dịch):* Nếu người dùng bấm hủy hoặc ngân hàng từ chối giao dịch, hệ thống mở modal `PaymentFailedModal.tsx` giải thích nguyên nhân (Tài khoản không đủ số dư, vượt hạn mức ngày, lỗi mạng ngân hàng) kèm 2 lựa chọn: "Thử lại phương thức khác" hoặc "Liên hệ hỗ trợ 24/7".

### 3.5.2 Biểu đồ UC005

#### Biểu đồ hoạt động (Activity Diagram) - Thanh toán SZ-Payment
```mermaid
flowchart TD
    Start([Bắt đầu: Mở màn hình CheckoutPage]) --> ShowMethods[Hiển thị danh sách phương thức thanh toán]
    ShowMethods --> SelectMethod{Khách hàng chọn phương thức}
    
    %% Nhánh COD
    SelectMethod -- Tiền mặt COD --> CheckAmount{Tổng đơn > 5.000.000đ?}
    CheckAmount -- Đúng --> DisableCOD[Vô hiệu hóa COD: Bắt buộc chuyển khoản] --> ShowMethods
    CheckAmount -- Sai --> ConfirmCOD[Xác nhận chọn COD] --> CreateOrderDone[Chuyển trạng thái: Sẵn sàng đóng gói] --> SuccessPage
    
    %% Nhánh Quét mã QR (VietQR / VNPAY)
    SelectMethod -- Quét mã VietQR/VNPAY --> GenQR[Khởi tạo QRCodePanel: Sinh mã QR & Đếm ngược 15 phút]
    GenQR --> ScanQR[Khách hàng quét mã qua Mobile Banking/Ví điện tử]
    ScanQR --> TimerCheck{Còn hạn 15 phút?}
    TimerCheck -- Hết hạn --> ExpiredQR[Khóa mã QR: Báo hết hạn] --> RefreshQR[Bấm: Tạo mã QR mới] --> GenQR
    TimerCheck -- Còn hạn --> ProcessPayment[Xử lý giao dịch qua Cổng ngân hàng]
    
    ProcessPayment --> PayResult{Kết quả từ Ngân hàng/Gateway}
    PayResult -- Thất bại/Hủy --> ShowFailModal[Mở PaymentFailedModal: Báo lỗi & Chọn lại] --> ShowMethods
    PayResult -- Thành công --> RecordPayment[Ghi bảng Payments & Cập nhật Order status = PAID]
    
    RecordPayment --> SuccessPage[Chuyển sang TransactionResultPage: Confetti & Hóa đơn số]
    SuccessPage --> ViewDetailChoice{Khách chọn hành động}
    ViewDetailChoice -- Xem chi tiết --> NavDetail[Mở OrderDetailPage] --> End([Kết thúc])
    ViewDetailChoice -- Về trang chủ --> NavHome[Mở ShopeeHomePage] --> End
```

#### Biểu đồ tuần tự (Sequence Diagram) - Thanh toán qua mã QR Cổng SZ-Payment
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    participant Checkout as Component CheckoutPage
    participant QRPanel as Component QRCodePanel
    participant Service as ThanhToanService
    participant Gateway as Cổng Thanh toán VietQR/VNPAY
    participant ResultPage as TransactionResultPage

    Customer->>Checkout: Chọn phương thức "Quét mã VNPAY-QR", bấm Tiếp tục
    Checkout->>QRPanel: Render QRCodePanel(amount, orderId)
    QRPanel->>QRPanel: Bắt đầu đếm ngược 15:00 phút & Tạo chuỗi mã QR
    QRPanel-->>Customer: Hiển thị mã QR và thông tin chuyển khoản ngân hàng
    Customer->>Gateway: Dùng App Ngân hàng quét QR và xác nhận chuyển khoản
    Gateway->>Gateway: Trừ tiền tài khoản & Đối soát thành công
    Gateway->>Service: Webhook POST /api/payment/webhook (status: SUCCESS, txId: 'TRX-99887766')
    Service->>Service: Cập nhật CSDL: Orders.status = 'PAID', Payments.insert(...)
    Service-->>QRPanel: Tín hiệu giao dịch thành công (Server-Sent Event / Polling)
    QRPanel->>Checkout: onPaymentSuccess()
    Checkout->>ResultPage: Điều hướng sang TransactionResultPage
    ResultPage->>ResultPage: Kích hoạt hiệu ứng pháo hoa Confetti
    ResultPage-->>Customer: Hiển thị Hóa đơn số 3D kèm mã giao dịch TRX-99887766
```

---

### 3.6 UC006_Bán hàng tại quầy (POS), CSKH & Tra cứu Đơn hàng

### 3.6.1 Mô tả use case UC006
- **Tên Use Case:** Bán hàng tại quầy (POS), Quản lý Hồ sơ Khách hàng, CSKH & Tra cứu Tiến trình Vận đơn (POS, CRM, Support & Order Lifecycle).
- **Mã định danh:** `UC006`.
- **Tác nhân tham gia:** Nhân viên Bán hàng (`SALES`), Khách hàng (`CUSTOMER`).
- **Mục đích:** Cho phép Nhân viên Bán hàng tạo đơn hàng tại quầy POS (`POSPage.tsx`), quản lý hồ sơ khách hàng & hạng thành viên (`CustomerManagementPage.tsx`), xử lý phiếu hỗ trợ CSKH (`CSKHPortalPage.tsx`), duyệt yêu cầu đổi trả (`ReturnManagementPage.tsx`), đồng thời cho phép Khách hàng tra cứu tiến trình vận đơn 5 mốc thời gian thực (`OrderTrackingPage.tsx`).
- **Tiền điều kiện:** Nhân viên Bán hàng đăng nhập với vai trò `SALES`, hoặc Khách hàng có mã đơn hàng hợp lệ (ví dụ: `DH-20241228-01`).
- **Hậu điều kiện:** Đơn hàng POS hoặc phiếu CSKH/Đổi trả được ghi nhận và cập nhật trạng thái vận đơn chính xác.
- **Luồng sự kiện chính (Basic Flow):**
  1. **Luồng Nhân viên Bán hàng (POS & CSKH):**
     - Nhân viên Bán hàng mở `POSPage.tsx`, quét mã SKU hoặc tìm sản phẩm thêm vào hóa đơn tại quầy, nhập SĐT khách hàng để tích điểm hạng thành viên, chọn thanh toán Tiền mặt hoặc VietQR và in hóa đơn.
     - Nhân viên Bán hàng mở `CSKHPortalPage.tsx` hoặc `ReturnManagementPage.tsx` để tiếp nhận yêu cầu hỗ trợ, kiểm tra điều kiện đổi trả hàng (`UC10`) và xác nhận xử lý.
  2. **Luồng Khách hàng Tra cứu Vận đơn (`OrderTrackingPage.tsx`):**
     - Khách hàng nhập mã đơn hàng vào ô tìm kiếm và bấm Tra cứu.
     - Hệ thống gọi `DatHangService.traCuuDonHang(orderId)` và hiển thị dòng thời gian (Vertical Timeline) gồm 5 trạng thái tiêu chuẩn:
       + **Mốc 1 - Chờ xác nhận (Pending):** Đơn hàng đã được ghi nhận trên hệ thống cửa hàng.
       + **Mốc 2 - Đã thanh toán (Paid):** Giao dịch tài chính đã được cổng thanh toán đối soát hoàn tất.
       + **Mốc 3 - Đang chuẩn bị hàng (Processing):** Nhân viên Kho đang đóng gói kiện hàng.
       + **Mốc 4 - Đang vận chuyển (Shipping):** Kiện hàng đã được bàn giao cho đơn vị vận chuyển.
       + **Mốc 5 - Đã giao hàng (Delivered):** Khách hàng đã nhận hàng thành công.
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng thay thế 1 (Yêu cầu hủy / đổi trả đơn hàng):* Nếu đơn hàng đang ở mốc "Chờ xác nhận" hoặc "Đã thanh toán", khách hàng có thể bấm "Hủy đơn hàng". Nếu đơn hàng đã giao (`DELIVERED`), khách hàng có thể gửi yêu cầu Đổi/Trả hàng (`UC10`) để Nhân viên Bán hàng xét duyệt.
  - *Luồng ngoại lệ 1 (Mã đơn hàng không tồn tại):* Nếu mã đơn nhập không tìm thấy trong hệ thống, giao diện hiển thị thông báo lỗi: "Không tìm thấy thông tin đơn hàng này. Vui lòng kiểm tra lại mã vận đơn."

### 3.6.2 Biểu đồ UC006

#### Biểu đồ hoạt động (Activity Diagram) - Tra cứu đơn hàng & Nghiệp vụ Bán hàng
```mermaid
flowchart TD
    Start([Bắt đầu: Truy cập Phân hệ Bán hàng / Vận đơn]) --> ActorCheck{Vai trò tác nhân?}
    ActorCheck -- Nhân viên Bán hàng (SALES) --> SalesMenu[Chọn nghiệp vụ: POS tại quầy / CSKH / Đổi trả]
    SalesMenu --> ProcessPOS[Tạo hóa đơn POS / Xử lý Ticket CSKH & Đổi trả] --> End([Kết thúc])
    
    ActorCheck -- Khách hàng (CUSTOMER) --> InputOrderId[Nhập mã đơn hàng ví dụ: DH-20241228]
    InputOrderId --> ClickSearch[Bấm nút Tra cứu]
    ClickSearch --> QueryDB[Gọi DatHangService.traCuuDonHang]
    QueryDB --> CheckExist{Tìm thấy đơn hàng?}
    CheckExist -- Không --> ShowNotFound[Báo lỗi: Mã đơn hàng không tồn tại] --> InputOrderId
    CheckExist -- Có --> RenderTimeline[Dựng giao diện Timeline 5 mốc vận đơn]
    
    RenderTimeline --> CheckCancelable{Đơn hàng chưa giao?}
    CheckCancelable -- Đúng: Pending/Paid --> ShowCancelBtn[Hiển thị nút 'Hủy đơn hàng']
    CheckCancelable -- Sai: Shipping/Delivered --> HideCancelBtn[Hiển thị nút 'Yêu cầu Đổi/Trả (UC10)']
    
    ShowCancelBtn --> UserCancelChoice{Khách bấm Hủy đơn?}
    UserCancelChoice -- Không --> End
    UserCancelChoice -- Có --> ConfirmModal[Hiện hộp thoại xác nhận hủy]
    ConfirmModal --> UpdateCancel[Cập nhật trạng thái: CANCELLED & Thêm mốc hủy vào timeline]
    UpdateCancel --> AlertRefund[Thông báo: Tiền sẽ được hoàn trong 24h] --> End
    HideCancelBtn --> End
```

#### Biểu đồ tuần tự (Sequence Diagram) - Tra cứu tiến trình đơn hàng
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng / NV Bán hàng
    participant UI as Component OrderTrackingPage / POSPage
    participant Service as DatHangService
    participant DB as HeThongBanHangDB / MSSQL

    Customer->>UI: Nhập mã "DH-20241228" và bấm Tìm kiếm
    UI->>Service: traCuuDonHang("DH-20241228")
    Service->>DB: SELECT * FROM Orders WHERE id = @id
    alt Không tìm thấy đơn hàng
        DB-->>Service: null
        Service-->>UI: null
        UI-->>Customer: Hiển thị thông báo "Không tìm thấy đơn hàng"
    else Tìm thấy đơn hàng
        DB-->>Service: Bản ghi Order kèm danh sách OrderItems và Payments
        Service->>Service: Định dạng danh sách TrackingStep[] kèm mốc thời gian
        Service-->>UI: Trả về dữ liệu tiến trình chi tiết
        UI-->>Customer: Render Timeline 5 mốc trực quan (Màu xanh các mốc đã hoàn tất)
    end
```

---

## 3.7 UC007_Trợ lý AI Mua sắm & Phân tích Doanh số ZShop Copilot

### 3.7.1 Mô tả use case UC007
- **Tên Use Case:** Trợ lý AI Mua sắm & Phân tích Doanh số ZShop Copilot (RAG-Driven Intelligent Sales & Analytics Copilot).
- **Mã định danh:** `UC007`.
- **Tác nhân tham gia:** Khách hàng (`CUSTOMER`), Nhân viên Bán hàng (`SALES`), Nhân viên Kho (`WAREHOUSE`), Admin - Chủ cửa hàng (`ADMIN`), Dịch vụ ngoài (`Gemini LLM`).
- **Mục đích:** Cung cấp trợ lý trí tuệ nhân tạo thông minh tương tác bằng ngôn ngữ tự nhiên tiếng Việt, vận hành bằng kiến trúc RAG (Retrieval-Augmented Generation) kết hợp 6 Business Skills nghiệp vụ giúp giải quyết tự động các bài toán mua sắm, tư vấn bán hàng, dự báo tồn kho và phân tích dữ liệu cho Chủ cửa hàng.
- **Tiền điều kiện:** Người dùng bấm vào biểu tượng bong bóng Chatbot AI ở góc phải phía dưới màn hình (`ChatBot.tsx`).
- **Hậu điều kiện:** Người dùng nhận được phản hồi tư vấn chính xác, tương tác trực tiếp với các thẻ sản phẩm hành động (Actionable Cards) được sinh động trong khung chat.
- **Luồng 6 Kỹ năng Nghiệp vụ AI (6 AI Business Skills):**
  1. **Skill 1 - Tư vấn theo ngân sách (Budget Recommender):** Khách hàng nhập: "Tôi có khoảng 500k, tư vấn cho tôi một chiếc áo đẹp". AI phân tích intent trích xuất ngân sách `<= 500.000 đ`, truy vấn CSDL danh mục Áo và hiển thị danh sách các mẫu áo phù hợp nhất kèm nút "Mua ngay".
  2. **Skill 2 - Lọc sản phẩm theo danh mục (Category Filtering):** Khách hàng yêu cầu: "Tìm cho tôi giày thể thao sneaker nam". AI tự động ánh xạ sang danh mục `Giày dép`, trả về danh sách sản phẩm kèm điểm đánh giá sao và giá thành.
  3. **Skill 3 - Thêm nhanh vào giỏ hàng (Quick Add-to-Cart):** Khách hàng bấm trực tiếp vào nút "Thêm vào giỏ" gắn liền trên thẻ sản phẩm mà AI vừa tư vấn ngay trong cửa sổ chat, sản phẩm lập tức được nạp vào giỏ hàng mà không cần chuyển trang.
  4. **Skill 4 - Tra cứu đơn hàng tức thì (Instant Order Tracking):** Khách hàng hoặc Nhân viên Bán hàng nhắn: "Kiểm tra đơn hàng DH-20241228 giúp tôi". AI gọi `DatHangService` trích xuất trạng thái đơn hàng và phản hồi vắn tắt lộ trình hiện tại của kiện hàng.
  5. **Skill 5 - Báo cáo doanh thu & Phân tích cho Admin (Admin Sales Intelligence):** Khi Admin (Chủ cửa hàng) chat: "Báo cáo doanh số hôm nay", AI kiểm tra phân quyền `userRole === 'ADMIN'`, tổng hợp doanh thu theo ngày từ CSDL và xuất báo cáo tài chính trực quan.
  6. **Skill 6 - Khuyến nghị Nhập kho & Nội dung Sản phẩm (Inventory & Product Copywriting):** Hỗ trợ Nhân viên Kho kiểm tra danh sách SKU sắp hết hàng cần nhập kho bổ sung và hỗ trợ Nhân viên Bán hàng / Admin tạo mô tả sản phẩm chuẩn SEO.
- **Luồng sự kiện chính (Basic Flow):**
  1. Người dùng mở khung chat AI Copilot và nhập câu hỏi bằng tiếng Việt tự nhiên.
  2. Frontend gửi tin nhắn đến `szshop-backend/controllers/ChatController.js`.
  3. Backend chuyển tiếp câu hỏi qua `AiService.js`:
     - Tầng RAG Context Builder thu thập dữ liệu bảng `Products`, `Orders` có cấu trúc từ SQL Server.
     - Ghép nối dữ liệu ngữ cảnh vào RAG Prompt.
     - Gọi Google Gemini API bằng giao thức streaming/json.
  4. Gemini trả về câu trả lời tự nhiên kèm danh sách mã ID sản phẩm đề xuất (Metadata).
  5. Frontend hiển thị nội dung câu trả lời và tự động render các thẻ sản phẩm tương tác bên dưới bong bóng chat.
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng ngoại lệ 1 (Mất kết nối API Gemini):* Nếu Gemini API bị nghẽn mạng hoặc vượt hạn ngạch (Rate Limit), hệ thống kích hoạt bộ dự phòng cục bộ `Local Rule-based Intent Engine` trong `ChatBot.tsx` phân tích từ khóa theo biểu thức chính quy (Regex) và trả lời chuẩn xác theo các mẫu kịch bản có sẵn.

### 3.7.2 Biểu đồ UC007

#### Biểu đồ hoạt động (Activity Diagram) - Tương tác Trợ lý AI Copilot
```mermaid
flowchart TD
    Start([Bắt đầu: Mở Chatbot AI]) --> UserMsg[Nhập tin nhắn tiếng Việt tự nhiên]
    UserMsg --> SendChatReq[Gửi tới ChatController]
    SendChatReq --> CheckAIOnline{Kết nối Gemini AI sẵn sàng?}
    
    CheckAIOnline -- Sẵn sàng --> RAGContext[Truy vấn CSDL: Lấy danh mục sản phẩm & đơn hàng]
    RAGContext --> BuildPrompt[Xây dựng RAG Prompt có ngữ cảnh thực tế]
    BuildPrompt --> CallGemini[Gọi Google Gemini 1.5 API]
    CallGemini --> ParseResponse[Trích xuất nội dung văn bản & Metadata sản phẩm]
    
    CheckAIOnline -- Gián đoạn/Offline --> LocalEngine[Chuyển sang Bộ phân tích quy tắc nội bộ Regex]
    LocalEngine --> ParseResponse
    
    ParseResponse --> SkillDispatch{Phân loại kỹ năng kích hoạt}
    SkillDispatch -- Tư vấn ngân sách / Lọc --> ShowProductCards[Hiển thị bong bóng chat kèm Thẻ sản phẩm tương tác]
    SkillDispatch -- Tra cứu đơn hàng --> ShowOrderStatus[Hiển thị trạng thái đơn hàng hiện tại]
    SkillDispatch -- Báo cáo Admin --> ShowReport[Hiển thị số liệu doanh thu & KPI cửa hàng]
    SkillDispatch -- Cảnh báo Kho / Copywriting --> ShowSEOText[Hiển thị khuyến nghị nhập kho & mô tả SEO]
    
    ShowProductCards --> QuickCartAction{Khách bấm 'Thêm vào giỏ' trong chat?}
    QuickCartAction -- Có --> AddDirect[Gọi onAddToCart nạp trực tiếp vào Giỏ hàng] --> End([Kết thúc tương tác AI])
    QuickCartAction -- Không --> End
    ShowOrderStatus --> End
    ShowReport --> End
    ShowSEOText --> End
```

#### Biểu đồ tuần tự (Sequence Diagram) - Luồng xử lý AI RAG Copilot
```mermaid
sequenceDiagram
    autonumber
    actor User as Tác nhân (Customer / Sales / Warehouse / Admin)
    participant ChatUI as Component ChatBot
    participant Controller as ChatController (/api/chat)
    participant AIService as Backend AiService
    participant DB as SQL Server / Products DB
    participant Gemini as Google Gemini AI API

    User->>ChatUI: Nhập câu hỏi "Tìm áo thun dưới 300k"
    ChatUI->>Controller: POST /api/chat { message: "Tìm áo thun dưới 300k", role: "CUSTOMER" }
    Controller->>AIService: processUserChat(query, userContext)
    AIService->>DB: Truy vấn SELECT * FROM Products WHERE price <= 300000
    DB-->>AIService: Trả về danh sách sản phẩm thực tế trong kho
    AIService->>AIService: Tạo RAG Prompt (kèm grounding facts sản phẩm thực)
    AIService->>Gemini: Gửi Prompt tới Gemini 1.5 Flash
    Gemini-->>AIService: Trả về câu trả lời tự nhiên kèm danh sách Product IDs
    AIService-->>Controller: Phản hồi { replyText, suggestedProducts: [...] }
    Controller-->>ChatUI: 200 OK
    ChatUI-->>User: Render câu trả lời và hiển thị Card sản phẩm kèm nút "Thêm vào giỏ"
    User->>ChatUI: Nhấn nút "Thêm vào giỏ" trên thẻ sản phẩm
    ChatUI->>ChatUI: Kích hoạt onAddToCart(product) và cập nhật Header Cart
```

---

## 3.8 UC008_Quản lý Nhập kho, Tồn kho & AI Khuyến nghị Kho (Nhân viên Kho)

### 3.8.1 Mô tả use case UC008
- **Tên Use Case:** Quản lý Nhập kho, Tồn kho & AI Khuyến nghị Kho (Warehouse Inventory, Stock Import & AI Replenishment).
- **Mã định danh:** `UC008` (ánh xạ chuẩn `UC05` & `UC08` của Nhân viên Kho).
- **Tác nhân tham gia:** Nhân viên Kho (`WAREHOUSE`), Admin - Chủ cửa hàng (`ADMIN`).
- **Mục đích:** Cho phép Nhân viên Kho quản lý danh mục hàng hóa trong kho của cửa hàng, lập phiếu nhập kho (`StockImportTickets`), kiểm kê điều chỉnh số lượng tồn kho thực tế, đóng gói bàn giao vận đơn (`SHIPPING`) và sử dụng AI Khuyến nghị Nhập kho (`UC08`) để phát hiện sớm các mặt hàng sắp đứt gãy tồn kho (`stock < min_threshold`).
- **Tiền điều kiện:** Người dùng đã đăng nhập với vai trò `WAREHOUSE` hoặc `ADMIN` và truy cập vào `WarehousePage.tsx`.
- **Hậu điều kiện:** Phiếu nhập kho được lưu vào bảng `StockImportTickets`, số lượng tồn kho trong bảng `Products` được cộng dồn chính xác và trạng thái đóng gói đơn hàng được cập nhật.
- **Luồng sự kiện chính (Basic Flow):**
  1. Nhân viên Kho đăng nhập hệ thống và được điều hướng tới phân hệ `WarehousePage.tsx`.
  2. Hệ thống hiển thị 4 phân mục nghiệp vụ kho:
     - **Tổng quan Tồn kho & Cảnh báo (Inventory Overview):** Hiển thị tổng số SKU, tổng số lượng tồn kho thực tế, và danh sách mặt hàng chạm ngưỡng cảnh báo đỏ (`stock <= 10`).
     - **Lập Phiếu Nhập Kho (`UC05 - Stock Import`):** Cho phép chọn nhà cung cấp (Supplier), chọn sản phẩm, nhập số lượng nhập mới và đơn giá nhập.
     - **Đóng gói & Xuất kho Vận đơn (`Order Fulfillment`):** Danh sách các đơn hàng đã thanh toán (`PAID`) hoặc xác nhận (`PROCESSING`) cần đóng gói xuất kho.
     - **AI Khuyến nghị Nhập kho (`UC08 - AI Warehouse Advisor`):** Bảng phân tích tốc độ tiêu thụ hàng hóa và đề xuất số lượng nhập kho tối ưu cho từng SKU.
  3. Nhân viên Kho bấm nút "+ Tạo Phiếu Nhập Kho".
  4. Nhập thông tin nhà cung cấp, chọn mặt hàng và số lượng nhập, sau đó nhấn "Xác nhận Nhập kho".
  5. Hệ thống ghi bản ghi mới vào bảng `StockImportTickets` và tự động cộng dồn `Products.stock = Products.stock + quantity`.
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng thay thế 1 (Kiểm kê điều chỉnh tồn kho):* Khi kiểm kê phát hiện chênh lệch, Nhân viên Kho cập nhật lại số lượng tồn thực tế và ghi chú lý do kiểm kê.
  - *Luồng ngoại lệ 1 (Số lượng nhập không hợp lệ):* Nếu số lượng nhập `<= 0`, hệ thống báo lỗi yêu cầu nhập số nguyên dương hợp lệ.

### 3.8.2 Biểu đồ UC008

#### Biểu đồ hoạt động (Activity Diagram) - Quản lý Kho & Nhập hàng (Nhân viên Kho)
```mermaid
flowchart TD
    Start([Bắt đầu: Đăng nhập vai trò Nhân viên Kho]) --> OpenWarehouse[Truy cập giao diện WarehousePage]
    OpenWarehouse --> SelectTask{Chọn nghiệp vụ Kho}
    
    SelectTask -- Nhập kho hàng mới (UC05) --> InputTicket[Nhập Nhà cung cấp, chọn SKU & Số lượng nhập]
    InputTicket --> ValidateQty{Số lượng > 0?}
    ValidateQty -- Không --> AlertInvalid[Báo lỗi: Số lượng nhập phải > 0] --> InputTicket
    ValidateQty -- Hợp lệ --> SaveTicket[Lưu bảng StockImportTickets & Cộng dồn Products.stock]
    
    SelectTask -- AI Khuyến nghị Kho (UC08) --> RunAIStock[Phân tích các SKU có stock <= 10 & tốc độ bán]
    RunAIStock --> SuggestOrder[Đề xuất danh sách & số lượng cần nhập bổ sung] --> InputTicket
    
    SelectTask -- Đóng gói xuất kho --> PackOrder[Kiểm tra kiện hàng & Cập nhật trạng thái SHIPPING]
    
    SaveTicket --> RefreshStock[Làm mới số liệu tồn kho toàn cửa hàng] --> End([Hoàn tất])
    PackOrder --> RefreshStock
```

#### Biểu đồ tuần tự (Sequence Diagram) - Nhân viên Kho lập phiếu nhập hàng & AI Khuyến nghị
```mermaid
sequenceDiagram
    autonumber
    actor Warehouse as Nhân viên Kho (WAREHOUSE)
    participant UI as WarehousePage
    participant Controller as ProductController (/api/products)
    participant DB as SQL Server Database

    Warehouse->>UI: Mở tab "AI Khuyến nghị Kho (UC08)"
    UI->>Controller: GET /api/products/low-stock
    Controller->>DB: SELECT * FROM Products WHERE stock <= 15
    DB-->>Controller: Danh sách SKU sắp hết hàng
    Controller-->>UI: Trả về danh sách cảnh báo & số lượng gợi ý nhập
    Warehouse->>UI: Nhấn "+ Tạo Phiếu Nhập Kho (UC05)" và xác nhận số lượng nhập
    UI->>Controller: POST /api/warehouse/import { staff_id, supplier_name, product_id, quantity, unit_cost }
    Controller->>DB: INSERT INTO StockImportTickets (...)
    Controller->>DB: UPDATE Products SET stock = stock + @quantity WHERE id = @product_id
    DB-->>Controller: Cập nhật thành công
    Controller-->>UI: 201 Created { success: true }
    UI-->>Warehouse: Hiển thị thông báo "Nhập kho thành công & đã cập nhật tồn kho!"
```

---

## 3.9 UC009_Quản trị Cửa hàng, Nhân sự Nội bộ & AI Phân tích Kinh doanh (Admin - Chủ cửa hàng)

### 3.9.1 Mô tả use case UC009
- **Tên Use Case:** Quản trị Cửa hàng, Nhân sự Nội bộ & AI Phân tích Kinh doanh (Store Owner Governance, HR Staff Management & AI Business Intelligence).
- **Mã định danh:** `UC009` (ánh xạ chuẩn `UC01`, `UC02`, `UC09` của Admin - Chủ cửa hàng).
- **Tác nhân tham gia:** Admin - Chủ cửa hàng (`ADMIN`).
- **Mục đích:** Cung cấp trung tâm điều hành toàn diện cho Chủ cửa hàng để theo dõi chỉ số hiệu suất kinh doanh (KPI, doanh thu tuần/tháng, lợi nhuận ròng, tổng đơn hàng), quản lý đội ngũ nhân sự nội bộ (`Nhân viên Bán hàng` & `Nhân viên Kho`), quản lý danh mục sản phẩm & giá bán của cửa hàng, cấu hình chính sách tích điểm VIP và xem báo cáo AI Phân tích Kinh doanh (`UC09`).
- **Tiền điều kiện:** Người dùng đã đăng nhập với vai trò `ADMIN` (`userRole === 'ADMIN'`).
- **Hậu điều kiện:** Các thao tác cấp quyền nhân viên, cập nhật sản phẩm, cấu hình khuyến mãi hoặc xuất báo cáo được áp dụng tức thì trên toàn hệ thống cửa hàng.
- **Luồng sự kiện chính (Basic Flow):**
  1. Admin (Chủ cửa hàng) đăng nhập vào hệ thống và được điều hướng tới `AdminDashboard.tsx`.
  2. Hệ thống tải dữ liệu tổng thể của cửa hàng và hiển thị các khối KPI chính:
     - **Thẻ Doanh thu & Lợi nhuận:** Tổng doanh thu cửa hàng và lợi nhuận ròng (40% biên lợi nhuận).
     - **Thẻ Đơn hàng:** Tổng số đơn hàng phát sinh kèm phân loại trạng thái (Chờ xử lý, Đang giao, Hoàn tất, Đã hủy).
     - **Biểu đồ cột Doanh thu tuần & Phân bổ thanh toán:** Thể hiện trực quan doanh số từ Thứ 2 đến Chủ nhật và tỷ trọng VNPAY/VietQR/MoMo/COD.
  3. Admin chọn tab **"Nhân sự (NV)" (`STAFF - UC01`)**:
     - Xem danh sách nhân sự nội bộ của cửa hàng (`Nhân viên Bán hàng - SALES` và `Nhân viên Kho - WAREHOUSE`).
     - Cấp tài khoản nhân viên mới, phân ca làm việc hoặc khóa/mở khóa quyền truy cập hệ thống của nhân viên trong bảng `Staffs`.
  4. Admin chọn tab **"Sản phẩm" (`PRODUCTS - UC02`)**:
     - Thêm sản phẩm mới vào cửa hàng, chỉnh sửa giá niêm yết, cập nhật danh mục hoặc ngừng kinh doanh sản phẩm.
  5. Admin chọn tab **"Báo cáo AI" (`REPORTS - UC09`)**:
     - Xem phân tích AI về xu hướng doanh thu, top mặt hàng bán chạy và xuất báo cáo CSV/Excel.
- **Các luồng thay thế & Luồng ngoại lệ:**
  - *Luồng ngoại lệ 1 (Truy cập trái phép):* Nếu người dùng không có vai trò `ADMIN` cố tình truy cập vào bảng điều khiển của Chủ cửa hàng, hệ thống tự động chặn và hiển thị thông báo từ chối quyền truy cập (Access Denied / 403 Forbidden).

### 3.9.2 Biểu đồ UC009

#### Biểu đồ hoạt động (Activity Diagram) - Quản trị Cửa hàng (Admin - Chủ cửa hàng)
```mermaid
flowchart TD
    Start([Bắt đầu: Đăng nhập vai trò Admin - Chủ cửa hàng]) --> CheckAdminAuth{Đúng quyền ADMIN?}
    CheckAdminAuth -- Không --> BlockAccess[Chặn truy cập & Báo lỗi 403 Forbidden] --> End([Dừng])
    CheckAdminAuth -- Đúng --> LoadDashboard[Tải dữ liệu AdminDashboard]
    
    LoadDashboard --> RenderKPI[Hiển thị thẻ KPI: Doanh thu, Lợi nhuận ròng, Đơn hàng, Biểu đồ tuần]
    RenderKPI --> AdminChoice{Chủ cửa hàng chọn phân hệ}
    
    AdminChoice -- Quản lý Nhân sự Nội bộ (UC01) --> ViewStaffList[Xem danh sách NV Bán hàng & NV Kho]
    ViewStaffList --> StaffAction{Cấp mới hay Khóa/Mở khóa NV?}
    StaffAction -- Cấp mới --> CreateStaff[Tạo tài khoản SALES / WAREHOUSE trong bảng Staffs]
    StaffAction -- Khóa/Mở khóa --> ToggleStaff[Cập nhật trạng thái ACTIVE / LOCKED]
    
    AdminChoice -- Quản lý Sản phẩm Cửa hàng (UC02) --> ViewAllProducts[Thêm/Sửa giá/Xóa sản phẩm của cửa hàng]
    
    AdminChoice -- AI Phân tích Kinh doanh (UC09) --> ViewFinanceReport[Xem dự báo doanh số AI & Xuất báo cáo CSV]
    
    CreateStaff --> End
    ToggleStaff --> End
    ViewAllProducts --> End
    ViewFinanceReport --> End
```

#### Biểu đồ tuần tự (Sequence Diagram) - Admin quản lý Nhân sự Nội bộ & Sản phẩm
```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin (Chủ cửa hàng)
    participant Dashboard as AdminDashboard
    participant Controller as AdminController (/api/admin)
    participant DB as SQL Server Database

    Admin->>Dashboard: Mở tab "Nhân sự Nội bộ (NV Bán hàng & NV Kho)"
    Dashboard->>Controller: GET /api/admin/staffs
    Controller->>DB: SELECT * FROM Staffs JOIN Users ON Staffs.user_id = Users.id
    DB-->>Controller: Danh sách Nhân viên Bán hàng (SALES) & Nhân viên Kho (WAREHOUSE)
    Controller-->>Dashboard: Trả về danh sách nhân sự
    Dashboard-->>Admin: Hiển thị Mã NV, Họ tên, Vai trò, Ca trực, Trạng thái
    Admin->>Dashboard: Nhấn "+ Cấp tài khoản Nhân viên" hoặc "Khóa/Mở khóa"
    Dashboard->>Controller: POST /api/admin/staffs/status { staffId, status: 'ACTIVE' }
    Controller->>DB: UPDATE Staffs SET status = 'ACTIVE' WHERE id = @staffId
    DB-->>Controller: Cập nhật thành công
    Controller-->>Dashboard: 200 OK { success: true }
    Dashboard-->>Admin: Thông báo "Đã cập nhật trạng thái nhân sự thành công!"
```

---

# 4. CÁC THÔNG TIN HỖ TRỢ KHÁC

## 4.1 Yêu cầu phi chức năng (Non-Functional Requirements)
Các yêu cầu phi chức năng thiết lập các chỉ tiêu chất lượng kỹ thuật mà hệ thống SZSHOP phải thỏa mãn:

| Nhóm Yêu cầu | Tiêu chí kỹ thuật cụ thể | Phương pháp kiểm chứng & Chỉ số đo lường |
| :--- | :--- | :--- |
| **1. Hiệu năng (Performance)** | - Tốc độ dựng khung hình đồ họa 3D Three.js đạt tối thiểu 60 FPS trên các dòng máy tính phổ thông có GPU onboard.<br/>- Thời gian tải trang ban đầu (Time to Interactive - TTI) < 2.0 giây trên đường truyền 4G/Wifi tiêu chuẩn.<br/>- Thời gian phản hồi của các API nghiệp vụ cốt lõi (sản phẩm, giỏ hàng, đặt hàng) < 300ms.<br/>- Thời gian phản hồi luồng trợ lý AI Copilot bắt đầu xuất hiện ký tự đầu tiên (Time to First Token) < 1.5 giây. | Đo kiểm bằng công cụ Google Lighthouse, Chrome DevTools Performance Profiler và Apache JMeter với tải 1.000 người dùng đồng thời. |
| **2. Bảo mật (Security)** | - Toàn bộ thông tin mật khẩu tài khoản người dùng bắt buộc được băm bằng thuật toán an toàn tiêu chuẩn ngành (BCrypt với salt rounds >= 10 hoặc Argon2id). Không lưu trữ mật khẩu dạng rõ (plaintext).<br/>- Cơ chế xác thực sử dụng JSON Web Token (JWT) có chữ ký bí mật, thời hạn hết hạn (TTL) tối đa 24 giờ, kiểm soát chặt chẽ 4 vai trò (`CUSTOMER`, `SALES`, `WAREHOUSE`, `ADMIN`).<br/>- Mọi giao tiếp dữ liệu Client - Server bắt buộc mã hóa qua giao thức HTTPS / TLS 1.3.<br/>- Ngăn chặn triệt để các lỗ hổng OWASP Top 10: SQL Injection bằng Parameterized Queries, Cross-Site Scripting (XSS) bằng Data Sanitization, và Cross-Site Request Forgery (CSRF). | Kiểm tra mã nguồn định kỳ (Static Code Analysis) bằng SonarQube và công cụ kiểm thử bảo mật chuyên dụng. |
| **3. Độ tin cậy & Sẵn sàng (Reliability & Availability)** | - Hệ thống duy trì mức độ sẵn sàng dịch vụ tối thiểu 99.9% thời gian trong năm (High Availability).<br/>- Tích hợp cơ chế tự phục hồi kết nối CSDL (Auto-reconnect) và Fallback thông minh sang In-Memory Database khi mạng doanh nghiệp gặp sự cố ngắt kết nối cục bộ.<br/>- Bảo toàn tính toàn vẹn giao dịch tài chính theo nguyên lý ACID: Không xảy ra tình trạng trừ tiền nhưng không ghi nhận đơn hàng. | Kiểm thử kịch bản ngắt mạng máy chủ CSDL đột ngột và đánh giá cơ chế chuyển mạch dự phòng tự động. |
| **4. Tính khả dụng & Tương thích (Usability & Portability)** | - Giao diện thiết kế theo triết lý Mobile-First & Responsive Design: Tương thích hoàn hảo trên các độ phân giải màn hình từ 360px (Smartphone), 768px (Tablet), 1024px (Laptop) đến 1920px (Desktop Full HD).<br/>- Hỗ trợ thao tác cảm ứng tự nhiên (Touch Gestures): Vuốt để xoay mô hình 3D, kéo thả giỏ hàng, chạm thanh toán.<br/>- Màu sắc thương hiệu và độ tương phản tuân thủ tiêu chuẩn tiếp cận Web Accessibility (WCAG 2.1 Level AA). | Kiểm thử chéo trên các hệ điều hành (Windows 11, macOS, iOS, Android) và các trình duyệt (Chrome, Safari, Edge, Firefox). |

## 4.2 Thiết kế Cơ sở Dữ liệu Quan hệ Vật lý (11 Bảng SQL Chuẩn Mô hình 1 Cửa hàng & 4 Tác nhân)
Cơ sở dữ liệu hệ thống SZSHOP được thiết kế chuẩn hóa mức 3NF (Third Normal Form) trên hệ quản trị Microsoft SQL Server, bao gồm 11 bảng quan hệ logic phản ánh trọn vẹn mô hình cửa hàng bán lẻ trực tuyến & tại quầy với 4 tác nhân (`ADMIN`, `SALES`, `WAREHOUSE`, `CUSTOMER`):

```mermaid
erDiagram
    Roles ||--o{ Users : "phân quyền 4 tác nhân"
    Users ||--o| Customers : "hồ sơ khách hàng"
    Users ||--o| Staffs : "hồ sơ nhân sự nội bộ"
    Categories ||--o{ Products : "phân loại"
    Staffs ||--o{ StockImportTickets : "nhập kho (UC05)"
    Products ||--o{ StockImportTickets : "cập nhật tồn"
    Customers ||--o{ Carts : "sở hữu"
    Carts ||--o{ CartItems : "chứa"
    Products ||--o{ CartItems : "được thêm"
    Customers ||--o{ Orders : "đặt mua"
    Orders ||--o{ OrderItems : "bao gồm"
    Products ||--o{ OrderItems : "chi tiết"
    Orders ||--o{ Payments : "lịch sử thanh toán"

    Roles {
        int id PK
        varchar name UK "ADMIN | SALES | WAREHOUSE | CUSTOMER"
    }
    Users {
        int id PK
        int role_id FK
        varchar email UK
        varchar password
        varchar provider
        varchar provider_user_id
    }
    Customers {
        int id PK
        int user_id FK
        nvarchar address
        varchar phone
        int loyalty_points
    }
    Staffs {
        int id PK
        int user_id FK
        varchar staff_code UK
        nvarchar full_name
        varchar department "SALES | WAREHOUSE"
        varchar status "ACTIVE | LOCKED"
    }
    Categories {
        int id PK
        nvarchar name
    }
    Products {
        int id PK
        int category_id FK
        nvarchar name
        decimal price
        int stock
    }
    StockImportTickets {
        int id PK
        int staff_id FK
        int product_id FK
        nvarchar supplier_name
        int quantity
        decimal unit_cost
        datetime imported_at
    }
    Carts {
        int id PK
        int customer_id FK
        datetime created_at
    }
    CartItems {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
        datetime added_at
    }
    Orders {
        int id PK
        int customer_id FK
        int handled_by_staff_id FK
        decimal total_amount
        varchar status
        datetime created_at
    }
    OrderItems {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
        varchar shipping_status
    }
    Payments {
        int id PK
        int order_id FK
        varchar payment_method
        varchar payment_status
        varchar transaction_id
        decimal amount
        datetime payment_date
    }
```

### Bảng đặc tả chi tiết 11 bảng Cơ sở dữ liệu:
1. **Bảng `Roles` (Phân quyền 4 tác nhân chuẩn UML):**
   - `id` (INT, Primary Key, Identity): Mã định danh quyền hạn.
   - `name` (VARCHAR(50), Unique, Not Null): Tên quyền (`ADMIN`, `SALES`, `WAREHOUSE`, `CUSTOMER`).
2. **Bảng `Users` (Tài khoản người dùng tổng thể):**
   - `id` (INT, Primary Key, Identity): Mã định danh tài khoản.
   - `role_id` (INT, Foreign Key -> `Roles.id`, Not Null): Quyền hạn tài khoản.
   - `email` (VARCHAR(255), Unique, Not Null): Địa chỉ email đăng nhập.
   - `password` (VARCHAR(255), Not Null): Chuỗi băm mật khẩu bảo mật.
   - `provider` (VARCHAR(50), Null): Nguồn đăng nhập một chạm (`google`, `facebook`, `apple`).
   - `provider_user_id` (VARCHAR(255), Null): Định danh tài khoản từ nhà cung cấp OAuth.
3. **Bảng `Customers` (Hồ sơ Khách hàng - `CUSTOMER`):**
   - `id` (INT, Primary Key, Identity): Mã hồ sơ khách hàng.
   - `user_id` (INT, Foreign Key -> `Users.id`, Unique, Not Null): Khóa ngoại liên kết bảng Users.
   - `address` (NVARCHAR(255), Null): Địa chỉ giao nhận mặc định.
   - `phone` (VARCHAR(20), Null): Số điện thoại liên lạc.
   - `loyalty_points` (INT, Default 0): Điểm tích lũy thành viên VIP (`UC03`).
4. **Bảng `Staffs` (Hồ sơ Nhân sự Nội bộ - `SALES` & `WAREHOUSE`):**
   - `id` (INT, Primary Key, Identity): Mã nhân viên nội bộ.
   - `user_id` (INT, Foreign Key -> `Users.id`, Unique, Not Null): Khóa ngoại liên kết bảng Users.
   - `staff_code` (VARCHAR(50), Unique, Not Null): Mã nhân viên (`NV-SALE-01`, `NV-KHO-01`).
   - `full_name` (NVARCHAR(150), Not Null): Họ và tên nhân viên.
   - `department` (VARCHAR(50), Not Null): Bộ phận công tác (`SALES` - Bán hàng & CSKH, `WAREHOUSE` - Kho vận).
   - `status` (VARCHAR(30), Default `'ACTIVE'`): Trạng thái công tác (`ACTIVE`, `LOCKED`).
5. **Bảng `Categories` (Danh mục ngành hàng):**
   - `id` (INT, Primary Key, Identity): Mã danh mục sản phẩm.
   - `name` (NVARCHAR(100), Not Null): Tên danh mục (Thời trang nam, Thời trang nữ, Giày dép, Phụ kiện công nghệ).
6. **Bảng `Products` (Sản phẩm kinh doanh của Cửa hàng):**
   - `id` (INT, Primary Key, Identity): Mã sản phẩm.
   - `category_id` (INT, Foreign Key -> `Categories.id`, Null): Ngành hàng tương ứng.
   - `name` (NVARCHAR(255), Not Null): Tên gọi sản phẩm.
   - `price` (DECIMAL(18,2), Not Null): Đơn giá niêm yết của cửa hàng.
   - `stock` (INT, Default 0): Số lượng sản phẩm còn tồn trong kho cửa hàng.
7. **Bảng `StockImportTickets` (Phiếu nhập kho hàng hóa - `UC05`):**
   - `id` (INT, Primary Key, Identity): Mã phiếu nhập kho.
   - `staff_id` (INT, Foreign Key -> `Staffs.id`, Not Null): Nhân viên Kho lập phiếu.
   - `product_id` (INT, Foreign Key -> `Products.id`, Not Null): Sản phẩm được nhập kho.
   - `supplier_name` (NVARCHAR(150), Not Null): Tên nhà cung cấp hàng hóa.
   - `quantity` (INT, Not Null): Số lượng nhập mới.
   - `unit_cost` (DECIMAL(18,2), Not Null): Giá vốn nhập kho trên mỗi đơn vị.
8. **Bảng `Carts` & `CartItems` (Giỏ hàng người dùng):**
   - Lưu trữ giỏ hàng (`Carts`) và chi tiết các sản phẩm chọn mua (`CartItems`: `cart_id`, `product_id`, `quantity`).
9. **Bảng `Orders` (Đơn hàng Online & Tại quầy POS):**
   - `id` (INT, Primary Key, Identity): Mã đơn hàng định danh.
   - `customer_id` (INT, Foreign Key -> `Customers.id`, Not Null): Khách hàng đặt mua.
   - `handled_by_staff_id` (INT, Foreign Key -> `Staffs.id`, Null): Nhân viên Bán hàng/Kho phụ trách.
   - `total_amount` (DECIMAL(18,2), Not Null): Tổng giá trị thanh toán của đơn hàng.
   - `status` (VARCHAR(50), Not Null): Trạng thái đơn (`Pending`, `Paid`, `Shipping`, `Delivered`, `Cancelled`).
10. **Bảng `OrderItems` (Chi tiết mặt hàng trong đơn):**
    - `id` (INT, Primary Key, Identity): Mã chi tiết dòng đơn hàng.
    - `order_id` (INT, Foreign Key -> `Orders.id`, Not Null): Thuộc đơn hàng gốc nào.
    - `product_id` (INT, Foreign Key -> `Products.id`, Not Null): Sản phẩm đặt mua.
    - `quantity` (INT, Not Null): Số lượng mặt hàng.
    - `unit_price` (DECIMAL(18,2), Not Null): Đơn giá tại thời điểm đặt mua.
    - `shipping_status` (VARCHAR(50), Not Null): Trạng thái đóng gói/vận chuyển từ kho cửa hàng.
11. **Bảng `Payments` (Lịch sử giao dịch thanh toán):**
    - `id` (INT, Primary Key, Identity): Mã định danh giao dịch.
    - `order_id` (INT, Foreign Key -> `Orders.id`, Not Null): Đơn hàng được thanh toán.
    - `payment_method` (VARCHAR(50), Not Null): Phương thức thanh toán (`VNPAY_QR`, `VIETQR`, `MOMO`, `CREDIT_CARD`, `COD`).
    - `payment_status` (VARCHAR(50), Not Null): Tình trạng xử lý (`Pending`, `Success`, `Failed`).
    - `transaction_id` (VARCHAR(100), Null): Mã tham chiếu giao dịch trả về từ ngân hàng/cổng thanh toán.
    - `amount` (DECIMAL(18,2), Not Null): Số tiền thực chuyển.
    - `payment_date` (DATETIME, Default GETDATE()): Thời điểm giao dịch được ghi nhận.

## 4.3 Ràng buộc Thiết kế & Kiến trúc Triển khai
- **Mô hình kiến trúc tổng thể:** Áp dụng mô hình đa tầng phân tách độc lập (N-Tier Decoupled Architecture):
  1. *Presentation Layer (Frontend):* Single Page Application (SPA) xây dựng trên nền React 19, TypeScript, Tailwind CSS, kết hợp Three.js cho việc kết xuất đồ họa không gian 3D.
  2. *API Gateway & Controller Layer (Backend):* Node.js kết hợp Express v5, quản lý xác thực bằng JWT middleware, điều hướng các endpoint RESTful chuẩn hóa `/api/auth`, `/api/products`, `/api/cart`, `/api/orders`, `/api/chat`.
  3. *Business Service & Repository Layer:* Phân tách rõ tầng dịch vụ nghiệp vụ (`services/`) và tầng truy cập cơ sở dữ liệu (`repositories/`), cô lập logic tính toán giỏ hàng, khuyến mãi và thanh toán.
  4. *Data Persistence Layer:* Hệ quản trị cơ sở dữ liệu quan hệ Microsoft SQL Server, kết hợp cơ chế Local In-Memory Fallback phục vụ môi trường offline/demo.
  5. *AI Intelligence Service Layer:* Tích hợp Gemini 1.5 API điều hướng qua cơ chế RAG Context Builder nhằm truy vấn tức thời dữ liệu sản phẩm trong CSDL trước khi sinh nội dung tư vấn.
- **Chiến lược đóng gói & Triển khai (Deployment Strategy):**
  - Frontend được biên dịch tĩnh tối ưu bằng Vite (`npm run build`), sẵn sàng triển khai trên CDN hoặc Web Server Nginx/Cloudflare Pages.
  - Backend chạy dưới dạng dịch vụ Node.js microservice (`node szshop-backend/server.js`), lắng nghe cổng nội bộ 5000, hỗ trợ đóng gói Docker container độc lập phục vụ horizontal scaling khi lượng truy cập tăng đột biến.

---
*Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) cho Hệ thống SZSHOP được hoàn thiện đầy đủ, chuẩn hóa theo mẫu quy định UML 2.5 (4 Tác nhân) và sẵn sàng cho các giai đoạn lập trình chi tiết, kiểm thử phần mềm và nghiệm thu dự án.*
"""
    return content

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_row(row, is_header=False, bg_hex="FFFFFF"):
    for cell in row.cells:
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(10)
                if is_header:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(255, 255, 255)
                else:
                    r.font.color.rgb = RGBColor(30, 41, 59)

def build_docx_report(target_docx_path):
    doc = Document()
    
    # Page setup
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)
    normal_style.paragraph_format.line_spacing = 1.2
    normal_style.paragraph_format.space_after = Pt(4)

    # Title Page / Header Banner
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(24)
    title_p.paragraph_format.space_after = Pt(6)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = title_p.add_run("TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)")
    r.font.size = Pt(22)
    r.font.bold = True
    r.font.color.rgb = RGBColor(14, 116, 144) # Teal/Cyan brand

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(16)
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = sub_p.add_run("HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ KHÔNG GIAN 3D & CỔNG THANH TOÁN SZ-PAYMENT (SZSHOP)\n(Chuẩn hóa UML 2.5 - Mô hình 4 Tác nhân: Admin, Nhân viên Bán hàng, Nhân viên Kho, Khách hàng)")
    r_sub.font.size = Pt(13)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    # Metadata Box
    meta_tbl = doc.add_table(rows=4, cols=2)
    set_table_borders(meta_tbl, "0EA5E9", "8")
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Dự án / Ứng dụng:", "SZSHOP (ZS-Economy) - 3D Spatial E-Commerce & POS Store Platform"),
        ("Phiên bản tài liệu:", "Phiên bản 3.0 (Chuẩn hóa UML 2.5 - 4 Tác nhân)"),
        ("Ngày lập báo cáo:", "23 Tháng 09 Năm 2026"),
        ("Cơ quan / Đơn vị thẩm định:", "Hội đồng Đánh giá & Giảng viên Bộ môn Kỹ thuật Phần mềm")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_tbl.rows[idx]
        row.cells[0].paragraphs[0].add_run(label).font.bold = True
        row.cells[1].paragraphs[0].add_run(val)
        format_row(row, False, "F0F9FF" if idx % 2 == 0 else "FFFFFF")
    
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(12)

    # --- NỘI DUNG TỔNG QUAN ---
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(text)
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = RGBColor(14, 116, 144)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(text)
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(30, 41, 59)
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(text)
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_bullet(p, bold_prefix, text):
        r1 = p.add_run(f"• {bold_prefix}: ")
        r1.font.bold = True
        r2 = p.add_run(text)
        p.paragraph_format.space_after = Pt(3)

    def add_callout(text, title="LƯU Ý / GHI CHÚ QUAN TRỌNG:"):
        tbl = doc.add_table(rows=1, cols=1)
        set_table_borders(tbl, "38BDF8", "12")
        cell = tbl.rows[0].cells[0]
        set_cell_background(cell, "F0F9FF")
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r_title = p.add_run(f"{title} ")
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(3, 105, 161)
        r_txt = p.add_run(text)
        r_txt.font.color.rgb = RGBColor(15, 23, 42)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 1. GIỚI THIỆU CHUNG
    add_h1("1. GIỚI THIỆU CHUNG")
    
    add_h2("1.1 Mục đích")
    p = doc.add_paragraph(
        "Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification - SRS) này mô tả chi tiết, toàn diện và đầy đủ các yêu cầu nghiệp vụ, "
        "yêu cầu chức năng, yêu cầu phi chức năng, các ràng buộc kỹ thuật, kiến trúc giao diện tương tác 3D WebGL và cơ sở dữ liệu quan hệ của "
        "Hệ thống Thương mại Điện tử Không gian 3D & Cổng Thanh toán SZ-Payment (SZSHOP / ZS-Economy) theo mô hình cửa hàng bán lẻ thống nhất.\n"
        "Mục đích của tài liệu bao gồm:\n"
        "1. Chuẩn hóa nghiệp vụ theo UML 2.5: Xác lập hệ thống gồm đúng 4 tác nhân con người (Khách hàng, Nhân viên Bán hàng, Nhân viên Kho, Admin - Chủ cửa hàng), loại bỏ mô hình nhiều nhà bán hàng (multi-vendor Seller).\n"
        "2. Hướng dẫn thiết kế & lập trình: Định nghĩa chi tiết các Use Case, luồng dữ liệu, giao diện tương tác và lược đồ 11 bảng SQL Server.\n"
        "3. Tiêu chuẩn nghiệm thu: Cung cấp bộ tiêu chí nghiệm thu khách quan, kịch bản kiểm thử chức năng và phi chức năng cho toàn bộ hệ thống."
    )

    add_h2("1.2 Phạm vi")
    p = doc.add_paragraph(
        "• Tên sản phẩm: Hệ thống Thương mại Điện tử Tương tác Không gian 3D & Cổng Thanh toán Số Đa kênh (Tên gọi: SZSHOP / ZS-Economy Gateway).\n"
        "• Phạm vi giải quyết bài toán:\n"
        "  - Trực quan hóa danh mục 3D: Thay thế các bức ảnh 2D tĩnh truyền thống bằng mô hình 3D tương tác thời gian thực (Three.js WebGL canvas), cho phép xoay 360 độ và xem thẻ Bento Grid chiều sâu.\n"
        "  - Cổng thanh toán SZ-Payment: Tích hợp cổng thanh toán đa phương thức hỗ trợ VietQR Napas 247, VNPAY-QR, Ví MoMo, Thẻ quốc tế Visa/Mastercard và COD (có ràng buộc ngưỡng rủi ro <= 5 triệu VNĐ).\n"
        "  - Trợ lý AI Sales Copilot: Vận hành 6 kỹ năng AI nghiệp vụ (Tư vấn theo ngân sách, lọc danh mục sản phẩm, thêm nhanh giỏ hàng từ chat, tra cứu tiến độ vận đơn, báo cáo doanh thu Admin, và AI Khuyến nghị Kho) theo kiến trúc RAG không ảo giác.\n"
        "  - Hệ sinh thái 4 tác nhân chuẩn UML: Hỗ trợ đúng 4 nhóm tác nhân con người (Khách hàng - CUSTOMER, Nhân viên Bán hàng - SALES, Nhân viên Kho - WAREHOUSE, và Admin Chủ cửa hàng - ADMIN) cùng 2 tác nhân dịch vụ ngoại vi (Cổng thanh toán và Dịch vụ AI Gemini)."
    )

    add_h2("1.3 Các định nghĩa, thuật ngữ, từ viết tắt")
    glossary_tbl = doc.add_table(rows=1, cols=3)
    set_table_borders(glossary_tbl, "CBD5E1", "6")
    glossary_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = glossary_tbl.rows[0]
    hdr.cells[0].paragraphs[0].add_run("Thuật ngữ / Viết tắt")
    hdr.cells[1].paragraphs[0].add_run("Tên đầy đủ")
    hdr.cells[2].paragraphs[0].add_run("Ý nghĩa kỹ thuật & Nghiệp vụ")
    format_row(hdr, True, "0E7490")
    
    terms = [
        ("SRS", "Software Requirements Specification", "Tài liệu đặc tả yêu cầu phần mềm theo tiêu chuẩn IEEE Std 830-1998."),
        ("UML 2.5", "Unified Modeling Language 2.5", "Ngôn ngữ mô hình hóa thống nhất dùng đặc tả Use Case, Class, Activity và Sequence Diagram."),
        ("POS", "Point of Sale", "Phân hệ bán hàng trực tiếp tại quầy dành cho Nhân viên Bán hàng (SALES)."),
        ("Three.js", "Three.js 3D WebGL Library", "Thư viện JavaScript kết xuất đồ họa không gian 3D tương tác trực tiếp trên trình duyệt web."),
        ("RAG", "Retrieval-Augmented Generation", "Kỹ thuật kết hợp truy xuất dữ liệu có cấu trúc từ CSDL với LLM để sinh câu trả lời chính xác, chống ảo giác."),
        ("VietQR", "Vietnam Quick Response Standard", "Tiêu chuẩn mã QR thanh toán liên ngân hàng quốc gia do Napas và NHNN ban hành."),
        ("VNPAY-QR", "Vietnam Payment QR Gateway", "Cổng thanh toán quét mã QR hỗ trợ hơn 40 ứng dụng ngân hàng và ví điện tử."),
        ("COD", "Cash On Delivery", "Phương thức thanh toán bằng tiền mặt trực tiếp khi người mua nhận kiện hàng."),
        ("JWT", "JSON Web Token", "Chuẩn mã hóa thông tin xác thực an toàn truyền giữa Client và Server để duy trì phiên làm việc."),
        ("SKU", "Stock Keeping Unit", "Mã định danh phân loại hàng tồn kho theo từng biến thể (màu sắc, kích cỡ)."),
        ("ACID", "Atomicity, Consistency, Isolation, Durability", "4 nguyên lý bảo toàn tính toàn vẹn của các giao dịch trên CSDL quan hệ.")
    ]
    for row_idx, (t, f, d) in enumerate(terms):
        row = glossary_tbl.add_row()
        row.cells[0].paragraphs[0].add_run(t).font.bold = True
        row.cells[1].paragraphs[0].add_run(f)
        row.cells[2].paragraphs[0].add_run(d)
        format_row(row, False, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2("1.4 Tài liệu tham khảo")
    p = doc.add_paragraph(
        "1. Tiêu chuẩn IEEE Std 830-1998 & ISO/IEC/IEEE 29148:2018.\n"
        "2. Tiêu chuẩn OMG Unified Modeling Language (OMG UML) Version 2.5.1.\n"
        "3. Ngân hàng Nhà nước Việt Nam & Napas: Tài liệu đặc tả kỹ thuật kết nối Cổng thanh toán VietQR Napas 247.\n"
        "4. Google Cloud: Tài liệu đặc tả kỹ thuật Google Gemini API & Best Practices for Enterprise RAG.\n"
        "5. Bộ mã nguồn và CSDL dự án SZSHOP (Repository _Web_ZShop-main: React 19, Express 5, SQL Server 2022)."
    )

    # 2. MÔ TẢ TỔNG QUAN ỨNG DỤNG
    add_h1("2. MÔ TẢ TỔNG QUAN ỨNG DỤNG")

    add_h2("2.1 Mô hình Use Case tổng thể")
    p = doc.add_paragraph(
        "Hệ thống SZSHOP được thiết kế xoay quanh đúng 4 nhóm tác nhân con người tương tác thông qua giao diện Web "
        "và 2 tác nhân dịch vụ bên thứ ba theo chuẩn UML 2.5:\n"
        "• 1. Khách hàng (CUSTOMER): Đăng ký/Đăng nhập tài khoản mua hàng, khám phá sản phẩm 3D, quản lý giỏ hàng, đặt hàng, thanh toán SZ-Payment, tra cứu vận đơn, gửi yêu cầu đổi trả và tương tác AI Copilot.\n"
        "• 2. Nhân viên Bán hàng (SALES): Tạo đơn bán hàng tại quầy (POS), quản lý hồ sơ & hạng thành viên khách hàng, tư vấn CSKH và xử lý yêu cầu đổi/trả hàng.\n"
        "• 3. Nhân viên Kho (WAREHOUSE): Lập phiếu nhập kho hàng hóa, kiểm kê tồn kho, đóng gói xuất kho vận đơn và nhận khuyến nghị nhập kho từ AI.\n"
        "• 4. Admin - Chủ cửa hàng (ADMIN): Quản lý toàn diện cửa hàng, quản lý danh mục sản phẩm, quản lý nhân sự nội bộ (NV Bán hàng & NV Kho), cấu hình khuyến mãi và xem báo cáo doanh thu AI."
    )

    add_h2("2.2 Danh sách các tác nhân và mô tả")
    actors_tbl = doc.add_table(rows=1, cols=3)
    set_table_borders(actors_tbl, "CBD5E1", "6")
    actors_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = actors_tbl.rows[0]
    hdr.cells[0].paragraphs[0].add_run("STT")
    hdr.cells[1].paragraphs[0].add_run("Tác nhân (Actor)")
    hdr.cells[2].paragraphs[0].add_run("Mô tả vai trò & Quyền hạn nghiệp vụ trong hệ thống")
    format_row(hdr, True, "0E7490")

    actors = [
        ("1", "Khách hàng (CUSTOMER)", "Người mua sắm trên cửa hàng trực tuyến ZShop. Có quyền tự đăng ký tài khoản mới, duyệt không gian sản phẩm 3D, quản lý giỏ hàng, đặt hàng, thanh toán qua cổng SZ-Payment, tra cứu tiến trình vận đơn 5 mốc và gửi yêu cầu đổi/trả hàng."),
        ("2", "Nhân viên bán hàng (SALES)", "Nhân sự phụ trách bán hàng và chăm sóc khách hàng của cửa hàng. Truy cập POSPage, CustomerManagementPage, CSKHPortalPage và ReturnManagementPage để tạo hóa đơn tại quầy POS, tích điểm thành viên, giải đáp thắc mắc và duyệt đổi/trả hàng."),
        ("3", "Nhân viên kho (WAREHOUSE)", "Nhân sự phụ trách kho vận nội bộ của cửa hàng. Truy cập WarehousePage để lập phiếu nhập kho từ nhà cung cấp, kiểm kê điều chỉnh tồn kho, đóng gói xuất kho vận đơn và sử dụng AI Khuyến nghị Nhập kho."),
        ("4", "Admin - Chủ cửa hàng (ADMIN)", "Chủ sở hữu và người điều hành cao nhất của cửa hàng ZShop. Truy cập AdminDashboard để quản lý danh mục sản phẩm toàn cửa hàng, quản lý đội ngũ nhân sự nội bộ (NV Bán hàng & NV Kho), cấu hình tích điểm VIP và xem báo cáo tài chính AI."),
        ("5", "Cổng thanh toán (Payment GW)", "Hệ thống đối tác thanh toán bên thứ ba (VietQR Napas 247, VNPAY, MoMo, Thẻ quốc tế). Tiếp nhận thông tin giao dịch, sinh mã QR động và gửi phản hồi xác nhận trạng thái thanh toán qua Webhook API."),
        ("6", "Dịch vụ AI (Gemini Service)", "Hệ thống điện toán đám mây Google Gemini 1.5 API. Tiếp nhận truy vấn tự nhiên kèm ngữ cảnh RAG từ CSDL để sinh phản hồi tư vấn mua sắm, dự báo tồn kho và phân tích doanh thu.")
    ]
    for a_idx, (stt, act, desc) in enumerate(actors):
        row = actors_tbl.add_row()
        row.cells[0].paragraphs[0].add_run(stt)
        row.cells[1].paragraphs[0].add_run(act).font.bold = True
        row.cells[2].paragraphs[0].add_run(desc)
        format_row(row, False, "F8FAFC" if a_idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2("2.3 Danh sách Use Case và mô tả")
    uc_tbl = doc.add_table(rows=1, cols=5)
    set_table_borders(uc_tbl, "CBD5E1", "6")
    uc_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = uc_tbl.rows[0]
    hdr.cells[0].paragraphs[0].add_run("Mã UC")
    hdr.cells[1].paragraphs[0].add_run("Tên Use Case")
    hdr.cells[2].paragraphs[0].add_run("Phân hệ")
    hdr.cells[3].paragraphs[0].add_run("Tác nhân chính")
    hdr.cells[4].paragraphs[0].add_run("Tóm tắt chức năng nghiệp vụ")
    format_row(hdr, True, "0E7490")

    ucs = [
        ("UC001", "Đăng ký, Đăng nhập & Phân quyền 4 Tác nhân", "Xác thực (Auth)", "Customer, Sales, Warehouse, Admin", "Khách hàng tự đăng ký tài khoản; Đăng nhập và phân quyền JWT theo đúng 4 vai trò: CUSTOMER, SALES, WAREHOUSE, ADMIN."),
        ("UC002", "Khám phá & Tìm kiếm Sản phẩm 3D", "Catalog & 3D", "Customer, Sales", "Hiển thị Banner 3D Three.js xoay 360°; Bento Grid 3D; Flash Sale; Tìm kiếm từ khóa real-time; Lọc danh mục; Xem chi tiết và chọn biến thể Size/Màu."),
        ("UC003", "Quản lý Giỏ hàng & MiniCart", "Giỏ hàng (Cart)", "Customer", "Thêm sản phẩm kèm biến thể; Mở bảng trượt MiniCart; Tăng/giảm số lượng; Xóa item; Tự động tính tổng tiền tạm tính trong thời gian thực."),
        ("UC004", "Xác nhận Đơn hàng & Giao nhận", "Đặt hàng (Checkout)", "Customer, Sales", "Nhập thông tin người nhận; Áp dụng mã Voucher (SZWELCOME, FREESHIP, SALE50); Khởi tạo Order (Pending)."),
        ("UC005", "Thanh toán Đa kênh SZ-Payment", "Thanh toán (Payment)", "Customer, Sales, Payment GW", "Chọn phương thức (VNPAY-QR, VietQR, Thẻ, MoMo, COD <= 5tr); Sinh mã QR đếm ngược 15 phút; Xuất hóa đơn số 3D kèm mã TRX."),
        ("UC006", "Bán hàng POS, CSKH & Tra cứu Vận đơn", "Bán hàng & Vận đơn", "Sales, Customer", "Nhân viên Bán hàng tạo đơn tại quầy POS, quản lý khách hàng VIP, xử lý CSKH & đổi trả; Khách hàng tra cứu Timeline 5 mốc vận đơn."),
        ("UC007", "Trợ lý AI Mua sắm ZShop Copilot", "Trí tuệ nhân tạo (AI)", "Customer, Sales, Warehouse, Admin", "Tương tác tự nhiên qua 6 AI Skills: Tư vấn theo ngân sách, lọc danh mục, thêm nhanh vào giỏ, tra cứu đơn, báo cáo doanh thu Admin, khuyến nghị kho."),
        ("UC008", "Quản lý Nhập kho, Tồn kho & AI Kho", "Kho vận (Warehouse)", "Warehouse, Admin", "Nhân viên Kho lập phiếu nhập kho (StockImportTickets), kiểm kê điều chỉnh tồn kho, đóng gói xuất kho và nhận khuyến nghị nhập hàng từ AI."),
        ("UC009", "Quản trị Cửa hàng & Nhân sự Nội bộ", "Admin Dashboard", "Admin (Chủ cửa hàng)", "Giám sát KPI cửa hàng (Doanh thu, lợi nhuận ròng, đơn hàng); Quản lý Nhân sự nội bộ (NV Bán hàng & NV Kho); Quản lý sản phẩm & Báo cáo AI.")
    ]
    for u_idx, (m, n, mod, act, des) in enumerate(ucs):
        row = uc_tbl.add_row()
        row.cells[0].paragraphs[0].add_run(m).font.bold = True
        row.cells[1].paragraphs[0].add_run(n).font.bold = True
        row.cells[2].paragraphs[0].add_run(mod)
        row.cells[3].paragraphs[0].add_run(act)
        row.cells[4].paragraphs[0].add_run(des)
        format_row(row, False, "F8FAFC" if u_idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2("2.4 Các điều kiện phụ thuộc")
    p = doc.add_paragraph(
        "1. Môi trường mạng & Băng thông: Kết nối Internet ổn định, băng thông tối thiểu 2 Mbps để tải tài nguyên 3D (mô hình GLTF/OBJ và kết cấu PBR) cũng như truyền tải dữ liệu streaming từ Google Gemini API.\n"
        "2. Đồ họa phần cứng WebGL trên Client: Thiết bị người dùng bắt buộc hỗ trợ bộ tăng tốc đồ họa phần cứng WebGL 2.0. Tương thích đầy đủ trên Google Chrome 110+, Edge 110+, Firefox 115+, Safari 16+.\n"
        "3. Máy chủ & Hệ quản trị CSDL: Máy chủ Backend thực thi môi trường Node.js LTS v18.x hoặc v20.x, Express v5.2.1. CSDL chính thức sử dụng Microsoft SQL Server 2022 (cổng 1433); hệ thống hỗ trợ cơ chế chuyển mạch tự động (In-Memory Local Fallback) khi mất kết nối mạng CSDL.\n"
        "4. Dịch vụ đám mây ngoại vi: Xác thực Google OAuth 2.0 (Client ID), chuẩn mã hóa VietQR Napas247, và Gemini 1.5 API Key hoạt động ổn định."
    )

    # 3. ĐẶC TẢ CÁC YÊU CẦU CHỨC NĂNG
    add_h1("3. ĐẶC TẢ CÁC YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)")

    # Danh sách chi tiết các use case
    uc_specs = [
        {
            "code": "UC001",
            "name": "Đăng ký, Đăng nhập & Phân quyền 4 Tác nhân Hệ thống",
            "actors": "Khách hàng (CUSTOMER), Nhân viên Bán hàng (SALES), Nhân viên Kho (WAREHOUSE), Admin - Chủ cửa hàng (ADMIN)",
            "purpose": "Nhận diện người dùng, cho phép Khách hàng tự đăng ký tài khoản mua sắm mới, xác thực đăng nhập và phân quyền điều hướng theo đúng 4 vai trò chuẩn UML.",
            "pre": "Người dùng đã truy cập hệ thống SZSHOP và có kết nối Internet ổn định.",
            "post": "Cấp phát JWT token, lưu trữ phiên đăng nhập, điều hướng người dùng về đúng giao diện theo 4 vai trò (CUSTOMER -> ShopeeHome; SALES -> POSPage; WAREHOUSE -> WarehousePage; ADMIN -> AdminDashboard).",
            "basic_flow": [
                "1. Người dùng bấm nút 'Đăng nhập' trên thanh điều hướng Header.",
                "2. Hệ thống hiển thị giao diện LoginPage.tsx với bộ chọn nhanh 4 vai trò chuẩn UML (Khách hàng, Nhân viên bán hàng, Nhân viên kho, Admin Chủ cửa hàng).",
                "3. Người dùng nhập Email và Mật khẩu hợp lệ, bấm 'ĐĂNG NHẬP'.",
                "4. Frontend kiểm tra định dạng dữ liệu client, gửi POST /api/auth/login kèm { email, password }.",
                "5. Backend truy vấn bảng Users trong SQL Server theo email, so khớp hash mật khẩu với Bcrypt/Argon2.",
                "6. Backend đọc vai trò từ bảng Roles (CUSTOMER, SALES, WAREHOUSE, ADMIN), ký sinh chuỗi JWT token có hạn 24h và trả về kết quả.",
                "7. Frontend lưu trữ token, cập nhật trạng thái userRole toàn cục và điều hướng người dùng về giao diện tương ứng."
            ],
            "alt_flows": [
                "• Đăng ký tài khoản Khách hàng mới: Người dùng bấm 'Đăng ký ngay' -> Mở RegisterPage.tsx -> Nhập Họ tên, Email, Mật khẩu -> Backend tạo User mới với vai trò cố định CUSTOMER (không có tùy chọn đăng ký Nhà bán hàng).",
                "• Cấp tài khoản Nhân viên (SALES / WAREHOUSE): Chỉ Admin (Chủ cửa hàng) mới có quyền tạo và cấp tài khoản cho Nhân viên Bán hàng và Nhân viên Kho.",
                "• Ngoại lệ sai thông tin: Nếu email hoặc mật khẩu không khớp, Backend trả về HTTP 401 Unauthorized kèm thông báo lỗi cụ thể."
            ]
        },
        {
            "code": "UC002",
            "name": "Khám phá & Tìm kiếm Sản phẩm Không gian 3D",
            "actors": "Khách hàng (CUSTOMER), Nhân viên Bán hàng (SALES)",
            "purpose": "Cung cấp trải nghiệm thị giác đa chiều với mô hình 3D WebGL xoay 360 độ, thẻ sản phẩm Bento Grid chiều sâu, duyệt danh mục, Flash Sale, tìm kiếm từ khóa và xem chi tiết sản phẩm kèm chọn biến thể Size/Màu.",
            "pre": "Người dùng truy cập trang chủ hệ thống SZSHOP.",
            "post": "Mô hình 3D được hiển thị mượt mà, danh sách sản phẩm được lọc chính xác theo từ khóa hoặc danh mục, và mở trang chi tiết sản phẩm theo yêu cầu.",
            "basic_flow": [
                "1. Người dùng mở trang chủ LandingPage3D.tsx hoặc chuyển sang ShopeeHomePage.tsx.",
                "2. Tại giao diện 3D, hệ thống khởi tạo ThreeScene.tsx dựng nguồn sáng đa chiều, tải mô hình 3D sản phẩm và kích hoạt vòng lặp quay 360 độ đạt 60 FPS.",
                "3. Người dùng chạm hoặc vuốt chuột để xoay đa hướng mô hình 3D, chiêm ngưỡng hiệu ứng chiều sâu trên BentoGrid3D.",
                "4. Người dùng bấm 'Khám phá Cửa hàng' để chuyển sang ShopeeHomePage.tsx: tải danh mục ngành hàng, sản phẩm Flash Sale và lưới sản phẩm tổng hợp.",
                "5. Người dùng nhập từ khóa tìm kiếm trên ô Header (ví dụ: 'Áo polo', 'Giày').",
                "6. Sau khoảng trễ debounce 250ms, hệ thống gọi SanPhamService.timKiemSanPham(tuKhoa) và hiển thị Dropdown kết quả gợi ý tức thì.",
                "7. Người dùng bấm chọn một sản phẩm từ danh sách gợi ý hoặc từ lưới sản phẩm.",
                "8. Hệ thống mở trang ProductDetailPage.tsx: hiển thị chi tiết tên, giá niêm yết, tỷ lệ giảm, tồn kho, bộ chọn màu sắc (Color picker) và kích thước (Size selector: S, M, L, XL, Freesize)."
            ],
            "alt_flows": [
                "• Lọc theo danh mục: Người dùng bấm chọn biểu tượng danh mục (Thời trang nam, Giày dép...) trên Categories.tsx, hệ thống lọc lại ProductGrid theo đúng categoryId.",
                "• Không tìm thấy kết quả: Nếu từ khóa không khớp, Dropdown hiển thị thông báo 'Không tìm thấy sản phẩm nào' kèm gợi ý từ khóa phổ biến."
            ]
        },
        {
            "code": "UC003",
            "name": "Quản lý Giỏ hàng Đa năng (Cart Management & MiniCart)",
            "actors": "Khách hàng (CUSTOMER)",
            "purpose": "Cho phép Khách hàng chọn mua sản phẩm với thuộc tính cụ thể, xem nhanh giỏ hàng qua bảng trượt MiniCart, điều chỉnh tăng giảm số lượng, xóa item và tự động cập nhật tổng tiền tạm tính.",
            "pre": "Người dùng đang xem trang chi tiết sản phẩm hoặc nhấn icon Giỏ hàng trên thanh Header.",
            "post": "Dữ liệu giỏ hàng (cartItems) được cập nhật chính xác trên giao diện và đồng bộ với CSDL.",
            "basic_flow": [
                "1. Tại trang ProductDetailPage, Khách hàng chọn Màu sắc, Kích cỡ và nhấn nút 'Thêm vào giỏ hàng'.",
                "2. Hệ thống kiểm tra: Nếu mặt hàng đã tồn tại trong giỏ thì tăng số lượng, nếu chưa thì tạo CartItem mới gồm id, name, price, quantity, image, variant.",
                "3. Badge số lượng trên icon Giỏ hàng ở Header tăng tương ứng.",
                "4. Bảng trượt MiniCart.tsx tự động mở ra từ cạnh phải màn hình (slide-over animation 300ms) kèm backdrop làm mờ nền.",
                "5. MiniCart hiển thị từng mặt hàng: Ảnh thu nhỏ, tên sản phẩm, biến thể, đơn giá, bộ nút '+/-' số lượng, icon Thùng rác xóa mặt hàng, và số tiền Tạm tính ở chân trang.",
                "6. Khách hàng bấm nút '+' hoặc '-' để thay đổi số lượng: hệ thống kiểm tra tồn kho khả dụng và tính toán lại giá trị Tạm tính trong thời gian thực.",
                "7. Khách hàng bấm nút 'Thanh toán ngay', hệ thống đóng MiniCart và điều hướng sang OrderConfirmationPage.tsx."
            ],
            "alt_flows": [
                "• Xóa mặt hàng: Khách hàng bấm icon Thùng rác bên cạnh sản phẩm -> Hệ thống gỡ bỏ item và tính lại tổng tiền.",
                "• Đạt ngưỡng tồn kho tối đa: Nếu người dùng tăng số lượng vượt quá số lượng hàng tồn kho (stock), nút '+' bị vô hiệu hóa kèm cảnh báo."
            ]
        },
        {
            "code": "UC004",
            "name": "Xác nhận Đơn hàng & Thiết lập Giao nhận (Checkout)",
            "actors": "Khách hàng (CUSTOMER), Nhân viên Bán hàng (SALES)",
            "purpose": "Kiểm tra danh mục hàng hóa đặt mua, nhập thông tin liên hệ và địa chỉ nhận hàng, chọn mã ưu đãi giảm giá (Coupon), tính phí vận chuyển và khởi tạo đơn hàng chính thức ở trạng thái PENDING.",
            "pre": "Giỏ hàng có ít nhất 01 sản phẩm và người dùng đã đăng nhập tài khoản.",
            "post": "Khởi tạo thành công bản ghi Order (status: PENDING) và OrderItems trong CSDL; chuyển tiếp sang bước thanh toán.",
            "basic_flow": [
                "1. Khách hàng bấm 'Thanh toán ngay' từ giỏ hàng, hệ thống mở màn hình OrderConfirmationPage.tsx.",
                "2. Màn hình chia thành 2 cột: Cột trái chứa Form 'Thông tin giao hàng' (Họ tên, SĐT, Địa chỉ nhận hàng, Ghi chú) và danh sách Mã giảm giá SZSHOP; Cột phải chứa Tóm tắt đơn hàng.",
                "3. Khách hàng nhập đầy đủ thông tin giao nhận hàng.",
                "4. Khách hàng bấm chọn mã khuyến mãi phù hợp: SZWELCOME (Giảm 20k), FREESHIP (Miễn phí vận chuyển 30k), hoặc SALE50 (Giảm 50k cho đơn từ 1 triệu).",
                "5. Hệ thống tính lại Tổng tiền: Tổng = Tạm tính + Phí ship - Giảm giá.",
                "6. Khách hàng tích chọn ô 'Tôi đồng ý với điều khoản mua hàng của SZSHOP' và nhấn 'XÁC NHẬN ĐẶT HÀNG'.",
                "7. Hệ thống gọi DatHangService.taoDonHangNhap tạo bản ghi trong bảng Orders và OrderItems với trạng thái PENDING và chuyển sang CheckoutPage.tsx."
            ],
            "alt_flows": [
                "• Bỏ trống thông tin giao nhận: Nếu để trống Họ tên, SĐT hoặc Địa chỉ, nút Xác nhận bị vô hiệu hóa kèm thông báo nhắc nhở."
            ]
        },
        {
            "code": "UC005",
            "name": "Thanh toán Trực tuyến Đa kênh SZ-Payment Gateway",
            "actors": "Khách hàng (CUSTOMER), Nhân viên Bán hàng (SALES), Cổng thanh toán bên thứ ba (Payment GW)",
            "purpose": "Cung cấp giải pháp thanh toán điện tử đa kênh (VietQR Napas 247, VNPAY-QR, MoMo, Thẻ quốc tế, COD), sinh mã QR động đếm ngược 15 phút, xác thực giao dịch qua webhook và xuất hóa đơn số 3D kèm mã TRX.",
            "pre": "Đơn hàng đã được tạo ở trạng thái PENDING từ Use Case UC004 hoặc từ quầy POS.",
            "post": "Đơn hàng được cập nhật trạng thái PAID, ghi nhận bản ghi vào bảng Payments, và khách hàng nhận được hóa đơn điện tử.",
            "basic_flow": [
                "1. Hệ thống hiển thị CheckoutPage.tsx gồm tóm tắt số tiền và danh sách phương thức thanh toán PaymentMethodList.tsx.",
                "2. Khách hàng chọn phương thức 'Quét mã VNPAY-QR' hoặc 'VietQR Napas 247' và bấm Tiếp tục.",
                "3. Hệ thống hiển thị QRCodePanel.tsx sinh chuỗi mã hóa SZSHOP-PAYMENT-[MãĐơn]-[SốTiền], render ảnh mã QR động kèm đồng hồ đếm ngược 15:00 phút.",
                "4. Khách hàng mở ứng dụng Ngân hàng trên điện thoại, quét mã QR và xác thực chuyển tiền.",
                "5. Cổng thanh toán gửi tín hiệu webhook xác nhận thành công về Backend POST /api/payment/confirm.",
                "6. Backend cập nhật Orders.status = 'PAID' và thêm bản ghi vào bảng Payments với payment_status = 'Success' và transaction_id = 'TRX-99887766'.",
                "7. Frontend chuyển sang TransactionResultPage.tsx: kích hoạt hiệu ứng pháo hoa Confetti, hiển thị dấu tích xanh thành công và hóa đơn số."
            ],
            "alt_flows": [
                "• Phương thức COD: Khách chọn COD. Nếu đơn hàng > 5.000.000đ, tự động khóa COD và hiện badge đỏ 'Không hỗ trợ đơn > 5tr'. Nếu đơn <= 5.000.000đ, cho phép chọn COD bình thường.",
                "• Hết hạn 15 phút quét mã: Đồng hồ đếm ngược chạm 00:00, mã QR bị làm mờ kèm nút 'Tạo mã QR mới'."
            ]
        },
        {
            "code": "UC006",
            "name": "Bán hàng tại quầy (POS), CSKH & Tra cứu Tiến trình Vận đơn",
            "actors": "Nhân viên Bán hàng (SALES), Khách hàng (CUSTOMER)",
            "purpose": "Cho phép Nhân viên Bán hàng tạo hóa đơn trực tiếp tại quầy POS, quản lý khách hàng thân thiết, xử lý yêu cầu CSKH & đổi trả hàng; đồng thời cho phép Khách hàng tra cứu lộ trình 5 mốc vận đơn.",
            "pre": "Nhân viên Bán hàng đăng nhập vai trò SALES hoặc Khách hàng có mã đơn hàng hợp lệ.",
            "post": "Hóa đơn POS, yêu cầu đổi trả hoặc lịch sử tiến trình vận đơn được cập nhật và hiển thị chính xác.",
            "basic_flow": [
                "1. Nhân viên Bán hàng mở POSPage.tsx để chọn nhanh sản phẩm tại quầy, áp dụng tích điểm khách hàng và xuất biên lai thanh toán.",
                "2. Nhân viên Bán hàng mở CSKHPortalPage.tsx và ReturnManagementPage.tsx để hỗ trợ khách hàng và phê duyệt yêu cầu đổi trả (UC10).",
                "3. Khách hàng mở trang OrderTrackingPage.tsx, nhập mã đơn hàng (ví dụ: DH-20241228) và bấm nút tra cứu.",
                "4. Hệ thống hiển thị Vertical Timeline gồm 5 mốc: 1. Chờ xác nhận (Pending); 2. Đã thanh toán (Paid); 3. Đang chuẩn bị hàng (Processing); 4. Đang vận chuyển (Shipping); 5. Đã giao hàng (Delivered)."
            ],
            "alt_flows": [
                "• Hủy / Đổi trả đơn hàng: Đối với các đơn chưa chuyển sang 'Đang vận chuyển', khách hàng có thể bấm 'Hủy đơn hàng'. Đối với đơn đã giao, khách hàng có thể tạo yêu cầu Đổi/Trả để Nhân viên Bán hàng xử lý."
            ]
        },
        {
            "code": "UC007",
            "name": "Trợ lý AI Mua sắm & Phân tích Doanh số ZShop Copilot",
            "actors": "Khách hàng (CUSTOMER), Nhân viên Bán hàng (SALES), Nhân viên Kho (WAREHOUSE), Admin - Chủ cửa hàng (ADMIN), Gemini Service",
            "purpose": "Cung cấp trợ lý ảo thông minh tương tác bằng ngôn ngữ tự nhiên tiếng Việt, vận hành bằng kiến trúc RAG kết hợp 6 Business Skills nghiệp vụ cho cả 4 tác nhân.",
            "pre": "Người dùng nhấp vào biểu tượng Chatbot AI ở góc phải phía dưới màn hình (ChatBot.tsx).",
            "post": "AI trả về câu trả lời tự nhiên chính xác kèm các Card sản phẩm tương tác hoặc báo cáo quản trị.",
            "basic_flow": [
                "1. Người dùng mở Chatbot và nhập câu hỏi bằng tiếng Việt tự nhiên (ví dụ: 'Tôi có 400k muốn mua áo thun').",
                "2. Frontend gửi tin nhắn tới Backend /api/chat.",
                "3. Backend AiService.js truy vấn CSDL lấy danh mục sản phẩm thực tế, xây dựng RAG Prompt có ngữ cảnh thực tế và gọi Google Gemini 1.5 API.",
                "4. Gemini sinh câu trả lời tự nhiên kèm danh sách mã ID sản phẩm phù hợp.",
                "5. Frontend hiển thị câu trả lời và render các Card sản phẩm tương tác bên dưới tin nhắn để khách bấm 'Thêm vào giỏ' ngay trong chat."
            ],
            "alt_flows": [
                "• Skill 4 (Tra cứu đơn): Khách hoặc NV Bán hàng hỏi 'Đơn hàng DH-20241228 đến đâu rồi?' -> AI trích xuất mã đơn và trả về trạng thái vận đơn hiện tại.",
                "• Skill 5 (Báo cáo Admin): Admin (Chủ cửa hàng) hỏi 'Báo cáo doanh số hôm nay' -> AI kiểm tra quyền ADMIN, tính tổng doanh thu từ CSDL và xuất báo cáo tài chính.",
                "• Skill 6 (Khuyến nghị Kho): Nhân viên Kho yêu cầu kiểm tra các mặt hàng sắp hết tồn kho cần nhập thêm."
            ]
        },
        {
            "code": "UC008",
            "name": "Quản lý Nhập kho, Tồn kho & AI Khuyến nghị Kho (Nhân viên Kho)",
            "actors": "Nhân viên Kho (WAREHOUSE), Admin - Chủ cửa hàng (ADMIN)",
            "purpose": "Cho phép Nhân viên Kho lập phiếu nhập kho từ nhà cung cấp, kiểm kê điều chỉnh số lượng tồn kho, đóng gói xuất kho vận đơn và nhận gợi ý nhập hàng tự động từ AI.",
            "pre": "Người dùng đã đăng nhập với vai trò WAREHOUSE hoặc ADMIN và truy cập vào WarehousePage.tsx.",
            "post": "Phiếu nhập kho mới được ghi vào bảng StockImportTickets và số lượng tồn kho trong bảng Products được cộng dồn chính xác.",
            "basic_flow": [
                "1. Nhân viên Kho đăng nhập hệ thống và truy cập vào giao diện WarehousePage.tsx.",
                "2. Xem bảng cảnh báo tồn kho thấp (các SKU có stock <= 10) và bảng khuyến nghị số lượng nhập từ AI (UC08).",
                "3. Nhân viên Kho bấm nút '+ Tạo Phiếu Nhập Kho (UC05)'.",
                "4. Nhập Tên nhà cung cấp, chọn sản phẩm cần nhập, nhập số lượng và đơn giá nhập vốn.",
                "5. Bấm 'Xác nhận Nhập kho', hệ thống lưu phiếu nhập vào bảng StockImportTickets và cộng dồn số lượng tồn kho vào bảng Products.",
                "6. Nhân viên Kho chuyển sang tab Đóng gói đơn hàng để xác nhận xuất kho bàn giao vận chuyển (SHIPPING)."
            ],
            "alt_flows": [
                "• Kiểm kê kho: Nhân viên Kho cập nhật điều chỉnh số lượng tồn kho thực tế khi kiểm kê định kỳ.",
                "• Số lượng nhập không hợp lệ: Hệ thống chặn và báo lỗi nếu số lượng nhập <= 0."
            ]
        },
        {
            "code": "UC009",
            "name": "Quản trị Cửa hàng, Nhân sự Nội bộ & AI Phân tích Kinh doanh (Admin)",
            "actors": "Admin - Chủ cửa hàng (ADMIN)",
            "purpose": "Cung cấp trung tâm điều hành toàn diện cho Chủ cửa hàng: Theo dõi KPI kinh doanh, quản lý đội ngũ nhân sự nội bộ (NV Bán hàng & NV Kho), quản lý danh mục sản phẩm cửa hàng và xem báo cáo AI.",
            "pre": "Người dùng đăng nhập tài khoản có vai trò ADMIN (userRole === 'ADMIN').",
            "post": "Các quyết định cấp quyền nhân sự, cập nhật sản phẩm hoặc cấu hình chính sách VIP được lưu vết và áp dụng ngay lập tức trên toàn cửa hàng.",
            "basic_flow": [
                "1. Admin (Chủ cửa hàng) đăng nhập và truy cập vào AdminDashboard.tsx.",
                "2. Hệ thống tải dữ liệu tổng thể và hiển thị các khối KPI: Thẻ Tổng doanh thu, Lợi nhuận ròng, Tổng đơn hàng và Biểu đồ cột Doanh thu tuần.",
                "3. Admin chọn tab 'Nhân sự (NV)' (STAFF - UC01): xem danh sách Nhân viên Bán hàng (SALES) và Nhân viên Kho (WAREHOUSE), cấp tài khoản nhân viên mới hoặc khóa/mở khóa quyền làm việc.",
                "4. Admin chọn tab 'Sản phẩm' (PRODUCTS - UC02): thêm mới, chỉnh sửa giá bán hoặc ngừng kinh doanh sản phẩm của cửa hàng.",
                "5. Admin chọn tab 'Đơn hàng' (ORDERS) & 'Báo cáo AI' (REPORTS - UC09): giám sát toàn bộ đơn hàng và xuất báo cáo phân tích kinh doanh."
            ],
            "alt_flows": [
                "• Chặn truy cập trái phép: Nếu người dùng không có vai trò ADMIN cố tình mở trang AdminDashboard, hệ thống chặn truy cập và hiển thị thông báo lỗi 403 Forbidden."
            ]
        }
    ]

    for uc in uc_specs:
        add_h2(f"3.{uc['code'][-3:].lstrip('0') if uc['code'][-3:].lstrip('0') else '1'} {uc['code']}_{uc['name']}")
        
        # 3.x.1 Mô tả use case
        add_h3(f"3.{uc['code'][-3:].lstrip('0') if uc['code'][-3:].lstrip('0') else '1'}.1 Mô tả use case {uc['code']}")
        p_desc = doc.add_paragraph()
        add_bullet(p_desc, "Mã Use Case & Tên", f"{uc['code']} - {uc['name']}")
        add_bullet(p_desc, "Tác nhân tham gia (Actors)", uc['actors'])
        add_bullet(p_desc, "Mục đích (Purpose)", uc['purpose'])
        add_bullet(p_desc, "Tiền điều kiện (Pre-conditions)", uc['pre'])
        add_bullet(p_desc, "Hậu điều kiện (Post-conditions)", uc['post'])

        p_bf = doc.add_paragraph()
        r_bf_title = p_bf.add_run("• Luồng sự kiện chính (Basic Flow / Normal Flow):\n")
        r_bf_title.font.bold = True
        for step in uc['basic_flow']:
            r_step = p_bf.add_run(f"  {step}\n")

        p_af = doc.add_paragraph()
        r_af_title = p_af.add_run("• Các luồng thay thế & Luồng ngoại lệ (Alternative & Exception Flows):\n")
        r_af_title.font.bold = True
        for alt in uc['alt_flows']:
            r_alt = p_af.add_run(f"  {alt}\n")

        # 3.x.2 Biểu đồ use case
        add_h3(f"3.{uc['code'][-3:].lstrip('0') if uc['code'][-3:].lstrip('0') else '1'}.2 Biểu đồ use case {uc['code']}")
        p_diag = doc.add_paragraph(
            f"Biểu đồ Hoạt động (Activity Diagram) và Biểu đồ Tuần tự (Sequence Diagram) chuẩn hóa chi tiết cho {uc['code']} "
            f"được kết xuất trực quan bằng mã nguồn Mermaid chuẩn trong file tài liệu đặc tả điện tử docs/SRS_SZSHOP_SPECIFICATION.md "
            f"và hiển thị đồng bộ trong hệ thống tài liệu dự án."
        )

    # 4. CÁC THÔNG TIN HỖ TRỢ KHÁC
    add_h1("4. CÁC THÔNG TIN HỖ TRỢ KHÁC")

    add_h2("4.1 Yêu cầu phi chức năng (Non-Functional Requirements)")
    nfr_tbl = doc.add_table(rows=1, cols=3)
    set_table_borders(nfr_tbl, "CBD5E1", "6")
    nfr_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = nfr_tbl.rows[0]
    hdr.cells[0].paragraphs[0].add_run("Nhóm tiêu chí")
    hdr.cells[1].paragraphs[0].add_run("Yêu cầu chỉ số kỹ thuật cụ thể")
    hdr.cells[2].paragraphs[0].add_run("Phương pháp kiểm chứng & Đo lường")
    format_row(hdr, True, "0E7490")

    nfrs = [
        ("1. Hiệu năng (Performance)", "- Tốc độ dựng khung hình 3D Three.js >= 60 FPS trên thiết bị phổ thông có GPU tích hợp.\n- Thời gian tương tác trang đầu (TTI) < 2.0s trên mạng tiêu chuẩn.\n- Độ trễ phản hồi API backend < 300ms.\n- Thời gian phản hồi token đầu tiên của AI Copilot < 1.5s.", "Kiểm thử tự động bằng Google Lighthouse, Chrome DevTools Performance Profiler và Apache JMeter với 1.000 virtual users."),
        ("2. Bảo mật (Security)", "- Băm mật khẩu bằng BCrypt/Argon2 (Salt rounds >= 10), tuyệt đối không lưu plaintext.\n- Xác thực phiên làm việc bằng JSON Web Token (JWT) kiểm soát đúng 4 vai trò (CUSTOMER, SALES, WAREHOUSE, ADMIN).\n- Mã hóa đường truyền qua HTTPS/TLS 1.3.\n- Ngăn chặn SQL Injection qua Parameterized Queries, chống XSS và CSRF.", "Kiểm tra mã nguồn tĩnh với SonarQube, quét bảo mật OWASP ZAP định kỳ."),
        ("3. Độ tin cậy (Reliability)", "- Mức độ sẵn sàng hệ sinh thái đạt 99.9% thời gian hoạt động.\n- Tự động chuyển mạch dự phòng (In-Memory Local Fallback) khi mất kết nối mạng SQL Server.\n- Bảo toàn tính toàn vẹn giao dịch thanh toán theo nguyên lý ACID.", "Kịch bản ngắt kết nối mạng CSDL bất ngờ và kiểm tra đối soát số dư giao dịch tự động."),
        ("4. Khả dụng & Tương thích", "- Thiết kế Responsive tương thích hoàn toàn trên Smartphone (360px), Tablet (768px), Laptop (1024px) và Desktop (1920px).\n- Hỗ trợ đầy đủ cảm ứng vuốt chạm xoay mô hình 3D.\n- Độ tương phản màu sắc đáp ứng tiêu chuẩn tiếp cận WCAG 2.1 Level AA.", "Kiểm thử chéo trên Chrome, Safari, Edge, Firefox trên các hệ điều hành Windows, macOS, iOS và Android.")
    ]
    for n_idx, (c, req, m) in enumerate(nfrs):
        row = nfr_tbl.add_row()
        row.cells[0].paragraphs[0].add_run(c).font.bold = True
        row.cells[1].paragraphs[0].add_run(req)
        row.cells[2].paragraphs[0].add_run(m)
        format_row(row, False, "F8FAFC" if n_idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2("4.2 Thiết kế Cơ sở Dữ liệu Quan hệ Vật lý (11 Bảng SQL Chuẩn 4 Tác nhân)")
    p = doc.add_paragraph(
        "Cơ sở dữ liệu của hệ sinh thái SZSHOP được thiết kế chuẩn hóa mức 3NF trên hệ quản trị Microsoft SQL Server, bao gồm 11 bảng quan hệ logic phục vụ 4 tác nhân:"
    )
    
    db_tbl = doc.add_table(rows=1, cols=4)
    set_table_borders(db_tbl, "CBD5E1", "6")
    db_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = db_tbl.rows[0]
    hdr.cells[0].paragraphs[0].add_run("STT")
    hdr.cells[1].paragraphs[0].add_run("Tên bảng (Table)")
    hdr.cells[2].paragraphs[0].add_run("Khóa chính & Khóa ngoại")
    hdr.cells[3].paragraphs[0].add_run("Ý nghĩa nghiệp vụ lưu trữ")
    format_row(hdr, True, "0E7490")

    tables_info = [
        ("1", "Roles", "PK: id", "Phân quyền hạn 4 tác nhân chuẩn UML (ADMIN, SALES, WAREHOUSE, CUSTOMER)."),
        ("2", "Users", "PK: id | FK: role_id -> Roles", "Lưu trữ tài khoản đăng nhập, hash mật khẩu, thông tin Google/Apple OAuth."),
        ("3", "Customers", "PK: id | FK: user_id -> Users", "Hồ sơ khách hàng, địa chỉ nhận hàng mặc định, SĐT và điểm tích lũy thành viên VIP."),
        ("4", "Staffs", "PK: id | FK: user_id -> Users", "Hồ sơ nhân sự nội bộ cửa hàng: Nhân viên Bán hàng (SALES) và Nhân viên Kho (WAREHOUSE)."),
        ("5", "Categories", "PK: id", "Danh mục phân loại ngành hàng (Thời trang nam, Thời trang nữ, Giày dép, Phụ kiện)."),
        ("6", "Products", "PK: id | FK: category_id", "Thông tin sản phẩm kinh doanh của cửa hàng: Tên, đơn giá, số lượng tồn kho."),
        ("7", "StockImportTickets", "PK: id | FK: staff_id, product_id", "Phiếu nhập kho hàng hóa từ nhà cung cấp do Nhân viên Kho lập (UC05)."),
        ("8", "Carts & CartItems", "PK: id | FK: customer_id, product_id", "Giỏ hàng và chi tiết các mặt hàng được Khách hàng chọn mua."),
        ("9", "Orders", "PK: id | FK: customer_id, handled_by_staff_id", "Đơn hàng Online hoặc tại quầy POS của khách, lưu tổng số tiền và trạng thái."),
        ("10", "OrderItems", "PK: id | FK: order_id, product_id", "Chi tiết mặt hàng trong đơn hàng, lưu đơn giá, số lượng và trạng thái đóng gói."),
        ("11", "Payments", "PK: id | FK: order_id -> Orders", "Lịch sử giao dịch thanh toán: Cổng thanh toán, mã giao dịch TRX ngân hàng, số tiền, ngày giờ.")
    ]
    for t_idx, (stt, tb, k, des) in enumerate(tables_info):
        row = db_tbl.add_row()
        row.cells[0].paragraphs[0].add_run(stt)
        row.cells[1].paragraphs[0].add_run(tb).font.bold = True
        row.cells[2].paragraphs[0].add_run(k)
        row.cells[3].paragraphs[0].add_run(des)
        format_row(row, False, "F8FAFC" if t_idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2("4.3 Ràng buộc Thiết kế & Kiến trúc Triển khai")
    p = doc.add_paragraph(
        "• Kiến trúc phân tầng N-Tier Decoupled: Tách biệt hoàn toàn giữa Tầng giao diện Presentation (React 19, Three.js, Tailwind), Tầng xử lý nghiệp vụ Backend API (Express 5 RESTful API), Tầng CSDL (SQL Server 2022 / Local Fallback) và Tầng Trí tuệ nhân tạo (Google Gemini RAG Microservice).\n"
        "• Tính toàn vẹn giao dịch: Mọi thao tác cập nhật đơn hàng và thanh toán đều tuân thủ triệt để nguyên lý ACID, ngăn chặn tình trạng dữ liệu không đồng nhất.\n"
        "• Đóng gói và triển khai: Mã nguồn Frontend được đóng gói tối ưu hóa bằng Vite; Backend hỗ trợ đóng gói Docker Container độc lập, dễ dàng triển khai trên môi trường đám mây và mở rộng ngang (Horizontal Scaling) linh hoạt."
    )

    add_callout(
        "Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này là văn kiện kỹ thuật có giá trị pháp lý cao nhất trong dự án SZSHOP, "
        "quy định tiêu chuẩn nghiệm thu và làm cơ sở tiến hành giai đoạn Hiện thực hóa Mã nguồn (Implementation Phase) "
        "và Kiểm thử Chấp nhận Người dùng (User Acceptance Testing - UAT).",
        "KẾT LUẬN & CAM KẾT:"
    )

    doc.save(target_docx_path)
    print(f"[OK] Đã tạo thành công file Word tại: {target_docx_path}")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(root_dir, "docs")
    os.makedirs(docs_dir, exist_ok=True)

    # 1. Sinh file Markdown
    md_content = create_markdown_content()
    md_path = os.path.join(docs_dir, "SRS_SZSHOP_SPECIFICATION.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"[OK] Đã tạo thành công file Markdown tại: {md_path}")

    # 2. Sinh file Word (.docx) ở thư mục gốc và thư mục docs
    docx_root_path = os.path.join(root_dir, "SRS_SZSHOP_SPECIFICATION.docx")
    build_docx_report(docx_root_path)

    docx_docs_path = os.path.join(docs_dir, "SRS_SZSHOP_SPECIFICATION.docx")
    shutil.copyfile(docx_root_path, docx_docs_path)
    print(f"[OK] Đã sao chép file Word sang: {docx_docs_path}")

if __name__ == "__main__":
    main()
