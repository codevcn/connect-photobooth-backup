Cách chuẩn, hiện đại và an toàn nhất để tạo UUID (Universally Unique Identifier) phiên bản 4 trực tiếp trên trình duyệt bằng JavaScript là sử dụng API có sẵn `crypto.randomUUID()`.

Đây là phương pháp được khuyến nghị hiện nay vì nó được xây dựng sẵn trong Web Crypto API của các trình duyệt, đảm bảo tính ngẫu nhiên an toàn về mặt mật mã học (cryptographically secure) và có cú pháp cực kỳ đơn giản.

## 1. Phương pháp tiêu chuẩn: Sử dụng `crypto.randomUUID()`

Bạn chỉ cần gọi hàm này trực tiếp mà không cần cài đặt thêm bất kỳ thư viện bên ngoài nào.

```javascript
// Tạo một UUID phiên bản 4
const myUUID = crypto.randomUUID()

console.log(myUUID)
// Kết quả ví dụ: "36b8f84d-df4e-4d49-b662-bcde71a8764f"
```

**Ưu điểm của phương pháp này:**

- **Hiệu suất cao:** Do được triển khai trực tiếp bằng mã nguồn gốc (native) của trình duyệt.
- **An toàn:** Sử dụng bộ tạo số ngẫu nhiên an toàn của hệ điều hành, giúp giảm thiểu tối đa tỷ lệ trùng lặp.
- **Ngắn gọn:** Không cần viết các hàm logic phức tạp.

**Lưu ý quan trọng:**
Phương thức `crypto.randomUUID()` yêu cầu môi trường chạy phải là một **Ngữ cảnh an toàn (Secure Context)**. Điều này có nghĩa là trang web của bạn phải được phục vụ qua giao thức **HTTPS** hoặc đang chạy trên **localhost**. Nếu bạn chạy trên môi trường HTTP thông thường, phương thức này có thể bị `undefined`.

---

## 2. Phương pháp dự phòng: Sử dụng `crypto.getRandomValues()`

Trong trường hợp bạn cần hỗ trợ các trình duyệt rất cũ không có `crypto.randomUUID()` hoặc buộc phải chạy ứng dụng trong môi trường không có HTTPS, bạn có thể tự viết một hàm tạo UUIDv4 dựa trên `crypto.getRandomValues()`.

Phương pháp này vẫn đảm bảo tính an toàn mật mã học do sử dụng cùng một lõi Web Crypto API:

```javascript
function generateUUID() {
  // Kiểm tra xem trình duyệt có hỗ trợ crypto.randomUUID không
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Phương án dự phòng sử dụng crypto.getRandomValues
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

const myFallbackUUID = generateUUID()
console.log(myFallbackUUID)
```

### Tại sao không nên sử dụng `Math.random()`?

Trước đây, nhiều nhà phát triển thường kết hợp `Math.random()` với `Date.now()` để tạo ra các chuỗi định dạng giống UUID. Tuy nhiên, cách làm này hiện tại **bị khuyến cáo không nên sử dụng** trong các ứng dụng thực tế. Hàm `Math.random()` không được thiết kế để bảo mật mật mã học, chuỗi số ngẫu nhiên nó tạo ra có thể đoán trước được và nguy cơ xảy ra xung đột (trùng mã UUID) khi hệ thống có lượng truy cập lớn là rất cao. Bạn luôn nên ưu tiên sử dụng đối tượng `crypto`.
