import { TPrintTemplate } from '@/utils/types/global'
import { FramesDisplayer } from './FrameDisplayer'
import { useMemo } from 'react'
import { cn } from '@/configs/ui/tailwind-utils'
import { useTemplateStore } from '@/stores/ui/template.store'

type TTemplatePickerProps = {
  printedImagesCount: number
} & Partial<{
  classNames: Partial<{
    templatesList: string
    templateItem: string
  }>
}>

export const TemplatesPicker = ({ printedImagesCount, classNames }: TTemplatePickerProps) => {
  const allTemplates = useTemplateStore((s) => s.allTemplates)
  const availableTemplates = useMemo<TPrintTemplate[]>(() => {
    return allTemplates.filter((template) => template.framesCount <= printedImagesCount)
  }, [printedImagesCount, allTemplates])
  const pickTemplate = useTemplateStore((s) => s.pickTemplate)

  return (
    <div className={classNames?.templatesList}>
      {availableTemplates.map((template) => (
        <div
          key={template.id}
          onClick={() => pickTemplate(template)}
          className={cn(
            'flex items-center justify-center border border-gray-300 rounded p-1 bg-white mobile-touch cursor-pointer transition',
            classNames?.templateItem
          )}
        >
          <FramesDisplayer
            template={template}
            plusIconReplacer={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-image-icon lucide-image text-gray-500 w-8 h-8"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            }
            frameStyles={{
              container: { backgroundColor: 'white' },
            }}
          />
        </div>
      ))}
    </div>
  )
}
