# Kế hoạch Tích hợp Hướng dẫn Người dùng mới (Phân đoạn Âm thanh và Tương tác Đồng bộ)

Bản kế hoạch này mô tả kiến trúc kỹ thuật để đồng bộ hóa một tệp âm thanh hoàn chỉnh được chia thành các phân đoạn (segments) với các bước hiển thị của thư viện Driver.js. Người dùng có quyền can thiệp vào tiến trình bằng cách tua nhanh hoặc quay lại.

## 1. Nguyên tắc hoạt động (Logic Cốt lõi)

- **Một tệp âm thanh, nhiều phân đoạn (Audio Sprite Logic):** Hệ thống sẽ chỉ tải duy nhất một tệp âm thanh dài. Tệp này được định nghĩa logic thành các phân đoạn. Mỗi phân đoạn sẽ được gắn một mốc thời gian bắt đầu (`startTime`) tương ứng với một bước hiển thị trên giao diện.
- **Chuyển tiếp tự động:** Khi âm thanh phát liên tục và vượt qua mốc thời gian `startTime` của phân đoạn tiếp theo, giao diện Driver.js sẽ tự động chuyển sang bước (popup) kế tiếp để hình ảnh khớp với lời nói.
- **Tương tác thủ công (Manual Navigation):** Các nút "Tiếp tục" (Next) và "Quay lại" (Previous) của Driver.js được giữ nguyên.
- Khi người dùng nhấn **"Tiếp tục"**, hệ thống sẽ ra lệnh cho tệp âm thanh tua nhanh (seek) đến đúng mốc `startTime` của phân đoạn kế tiếp và tiếp tục phát.
- Khi người dùng nhấn **"Quay lại"**, hệ thống sẽ tua ngược tệp âm thanh về mốc `startTime` của phân đoạn trước đó, giúp người dùng nghe lại những thông tin họ chưa kịp nắm bắt.

## 2. Cấu trúc dữ liệu cấu hình kịch bản

Bạn cần khai báo một mảng cấu hình chứa thông tin của các phân đoạn. Thời gian `startTime` được tính bằng giây (seconds).

```typescript
// Định nghĩa kiểu dữ liệu cho mỗi phân đoạn hướng dẫn
interface TourSegment {
  startTime: number // Mốc thời gian bắt đầu phát âm thanh của đoạn này
  element?: string // CSS Selector của phần tử cần làm nổi bật
  popover: {
    title: string
    description: string
  }
}

// Cấu hình kịch bản dựa trên 7 bước của Studio Thiết Kế
const TOUR_SEGMENTS: TourSegment[] = [
  {
    startTime: 0, // Bắt đầu ngay khi chạy
    popover: {
      title: 'Chào mừng bạn đến với Studio Thiết Kế! 🎉',
      description:
        'Đây là nơi bạn có thể thỏa sức sáng tạo và tự tay thiết kế những món đồ độc nhất vô nhị. Hãy dành 1 phút để xem qua cách hoạt động nhé!',
    },
  },
  {
    startTime: 8.5, // Ví dụ: Giây thứ 8.5 chuyển sang nói về Chọn sản phẩm
    element: '.NAME-products-gallery-wrapper',
    popover: {
      title: '1. Chọn Sản Phẩm',
      description:
        'Bắt đầu bằng việc lướt chọn sản phẩm bạn muốn thiết kế. Chúng tôi có rất nhiều mẫu mã đa dạng ở đây!',
    },
  },
  {
    startTime: 16.0, // Giây thứ 16 chuyển sang nói về Chọn thuộc tính
    element: '.NAME-start-of-customization',
    popover: {
      title: '2. Chọn Thuộc Tính',
      description:
        'Tùy chỉnh màu sắc, kích cỡ, hương thơm (nếu có), hoặc chất liệu cho sản phẩm của bạn ở khu vực này.',
    },
  },
  // ... Bạn tiếp tục bổ sung các bước 4, 5, 6, 7 với mốc startTime chính xác
]
```

## 3. Kiến trúc triển khai mã nguồn (React Hook)

Dưới đây là phần triển khai Custom Hook `useAudioTourGuide.ts` dành cho dự án React kết hợp Zustand/Vite của bạn. Mã nguồn này xử lý chặt chẽ sự kiện đồng bộ giữa thẻ Audio và thư viện Driver.js.

