# Hướng dẫn Test API Cache System

Hệ thống cache đã được tích hợp trực tiếp vào các service. Khi load trang lần 2, data sẽ được lấy từ cache với delay 1.5s để tạo cảm giác như đang gọi API thật.

## 🎯 Cách hoạt động

### Lần đầu (Cache Miss)
1. Gọi API thực → Nhận response từ server
2. Lưu vào localStorage với TTL
3. Log: `[ApiCache] ⚡ Cache miss for key: xxx - Calling real API...`

### Lần 2+ (Cache Hit)
1. Kiểm tra localStorage → Tìm thấy cache
2. **Delay 1.5 giây** để giả lập API call
3. Trả về data từ cache
4. Log: `[ApiCache] 🎯 Cache hit for key: xxx`

## 📋 Test Checklist

### 1. Test Address Service

```typescript
import { addressService } from '@/services/address.service'

// Test 1: Fetch provinces
console.log('🧪 Test 1: Fetch provinces...')
const provinces1 = await addressService.fetchProvinces()
// Lần đầu: Gọi API thật, không delay
// Log: [ApiCache] ⚡ Cache miss for key: provinces - Calling real API...

console.log('🧪 Test 1b: Fetch provinces again...')
const provinces2 = await addressService.fetchProvinces()
// Lần 2: Từ cache, delay 1.5s
// Log: [ApiCache] 🎯 Cache hit for key: provinces

// Test 2: Fetch districts
console.log('🧪 Test 2: Fetch districts...')
const districts1 = await addressService.fetchDistricts(1)
// Lần đầu: API call
const districts2 = await addressService.fetchDistricts(1)
// Lần 2: Cache + delay 1.5s

// Test 3: Fetch wards
console.log('🧪 Test 3: Fetch wards...')
const wards1 = await addressService.fetchWards(1)
const wards2 = await addressService.fetchWards(1)
```

### 2. Test Product Service

```typescript
import { productService } from '@/services/product.service'

console.log('🧪 Test: Fetch products...')
const products1 = await productService.fetchProductsByPage(1, 10)
// Lần đầu: API call

const products2 = await productService.fetchProductsByPage(1, 10)
// Lần 2: Cache + delay 1.5s
```

### 3. Test Voucher Service

```typescript
import { voucherService } from '@/services/voucher.service'

console.log('🧪 Test: Check voucher...')
const result1 = await voucherService.checkVoucherValidity('SAVE10', 100000)
// Lần đầu: API call + delay gốc (800ms)

const result2 = await voucherService.checkVoucherValidity('SAVE10', 100000)
// Lần 2: Cache + delay 1.5s
```

## 🔍 Kiểm tra Cache trong Browser

### Mở DevTools → Console

```javascript
// 1. Xem cache stats
import { CacheManager } from '@/dev/cached-services'
console.log(CacheManager.getCacheStats())

// Output:
// {
//   provinces: { exists: true, expired: false, timestamp: 1701234567890 },
//   sampleProducts: { exists: true, expired: false, timestamp: 1701234567890 },
//   sampleVouchers: { exists: false, expired: false }
// }

// 2. Xem localStorage
console.log(localStorage)
// Tìm các key có prefix: api_cache_*

// 3. Clear all cache
CacheManager.clearAllCaches()

// 4. Disable cache tạm thời
CacheManager.setEnabled(false)
```

### Mở DevTools → Application → Local Storage

Sẽ thấy các key:
- `api_cache_provinces`
- `api_cache_districts_1`
- `api_cache_districts_2`
- `api_cache_wards_1`
- `api_cache_products_1_10`
- `api_cache_voucher_SAVE10_100000`

Mỗi key chứa JSON:
```json
{
  "data": [...],
  "timestamp": 1701234567890,
  "expiresAt": 1701238167890
}
```

## ⏱️ Test Delay Timing

### Test bằng Console

```javascript
// Test delay timing
console.time('First call')
const result1 = await addressService.fetchProvinces()
console.timeEnd('First call')
// First call: ~500-1000ms (tùy network)

console.time('Second call')
const result2 = await addressService.fetchProvinces()
console.timeEnd('Second call')
// Second call: ~1500ms (delay từ cache)
```

### Test bằng Network Tab

1. Mở DevTools → Network tab
2. Reload trang → Thấy requests đến server
3. Reload lần 2 → **KHÔNG thấy requests** (vì lấy từ cache)
4. Nhưng UI vẫn có loading 1.5s

