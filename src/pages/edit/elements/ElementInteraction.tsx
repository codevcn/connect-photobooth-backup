import { useEditedElementStore } from '@/stores/element/element.store'
import { EInternalEvents, eventEmitter } from '@/utils/events'
import { TElementType } from '@/utils/types/global'
import { useEffect } from 'react'
import { TextElementMenu } from './text-element/Menu'
import { StickerElementMenu } from './sticker-element/Menu'
import { TemplateFrameMenu } from '../customize/template/TemplateFrameMenu'
import { useTemplateStore } from '@/stores/ui/template.store'

export const ElementInteraction = () => {
  const selectElement = useEditedElementStore((s) => s.selectElement)
  const cancelSelectingElement = useEditedElementStore((s) => s.cancelSelectingElement)
  const selectedElement = useEditedElementStore((s) => s.selectedElement)
  const { elementId, elementType, elementURL } = selectedElement || {}
  console.log('>>> selectedElement:', selectedElement)

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
        console.log('>>> elementURL:', elementURL)
        selectElement(elementId, element, elementType, elementURL)
      }
    )
  }, [])

  return (
    <div className="bg-white rounded smd:h-[41.5px] mt-2 relative">
      {elementId &&
        (elementType === 'text' ? (
          <TextElementMenu elementId={elementId} onClose={cancelSelectingElement} />
        ) : elementType === 'sticker' ? (
          <StickerElementMenu elementId={elementId} onClose={cancelSelectingElement} />
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
  )
}
