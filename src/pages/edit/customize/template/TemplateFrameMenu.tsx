import { getInitialContants } from '@/utils/contants'
import { EInternalEvents, eventEmitter } from '@/utils/events'
import { TElementType, TPrintedImageVisualState } from '@/utils/types/global'
import { useEffect, useRef, useState } from 'react'
import { CropElementModal } from './CropElementModal'
import { createPortal } from 'react-dom'
import { useEditedElementStore } from '@/stores/element/element.store'
import { useTemplateStore } from '@/stores/ui/template.store'
import { useProductUIDataStore } from '@/stores/ui/product-ui-data.store'

type TCropElementModalWrapperProps = {
  frameId: string
  imageUrl: string
  onClose: () => void
}

const CropImageModalWrapper = ({ frameId, imageUrl, onClose }: TCropElementModalWrapperProps) => {
  const [showCropModal, setShowCropModal] = useState<boolean>(false)

  const handleCropComplete = (croppedImageUrl: string) => {
    eventEmitter.emit(EInternalEvents.CROP_PRINTED_IMAGE_ON_FRAME, frameId, croppedImageUrl)
    setShowCropModal(false)
    onClose()
  }

  return (
    <>
      <button
        onClick={() => setShowCropModal(true)}
        className="group flex flex-nowrap items-center justify-center font-bold gap-1 text-white hover:bg-white hover:text-pink-cl rounded p-1 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-crop-icon lucide-crop"
        >
          <path d="M6 2v14a2 2 0 0 0 2 2h14" />
          <path d="M18 22V8a2 2 0 0 0-2-2H2" />
        </svg>
        <span>Cắt ảnh</span>
      </button>

      {showCropModal &&
        imageUrl &&
        createPortal(
          <CropElementModal
            elementId={frameId}
            imageUrl={imageUrl}
            onClose={onClose}
            onCropComplete={handleCropComplete}
          />,
          document.body
        )}
    </>
  )
}

type TPropertyType = 'scale' | 'angle' | 'posXY' | 'zindex-up' | 'zindex-down'

type PrintedImageMenuProps = {
  frameId: string
  onClose: () => void
  printedImageURL: string
}

