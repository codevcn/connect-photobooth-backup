import { cn } from '@/configs/ui/tailwind-utils'

type TStarProps = {
  top?: string
  left?: string
  right?: string
  bottom?: string
  index: number
  classNames?: {
    container?: string
  }
}

export const CTAButtonStar = ({ top, left, right, bottom, index, classNames }: TStarProps) => {
  return (
    <div
      style={{
        top: top,
        left: left,
        right: right,
        bottom: bottom,
      }}
      className={cn(
        `NAME-intro-star NAME-intro-star-${index} absolute w-14 h-14`,
        classNames?.container
      )}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path
          stroke="#fff"
          fill="#e60076"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="m12 3 2.036 5.162c.188.476.282.714.425.915.128.178.284.334.462.462.2.143.439.237.915.425L21 12l-5.162 2.036c-.476.188-.714.282-.915.425a1.998 1.998 0 0 0-.462.462c-.143.2-.237.439-.425.915L12 21l-2.036-5.162c-.188-.476-.282-.714-.425-.915a1.999 1.999 0 0 0-.462-.462c-.2-.143-.439-.237-.915-.425L3 12l5.162-2.036c.476-.188.714-.282.915-.425a2 2 0 0 0 .462-.462c.143-.2.237-.439.425-.915L12 3Z"
        />
      </svg>
    </div>
  )
}
