# Kiến trúc và Logic Xử lý Tính năng Tour Guide (Audio-Synchronized)

Tính năng Tour Guide của dự án là một hệ thống hướng dẫn người dùng kết hợp giữa **giọng nói (Audio)**, **làm nổi bật UI (Driver.js)** và **mô phỏng thao tác người dùng (Simulated Behaviors)**. Tính năng này được thiết kế theo cơ chế đồng bộ hoá thời gian thực (time-synced), biến trang web thành một video hướng dẫn tương tác.

---

## 1. Các thành phần (Components) chính

- **`driver.js`**: Thư viện lõi dùng để làm tối màn hình (overlay), làm nổi bật một element cụ thể và hiển thị bảng hướng dẫn (popover).
- **`useAudioTourGuide` (`src/hooks/use-audio-tour-guide.ts`)**: Bộ não (orchestrator) của hệ thống, quản lý audio, tính toán thời gian, điều khiển `driver.js` và lên lịch các hành động mô phỏng.
- **`useSimulatedBehavior` (`src/hooks/use-simulated-behavior.ts`)**: Xử lý logic giả lập các thao tác vật lý của chuột/cảm ứng (như click, cuộn, vuốt, kéo thả) trên giao diện.
- **`useSimulatedActionStore` (`src/stores/ui/simulated-action.store.ts`)**: Quản lý state toàn cục (Zustand) cho biểu tượng con trỏ chuột ảo (toạ độ x/y, opacity, trạng thái active).
- **`TourWelcomePopup` (`src/components/ui/TourWelcomePopup.tsx`)**: Modal chào mừng (thiết kế theo phong cách Minimal Glassmorphism), kiểm tra trạng thái xem người dùng đã từng xem hướng dẫn chưa qua `localStorage`.
- **Nút Xem lại hướng dẫn (`AdditionalInformation.tsx`)**: Cho phép người dùng xoá cờ lưu trong `localStorage` và tải lại trang để xem lại tour guide.

---

## 2. Các Hằng số và Kiểu dữ liệu (Types/Constants)

### Hằng số

- `AUDIO_FILE_PATH`: Đường dẫn mặc định của file âm thanh, ví dụ `'/audios/tour-guide-audio(14).WAV'`.
- `has_seen_tour`: Key lưu trữ trong `localStorage` để đánh dấu user đã hoàn thành hoặc bỏ qua tour.

### Kiểu cấu trúc `TourSegment`

Mỗi "phân đoạn" (segment) của tour guide được định nghĩa qua interface:

```typescript
interface TourSegment {
  name: string
  startTime: number // Thời gian bắt đầu (tính bằng giây) so với track audio
  element?: string // CSS Selector của DOM Element cần highlight
  popover: {
    // Thông tin hiển thị trên bảng driver.js
    title: string
    description: string
  }
  actions?: TTourAction[] // Danh sách các hành động giả lập kèm theo trong segment
  no_driver?: boolean // Cờ ẩn toàn bộ UI của driver.js (để xem live preview)
  skipGuidePosition?: 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right' // Vị trí dòng text hướng dẫn thoát
}
```

### Kiểu cấu trúc `TTourAction` (Hành động giả lập)

Các action sẽ chạy song song với audio:

- `click`: Click vào `selector`.
- `swipe`: Vuốt màn hình (`direction`, `distance`, `duration`).
- `scroll`: Cuộn màn hình tới `selector` (cách top một khoảng `topMargin`).
- `drag-drop`: Kéo thả một phần tử (`direction`, `distance`, `duration`).
- `custom`: Chạy một hàm `executor` bất kỳ.
  _Tất cả action đều có thể đính kèm thuộc tính `delay` (ms) và `hide_pointer` (chạy ngầm, không hiện con trỏ chuột ảo)._

---

## 3. Luồng Logic Xử Lý (Workflow)

### 3.1 Khởi tạo và Tải trước (Preload)

Khi Component mount, `useEffect` bên trong `useAudioTourGuide` sẽ khởi tạo đối tượng `new Audio()` và đặt `preload="auto"`. Việc này giúp trình duyệt âm thầm tải file âm thanh nặng về cache, để khi user nhấn "Bắt đầu", âm thanh sẽ phát ra ngay lập tức (zero delay).

### 3.2 Bắt đầu Tour (`startTour`)

