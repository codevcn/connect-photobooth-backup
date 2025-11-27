# Fast Boxes WASM Integration Guide

## Tổng quan

Module `fast_boxes` là một WASM module để phát hiện bounding boxes từ ảnh. Module này đã được tích hợp vào React project thông qua custom hook `useFastBoxes`.

## Cấu trúc files

```
public/
  wasm/
    fast_boxes.js      # WASM glue code
    fast_boxes.wasm    # WASM binary

src/
  hooks/
    use-fast-boxes.ts  # Custom hook để sử dụng WASM
  components/
    custom/
      BoundingBoxDetector.tsx  # Demo component
```

## Cách sử dụng

### 1. Setup ban đầu

Di chuyển 2 files WASM vào thư mục public:

```powershell
mkdir public/wasm
cp src/dev/dist/fast_boxes.js public/wasm/
cp src/dev/dist/fast_boxes.wasm public/wasm/
```

### 2. Sử dụng Hook trong component

```typescript
import { useFastBoxes } from '@/hooks/use-fast-boxes'

function MyComponent() {
  const { isReady, detectFromFile, detectFromUrl } = useFastBoxes()

  const handleFileSelect = async (file: File) => {
    const result = await detectFromFile(file)
    
    if (result.success) {
      console.log('Bounding boxes:', result.boxes)
      // result.boxes: Array<{ x, y, width, height, confidence }>
    } else {
      console.error('Error:', result.error)
    }
  }

  return (
    <div>
      {isReady ? 'WASM Ready' : 'Loading...'}
    </div>
  )
}
```

### 3. API của useFastBoxes Hook

#### Return values:

```typescript
{
  isLoading: boolean        // true nếu đang load WASM
  error: string | null      // Lỗi khi load WASM (nếu có)
  isReady: boolean         // true khi WASM sẵn sàng sử dụng
  
  // Detect từ File object
  detectFromFile: (file: File) => Promise<TDetectionResult>
  
  // Detect từ URL hoặc base64
  detectFromUrl: (url: string) => Promise<TDetectionResult>
  
  // Detect từ HTMLImageElement
  detectFromImage: (img: HTMLImageElement) => Promise<TDetectionResult>
}
```

#### Types:

```typescript
type TBoundingBox = {
  x: number           // X coordinate (top-left)
  y: number           // Y coordinate (top-left)
  width: number       // Box width
  height: number      // Box height
  confidence: number  // Detection confidence (0-1)
}

type TDetectionResult = {
  success: boolean
  boxes?: TBoundingBox[]
  error?: string
}
```

### 4. Ví dụ sử dụng

#### Detect từ File input:

```tsx
const { detectFromFile } = useFastBoxes()

const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const result = await detectFromFile(file)
  if (result.success) {
    result.boxes?.forEach(box => {
      console.log(`Box at (${box.x}, ${box.y}), size: ${box.width}x${box.height}`)
    })
  }
}

return <input type="file" onChange={handleChange} />
```

#### Detect từ URL:

```tsx
const { detectFromUrl } = useFastBoxes()

const analyzeImage = async () => {
  const result = await detectFromUrl('https://example.com/image.jpg')
  // hoặc base64:
  // const result = await detectFromUrl('data:image/jpeg;base64,...')
  
  if (result.success) {
    console.log('Found boxes:', result.boxes)
  }
}
```

#### Detect từ existing image element:

```tsx
const { detectFromImage } = useFastBoxes()
const imgRef = useRef<HTMLImageElement>(null)

const analyzeImageElement = async () => {
  if (!imgRef.current) return
  
  const result = await detectFromImage(imgRef.current)
  if (result.success) {
    console.log('Boxes:', result.boxes)
  }
}

return <img ref={imgRef} src="..." onLoad={analyzeImageElement} />
```

## Demo Component

Truy cập `/bbox-demo` để xem demo component hoàn chỉnh với:
- Drag & drop ảnh
- Preview ảnh với bounding boxes được vẽ overlay
- Hiển thị kết quả JSON

## Notes

1. **Performance**: WASM module chỉ được load 1 lần khi component mount lần đầu
2. **Memory**: Module tự động free memory sau mỗi lần detect
3. **Browser compatibility**: Cần browser hỗ trợ WebAssembly (Chrome 57+, Firefox 52+, Safari 11+)
4. **File size**: 
   - fast_boxes.js: ~50KB (minified)
   - fast_boxes.wasm: Size phụ thuộc vào implementation

## Troubleshooting

### WASM module không load được

Kiểm tra:
1. Files `fast_boxes.js` và `fast_boxes.wasm` có trong `public/wasm/`
2. Console có lỗi 404 không
3. CORS headers nếu load từ external source

### Detection trả về lỗi

Kiểm tra:
1. File ảnh có hợp lệ không (JPEG, PNG, etc.)
2. File size không quá lớn (recommend < 10MB)
3. Console error messages

### Performance issues

- Nếu ảnh quá lớn, resize trước khi detect
- Sử dụng Web Worker nếu cần xử lý nhiều ảnh (future enhancement)
