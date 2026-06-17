import { useSimulatedActionStore } from '@/stores/ui/simulated-action.store'

export const SimulatedPointer = () => {
  const { isActive, x, y, opacity, scale } = useSimulatedActionStore((s) => s.pointer)

  if (!isActive) return null

  return (
    <div
      className="fixed z-9999 pointer-events-none"
      style={{
        left: x,
        top: y,
        opacity: opacity,
        transform: `translate(-50%, -50%) scale(${scale})`, // center the pointer slightly
        transition: 'left 1s ease-in-out, top 1s ease-in-out, opacity 0.3s ease, transform 0.2s ease',
      }}
    >
      <img 
        src="/images/tour-guide/pointer.svg" 
        alt="pointer" 
        className="w-12 h-12"
        style={{
          filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
        }}
      />
    </div>
  )
}
