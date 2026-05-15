import type { GameEvent } from '#/types/game'
import { i2c } from '#/utils/number'
import { EventEmitter } from '../EventEmitter'

export class EventAggregator extends EventEmitter {
  // @ts-expect-error initialized on component mount
  canvas: HTMLCanvasElement
  // @ts-expect-error initialized on component mount
  ctx: CanvasRenderingContext2D

  CELL_SIZE = 20

  #running = false
  #animationId: number | null = null
  #_render = this.#render.bind(this)

  #sources: GameEvent[] = []
  #pieces: Map<string, GameEvent> = new Map()
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
    this.#pieces.clear()

    for (const ev of objects) {
      const { x, y, reveal_radius } = ev
      const minx = x - reveal_radius
      const miny = y - reveal_radius

      const width = reveal_radius * 2 + 1
      const total = width ** 2

      const key = this.createHash(x, y)
      this.#pieces.set(key, ev)

      Array(total)
        .fill(0)
        .forEach((_, i) => {
          const [_x, _y] = i2c(i, width)
          const tx = minx + _x
          const ty = miny + _y

          const cellKey = this.createHash(tx, ty)
          if (seen.has(cellKey)) return
          seen.add(cellKey)
          result.push([tx, ty])
        })
    }

    return result
  }

  createHash(x: number, y: number) {
    return `${x},${y}`
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

    this.emit('beforeRender')

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.#animationId = requestAnimationFrame(this.#_render)

    this.emit('render')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.renderMap()
  }

  renderMap() {
    const { ctx } = this

    const fullCell = this.CELL_SIZE
    const halfCell = fullCell / 2

    ctx.font = `${halfCell}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (const [_x, _y] of this.revealMap) {
      const [x, y] = this.computeCoordinate(_x, _y)

      ctx.fillStyle = 'white'
      ctx.fillRect(x, y, fullCell - 1, fullCell - 0.5)

      ctx.fillStyle = 'black'
      const ev = this.#pieces.get(this.createHash(_x, _y))
      if (ev && ev.event_type == 'put') {
        this.ctx.fillText(
          ev.piece_type === 'O' ? 'X' : 'O',
          x + halfCell,
          y + halfCell,
        )
      }
    }

    ctx.fill()
  }

  computeCoordinate(x: number, y: number) {
    const fullCell = this.CELL_SIZE
    const halfCell = fullCell / 2

    const w = this.canvas.width
    const h = this.canvas.height

    // offset the center
    const cx = w / 2 - fullCell
    const cy = h / 2 - fullCell

    const ox = cx + x * fullCell - halfCell
    const oy = cy + y * fullCell - halfCell

    return [ox, oy]
  }
}
