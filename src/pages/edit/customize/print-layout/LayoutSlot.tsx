import { cn } from '@/configs/ui/tailwind-utils'
import { TLayoutSlotConfig, TLayoutType, TPrintLayout } from '@/utils/types/print-layout'
import { PlacedImage } from './PlacedImage'

type TAddImageIconProps = {
  slotsCount: number
} & Partial<{
  classNames: Partial<{
    plusIconWrapper: string
  }>
  styles: Partial<{
    container: React.CSSProperties
    plusIconWrapper: React.CSSProperties
  }>
}>

export const AddImageIcon = ({ styles, classNames, slotsCount }: TAddImageIconProps) => {
  return (
    <div
      style={styles?.plusIconWrapper}
      className={cn(
        'NAME-add-printed-image-to-slot text-center p-1 flex flex-col items-center justify-center text-white h-full w-full bg-gray-400/90',
        classNames?.plusIconWrapper
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-plus-icon lucide-plus"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
      <span
        style={{
          fontSize: slotsCount < 3 ? (slotsCount < 2 ? '10px' : '8px') : '6px',
        }}
      >
        Nhấn để chọn ảnh
      </span>
    </div>
  )
}

type TemplateFrameProps = {
  layoutSlot: TLayoutSlotConfig
  layoutId: TPrintLayout['id']
  slotsCount: number
  layoutType: TLayoutType
} & Partial<{
  onClickFrame: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    slotId: string,
    layoutId: string
  ) => void
  scrollable: boolean
  onImageLoad?: () => void
}>

export const LayoutSlot = ({
  layoutSlot,
  layoutId,
  slotsCount,
  onClickFrame,
  scrollable = true,
  onImageLoad,
  layoutType,
}: TemplateFrameProps) => {
  return (
    <div
      style={{
        ...layoutSlot.style,
        ...(layoutType === 'full' ? { aspectRatio: 'auto', height: '100%', width: '100%' } : {}),
      }}
      className={cn(
        'NAME-layout-slot cursor-pointer relative flex justify-center items-center overflow-hidden aspect-square border border-gray-600 border-dashed',
        scrollable ? '' : 'touch-none'
      )}
      onClick={onClickFrame ? (e) => onClickFrame(e, layoutSlot.id, layoutId) : undefined}
    >
      {layoutSlot.placedImage ? (
        <PlacedImage
          placedImage={layoutSlot.placedImage}
          onImageLoad={onImageLoad}
          layoutType={layoutType}
        />
      ) : (
        <AddImageIcon slotsCount={slotsCount} />
      )}
    </div>
  )
}