## 🧹 Clear Cache Scenarios

### Scenario 1: Clear all cache

```javascript
import { CacheManager } from '@/dev/cached-services'
CacheManager.clearAllCaches()
// Sau khi clear, lần call tiếp theo sẽ gọi API thật
```

### Scenario 2: Clear specific service

```javascript
import { CachedAddressService } from '@/dev/cached-services'
CachedAddressService.clearCache()
```

### Scenario 3: Cache expired tự động

Đợi đủ TTL:
- Address: 1 giờ
- Products: 30 phút
- Voucher: 10 phút

Sau khi expired, lần call tiếp theo sẽ gọi API thật.

## 📊 Monitoring Cache

### Log Format

```
[ApiCache] 🎯 Cache hit for key: provinces
[ApiCache] ⚡ Cache miss for key: products_1_10 - Calling real API...
```

### Watch Console

1. Lần đầu load trang:
```
[ApiCache] ⚡ Cache miss for key: provinces - Calling real API...
>>> api products: [...]
[ApiCache] ⚡ Cache miss for key: products_1_10 - Calling real API...
```

2. Lần 2 load trang (hoặc reload):
```
[ApiCache] 🎯 Cache hit for key: provinces
[ApiCache] 🎯 Cache hit for key: products_1_10
```

## 🐛 Troubleshooting

### Cache không hoạt động?

```javascript
// Check enabled status
import { apiCache } from '@/dev/api-cache'
console.log(apiCache)
// enabled: true/false
```

### Muốn tắt cache?

```javascript
import { CacheManager } from '@/dev/cached-services'
CacheManager.setEnabled(false)
```

### Delay không đủ 1.5s?

Check code trong `api-cache.ts`:
```typescript
private async simulateDelay(fromCache: boolean): Promise<void> {
  if (!this.enabled) return
  if (fromCache) {
    const delay = 1500 // 1.5 seconds ← Có thể thay đổi
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}
```

## 🎬 Demo Flow

### Complete Test Flow

```javascript
// 1. Clear all để bắt đầu fresh
import { CacheManager } from '@/dev/cached-services'
CacheManager.clearAllCaches()

// 2. Call API lần đầu (sẽ gọi thật)
import { addressService } from '@/services/address.service'
console.time('First call')
const provinces1 = await addressService.fetchProvinces()
console.timeEnd('First call')
// Output: First call: ~800ms (network time)
// Log: [ApiCache] ⚡ Cache miss for key: provinces - Calling real API...

// 3. Call API lần 2 (từ cache + delay)
console.time('Second call')
const provinces2 = await addressService.fetchProvinces()
console.timeEnd('Second call')
// Output: Second call: ~1500ms (simulated delay)
// Log: [ApiCache] 🎯 Cache hit for key: provinces

// 4. Check same data
console.log('Same data?', provinces1 === provinces2) // false (different objects)
console.log('Same content?', JSON.stringify(provinces1) === JSON.stringify(provinces2)) // true

// 5. Check stats
console.log(CacheManager.getCacheStats())
```

## ✅ Expected Results

| Action | Time | Network | Source | Log |
|--------|------|---------|--------|-----|
| First load | ~500-1000ms | ✅ Request sent | API Server | ⚡ Cache miss |
| Second load | ~1500ms | ❌ No request | localStorage | 🎯 Cache hit |
| After clear | ~500-1000ms | ✅ Request sent | API Server | ⚡ Cache miss |
| After expire | ~500-1000ms | ✅ Request sent | API Server | ⚡ Cache miss |

## 🎯 Production Notes

**Quan trọng:** Cache hiện tại chỉ enabled trong DEV mode:

```typescript
export const apiCache = new ApiCache({
  enabled: import.meta.env.DEV, // Only in development
  ttl: 10 * 60 * 1000, // 10 minutes
})
```

Để enable trong production, thay đổi:
```typescript
enabled: true, // Always enabled
```

Hoặc dùng env variable:
```typescript
enabled: import.meta.env.VITE_ENABLE_CACHE === 'true',
```

---

## 📝 Summary

- ✅ Cache tự động tích hợp vào services
- ✅ Delay 1.5s khi lấy từ cache
- ✅ TTL khác nhau cho từng loại data
- ✅ Auto-expire và clear cache
- ✅ Production-ready với flag enable/disable

Happy testing! 🚀
