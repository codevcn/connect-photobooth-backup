# API Cache System

Hệ thống cache dữ liệu API vào localStorage với hỗ trợ expiration time.

## Mục đích

- Cache các response từ API để giảm số lượng request không cần thiết
- Cải thiện performance khi load data đã được cache
- Tự động xóa cache khi hết hạn (TTL - Time To Live)
- Chỉ hoạt động trong môi trường development (có thể config)

## Cấu trúc

```
src/dev/
├── api-cache.ts          # Core cache engine
├── cached-services.ts    # Wrapper services với cache
└── API_CACHE_GUIDE.md   # Documentation này
```

## 1. Core Cache Engine (`api-cache.ts`)

### Class: `ApiCache`

Class chính để quản lý cache với các tính năng:

- ✅ Get/Set cache với TTL
- ✅ Auto-expire cache khi hết hạn
- ✅ Clear cache (single hoặc all)
- ✅ Cache info để debug
- ✅ Helper method `withCache()` để wrap async functions

### Cấu hình

```typescript
export interface CacheConfig {
  ttl?: number        // Thời gian cache tồn tại (ms), default: 5 phút
  prefix?: string     // Prefix cho cache key, default: 'api_cache_'
  enabled?: boolean   // Bật/tắt cache, default: true
}
```

### Sử dụng cơ bản

```typescript
import { ApiCache } from '@/dev/api-cache'

// Tạo instance mới với config
const cache = new ApiCache({
  ttl: 10 * 60 * 1000, // 10 phút
  prefix: 'my_cache_',
  enabled: true,
})

// Get cache
const data = cache.get<MyDataType>('my-key')

// Set cache
cache.set('my-key', myData, customTtl)

// Delete cache
cache.delete('my-key')

// Clear all cache với prefix này
cache.clearAll()

// Wrap async function với cache
const result = await cache.withCache(
  'my-key',
  async () => {
    // Your async function here
    return await fetchDataFromApi()
  },
  customTtl // optional
)
```

## 2. Cached Services (`cached-services.ts`)

### Class: `CachedAddressService`

Wrapper cho `addressService` với cache support.

**Methods:**

```typescript
// Lấy danh sách tỉnh/thành (cached 1 giờ)
const provinces = await CachedAddressService.fetchProvinces()

// Lấy danh sách quận/huyện theo tỉnh (cached 1 giờ)
const districts = await CachedAddressService.fetchDistricts(provinceId)

// Lấy danh sách phường/xã theo quận (cached 1 giờ)
const wards = await CachedAddressService.fetchWards(districtId)

// Xóa cache address
CachedAddressService.clearCache()
```

### Class: `CachedProductService`

Wrapper cho `productService` với cache support.

**Methods:**

```typescript
// Lấy products theo page (cached 30 phút)
const products = await CachedProductService.fetchProductsByPage(page, limit)

// Pre-send mockup image (KHÔNG cache - luôn fresh)
const result = await CachedProductService.preSendMockupImage(image, filename)

// Xóa cache products
CachedProductService.clearCache()
```

### Class: `CacheManager`

Utility để quản lý tất cả caches.

**Methods:**

```typescript
// Xóa tất cả cache
CacheManager.clearAllCaches()

// Lấy thống kê cache
const stats = CacheManager.getCacheStats()
console.log(stats)
// {
//   provinces: { exists: true, expired: false, timestamp: 1234567890 },
//   sampleProducts: { exists: false, expired: false }
// }

// Bật/tắt cache globally
CacheManager.setEnabled(false) // Tắt cache
CacheManager.setEnabled(true)  // Bật cache
```

## 3. Cách sử dụng trong project

### Thay thế service gốc bằng cached service

**Trước khi có cache:**

```typescript
import { addressService } from '@/services/address.service'

// Direct call - không cache
const provinces = await addressService.fetchProvinces()
```

**Sau khi có cache:**

```typescript
import { CachedAddressService } from '@/dev/cached-services'

// Cached call - data sẽ được cache
const provinces = await CachedAddressService.fetchProvinces()
```

### Ví dụ trong React component

