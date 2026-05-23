Dưới đây là tài liệu Markdown chi tiết, chuẩn chỉnh từ A đến Z để bạn có thể lưu trữ trực tiếp vào tệp `README.md` hoặc hệ thống tài liệu nội bộ của dự án.

Tài liệu này được thiết kế đặc thù cho kiến trúc **ReactJS + Vite + TypeScript**, tập trung vào việc đảm bảo an toàn kiểu dữ liệu (Type-Safety) và cấu trúc mã nguồn có thể mở rộng về sau.

---

# Tài Liệu Tích Hợp Firebase Analytics (Theo Dõi Hành Vi Người Dùng)

**Ngăn xếp công nghệ:** ReactJS, Vite, TypeScript, NPM.
**Mục tiêu:** Thiết lập hệ thống đo lường hành vi người dùng (User Behavior Tracking) bằng Google Analytics cho Firebase, áp dụng kiểm tra kiểu dữ liệu nghiêm ngặt để tránh sai sót trong quá trình ghi nhận sự kiện.

## Giai Đoạn 1: Chuẩn Bị Môi Trường Làm Việc

Trước khi can thiệp vào mã nguồn, bạn cần có thông tin cấu hình từ máy chủ Firebase.

1. Đăng nhập vào [Firebase Console](https://console.firebase.google.com/).
2. Chọn dự án của bạn (hoặc tạo dự án mới và bắt buộc phải bật tích hợp Google Analytics).
3. Truy cập **Project settings** (Cài đặt dự án) > thẻ **General** (Cài đặt chung).
4. Di chuyển xuống khu vực **Your apps** (Ứng dụng của bạn) và đăng ký một ứng dụng Web (biểu tượng `</>`).
5. Tại bước cung cấp SDK, chọn nút radio **Config** để lấy chuỗi cấu hình JavaScript.

## Giai Đoạn 2: Cài Đặt Và Cấu Hình Biến Môi Trường

1. **Cài đặt thư viện lõi:** Mở terminal tại thư mục gốc của dự án và chạy lệnh:

```bash
npm install firebase

```

2. **Thiết lập biến môi trường:** Tạo tệp tin `.env.local` ở thư mục gốc (ngang hàng với `package.json`). Vite yêu cầu các biến môi trường dành cho máy khách (client-side) phải bắt đầu bằng tiền tố `VITE_`.

```env
# .env.local
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="project-id"
VITE_FIREBASE_STORAGE_BUCKET="project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcd12345"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

```

_Lưu ý: Bắt buộc thêm `.env.local` vào tệp `.gitignore` để tránh rò rỉ cấu hình lên kho lưu trữ mã nguồn._

## Giai Đoạn 3: Khởi Tạo Firebase Và Hệ Thống Định Kiểu (TypeScript)

Tạo một thư mục cấu hình và tiện ích để gom nhóm toàn bộ logic của Firebase vào một nơi duy nhất. Việc này giúp dễ dàng bảo trì hoặc thay đổi nền tảng phân tích trong tương lai mà không ảnh hưởng đến các Component của React.

**Tạo tệp tin `src/utils/firebase.ts`:**

```typescript
import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics'

// 1. Lấy cấu hình từ Vite Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// 2. Khởi tạo ứng dụng và dịch vụ Analytics
const app: FirebaseApp = initializeApp(firebaseConfig)
export const analytics: Analytics = getAnalytics(app)

// ==========================================
// HỆ THỐNG ĐỊNH KIỂU CHO SỰ KIỆN (TYPE SAFETY)
// ==========================================

// Định nghĩa danh sách các sự kiện được phép gửi đi
export type AppEventName = 'page_view' | 'sign_up' | 'login' | 'view_item' | 'add_to_cart'

// Định nghĩa cấu trúc tham số đi kèm để ngăn việc truyền sai dữ liệu
export interface EventParams {
  page_title?: string
  page_location?: string
  method?: string
  item_id?: string
  item_name?: string
  price?: number
  currency?: string
  [key: string]: any // Cho phép linh hoạt truyền thêm các tham số khác nếu cần
}

// ==========================================
// CÁC HÀM TIỆN ÍCH CUNG CẤP RA BÊN NGOÀI
// ==========================================

/**
 * Hàm gửi sự kiện hành vi người dùng lên Firebase Analytics
 */
export const trackEvent = (eventName: AppEventName, eventParams?: EventParams): void => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams)
      if (import.meta.env.DEV) {
        console.log(`[Firebase Tracking] Event: ${eventName}`, eventParams || '')
      }
    }
  } catch (error) {
    console.error('Lỗi khi ghi nhận sự kiện Firebase:', error)
  }
}

/**
 * Hàm định danh người dùng sau khi họ đăng nhập thành công
 */
export const identifyUser = (userId: string, traits?: Record<string, string | number>): void => {
  try {
    if (analytics) {
      setUserId(analytics, userId)
      if (traits) {
        setUserProperties(analytics, traits)
      }
    }
  } catch (error) {
    console.error('Lỗi khi định danh người dùng:', error)
  }
}
```

## Giai Đoạn 4: Triển Khai Vào React Components

Bạn nhập (import) hàm `trackEvent` vào các Component tương ứng để theo dõi những hành vi cụ thể của người dùng.

### Ví dụ 1: Theo dõi lượt xem trang (Page View)

Sử dụng `useEffect` để kích hoạt sự kiện khi Component vừa được hiển thị trên màn hình.

```tsx
// src/pages/HomePage.tsx
import React, { useEffect } from 'react'
import { trackEvent } from '../utils/firebase'

const HomePage: React.FC = () => {
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Trang Chủ Hệ Thống',
      page_location: window.location.pathname,
    })
  }, [])

  return <div>Chào mừng đến với trang chủ</div>
}

export default HomePage
```

### Ví dụ 2: Theo dõi hành động tương tác với sản phẩm

Sự kiện `view_item` là một sự kiện tiêu chuẩn của Google Analytics dùng để đo lường thương mại điện tử.

```tsx
// src/components/ProductDetail.tsx
import React from 'react'
import { trackEvent } from '../utils/firebase'

interface ProductProps {
  id: string
  name: string
  price: number
}

const ProductDetail: React.FC<ProductProps> = ({ id, name, price }) => {
  const handleViewDetails = () => {
    // 1. Thực hiện logic hiển thị chi tiết (ví dụ: mở modal)

    // 2. Ghi nhận hành vi người dùng
    trackEvent('view_item', {
      item_id: id,
      item_name: name,
      price: price,
      currency: 'VND',
    })
  }

  return (
    <div>
      <h3>{name}</h3>
      <button onClick={handleViewDetails}>Xem chi tiết sản phẩm</button>
    </div>
  )
}

export default ProductDetail
```

## Giai Đoạn 5: Hiểu Về Cơ Chế Gửi Dữ Liệu Và Kiểm Thử

### 1. Cơ chế tự động của Firebase SDK

Khi bạn gửi đi một sự kiện thông qua hàm `logEvent`, Firebase SDK sẽ không chỉ gửi những tham số bạn cung cấp (như `item_id`, `price`). Nó sẽ tự động thu thập và đính kèm thêm các tham số ngữ cảnh quan trọng về phiên hoạt động để phục vụ cho việc phân tích sau này, bao gồm:

- `ga_session_id`: Mã định danh duy nhất cho phiên truy cập hiện tại.
- `ga_session_number`: Số thứ tự lần truy cập của người dùng đó.
- `engagement_time_msec`: Thời gian người dùng đã tương tác với trang web trước khi sự kiện xảy ra.
- Các thông số về thiết bị, trình duyệt, và độ phân giải màn hình.

### 2. Sự chênh lệch thời gian trong báo cáo (Delay)

- **Dữ liệu Thời gian thực (Realtime):** Có thể xem ngay lập tức tại thẻ _Active users in last 30 minutes_. Sau 30 phút không có hoạt động, dữ liệu này sẽ tự động biến mất.
- **Dữ liệu Báo cáo Lịch sử (Historical Reports):** Tất cả các biểu đồ lớn (Tỷ lệ giữ chân, Doanh thu, Nhân khẩu học) cần từ **24 đến 48 giờ** để máy chủ Google xử lý, lọc bỏ những truy cập rác và tổng hợp lại. Việc bạn không thấy dữ liệu ngay trong các biểu đồ này là điều bình thường.

### 3. Công cụ kiểm thử (DebugView)

Trong quá trình phát triển trên máy tính cá nhân (localhost), để chắc chắn rằng dữ liệu đang được cấu trúc đúng và gửi đi thành công mà không cần chờ đợi 24 giờ:

1. Cài đặt tiện ích mở rộng **Google Analytics Debugger** trên trình duyệt Google Chrome.
2. Bật tiện ích này lên.
3. Truy cập giao diện Firebase Console > Analytics > **DebugView**.
4. Thực hiện các thao tác trên trang web React của bạn, dữ liệu sẽ ngay lập tức nhảy lên dòng thời gian của màn hình DebugView.
