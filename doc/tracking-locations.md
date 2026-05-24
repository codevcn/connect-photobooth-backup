# Danh sách các điểm Tích hợp Tracking Hành vi Người dùng

Dưới đây là danh sách chi tiết tất cả các file và vị trí đang sử dụng tính năng theo dõi hành vi người dùng (`trackEventSafe` và `useTrackPageView`) trong mã nguồn hiện tại, tính từ thư mục gốc (`/root`).

## 1. Khởi tạo & Tiện ích Core
- **Tên file**: `firebase.ts`
- **Đường dẫn**: `src/utils/firebase.ts`
- **Mô tả**: Đây là file hạt nhân của tính năng tracking. Chứa định nghĩa Class `UserBehaviorTracker`, hàm tạo `access_id` và `session_id`, tự động lấy `current_path`, cũng như xuất ra hàm `trackEventSafe` và custom hook `useTrackPageView`.

---

## 2. Các điểm Tracking trên Trang Chỉnh Sửa (Edit Page)

- **Tên file**: `Page.tsx`
  - **Đường dẫn**: `src/pages/edit/Page.tsx`
  - **Mô tả**: Gọi `useTrackPageView` để đếm lượt xem trang Chỉnh sửa.

- **Tên file**: `Actions.tsx`
  - **Đường dẫn**: `src/pages/edit/Actions.tsx`
  - **Mô tả**: Gắn `trackEventSafe` cho 3 sự kiện chính trên thanh Action: 
    - `ADD_TO_CART`: Thêm vào giỏ hàng.
    - `VIEW_CART`: Nhấn để xem giỏ hàng/thanh toán.
    - `PREVIEW_MOCKUP`: Mở Modal xem trước Mockup.

- **Tên file**: `ProductGallery.tsx`
  - **Đường dẫn**: `src/pages/edit/ProductGallery.tsx`
  - **Mô tả**: Gắn `SELECT_PRODUCT` khi người dùng nhấn chuyển đổi sản phẩm muốn thiết kế.

- **Tên file**: `VariantInfo.tsx`
  - **Đường dẫn**: `src/pages/edit/product/VariantInfo.tsx`
  - **Mô tả**: Gắn `SELECT_VARIANT` khi người dùng chọn/đổi biến thể sản phẩm (như màu sắc, chất liệu, size).

- **Tên file**: `LayoutsPicker-Fun.tsx`
  - **Đường dẫn**: `src/pages/edit/customize/print-layout/LayoutsPicker-Fun.tsx`
  - **Mô tả**: Gắn `PICK_LAYOUT` (khi chọn Layout thiết kế) và `PICK_NO_LAYOUT` (khi hủy bỏ Layout).

- **Tên file**: `StickerPicker.tsx`
  - **Đường dẫn**: `src/pages/edit/elements/sticker-element/StickerPicker.tsx`
  - **Mô tả**: Gắn `ADD_STICKER` khi thao tác chọn thêm Sticker.

- **Tên file**: `TextEditor.tsx`
  - **Đường dẫn**: `src/pages/edit/elements/text-element/TextEditor.tsx`
  - **Mô tả**: Gắn `ADD_TEXT` khi thao tác thêm đoạn văn bản mới.

- **Tên file**: `PrintedImagesModal.tsx`
  - **Đường dẫn**: `src/pages/edit/printed-images/PrintedImagesModal.tsx`
  - **Mô tả**: Gắn `PICK_PRINTED_IMAGE` khi user chọn lấy ảnh đã chụp in ra.

- **Tên file**: `AdditionalInformation.tsx`
  - **Đường dẫn**: `src/pages/edit/product/AdditionalInformation.tsx`
  - **Mô tả**: Bắt các thao tác xem thông tin chi tiết qua các event: `VIEW_PRODUCT_DESCRIPTION_TAB`, `VIEW_RETURN_POLICY_TAB`, `VIEW_FAQ_TAB`.

---

## 3. Các điểm Tracking trên Trang Thanh Toán & Giỏ hàng (Payment Page)

- **Tên file**: `Page.tsx`
  - **Đường dẫn**: `src/pages/payment/Page.tsx`
  - **Mô tả**: 
    - Bắt sự kiện `PAGE_VIEW` cho trang thanh toán.
    - `APPLY_VOUCHER`: Khi thêm hoặc gỡ mã giảm giá.
    - `UPDATE_QUANTITY`: Khi bấm tăng/giảm số lượng sản phẩm.
    - `REMOVE_CART_ITEM`: Khi xóa bỏ hẳn sản phẩm khỏi giỏ hàng.
    - `EDIT_MOCKUP`: Khi nhấn nút chỉnh sửa lại sản phẩm từ giỏ hàng.
    - `ACCEPT_TERMS`: Khi tick hoặc bỏ tick đồng ý điều khoản.
    - `PAYMENT_PROCEED`: Khi bấm nút "Tiến hành thanh toán".

- **Tên file**: `PaymentModal.tsx`
  - **Đường dẫn**: `src/pages/payment/PaymentModal.tsx`
  - **Mô tả**: Gắn `START_PROCESS_PAYMENT` khi bắt đầu quá trình thanh toán nội bộ và `START_PAYMENT_QR` khi mã QR ngân hàng hiện lên.

- **Tên file**: `ShippingInfo.tsx`
  - **Đường dẫn**: `src/pages/payment/ShippingInfo.tsx`
  - **Mô tả**: Bắt sự kiện `SHIPPING_FORM_CHANGE` mỗi khi người dùng điền hoặc thay đổi thông tin vận chuyển.

- **Tên file**: `EndOfPayment.tsx`
  - **Đường dẫn**: `src/pages/payment/EndOfPayment.tsx`
  - **Mô tả**: 
    - `BACK_TO_EDIT`: Bấm quay lại trang thiết kế sau khi ở bước cuối.
    - `COMPLETE_PAYMENT`: Ghi nhận đã thanh toán xong (thành công).
    - `CANCEL_PAYMENT`: Ghi nhận quá trình thanh toán bị hủy ngang.

---

## 4. Components Dùng Chung

- **Tên file**: `FAQ.tsx`
  - **Đường dẫn**: `src/components/ui/FAQ.tsx`
  - **Mô tả**: Gắn sự kiện `EXPAND_FAQ_QUESTION` mỗi khi người dùng nhấn xổ xuống (expand) để đọc câu trả lời của mục giải đáp thắc mắc.