1. Đặt `audioRef.current.currentTime = 0`.
2. Khởi tạo một dòng text hướng dẫn ẩn thoát (hint text) và chèn thẳng vào `document.body`.
3. Ánh xạ (Map) mảng `TOUR_SEGMENTS` sang format `DriveStep[]` mà thư viện `driver.js` yêu cầu.
4. Gắn cờ Event Listeners (`timeupdate` và `ended`) vào đối tượng Audio.
5. Gọi `audioRef.current.play()` và kích hoạt `driver.js` khởi động ở step 0.

### 3.3 Đồng bộ Audio và UI

Khi audio phát, sự kiện `timeupdate` kích hoạt liên tục (khoảng 4 lần/giây):

- Hàm `handleTimeUpdate` so sánh `audio.currentTime` với `startTime` của segment _tiếp theo_.
- Nếu thời gian hiện tại lớn hơn hoặc bằng `startTime` của step tiếp theo:
  - Gọi `driver.js` nhảy sang bước kế tiếp (`moveNext()`).
  - Gọi hàm `handleSegmentAction(nextIndex)`.

### 3.4 Thực thi Hành động mô phỏng (Simulated Behaviors)

Hàm `handleSegmentAction` đọc mảng `actions` của segment:

- Quét qua từng `action`, tính toán bộ đếm giờ (`setTimeout` dựa trên thuộc tính `delay`).
- Uỷ quyền cho hàm trong `useSimulatedBehavior` tương ứng (ví dụ `simulateClick`).
- Các hàm simulate thực hiện tính toán toạ độ thật của DOM, dịch chuyển toạ độ x/y vào global store (để UI con trỏ chuột chạy), chờ một khoảng fade-in, và cuối cùng trigger dispatch event chuột/kéo thả trực tiếp lên cây DOM thật.
- Nếu `hide_pointer` = true, state toạ độ vẫn update nhưng CSS opacity của chuột ảo sẽ bị chặn lại ở mức 0.

### 3.5 Chế độ Tàng hình Driver (`no_driver`)

Mục đích: Cho phép người dùng nhìn toàn cảnh một số khu vực (như Live Preview) mà không bị lớp overlay tối của `driver.js` che mất.

- **Cơ chế**: Khi `driver.js` chuyển step, hook `onHighlightStarted` kiểm tra thuộc tính `no_driver`.
- Nếu `true`, nó sẽ thêm một class `hide-driver-guide` vào `<body>`.
- Một tag `<style>` toàn cục được tiêm ngầm vào `<head>` sẽ kích hoạt `display: none !important; opacity: 0; pointer-events: none;` cho `.driver-overlay` và `.driver-popover`.
- Nhờ vậy, người dùng không nhìn thấy UI của driver nhưng Tour guide (audio + logic mô phỏng) vẫn tự động tiếp diễn ở chế độ nền.

### 3.6 Khắc phục sự cố cuộn (Driver.js Scroll Locking)

- **Vấn đề**: `driver.js` tự động thêm `overflow: hidden !important` thông qua quy tắc `:has(> .driver-active-element)` vào thành phần cha chứa đối tượng được highlight, khiến hàm `simulateScroll` không thể hoạt động.
- **Giải pháp**: Trong `simulateScroll`, hệ thống chạy một vòng lặp đệ quy (`unlockDriverScrollRoot`) để dò ngược lên cây DOM nhằm tìm phần tử bị khoá bởi `driver.js`. Tạm thời thay đổi inline style của phần tử đó thành `visible !important`, thực hiện lệnh `element.scrollLeft`/`scrollTop`, và sau đó khôi phục lại khoá cuộn bằng `requestAnimationFrame`.

### 3.7 Hủy Tour & Dọn dẹp (Cleanup)

Hàm `cancelTour` (kích hoạt khi user nhấn Bỏ qua, hết Audio, hoặc Component unmount):

- Gỡ class `hide-driver-guide` khỏi `<body>`.
- Xoá dòng text hint.
- Tạm dừng audio, reset thời gian và gỡ sạch `removeEventListener` để chống Memory Leak.
- Huỷ toàn bộ các timeout của action mô phỏng (`clearTimeout`).
- Tiêu huỷ (destroy) thể hiện của `driver.js`.
- (Chỉ khi component unmount trong React 18 Strict Mode): đặt `audioRef.current = null` để đảm bảo khi re-mount, trình duyệt khởi tạo lại nguồn `src` chính xác.