export const TemplateFrameMenu = ({ frameId, onClose, printedImageURL }: PrintedImageMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const selectedElement = useEditedElementStore((s) => s.selectedElement)
  const removeFrameImage = useTemplateStore((s) => s.removeFrameImage)

  const validateInputsPositiveNumber = (
    inputs: HTMLInputElement[],
    type: TPropertyType
  ): (number | undefined)[] => {
    const values = inputs.map((input) => input.value.trim())
    // Allow negative numbers if type is 'angle'
    const numberRegex = type === 'angle' ? /^-?\d*\.?\d+$|^0$/ : /^\d+(\.\d+)?$/
    const validValues = values.map((value) =>
      numberRegex.test(value) ? parseFloat(value) : undefined
    )
    return validValues.length > 0 ? validValues : []
  }

  const handleChangeProperties = (
    scale?: number,
    angle?: number,
    posX?: number,
    posY?: number,
    zindex?: number
  ) => {
    eventEmitter.emit(
      EInternalEvents.SUBMIT_PRINTED_IMAGE_ELE_PROPS,
      frameId,
      scale,
      angle,
      posX,
      posY,
      zindex
    )
  }

  const submit = (inputs: HTMLInputElement[], type: TPropertyType) => {
    const values = validateInputsPositiveNumber(inputs, type)
    if (values && values.length > 0) {
      switch (type) {
        case 'scale':
          handleChangeProperties(values[0] ? values[0] / 100 : undefined)
          break
        case 'angle':
          handleChangeProperties(undefined, values[0])
          break
        case 'posXY':
          if (values.length >= 2) {
            handleChangeProperties(undefined, undefined, values[0], values[1])
          }
      }
    }
  }

  const catchEnter = (e: React.KeyboardEvent<HTMLInputElement>, type: TPropertyType) => {
    if (e.key === 'Enter') {
      const formGroup = e.currentTarget.closest<HTMLElement>('.NAME-form-group')
      const inputs = formGroup?.querySelectorAll<HTMLInputElement>('input')
      if (inputs) {
        submit(Array.from(inputs), type)
      }
    }
  }

  const onClickButton = (type: TPropertyType) => {
    if (type === 'zindex-down') {
      handleChangeProperties(
        undefined,
        undefined,
        undefined,
        undefined,
        -getInitialContants<number>('ELEMENT_ZINDEX_STEP')
      )
    } else if (type === 'zindex-up') {
      handleChangeProperties(
        undefined,
        undefined,
        undefined,
        undefined,
        getInitialContants<number>('ELEMENT_ZINDEX_STEP')
      )
    }
  }

  const handleRemoveFrameImage = () => {
    removeFrameImage(frameId)
    setShowDeleteConfirm(false)
  }

  const getAllInputsInForm = () => {
    const menuSection = menuRef.current
    const scaleInput = menuSection?.querySelector<HTMLInputElement>('.NAME-form-scale input')
    const angleInput = menuSection?.querySelector<HTMLInputElement>('.NAME-form-angle input')
    const posXYInputs = menuSection?.querySelectorAll<HTMLInputElement>('.NAME-form-position input')
    return { scaleInput, angleInput, posXYInputs }
  }

  const handleClickCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { scaleInput, angleInput, posXYInputs } = getAllInputsInForm()
    handleChangeProperties(
      scaleInput?.value ? parseFloat(scaleInput.value) / 100 : undefined,
      angleInput?.value ? parseFloat(angleInput.value) : undefined,
      posXYInputs && posXYInputs[0]?.value ? parseFloat(posXYInputs[0].value) : undefined,
      posXYInputs && posXYInputs[1]?.value ? parseFloat(posXYInputs[1].value) : undefined
    )
  }

  const listenElementProps = (idOfElement: string | null, type: TElementType) => {
    if (type !== 'printed-image' || frameId !== idOfElement) return
    const dataset = JSON.parse(selectedElement?.element.getAttribute('data-visual-state') || '{}')
    const { scale, angle, position } = dataset as TPrintedImageVisualState
    const { x: posX, y: posY } = position || {}
    const menuSection = menuRef.current
    if (scale) {
      const scaleInput = menuSection?.querySelector<HTMLInputElement>('.NAME-form-scale input')
      if (scaleInput) scaleInput.value = (scale * 100).toFixed(0)
    }
    if (angle || angle === 0) {
      const angleInput = menuSection?.querySelector<HTMLInputElement>('.NAME-form-angle input')
      if (angleInput) angleInput.value = angle.toFixed(0)
    }
    if (posX || posX === 0) {
      const posXYInputs = menuSection?.querySelectorAll<HTMLInputElement>(
        '.NAME-form-position input'
      )
      if (posXYInputs) posXYInputs[0].value = posX.toFixed(0)
    }
    if (posY || posY === 0) {
      const posXYInputs = menuSection?.querySelectorAll<HTMLInputElement>(
        '.NAME-form-position input'
      )
      if (posXYInputs) posXYInputs[1].value = posY.toFixed(0)
    }
  }

  const handleShowPrintedImagesModal = () => {
    const pickedPrintSurface = useProductUIDataStore.getState().pickedSurface
    if (!pickedPrintSurface) return
    eventEmitter.emit(
      EInternalEvents.HIDE_SHOW_PRINTED_IMAGES_MODAL,
      true,
      {
        width: pickedPrintSurface.area.printW,
        height: pickedPrintSurface.area.printH,
      },
      frameId
    )
  }

  useEffect(() => {
    listenElementProps(frameId, 'printed-image')
  }, [frameId])

  useEffect(() => {
    eventEmitter.on(EInternalEvents.SYNC_ELEMENT_PROPS, listenElementProps)
    return () => {
      eventEmitter.off(EInternalEvents.SYNC_ELEMENT_PROPS, listenElementProps)
    }
  }, [])

  return (
    <>
      <div className="absolute top-1/2 -translate-y-1/2 left-1 flex items-center z-30">
        <button
          onClick={onClose}
          className="group flex flex-nowrap items-center justify-center shadow-md outline-2 outline-white font-bold bg-pink-cl gap-1 text-white active:scale-90 transition rounded p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div
        ref={menuRef}
        className="NAME-menu-section STYLE-hide-scrollbar z-10 px-10 relative overflow-x-auto flex flex-nowrap items-stretch justify-start md:justify-center gap-y-1 gap-x-1 py-1 rounded-md border border-gray-400/30 border-solid"
      >
        <div className="NAME-form-group NAME-form-crop min-w-[100px] col-span-2 flex shrink-0 items-center justify-center bg-pink-cl rounded px-1 py-0.5 shadow">
          <CropImageModalWrapper frameId={frameId} imageUrl={printedImageURL} onClose={onClose} />
        </div>
        <div className="NAME-form-group NAME-form-crop min-w-[100px] col-span-2 flex shrink-0 items-center justify-center bg-pink-cl rounded px-1 py-0.5 shadow">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="group flex flex-nowrap items-center justify-center font-bold gap-1 text-white hover:bg-white hover:text-pink-cl rounded p-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Xóa ảnh</span>
          </button>
        </div>
        <div className="NAME-form-group NAME-form-crop min-w-[100px] col-span-2 flex shrink-0 items-center justify-center bg-pink-cl rounded px-1 py-0.5 shadow">
          <button
            onClick={handleShowPrintedImagesModal}
            className="group flex flex-nowrap items-center justify-center font-bold gap-1 text-white hover:bg-white hover:text-pink-cl rounded p-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-ccw-icon lucide-refresh-ccw"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            <span>Đổi ảnh</span>
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="bg-black/50 z-10 absolute inset-0"
              onClick={() => setShowDeleteConfirm(false)}
            ></div>
            <div className="relative z-20 bg-white p-4 rounded shadow-lg">
              <div>
                <p className="font-bold">Bạn xác nhận sẽ xóa ảnh?</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-2 px-4 font-bold rounded bg-gray-600 text-white"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRemoveFrameImage}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 font-bold rounded bg-pink-cl text-white"
                >
                  <span>Xác nhận</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check-icon lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-1 flex items-center z-20">
        <button
          onClick={onClose}
          className="group flex flex-nowrap items-center justify-center shadow-md outline-white outline font-bold bg-pink-cl gap-1 text-white active:scale-90 transition rounded p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check-icon lucide-check"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
      </div>
    </>
  )
}
