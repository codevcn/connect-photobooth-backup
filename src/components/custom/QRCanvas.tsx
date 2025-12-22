import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

type TQRCanvasProps = {
  value: string
  size?: number
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

export const QRCanvas = ({ value, size = 200, onCanvasReady }: TQRCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return

    QRCode.toCanvas(canvas, value, { width: size }, (error) => {
      if (error) console.error(error)
      else if (canvas && onCanvasReady) {
        onCanvasReady(canvas)
      }
    })
  }, [value, size, onCanvasReady])

  return <canvas ref={canvasRef} width={size} height={size} />
}
