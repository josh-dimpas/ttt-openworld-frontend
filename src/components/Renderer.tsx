import React, { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'

import { gameStore } from '#/stores/game'
import { CursorIcon } from '@phosphor-icons/react/dist/ssr'
import { useElementSize } from '@reactuses/core'
import type { GraphicsController } from '../core/GraphicsController/main'
import { BackButton } from './BackButton'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

type RendererProps = {
  controller: GraphicsController

  onPut: (x: number, y: number) => void
  onHover: (x: number, y: number) => void
} & React.ComponentProps<'div'>

// The component for the custom renderer
export function Renderer({
  controller,

  onPut,
  onHover,

  className,
  ...props
}: RendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('SETTING IT UP')
    if (containerRef.current && canvasRef.current && spacerRef.current) {
      controller.setup({
        parent: containerRef.current,
        canvas: canvasRef.current,
        spacer: spacerRef.current,
      })

      console.log('STARTING')

      controller.start()
      controller.on('mouseclick', () => {
        const { gmx: x, gmy: y } = controller.input

        // Do no call onPut when not revealed
        if (!controller.config.isFilled(x, y)) return

        // Do not call when there is already a cell in it

        return onPut(x, y)
      })

      controller.on('mousemove', onHover)
    }

    return () => {
      console.log('DISMOUNTED')
      return controller.dismount()
    }
  }, [controller])

  return (
    <div
      {...props}
      ref={containerRef}
      className={`absolute bg-black top-0 h-screen w-screen overflow-auto flex items-center justify-center ${className}`}
    >
      <canvas className="absolute w-full h-full" ref={canvasRef} />
      <div
        ref={spacerRef}
        // className="relative bg-transparent border border-red-500"
        className="absolute bg-transparent"
        style={{ zIndex: 1 }}
      />

      <RendererStats
        controller={controller}
        spacerRef={spacerRef}
        canvasRef={canvasRef}
        containerRef={containerRef}
      />
      <RenderTurnStatus controller={controller} />
      <RenderOtherMouse controller={controller} />
      <RenderScores controller={controller} />
      <div className="top-0 left-0 fixed bg-white pr-4 pl-2 border-3">
        <BackButton text="Exit" />
      </div>
    </div>
  )
}

type RendererStatProps = {
  controller: GraphicsController
  spacerRef: React.RefObject<HTMLDivElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
} & React.ComponentProps<'div'>

function RendererStats({
  controller,
  spacerRef,
  containerRef,
}: RendererStatProps) {
  const [sw, sh] = useElementSize(spacerRef)
  const [w, h] = useElementSize(containerRef)

  return (
    <div className="top-0 right-0 z-10 fixed bg-neutral-300 opacity-40 hover:opacity-100 p-2 border-2 rounded-bl-xl text-xs">
      <div className="font-bold text-base">Renderer Stats</div>
      <RenderStatMouse controller={controller} />
      <RenderStatScroll controller={controller} />
      <div>
        Container: {w} x {h}
      </div>
      <div>
        Spacer: {sw} x {sh}{' '}
      </div>
      <hr className="pb-1" />
      <div className="space-x-2">
        <Checkbox
          id="show-guidelines"
          onClick={() => controller.terrain.toggleShowGuidelines()}
        />
        <Label htmlFor="show-guidelines" className="text-xs">
          Show Noise Guidelines
        </Label>
      </div>
    </div>
  )
}

function RenderOtherMouse({ controller }: { controller: GraphicsController }) {
  const other = useSnapshot(controller.input.mouseOther)

  // eslint-disable-next-line
  if (!controller.camera.canvas) return <div></div>

  const { left: l, top: t } = controller.camera.canvasRect

  const ownOx = controller.camera.wox
  const ownOy = controller.camera.woy
  const CELL_SIZE = controller.camera.CELL_SIZE

  const ox = (other.ox - ownOx) * CELL_SIZE
  const oy = (other.oy - ownOy) * CELL_SIZE

  const left = other.x + l - ox
  const top = other.y + t - oy

  return (
    <div
      style={{ left, top }}
      className="0 fixed bg-transparent  border-black border-double transition-all rounded-none h-min font-black text-xl"
    >
      <div className="relative">
        <CursorIcon
          className="absolute top-0 left-0 text-cyan-950"
          weight="fill"
          size={12}
          z={50}
        />
        <CursorIcon weight="fill" color="cyan" size={13} z={100} />
        <div className="bg-cyan-700 text-cyan-100 border-2 px-1 py-0.5 rounded-[5px] translate-x-2 text-sm border-cyan-600">
          {other.name}
        </div>
      </div>
    </div>
  )
}

function RenderScores({ controller }: { controller: GraphicsController }) {
  const scores = useSnapshot(controller.config.scores)

  return (
    <div className="left-0 fixed bg-white px-4 py-2 border-3 border-black border-double rounded-none h-min font-black text-xl">
      <div>Your Score: {scores.own}</div>
      <div>Other Score: {scores.other}</div>
    </div>
  )
}

function RenderTurnStatus(_: { controller: GraphicsController }) {
  const game = useSnapshot(gameStore)
  const canput = game.game?.can_put ?? false

  return (
    <div className="top-0 fixed bg-white px-4 py-2 border-3 border-black border-double rounded-none font-black text-red-500 text-xl">
      <div className={canput ? 'text-green-500' : 'text-red-500'}>
        {game.game?.can_put ? 'YOUR TURN' : 'NOT YOUR TURN'}
      </div>
      <div className="font-black text-black text-6xl text-center">
        {game.game?.state.turn === 1 ? 'O' : 'X'}
      </div>
    </div>
  )
}

function RenderStatMouse({ controller }: { controller: GraphicsController }) {
  useSnapshot(controller.input.mouse)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!controller.camera.canvas) return <div>Mouse: 0, 0</div>

  return (
    <div>
      Mouse:
      <span className="font-mono">
        {controller.input.mx}, {controller.input.my} ({controller.input.gmx},{' '}
        {controller.input.gmy})
      </span>
    </div>
  )
}

function RenderStatScroll({ controller }: { controller: GraphicsController }) {
  const scroll = useSnapshot(controller.camera.scroll)
  const offset = useSnapshot(controller.camera.worldOffset)

  return (
    <div>
      Scroll:
      <span className="font-mono">
        {scroll.x}, {scroll.y}
      </span>{' '}
      ({offset.x}, {offset.y})
    </div>
  )
}
