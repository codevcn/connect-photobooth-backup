import { cn } from '@/configs/ui/tailwind-utils'

type TAppLoadingProps = {
  message: string
  classNames?: Partial<{
    container: string
    message: string
    shapesContainer: string
  }>
}

export const AppLoading = ({ message, classNames }: TAppLoadingProps) => {
  return (
    <div
      id="app-loading"
      className={cn(
        'flex-col items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex z-999',
        classNames?.container
      )}
    >
      <div className="relative bottom-5">
        <div
          className={cn('STYLE-animation-loading-shapes text-main-cl', classNames?.shapesContainer)}
        ></div>
        <p
          className={cn(
            'QUERY-loading-message w-max text-base font-bold text-white mt-6 absolute top-[calc(50%+50px)] left-1/2 -translate-x-1/2 -translate-y-1/2',
            classNames?.message
          )}
        >
          {message}
        </p>
      </div>
    </div>
  )
}

type TPageLoadingProps = {
  message: string
  classNames?: Partial<{
    container: string
    message: string
    shapesContainer: string
  }>
}

export const PageLoading = ({ message, classNames }: TPageLoadingProps) => {
  return (
    <div
      id="page-loading"
      className={cn(
        'flex flex-col items-center justify-center h-screen w-screen',
        classNames?.container
      )}
    >
      <div className="relative bottom-5">
        <div
          className={cn('STYLE-animation-loading-shapes text-main-cl', classNames?.shapesContainer)}
        ></div>
        <p
          className={cn(
            'QUERY-loading-message text-main-cl w-max text-lg font-bold mt-6 absolute top-[calc(50%+50px)] left-1/2 -translate-x-1/2 -translate-y-1/2',
            classNames?.message
          )}
        >
          {message}
        </p>
      </div>
    </div>
  )
}

type TSectionLoadingProps = {} & Partial<{
  message: string
  classNames: Partial<{
    container: string
    message: string
    shapesContainer: string
  }>
}>

export const SectionLoading = ({ message, classNames }: TSectionLoadingProps) => {
  return (
    <div
      id="section-loading"
      className={cn('flex flex-col items-center justify-center', classNames?.container)}
    >
      <div className="relative bottom-5">
        <div
          className={cn('STYLE-animation-loading-shapes text-main-cl', classNames?.shapesContainer)}
        ></div>
        {message && (
          <p
            className={cn(
              'QUERY-loading-message text-main-cl w-max text-lg font-bold mt-6 absolute top-[calc(50%+50px)] left-1/2 -translate-x-1/2 -translate-y-1/2',
              classNames?.message
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
