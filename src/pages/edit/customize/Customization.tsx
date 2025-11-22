import { TElementType, TPrintedImage } from '@/utils/types/global'
import { PrintedImagesPreview } from '../printed-images/PrintedImagesPreview'
import { TemplatesPicker } from './template/TemplatesPicker'
import StickerPicker from '../elements/sticker-element/StickerPicker'
import { TextEditor } from '../elements/text-element/TextEditor'
import { useEffect } from 'react'
import { EInternalEvents, eventEmitter } from '@/utils/events'
import { useTemplateStore } from '@/stores/ui/template.store'
import { useEditedElementStore } from '@/stores/element/element.store'

type TCustomizeProps = {
  printedImages: TPrintedImage[]
}

export const Customization = ({ printedImages }: TCustomizeProps) => {
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
        useEditedElementStore.getState().selectElement(elementId, element, elementType, elementURL)
      }
    )
  }, [])

  return (
    <div className="border-border rounded-lg p-3 bg-gray-100 mt-2">
      <h3 className="text-center text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
        Cá nhân hóa
      </h3>
      <div className="overflow-hidden relative w-full mt-4">
        <TemplatesPicker
          printedImagesCount={printedImages.length}
          classNames={{
            templatesList: 'grid grid-cols-3 gap-2',
            templateItem: 'aspect-square',
          }}
        />
        <PrintedImagesPreview printedImages={printedImages} />
        <StickerPicker />
        <TextEditor />
      </div>
    </div>
  )
}
