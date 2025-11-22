import { useEditedElementStore } from '@/stores/element/element.store'
import { EInternalEvents, eventEmitter } from '@/utils/events'
import { TElementType } from '@/utils/types/global'
import { useEffect, useRef } from 'react'
// import { TextElementMenu } from '../elements/text-element/Menu'
// import { StickerElementMenu } from '../elements/sticker-element/Menu'
import { TemplateFrameMenu } from './template/TemplateFrameMenu'
import { useTemplateStore } from '@/stores/ui/template.store'

export const ElementInteraction = () => {
  const selectElement = useEditedElementStore((s) => s.selectElement)
  const cancelSelectingElement = useEditedElementStore((s) => s.cancelSelectingElement)
  const selectedElement = useEditedElementStore((s) => s.selectedElement)
  const { elementId, elementType, elementURL } = selectedElement || {}
  const elementInteractionContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    eventEmitter.on(
      EInternalEvents.PICK_ELEMENT,
      (elementId: string, element: HTMLElement, elementType: TElementType) => {
        let elementURL: string | undefined = undefined
        if (elementType === 'template-frame') {
          const pickedFrame = useTemplateStore.getState().getFrameById(elementId)
          if (pickedFrame) {
            elementURL = pickedFrame.placedImage?.imgURL
          }
        }
        selectElement(elementId, element, elementType, elementURL)
        elementInteractionContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    )
  }, [])

  if (!elementId) return null

  return (
    <div ref={elementInteractionContainerRef} className="mt-6">
      <h3 className="NAME-element-interaction-title font-bold text-gray-800">Tùy chỉnh khác</h3>
      <div className="rounded mt-1 relative">
        {elementId &&
          (elementType === 'text' ? (
            //   <TextElementMenu elementId={elementId} onClose={cancelSelectingElement} />
            // ) : elementType === 'sticker' ? (
            //   <StickerElementMenu elementId={elementId} onClose={cancelSelectingElement} />
            <></>
          ) : (
            elementType === 'template-frame' &&
            elementURL && (
              <TemplateFrameMenu
                frameId={elementId}
                onClose={cancelSelectingElement}
                printedImageURL={elementURL}
              />
            )
          ))}
      </div>
    </div>
  )
}