```typescript
import { useEffect, useState } from 'react'
import { CachedAddressService } from '@/dev/cached-services'
import { TClientProvince } from '@/services/adapter/address.adapter'

function ProvinceSelector() {
  const [provinces, setProvinces] = useState<TClientProvince[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        // Lần đầu: fetch từ API
        // Lần sau: lấy từ cache (nếu chưa expire)
        const data = await CachedAddressService.fetchProvinces()
        setProvinces(data)
      } catch (error) {
        console.error('Error loading provinces:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProvinces()
  }, [])

  return (
    <select>
      {provinces.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  )
}
```

### Debug cache trong Console

```typescript
// Trong browser console hoặc component
import { CacheManager } from '@/dev/cached-services'

// Xem thống kê cache
console.log(CacheManager.getCacheStats())

// Xóa tất cả cache để test
CacheManager.clearAllCaches()

// Tắt cache tạm thời
CacheManager.setEnabled(false)
```

## 4. Cấu hình TTL (Time To Live)

TTL được config trong `cached-services.ts`:

```typescript
const CACHE_TTL = {
  ADDRESS: 60 * 60 * 1000,  // 1 giờ - address data ít thay đổi
  PRODUCTS: 30 * 60 * 1000, // 30 phút - product data có thể thay đổi
}
```

Bạn có thể customize TTL cho từng loại data.

## 5. Cache Keys

Cache keys được generate tự động dựa trên params:

```typescript
const CACHE_KEYS = {
  PROVINCES: 'provinces',
  DISTRICTS: (provinceId: number) => `districts_${provinceId}`,
  WARDS: (districtId: number) => `wards_${districtId}`,
  PRODUCTS: (page: number, limit: number) => `products_${page}_${limit}`,
}
```

Ví dụ keys trong localStorage:
- `api_cache_provinces`
- `api_cache_districts_1`
- `api_cache_wards_5`
- `api_cache_products_1_10`

## 6. Best Practices

### ✅ Nên làm:

1. **Cache data ít thay đổi**: Address data, categories, static configs
2. **Set TTL phù hợp**: Data càng ít đổi, TTL càng dài
3. **Clear cache khi cần**: Sau khi update data
4. **Use in development**: Cache enabled by default trong DEV mode

### ❌ Không nên:

1. **Cache user-specific data**: Personal info, cart, orders
2. **Cache realtime data**: Payment status, live updates
3. **Cache POST/PUT/DELETE responses**: Chỉ cache GET requests
4. **Set TTL quá dài**: Có thể nhận data cũ

## 7. Troubleshooting

### Cache không hoạt động?

```typescript
// Kiểm tra cache có enabled không
import { apiCache } from '@/dev/api-cache'
console.log(apiCache) // Check 'enabled' property

// Kiểm tra có data trong cache không
import { CacheManager } from '@/dev/cached-services'
console.log(CacheManager.getCacheStats())
```

### Data bị cũ?

```typescript
// Clear cache và reload
CacheManager.clearAllCaches()
// Hoặc clear specific cache
CachedAddressService.clearCache()
```

### LocalStorage đầy?

```typescript
// Giảm TTL hoặc clear old cache
CacheManager.clearAllCaches()
```

## 8. Tương lai & Mở rộng

Có thể mở rộng thêm:

- [ ] IndexedDB support cho large data
- [ ] Cache versioning
- [ ] Cache size limit
- [ ] LRU (Least Recently Used) eviction
- [ ] Background cache refresh
- [ ] Cache compression

## 9. Tóm tắt

```typescript
// Import
import { CachedAddressService, CachedProductService, CacheManager } from '@/dev/cached-services'

// Sử dụng
const provinces = await CachedAddressService.fetchProvinces() // Auto cache
const products = await CachedProductService.fetchProductsByPage(1, 10) // Auto cache

// Quản lý
CacheManager.getCacheStats()    // Xem stats
CacheManager.clearAllCaches()   // Xóa all
CacheManager.setEnabled(false)  // Tắt cache
```

---

**Note**: Hệ thống cache này chỉ hoạt động ở client-side (localStorage). Server vẫn nhận requests như bình thường khi cache expired hoặc bị clear.
