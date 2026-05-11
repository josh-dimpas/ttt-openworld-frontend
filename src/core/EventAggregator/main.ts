import type { GameEvent } from '#/types/game'
import { EventEmitter } from '../EventEmitter'

export class EventAggregator extends EventEmitter {
  // @ts-expect-error initialized on component mount
  canvas: HTMLCanvasElement
  // @ts-expect-error initialized on component mount
  ctx: CanvasRenderingContext2D

  CELL_SIZE = 50

  #running = false
  #animationId: number | null = null
  #_render = this.#render.bind(this)

  #sources: GameEvent[] = []
  revealMap: [x: number, y: number][] = []

  get sources() {
    return this.#sources
  }

  set sources(data: GameEvent[]) {
    this.#sources = data
    this.aggregate()
  }

  aggregate() {
    this.revealMap = this.revealTiles(this.#sources)
  }

  revealTiles(objects: GameEvent[]) {
    const seen = new Set()
    const result: [number, number][] = []

    for (const { x, y, reveal_radius } of objects) {
      for (let dy = -reveal_radius; dy <= reveal_radius; dy++) {
        for (let dx = -reveal_radius; dx <= reveal_radius; dx++) {
          const tx = x + dx
          const ty = y + dy
          const key = `${tx},${ty}`

          if (!seen.has(key)) {
            seen.add(key)
            result.push([tx, ty])
          }
        }
      }
    }

    return result
  }

  get running() {
    return this.#running
  }

  get ready() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return this.canvas != null && this.ctx != null
  }

  start() {
    if (this.#running) return
    this.#running = true
    this.#animationId = requestAnimationFrame(this.#_render)
  }

  stop() {
    if (!this.#running) return
    this.#running = false
    if (this.#animationId !== null) {
      cancelAnimationFrame(this.#animationId)
      this.#animationId = null
    }
  }

  constructor() {
    super()
  }

  setup({ canvas }: { canvas: HTMLCanvasElement }) {
    this.#setCanvas(canvas)

    // this.input.setup()
    // this.config.setup()
    // this.camera.setup()
    // this.terrain.setup()

    this.emit('setup')
  }

  #setCanvas(c: HTMLCanvasElement) {
    this.canvas = c

    const ctx = c.getContext('2d')
    if (ctx) this.ctx = ctx
    else throw new Error('Failed to acquire canvas context')

    this.setCanvasDimensions()
  }

  setCanvasDimensions() {
    this.canvas.height = this.canvas.clientHeight
    this.canvas.width = this.canvas.clientWidth
  }

  dismount() {
    this.stop()

    // Dismount sub-modules
    this.emit('dismount')

    this.removeAllListeners()
  }

  #render() {
    if (!this.ready) return
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height

    this.emit('beforeRender')

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.#animationId = requestAnimationFrame(this.#_render)

    this.emit('render')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Perform all rendering here
  }
}
