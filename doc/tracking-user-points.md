# Kế hoạch Theo dõi Hành vi Người dùng (User Behavior Tracking Plan)

Tài liệu này xác định các điểm tương tác chính trên giao diện người dùng (UI) để tiến hành theo dõi (tracking) hành vi.

## Tổng quan Hành vi Người dùng trên Giao diện

### Trang Chỉnh sửa (Edit Page - `/`)

- **Tương tác với Sản phẩm & Frame**:
  - Chọn sản phẩm (Product).
  - Chọn biến thể (Variant: kích thước, màu sắc).
  - Đổi khung ảnh (Template Frame).
- **Thêm/Chỉnh sửa Element (Mockup)**:
  - Nhấn nút thêm Text.
  - Nhấn nút thêm Sticker.
  - Chọn ảnh đã in (Printed Image).
  - **_Lưu ý quan trọng: TUYỆT ĐỐI KHÔNG ĐỤNG GÌ VÀO LOGIC KÉO THẢ CỦA KHU VỰC print-area-container_**
- **Thao tác hành động chính (Actions Bar)**:
  - Nhập "Ghi chú đơn hàng" vào ô ghi chú.
  - Nhấn nút "Xem trước bản mockup".
  - Nhấn nút "Thêm vào giỏ hàng".
  - Nhấn nút "Xem giỏ hàng" để chuyển qua bước thanh toán.

### Trang Thanh toán (Payment Page - `/payment`)

- **Quản lý giỏ hàng**:
  - Tăng/giảm số lượng sản phẩm.
  - Xóa sản phẩm khỏi giỏ hàng.
  - Nhấn quay lại để chỉnh sửa lại mockup.
- **Voucher**:
  - Nhập mã và áp dụng voucher.
- **Thanh toán**:
  - Click xem "Điều khoản dịch vụ".
  - Tick chọn "Đồng ý điều khoản".
  - Nhấn nút "Tiến hành thanh toán".
- **Lỗi/Điều hướng**:
  - Nhấn nút "Quay về" (Back to Edit).
  - Nhấn nút "Quay lại trang chỉnh sửa" khi giỏ hàng trống.
