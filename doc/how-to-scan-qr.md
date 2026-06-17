# Chi tiết logic quét QR (Photobooth)

Tài liệu này mô tả chi tiết luồng xử lý quét mã QR từ camera và lấy dữ liệu link trả về từ QR code.

## 1. Bối cảnh dự án

Dự án là một ứng dụng Web (ReactJS + Vite) cho hệ thống Photobooth. Người dùng sau khi chụp ảnh tại máy Photobooth sẽ nhận được một mã QR. Người dùng sử dụng ứng dụng web này trên điện thoại (hoặc PC) để quét mã QR đó.
Ứng dụng sẽ đọc mã QR để lấy đường dẫn (link) chứa ảnh gốc chụp từ máy Photobooth.

## 2. Thư viện sử dụng

- **`qr-scanner`** (`^1.4.2`): Thư viện cốt lõi để truy cập camera và quét mã QR ngay trên trình duyệt một cách mượt mà và hiệu quả.

## 3. Các thành phần (Components) chính

### 3.1. `ScanQRPage` (`src/pages/scan-qr/Page.tsx`)

Đây là trang giao diện hiển thị cho người dùng khi họ vào tính năng quét QR.

- Hiển thị layout bao gồm hướng dẫn cách quét (cách 8cm, đưa vào khung camera).
- Chứa component `<QRScanner />` để xử lý việc truy cập camera và nhận diện mã QR.

### 3.2. `QRScanner` (`src/pages/scan-qr/QRScanner.tsx`)

Đây là wrapper component đóng gói logic xử lý của thư viện `qr-scanner`.

- **Luồng hoạt động:**
  1. Khởi tạo `QrScanner` khi component mount (`initializeScanner`).
  2. Yêu cầu quyền truy cập Camera.
  3. Khi phát hiện mã QR trong khung hình, thư viện sẽ tự động quét và lấy ra chuỗi `result.data` (chính là URL hoặc đoạn text được mã hoá trong QR).
  4. Ngừng camera ngay lập tức (`qrScanner.stop()`) để tránh việc quét lặp lại nhiều lần.
  5. Chuyển tiếp chuỗi dữ liệu (`result.data`) vừa lấy được sang module xử lý link.
  6. Cung cấp các cơ chế fallback (báo lỗi) trên UI nếu trình duyệt không hỗ trợ quét, người dùng từ chối cấp quyền camera hoặc gặp sự cố bất ngờ.

- **Cấu hình `QrScanner` (Params):**
  - `returnDetailedScanResult: true`: Cho phép trả về cả dữ liệu thô và các chi tiết của vùng được quét thành công.
  - `highlightScanRegion: true`, `highlightCodeOutline: true`: Hiển thị khung bao quanh (highlight) trên video khi phần mềm phát hiện được hình dạng mã QR.
  - `maxScansPerSecond: 15`: Tối ưu giới hạn tối đa 15 lần quét mỗi giây (15 FPS), đảm bảo tốc độ nhận diện nhanh mà không ngốn tài nguyên thiết bị.
  - `calculateScanRegion`: Hàm tuỳ chỉnh vùng tập trung quét QR trên camera. Nó tính toán dựa trên kích thước màn hình thiết bị để tạo ra một vùng quét hình vuông nằm ở vị trí trung tâm, đồng thời chừa một khoảng lề (padding) 16px đối với màn hình lớn hoặc 30px đối với màn hình nhỏ. Thu hẹp khu vực quét giúp loại bỏ nhiễu và tăng độ nhạy.

## Tóm tắt quy trình hoàn chỉnh đến khi lấy được link:

`ScanQRPage` -> Render `<QRScanner />` -> Khởi động thư viện `qr-scanner` và mở quyền truy cập Camera -> Camera quay được hình ảnh mã QR -> Trích xuất chuỗi thô (`url`) -> Tắt Camera -> Sử dụng chuỗi URL (xử lý bóc tách protocol nếu cần) để tiến hành gửi gọi API truy vấn ảnh thực tế.
