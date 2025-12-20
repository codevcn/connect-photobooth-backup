import { cn } from '@/configs/ui/tailwind-utils'

type WarningIconProps = {
  className?: string
  strokeWidth?: number
}

export const WarningIcon = ({ className, strokeWidth = 2 }: WarningIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lucide lucide-triangle-alert-icon lucide-triangle-alert w-6 h-6', className)}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
