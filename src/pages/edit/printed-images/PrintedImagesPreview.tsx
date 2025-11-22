import { TPrintedImage } from '@/utils/types/global'
import { useEffect, useMemo } from 'react'
import { PrintedImagesModal } from './PrintedImagesModal'
import { createPortal } from 'react-dom'
import { EInternalEvents, eventEmitter } from '@/utils/events'
import { TemplateFrameMenu } from '../customize/template/TemplateFrameMenu'
import { useEditedElementStore } from '@/stores/element/element.store'

type TPrintedImagesProps = {
  printedImages: TPrintedImage[]
}

export const PrintedImagesPreview = ({ printedImages }: TPrintedImagesProps) => {
  const cancelSelectingElement = useEditedElementStore((s) => s.cancelSelectingElement)
  const selectedElement = useEditedElementStore((s) => s.selectedElement)
  const { elementId, elementType, elementURL } = selectedElement || {}

  const displayedImage = useMemo<TPrintedImage | null>(() => {
    return printedImages.length > 0 ? printedImages[0] : null
  }, [printedImages])

  const showPrintedImagesModal = () => {
    eventEmitter.emit(EInternalEvents.HIDE_SHOW_PRINTED_IMAGES_MODAL, true)
  }

  const scrollToSelectedElement = () => {
    if (elementType !== 'template-frame') return
    document.body
      .querySelector('.NAME-menu-template-frame')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  useEffect(() => {
    scrollToSelectedElement()
  }, [elementId, elementType, elementURL])

  return (
    <div className="mt-6 w-full">
      <h3 className="mb-1 font-bold text-gray-800">Chọn ảnh chụp photobooth</h3>
      <div className="flex justify-center min-w-[50px] rounded text-main-cl w-fit active:scale-90 transition relative">
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

      {elementId && elementType === 'template-frame' && elementURL && (
        <TemplateFrameMenu
          frameId={elementId}
          onClose={cancelSelectingElement}
          printedImageURL={elementURL}
        />
      )}
    </div>
  )
}
