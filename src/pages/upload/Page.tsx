import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppNavigator } from '@/utils/navigator'
import { usePrintedImageStore } from '@/stores/printed-image/printed-image.store'
import { postPreSendMockupImage } from '@/services/api/product.api'
import { SectionLoading } from '@/components/custom/Loading'
import { generateUniqueId } from '@/utils/helpers'
import { TPrintedImage } from '@/utils/types/global'

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

const validateImageMagicBytes = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = function (e) {
      if (!e.target || !e.target.result) return resolve(false)
      const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4)
      let header = ''
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0').toUpperCase()
      }

      // Check for JPEG (FF D8 FF ...) or PNG (89 50 4E 47) or WebP (52 49 46 46)
      if (header.startsWith('FFD8') || header === '89504E47' || header === '52494646') {
        resolve(true)
      } else {
        resolve(false)
      }
    }
    reader.onerror = () => reject(false)
    reader.readAsArrayBuffer(file.slice(0, 4))
  })
}

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const setPrintedImages = usePrintedImageStore((s) => s.setPrintedImages)

  const handleFile = async (file: File) => {
    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error('Chỉ hỗ trợ file định dạng JPG, JPEG, PNG, WebP')
      return
    }

    // Check magic bytes
    const isValidSignature = await validateImageMagicBytes(file)
    if (!isValidSignature) {
      toast.error('File không đúng định dạng hình ảnh hợp lệ (Magic Bytes mismatch)')
      return
    }

    setIsUploading(true)
    try {
      // Get dimensions
      const dimensions = await getImageDimensions(file)

      // Upload file
      const formData = new FormData()
      formData.append('file', file)
      const res = await postPreSendMockupImage(formData)

      if (res.success && res.data) {
        const imageUrl = res.data.data.url
        const imageData: TPrintedImage = {
          url: imageUrl,
          width: dimensions.width,
          height: dimensions.height,
          id: generateUniqueId(),
          isOriginalImage: true,
        }

        setPrintedImages([imageData])
        AppNavigator.navTo(navigate, '/edit')
      } else {
        toast.error(res.error || 'Tải ảnh lên thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Đã có lỗi xảy ra trong quá trình xử lý ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center py-4 px-3 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="z-10 w-full max-w-lg bg-white/80 backdrop-blur-md rounded-xl shadow-2xl px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-4xl font-extrabold text-main-cl mb-2">
            TẢI LÊN ẢNH CỦA BẠN
          </h1>
          <h2 className="text-lg font-bold text-gray-800 leading-relaxed">
            <span>Lưu giữ kỷ niệm chụp ảnh photobooth cùng bạn bè và người thương </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500 inline-block align-text-bottom mb-1"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </h2>
        </div>

        <div
          className={`w-full aspect-video border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-main-cl bg-main-cl/10 scale-105'
              : 'border-gray-300 hover:border-main-cl/50 hover:bg-gray-50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-main-cl/10 rounded-full flex items-center justify-center mb-4 text-main-cl shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-700 mb-1 px-2 text-center">
            Bấm để chọn file ảnh của bạn (JPG, PNG, WEBP)
          </p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={onFileChange}
          />
        </div>

        <div className="mt-8 w-full flex flex-col gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-main-cl text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mobile-touch"
          >
            <span>Tải ảnh lên ngay</span>
          </button>

          <button
            onClick={() => navigate('/scan-qr')}
            className="overflow-hidden w-full bg-white border-2 border-main-cl text-main-cl font-bold rounded-xl text-md shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 active:scale-95 flex items-stretch justify-center gap-2 mobile-touch"
          >
            <span className="flex justify-center items-center bg-main-cl min-h-full w-[20%] p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                fill="white"
                className="bi bi-qr-code"
                viewBox="0 0 16 16"
              >
                <path d="M2 2h2v2H2z" />
                <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
                <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
                <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
                <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
              </svg>
            </span>
            <span className="flex items-center justify-center w-[80%] p-1.5">
              Bạn có mã QR Photobooth? Quét ngay
            </span>
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center flex-col backdrop-blur-sm">
          <SectionLoading
            message="Đang tải ảnh lên máy chủ..."
            classNames={{
              message: 'text-main-cl font-bold mt-4 text-xl',
              shapesContainer: 'text-main-cl',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default UploadPage
