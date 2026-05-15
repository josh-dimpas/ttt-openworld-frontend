import type { EventAggregator } from '#/core/EventAggregator/main'
import { useEffect, useRef } from 'react'

type AggregatorProps = {
  controller: EventAggregator
} & React.ComponentProps<'div'>

export function Aggregator({ controller, ...props }: AggregatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log('SETTING IT UP')
    if (canvasRef.current) {
      controller.setup({
        canvas: canvasRef.current,
      })

      console.log('STARTING')
      controller.start()
    }

    return () => {
      return controller.dismount()
    }
  }, [controller])

  return (
    <div
      {...props}
      className={`bg-black grow top-0 overflow-auto flex items-center justify-center`}
    >
      <canvas className="w-full h-full" ref={canvasRef} />
    </div>
  )
}
