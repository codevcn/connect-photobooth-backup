import {
  TPrintTemplate,
  TTemplateFrame,
  TPrintedImage,
  TPlacedImage,
  TSizeInfo,
} from '@/utils/types/global'
import { getInitialContants } from '@/utils/contants'
import { create } from 'zustand'
import { assignFrameSizeByTemplateType } from '@/configs/print-template/templates-helpers'
import { matchPrintedImgAndAllowSquareMatchToShapeSize } from '@/pages/edit/customize/template/TemplateFrame'
import { toast } from 'react-toastify'
import { subscribeWithSelector } from 'zustand/middleware'
import { hardCodedPrintTemplates } from '@/configs/print-template/templates-data'

type TTemplateStore = {
  allTemplates: TPrintTemplate[]
  pickedTemplate: TPrintTemplate | null
  showTemplatePicker: boolean
  pickedFrame: TTemplateFrame | undefined

  // Actions
  getFrameById: (frameId: string) => TTemplateFrame | undefined
  getFrameByFrameIdAndTemplateId: (
    frameId: string,
    templateId: TPrintTemplate['id']
  ) => TTemplateFrame | undefined
  initializeAddingTemplates: (templates: TPrintTemplate[], isFinal: boolean) => void
  pickTemplate: (template: TPrintTemplate) => void
  hideShowTemplatePicker: (show: boolean) => void
  pickFrame: (frame: TTemplateFrame | undefined) => void
  addImageToFrame: (printedImage: TPrintedImage, printAreaSize: TSizeInfo, frameId?: string) => void
  updateFrameImageURL: (newURL: string, frameId: string, idOfURLImage?: string) => void
  removeFrameImage: (frameId: string) => void
  updatePickedTemplate: (template: TPrintTemplate) => void
}

export const useTemplateStore = create(
  subscribeWithSelector<TTemplateStore>((set, get) => ({
    allTemplates: [],
    pickedTemplate: null,
    showTemplatePicker: false,
    pickedFrame: undefined,

    getFrameByFrameIdAndTemplateId: (frameId, templateId) => {
      const { allTemplates } = get()
      const foundTemplate = allTemplates.find((t) => t.id === templateId)
      if (foundTemplate) {
        const foundFrame = foundTemplate.frames.find((f) => f.id === frameId)
        return foundFrame
      }
    },

    getFrameById: (frameId: string): TTemplateFrame | undefined => {
      const { allTemplates } = get()
      for (const template of allTemplates) {
        const foundFrame = template.frames.find((f) => f.id === frameId)
        if (foundFrame) {
          return foundFrame
        }
      }
      return undefined
    },

    initializeAddingTemplates: (templates, isFinal = false) => {
      if (isFinal) {
        const toCheckUnique = new Map<TPrintTemplate['id'], TPrintTemplate>()
        for (const t of get().allTemplates) {
          toCheckUnique.set(t.id, t)
        }
        for (const t of templates) {
          toCheckUnique.set(t.id, t)
        }
        for (const t of hardCodedPrintTemplates()) {
          if (!toCheckUnique.has(t.id)) {
            toCheckUnique.set(t.id, t)
          }
        }
        set({
          allTemplates: [...toCheckUnique.values()],
        })
      } else {
        set({
          allTemplates: [...get().allTemplates, ...templates],
        })
      }
    },

    pickTemplate: (template) => {
      const { pickedTemplate } = get()
      if (pickedTemplate && pickedTemplate.id === template.id) return
      set({ pickedTemplate: template })
    },

    hideShowTemplatePicker: (show) => {
      set({ showTemplatePicker: show })
    },

    pickFrame: (frame) => {
      set({ pickedFrame: frame })
    },

    addImageToFrame: (printedImage, printAreaSize, frameId) => {
      const { allTemplates, pickedTemplate } = get()
      if (!pickedTemplate) return

      const templates = [...allTemplates]

      const initPlacedImage = (frameIndex: TTemplateFrame['index']): TPlacedImage => {
        return {
          id: printedImage.id,
          imgURL: printedImage.url,
          placementState: {
            frameIndex,
            zoom: getInitialContants<number>('PLACED_IMG_ZOOM'),
            objectFit: getInitialContants<'contain'>('PLACED_IMG_OBJECT_FIT'),
            squareRotation: getInitialContants<number>('PLACED_IMG_SQUARE_ROTATION'),
            direction: getInitialContants<'center'>('PLACED_IMG_DIRECTION'),
          },
        }
      }

      if (frameId) {
        // Thêm vào frame cụ thể
        for (const template of templates) {
          let frameIndex: number = getInitialContants<number>('PLACED_IMG_FRAME_INDEX')
          for (const frame of template.frames) {
            if (frame.id === frameId) {
              assignFrameSizeByTemplateType(printAreaSize, template.type, frame)
              if (matchPrintedImgAndAllowSquareMatchToShapeSize(frame, printedImage)) {
                frame.placedImage = initPlacedImage(frameIndex)
              } else {
                toast.warning('Ảnh không phù hợp với khung hình. Vui lòng chọn ảnh khác.')
              }
              break
            }
            frameIndex++
          }
        }
      } else {
        // Thêm vào frame trống đầu tiên của template được chọn
        const currentTemplateId = pickedTemplate.id
        for (const template of templates) {
          if (template.id === currentTemplateId) {
            const foundFrameIndex = template.frames.findIndex((f) => !f.placedImage)
            if (foundFrameIndex >= 0) {
              const foundFrame = template.frames[foundFrameIndex]
              assignFrameSizeByTemplateType(printAreaSize, template.type, foundFrame)
              if (matchPrintedImgAndAllowSquareMatchToShapeSize(foundFrame, printedImage)) {
                foundFrame.placedImage = initPlacedImage(foundFrameIndex + 1)
              } else {
                toast.warning('Ảnh không phù hợp với khung hình. Vui lòng chọn ảnh khác.')
              }
              break
            }
          }
        }
      }
      console.log('>>> check all:', templates)

      set({ allTemplates: templates })
    },

    updateFrameImageURL: (newURL, frameId, idOfURLImage) => {
      const { allTemplates } = get()
      const templates = [...allTemplates]

      for (const template of templates) {
        const foundFrame = template.frames.find((f) => f.id === frameId)
        if (foundFrame) {
          if (foundFrame.placedImage) {
            foundFrame.placedImage.imgURL = newURL
            if (idOfURLImage) {
              foundFrame.placedImage.id = idOfURLImage
            }
          }
          break
        }
      }

      set({ allTemplates: templates })
    },

    removeFrameImage: (frameId) => {
      const { allTemplates } = get()
      const templates = [...allTemplates]

      for (const template of templates) {
        const foundFrame = template.frames.find((f) => f.id === frameId)
        if (foundFrame && foundFrame.placedImage) {
          foundFrame.placedImage = undefined
          break
        }
      }

      set({ allTemplates: templates })
    },

    updatePickedTemplate: (template) => {
      set({ pickedTemplate: { ...template } })
    },
  }))
)

useTemplateStore.subscribe(
  (state) => state.allTemplates,
  (allTemplates) => {
    const pickedTemplate = useTemplateStore.getState().pickedTemplate
    if (pickedTemplate) {
      const pickedTemplateId = pickedTemplate.id
      for (const template of allTemplates) {
        if (template.id === pickedTemplateId) {
          useTemplateStore.getState().updatePickedTemplate(template)
        }
      }
    }
  }
)
