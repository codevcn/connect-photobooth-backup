# Kế hoạch Tích hợp Hướng dẫn Người dùng mới (New User Guide Tour) với Driver.js

Để giúp người dùng mới (new users) dễ dàng làm quen với giao diện và các tính năng thiết kế của ứng dụng, chúng ta sẽ sử dụng thư viện **[Driver.js](https://driverjs.com/)**. Dưới đây là kế hoạch chi tiết (Base Tour Plan) để tích hợp tính năng này.

## 1. Mục tiêu của Tour

- **Giới thiệu tổng quan** về ứng dụng.
- **Hướng dẫn từng bước (Step-by-step)** các thao tác cơ bản: Chọn sản phẩm -> Chọn biến thể -> Thêm tài nguyên thiết kế -> Tương tác với vùng in -> Xem trước & Thêm vào giỏ hàng.

## 2. Kịch bản Tour (Tour Steps)

Dưới đây là kịch bản dự kiến. Các `.NAME-...` là các class name đã được thiết lập sẵn trong mã nguồn hoặc sẽ cần tinh chỉnh thêm id để Driver.js có thể target (nhắm mục tiêu) một cách chính xác.

### Bước 1: Chào mừng (Welcome)

- **Target**: `body` hoặc popup ở giữa màn hình (không target cụ thể phần tử nào).
- **Tiêu đề**: Chào mừng bạn đến với Studio Thiết Kế! 🎉
- **Mô tả**: Đây là nơi bạn có thể thỏa sức sáng tạo và tự tay thiết kế những món đồ độc nhất vô nhị. Hãy dành 1 phút để xem qua cách hoạt động nhé!
- **Hành động**: Nút "Bắt đầu hướng dẫn".

### Bước 2: Chọn sản phẩm (Select Product)

- **Target**: `.NAME-products-gallery-wrapper` (Nằm ở `src/pages/edit/ProductGallery.tsx`).
- **Tiêu đề**: 1. Chọn Sản Phẩm
- **Mô tả**: Bắt đầu bằng việc lướt chọn sản phẩm bạn muốn thiết kế. Chúng tôi có rất nhiều mẫu mã đa dạng ở đây!

### Bước 3: Tuỳ chỉnh thuộc tính (Product Variants)

- **Target**: `.NAME-start-of-customization` (Nằm ở `src/pages/edit/customize/Customization.tsx`).
- **Tiêu đề**: 2. Chọn Thuộc Tính
- **Mô tả**: Tùy chỉnh màu sắc, kích cỡ, hương thơm (nếu có), hoặc chất liệu cho sản phẩm của bạn ở khu vực này.

### Bước 4: Công cụ Thiết kế (Design Tools)

- **Target**: Khu vực chứa các nút Thêm Ảnh / Thêm Chữ / Thêm Sticker. _(Có thể cần thêm ID ví dụ `#tour-design-tools` bao bọc cụm nút này)_
- **Tiêu đề**: 3. Thỏa Sức Sáng Tạo
- **Mô tả**: Bạn có thể thêm các Bố cục (Layout), Văn bản (Text), Nhãn dán (Sticker) hoặc chọn Ảnh in từ hệ thống để trang trí lên sản phẩm.

### Bước 5: Xem trước và Thêm vào giỏ hàng (Actions Bar)

- **Target**: `.NAME-actions-bar` (Nằm ở `src/pages/edit/Actions.tsx`).
- **Tiêu đề**: 5. Hoàn tất & Đặt hàng
- **Mô tả**: Sau khi ưng ý, hãy nhấn "Xem trước mockup" để xem sản phẩm thực tế trông như thế nào, sau đó "Thêm vào giỏ hàng" để tiến hành thanh toán.

### Bước 6: Kết thúc Tour

- **Target**: Không target (Chính giữa màn hình).
- **Tiêu đề**: Bạn đã sẵn sàng! 🚀
- **Mô tả**: Giờ thì hãy bắt đầu tự tay tạo ra sản phẩm tuyệt vời của riêng bạn nhé. Chúc bạn vui vẻ!
- **Hành động**: Nút "Bắt đầu thiết kế".

---

## 3. Kiến trúc Triển khai (Implementation Logic)

Để tích hợp chuẩn vào app React (Zustand + Vite), chúng ta sẽ làm theo các bước sau:

**1. Cài đặt Driver.js:**

```bash
npm install driver.js
```

**2. Tạo Hook quản lý Tour (`useTourGuide.ts`):**

- Sử dụng `localStorage` để kiểm tra xem user này đã từng xem tour chưa (ví dụ: key `has_seen_tour`).
- Hàm `startTour()` sẽ cấu hình `driver()` với các mảng steps đã định nghĩa ở trên.

**3. Khởi chạy Tour tự động:**

- Trong `App.tsx` hoặc `Page.tsx` của trang Edit, sử dụng `useEffect` để gọi `startTour()` nếu `localStorage.getItem('has_seen_tour')` là rỗng (tức là user mới).

**4. Thiết lập CSS & Z-Index an toàn:**

- Chú ý các `z-index` của các phần tử hiện tại (như modal, floating menu) để Driver.js overlay lớp nền đen mờ không bị che lấp hoặc bị đè.
- Driver.js hỗ trợ style mặc định nhưng ta sẽ đè lại CSS đôi chút để giao diện các popover đồng bộ với màu chủ đạo (`var(--vcn-main-cl)`) của app.