```typescript
import { useEffect, useRef } from 'react'
import { driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

export const useAudioTourGuide = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const driverRef = useRef<any>(null)

  const startTour = () => {
    // Ngăn chặn khởi tạo nhiều lần
    if (audioRef.current && !audioRef.current.paused) return

    // 1. Khởi tạo đối tượng Audio
    audioRef.current = new Audio('/audios/full-guide.mp3')

    // 2. Chuyển đổi dữ liệu TOUR_SEGMENTS sang định dạng của Driver.js
    const driverSteps: DriveStep[] = TOUR_SEGMENTS.map((segment) => ({
      element: segment.element,
      popover: segment.popover,
    }))

    // 3. Khởi tạo cấu hình Driver.js
    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'], // Giữ lại toàn bộ nút điều khiển
      nextBtnText: 'Tiếp tục',
      prevBtnText: 'Quay lại',
      doneBtnText: 'Bắt đầu thiết kế',
      steps: driverSteps,

      // Ghi đè hành vi khi người dùng nhấn nút "Tiếp tục"
      onNextClick: () => {
        const activeIndex = driverRef.current.getActiveIndex()
        const nextIndex = activeIndex + 1

        if (nextIndex < TOUR_SEGMENTS.length) {
          // Tua âm thanh đến thời điểm bắt đầu của phân đoạn tiếp theo
          if (audioRef.current) {
            audioRef.current.currentTime = TOUR_SEGMENTS[nextIndex].startTime
            audioRef.current.play()
          }
          // Chuyển giao diện sang bước tiếp theo
          driverRef.current.moveNext()
        }
      },

      // Ghi đè hành vi khi người dùng nhấn nút "Quay lại"
      onPrevClick: () => {
        const activeIndex = driverRef.current.getActiveIndex()
        const prevIndex = activeIndex - 1

        if (prevIndex >= 0) {
          // Tua âm thanh về thời điểm bắt đầu của phân đoạn trước đó
          if (audioRef.current) {
            audioRef.current.currentTime = TOUR_SEGMENTS[prevIndex].startTime
            audioRef.current.play()
          }
          // Chuyển giao diện về bước trước đó
          driverRef.current.movePrevious()
        }
      },

      // Xử lý khi Tour bị đóng (hoàn thành hoặc bỏ qua)
      onDestroyStarted: () => {
        if (audioRef.current) {
          audioRef.current.pause() // Dừng âm thanh
        }
        driverRef.current.destroy()
        localStorage.setItem('has_seen_tour', 'true')
      },
    })

    // 4. Lắng nghe tiến trình phát của âm thanh để tự động chuyển bước
    const handleTimeUpdate = () => {
      if (!audioRef.current || !driverRef.current) return

      const currentTime = audioRef.current.currentTime
      const activeIndex = driverRef.current.getActiveIndex()
      const nextIndex = activeIndex + 1

      // Nếu đang phát và thời gian vượt qua mốc của phân đoạn tiếp theo
      if (nextIndex < TOUR_SEGMENTS.length && currentTime >= TOUR_SEGMENTS[nextIndex].startTime) {
        driverRef.current.moveNext()
      }
    }

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)

    // Đóng hướng dẫn khi âm thanh kết thúc hoàn toàn
    audioRef.current.addEventListener('ended', () => {
      driverRef.current.destroy()
      localStorage.setItem('has_seen_tour', 'true')
    })

    // 5. Kích hoạt phát âm thanh và hiển thị Driver.js
    audioRef.current
      .play()
      .then(() => {
        driverRef.current.drive(0) // Bắt đầu ở bước đầu tiên
      })
      .catch((error) => {
        console.error('Trình duyệt đã chặn phát âm thanh tự động:', error)
      })
  }

  // Dọn dẹp bộ nhớ khi Component bị hủy
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = '' // Xóa bộ đệm âm thanh
      }
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [])

  return { startTour }
}
```

## 4. Tối ưu hóa trải nghiệm người dùng

- **Hiệu ứng mượt mà:** Khi sử dụng logic `audio.currentTime = startTime`, quá trình tua âm thanh diễn ra gần như ngay lập tức. Người dùng sẽ không cảm nhận được độ trễ khi chuyển đổi qua lại giữa các bước.
- **Quản lý sự kiện tải trang:** Giống như nguyên tắc bảo mật của trình duyệt mà chúng ta đã thảo luận, hàm `startTour()` này bắt buộc phải được kích hoạt thông qua một thao tác nhấp chuột (click) từ phía người dùng (ví dụ: một nút "Xem hướng dẫn") để đảm bảo thẻ Audio được phép hoạt động mà không bị chặn (Autoplay Policy). Cấu trúc mã nguồn trên đã được chuẩn bị sẵn khối `try-catch` để ghi nhận lỗi trong trường hợp bị trình duyệt ngăn cản.
