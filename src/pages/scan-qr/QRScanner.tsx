import { useEffect, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { qrGetter } from '@/configs/brands/photoism/qr-getter'
import { toast } from 'react-toastify'
import { TUserInputImage } from '@/utils/types/global'
import { useFastBoxes } from '@/hooks/use-fast-boxes'

type QRScannerProps = {
  onScanSuccess: (result: TUserInputImage[]) => Promise<void>
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>('')
  const { detectFromFile, isReady } = useFastBoxes()

  useEffect(() => {
    if (!isReady) return
    qrGetter.setDetectFromFileHandler(detectFromFile as any)
  }, [isReady])

  const handleScan = (result: string) => {
    if (!isScanning && isReady) {
      setIsScanning(true)
      console.log('>>> QR scanned:', result)
      qrGetter
        .handleImageData(result, (percentage, images, error) => {
          setProgress(percentage)
          if (error) {
            console.error('>>> Lỗi lấy dữ liệu mã QR:', error)
            setError('Không thể lấy dữ liệu từ mã QR. Vui lòng thử lại.')
            toast.error(error.message)
            setIsScanning(false)
            return
          }
          if (images) {
            console.log('>>> images extracted:', images)
            onScanSuccess(
              images.map((img) => ({
                ...img,
                url: img.isOriginalImage ? img.url : URL.createObjectURL(img.blob),
              }))
            )
          }
        })
        .catch((err) => {
          console.error('>>> Lỗi xử lý dữ liệu mã QR:', err)
          setError('Không thể xử lý mã QR. Vui lòng thử lại.')
          toast.error('Không thể xử lý mã QR. Vui lòng thử lại.')
          setIsScanning(false)
        })
    }
  }

  const handleError = (error: unknown) => {
    console.error('>>> QR Scanner error:', error)
    setError('Không thể truy cập camera. Vui lòng cấp quyền sử dụng camera.')
    toast.error('Không thể truy cập camera. Vui lòng cấp quyền sử dụng camera.')
  }

  // useEffect(() => {
  //   if (!isReady) return
  //   setTimeout(() => {
  //     qrGetter.setDetectFromFileHandler(detectFromFile as any)
  //     qrGetter
  //       .handleImageData('https://qr.seobuk.kr/s/8ijZsg_', (percentage, images, error) => {
  //         setProgress(percentage)
  //         if (error) {
  //           console.error('>>> Lỗi lấy dữ liệu mã QR:', error)
  //           setError('Không thể lấy dữ liệu từ mã QR. Vui lòng thử lại.')
  //           toast.error(error.message)
  //           return
  //         }
  //         if (images) {
  //           console.log('>>> images extracted:', images)
  //           onScanSuccess(
  //             images.map((img) => ({
  //               ...img,
  //               url: img.isOriginalImage ? img.url : URL.createObjectURL(img.blob),
  //             }))
  //           )
  //         }
  //       })
  //       .catch((err) => {
  //         console.error('>>> Lỗi xử lý dữ liệu mã QR:', err)
  //         setError('Không thể xử lý mã QR. Vui lòng thử lại.')
  //         toast.error('Không thể xử lý mã QR. Vui lòng thử lại.')
  //       })
  //   }, 500)
  // }, [isReady])

  return (
    <div className="w-full">
      <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
        {!error && !isScanning && (
          <Scanner
            onScan={(detectedCodes) => {
              const result = detectedCodes[0]?.rawValue
              if (result) {
                handleScan(result)
              }
            }}
            onError={handleError}
            constraints={{
              facingMode: 'environment',
            }}
            styles={{
              container: {
                width: '100%',
                height: '100%',
              },
              video: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }}
            components={{
              finder: false,
            }}
          />
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fade-in-down">
            <p className="text-red-600 text-lg font-bold text-center">{error}</p>
          </div>
        ) : (
          <>
            {isScanning && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in-down">
                <div className="w-4/5">
                  <div className="bg-white rounded-full h-4 overflow-hidden mb-4 shadow-lg">
                    <div
                      className="bg-pink-400 h-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white text-center font-medium animate-pulse">
                    <span>Đang xử lý ảnh của bạn...</span>
                    <span> {progress}</span>
                    <span>%</span>
                  </p>
                </div>
              </div>
            )}
            {!isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-pink-400 rounded-lg opacity-30 animate-pulse"></div>
              </div>
            )}
          </>
        )}
      </div>
      {!isScanning && !error && (
        <p
          className="text-center mt-4 text-white text-sm animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Hãy đưa mã QR vào khung để quét
        </p>
      )}
    </div>
  )
}
