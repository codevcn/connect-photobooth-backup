import { TPrintedImage } from '@/utils/types/global'
import { useMemo } from 'react'
import { PrintedImagesModal } from './PrintedImagesModal'
import { createPortal } from 'react-dom'
import { EInternalEvents, eventEmitter } from '@/utils/events'

type TPrintedImagesProps = {
  printedImages: TPrintedImage[]
}

export const PrintedImagesPreview = ({ printedImages }: TPrintedImagesProps) => {
  const displayedImage = useMemo<TPrintedImage | null>(() => {
    return printedImages.length > 0 ? printedImages[0] : null
  }, [printedImages])

  const showPrintedImagesModal = () => {
    eventEmitter.emit(EInternalEvents.HIDE_SHOW_PRINTED_IMAGES_MODAL, true)
  }

  return (
    <div className="flex justify-center min-w-[50px] rounded text-pink-cl w-fit active:scale-90 transition relative">
      <div onClick={showPrintedImagesModal} className="border-border rounded-md cursor-pointer">
        {displayedImage && (
          <div
            key={displayedImage.id}
            className="flex items-center h-[50px] overflow-hidden rounded"
          >
            <img
              src={displayedImage.url}
              alt="Printed image"
              className={`h-max w-max max-h-[50px] max-w-20 my-auto object-contain rounded`}
            />
          </div>
        )}
      </div>
      {createPortal(<PrintedImagesModal printedImages={printedImages} />, document.body)}
    </div>
  )
}
