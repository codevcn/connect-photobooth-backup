import { EInternalEvents, eventEmitter } from '@/utils/events'
import { generateUniqueId, getNaturalSizeOfImage } from '@/utils/helpers'
import { TPrintedImage } from '@/utils/types/global'
import { useEffect, useRef, useState } from 'react'
import { useProductUIDataStore } from '@/stores/ui/product-ui-data.store'
import { useLayoutStore } from '@/stores/ui/print-layout.store'
import { createPortal } from 'react-dom'
import { CropImageElementModal } from '../../elements/CropImageElementModal'
import { useQueryFilter } from '@/hooks/extensions'
import { useCommonDataStore } from '@/stores/ui/common-data.store'
import { usePrintedImageStore } from '@/stores/printed-image/printed-image.store'
import { postPreSendMockupImage } from '@/services/api/product.api'
import { toast } from 'react-toastify'

const IMAGE_INDEX_TO_SIMULATE_CLICK: number = 0

type ImageProps = {
  img: TPrintedImage
  imgsContainerRef: React.RefObject<HTMLDivElement | null>
  onClickImage: (printedImg: TPrintedImage) => void
  imgIndex?: number
}

const ImageSlot = ({ img, imgsContainerRef, onClickImage, imgIndex }: ImageProps) => {
  const { url, id } = img

  const handleClickImage = () => {
    onClickImage({ ...img, id, url })
  }

  useEffect(() => {
    setTimeout(() => {
      getNaturalSizeOfImage(
        url,
        (width, height) => {
          const imgEle = imgsContainerRef.current?.querySelector<HTMLImageElement>(
            `.NAME-printed-image-box[data-img-box-id='${id}'] img`
          )
          if (imgEle) {
            imgEle.style.cssText = `width: ${width}px; aspect-ratio: ${width} / ${height};`
            imgEle.src = url
          }
        },
        (err) => {}
      )
    }, 0)
  }, [url, id])

  return (
    <div
      onClick={handleClickImage}
      className={`${imgIndex === IMAGE_INDEX_TO_SIMULATE_CLICK ? 'NAME-simulated-click-target--pick-printed-image' : ''} NAME-printed-image-box cursor-pointer relative w-fit h-fit rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-colors group`}
      data-img-box-id={id}
    >
      <img
        src={undefined}
        alt={`Printed Image`}
        className="max-w-full group-hover:scale-105 transition-transform duration-200 object-contain"
      />
    </div>
  )
}

type TDataOnOpen = {
  slotId?: string
  layoutId?: string
}

type TCropImageModalData = {
  printdImage?: TPrintedImage
  showModal: boolean
}

type PrintedImagesProps = {
  printedImages: TPrintedImage[]
}

