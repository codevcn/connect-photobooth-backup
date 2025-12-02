import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
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
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const scannerDivId = 'qr-reader'

  useEffect(() => {
    if (!isReady) return
    qrGetter.setDetectFromFileHandler(detectFromFile as any)
  }, [isReady, detectFromFile])

  useEffect(() => {
    if (!isReady) return

    const html5QrCode = new Html5Qrcode(scannerDivId)
    html5QrCodeRef.current = html5QrCode

    const handleScanSuccess = (decodedText: string) => {
      if (!isScanning && isReady) {
        setIsScanning(true)
        console.log('>>> QR scanned:', decodedText)
        
        // Stop scanner
        html5QrCode.stop().catch((err) => {
          console.error('Error stopping scanner:', err)
        })

        qrGetter
          .handleImageData(decodedText, (percentage, images, error) => {
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

    const handleScanError = (errorMessage: string) => {
      // Ignore scan errors (happens continuously when no QR code is detected)
      // Only log for debugging if needed
      // console.log('Scan error:', errorMessage)
    }

    html5QrCode
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        handleScanError
      )
      .catch((err) => {
        console.error('>>> Camera error:', err)
        setError('Không thể truy cập camera. Vui lòng cấp quyền sử dụng camera.')
        toast.error('Không thể truy cập camera. Vui lòng cấp quyền sử dụng camera.')
      })

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch((err) => {
          console.error('Error stopping scanner on cleanup:', err)
        })
      }
    }
  }, [isReady, isScanning, onScanSuccess])

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
        {!error && (
          <div
            id={scannerDivId}
            className="w-full h-full"
            style={{
              border: 'none',
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
