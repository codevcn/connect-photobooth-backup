import { TSizeInfo } from '@/utils/types/global'
import { useEffect } from 'react'

export const useScreenSizeChange = (callback: (size: TSizeInfo) => void) => {
  useEffect(() => {
    const handleResize = () => {
      callback({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
}