export const PrintedImagesModal = ({ printedImages }: PrintedImagesProps) => {
  const imgsContainerRef = useRef<HTMLDivElement>(null)
  const dataOnOpenRef = useRef<TDataOnOpen>({
    slotId: undefined,
    layoutId: undefined,
  })
  const [showPrintedImagesModal, setShowPrintedImagesModal] = useState(false)
  const [showCropImageModal, setShowCropImageModal] = useState<TCropImageModalData>({
    printdImage: undefined,
    showModal: false,
  })
  const [isUploadingExtraImage, setIsUploadingExtraImage] = useState(false)
  const queryFilter = useQueryFilter()
  const { setPrintedImages } = usePrintedImageStore()

  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

  const validateImageMagicBytes = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = (e) => {
        if (!e.target || !e.target.result) return resolve(false)
        const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4)
        let header = ''
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16).padStart(2, '0').toUpperCase()
        }
        // JPEG: FF D8, PNG: 89504E47, WEBP: 52494646
        if (header.startsWith('FFD8') || header === '89504E47' || header.startsWith('52494646')) {
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

  const handleExtraImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input để có thể chọn cùng file lần sau
    e.target.value = ''

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error('Chỉ hỗ trợ file định dạng JPG, JPEG, PNG, WEBP')
      return
    }

    const isValidSignature = await validateImageMagicBytes(file)
    if (!isValidSignature) {
      toast.error('File không đúng định dạng hình ảnh hợp lệ')
      return
    }

    setIsUploadingExtraImage(true)
    try {
      const dimensions = await getImageDimensions(file)
      const formData = new FormData()
      formData.append('file', file)
      const res = await postPreSendMockupImage(formData)

      if (res.success && res.data) {
        const imageUrl = res.data.data.url
        const newImage: TPrintedImage = {
          url: imageUrl,
          width: dimensions.width,
          height: dimensions.height,
          id: generateUniqueId(),
          isOriginalImage: false,
        }
        // Append vào danh sách hiện có, không thay thế
        const currentImages = usePrintedImageStore.getState().printedImages
        setPrintedImages([newImage, ...currentImages])
        toast.success('Đã thêm ảnh thành công!')
      } else {
        toast.error(res.error || 'Tải ảnh lên thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Đã có lỗi xảy ra trong quá trình xử lý ảnh')
    } finally {
      setIsUploadingExtraImage(false)
    }
  }

  const handleAddPrintedImageToLayout = (printedImg: TPrintedImage) => {
    const pickedPrintSurface = useProductUIDataStore.getState().pickedSurface
    if (!pickedPrintSurface) return
    const { slotId, layoutId } = dataOnOpenRef.current
    if (!slotId || !layoutId) return
    useLayoutStore.getState().addPlacedImageToLayout(layoutId, slotId, printedImg)
    setShowPrintedImagesModal(false)
  }

  const addPrintedImageToLayout = (printedImage: TPrintedImage) => {
    const pickedPrintSurface = useProductUIDataStore.getState().pickedSurface
    if (!pickedPrintSurface) return
    const { slotId, layoutId } = dataOnOpenRef.current
    if (!slotId || !layoutId) return
    useLayoutStore.getState().addPlacedImageToLayout(layoutId, slotId, printedImage)
    setShowPrintedImagesModal(false)
  }

  const handleCropPrintedImageComplete = (imageBlob: Blob) => {
    const printedImage = showCropImageModal.printdImage
    if (!printedImage) return
    const clonedImage = { ...printedImage }
    clonedImage.url = useCommonDataStore.getState().createLocalBlobURL(imageBlob)
    if (!clonedImage) return
    addPrintedImageToLayout(clonedImage)
  }

  const handleNoCropPrintedImage = () => {
    const printedImage = showCropImageModal.printdImage
    if (!printedImage) return
    addPrintedImageToLayout(printedImage)
  }

  const listenHideShowPrintedImagesModal = (show: boolean, slotId?: string, layoutId?: string) => {
    dataOnOpenRef.current = { slotId, layoutId }
    setShowPrintedImagesModal(show)
  }

  const handlePickPrintedImage = (printedImg: TPrintedImage) => {
    if (queryFilter.isPhotoism || queryFilter.dev) {
      handleShowCropImageModal(printedImg)
    } else {
      handleAddPrintedImageToLayout(printedImg)
    }
  }

  const handleShowCropImageModal = (printedImg: TPrintedImage) => {
    setShowCropImageModal({ printdImage: printedImg, showModal: true })
  }
  const handleCloseCropImageModal = () => {
    setShowCropImageModal({ printdImage: undefined, showModal: false })
  }

  useEffect(() => {
    eventEmitter.on(
      EInternalEvents.HIDE_SHOW_PRINTED_IMAGES_MODAL,
      listenHideShowPrintedImagesModal
    )
    return () => {
      eventEmitter.off(
        EInternalEvents.HIDE_SHOW_PRINTED_IMAGES_MODAL,
        listenHideShowPrintedImagesModal
      )
    }
  }, [])

  return (
    <>
      <div
        style={{
          display: showPrintedImagesModal ? 'flex' : 'none',
        }}
        className="NAME-printed-images-modal 5xl:text-3xl fixed inset-0 z-999 flex items-center justify-center"
      >
        <div
          onClick={() => setShowPrintedImagesModal(false)}
          className="bg-black/70 absolute inset-0 z-10"
        ></div>
        <div className="relative z-20 bg-white w-full max-w-[90vw] rounded-lg max-h-[80vh] flex flex-col transition duration-300 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-b-gray-200 shadow">
            <h2 className="5xl:text-[1em] text-lg font-bold">Chọn ảnh bạn đã chụp</h2>
            <button
              onClick={() => setShowPrintedImagesModal(false)}
              className="NAME-close-printed-images-modal-btn--replace-printed-image 5xl:h-12 5xl:w-12 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors cursor-pointer mobile-touch"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x-icon lucide-x 5xl:w-12 5xl:h-12"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto p-3 pt-0">
            <label
              htmlFor="extra-printed-image-adder-input"
              className="NAME-extra-printed-image-adder-btn my-3 overflow-hidden flex justify-stretch items-center border-2 border-solid border-main-cl rounded-lg"
            >
              <input
                id="extra-printed-image-adder-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleExtraImageFileChange}
                disabled={isUploadingExtraImage}
              />
              <div className="bg-main-cl h-full w-[20%] py-3 flex items-center justify-center text-main-cl shadow-sm">
                {isUploadingExtraImage ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                )}
              </div>
              <div className="block h-fit text-md text-gray-700 font-bold w-[80%] text-center">
                {isUploadingExtraImage ? 'Đang tải ảnh...' : 'Tải lên ảnh riêng của bạn'}
              </div>
            </label>
            <div className="grid-cols-1 smd:grid-cols-2 grid gap-2" ref={imgsContainerRef}>
              {printedImages.map((img, index) => (
                <ImageSlot
                  key={img.id}
                  img={img}
                  imgIndex={index}
                  imgsContainerRef={imgsContainerRef}
                  onClickImage={handlePickPrintedImage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCropImageModal.showModal &&
        showCropImageModal.printdImage &&
        createPortal(
          <CropImageElementModal
            elementId={showCropImageModal.printdImage.id}
            imageUrl={showCropImageModal.printdImage.url}
            onClose={handleCloseCropImageModal}
            onCropComplete={handleCropPrintedImageComplete}
            showNoCrop
            onNoCrop={handleNoCropPrintedImage}
          />,
          document.body
        )}
    </>
  )
}
