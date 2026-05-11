import { EventEmitter } from '../EventEmitter'
import { GraphicsCameraController } from './camera'
import { GraphicsConfigController } from './config'
import { GraphicsInputController } from './input'
import { GraphicsTerrainController } from './terrain'

type GraphicsControllerEmits = {
  setup: []
  render: []
  beforeRender: []
  dismount: []

  resize: []
  scroll: [x: number, y: number]
  mousemove: [x: number, y: number]
  mouseclick: [x: number, y: number]
}

export class GraphicsController extends EventEmitter<GraphicsControllerEmits> {
  // @ts-expect-error initialized on component mount
  canvas: HTMLCanvasElement
  // @ts-expect-error initialized on component mount
  ctx: CanvasRenderingContext2D

  // @ts-expect-error initialized on component mount
  spacer: HTMLDivElement
  // @ts-expect-error initialized on component mount
  parent: HTMLDivElement

  camera: GraphicsCameraController
  terrain: GraphicsTerrainController
  config: GraphicsConfigController
  input: GraphicsInputController

  #running = false
  #animationId: number | null = null
  #_render = this.#render.bind(this)

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

  #render() {
    if (!this.ready) return

    this.emit('beforeRender')

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.#animationId = requestAnimationFrame(this.#_render)

    this.emit('render')
  }

  constructor() {
    super()
    this.config = new GraphicsConfigController(this)
    this.camera = new GraphicsCameraController(this)
    this.terrain = new GraphicsTerrainController(this)
    this.input = new GraphicsInputController(this)
  }

  setup({
    canvas,
    spacer,
    parent,
  }: {
    canvas: HTMLCanvasElement
    spacer: HTMLDivElement
    parent: HTMLDivElement
  }) {
    this.#setCanvas(canvas)
    this.#setParent(parent)
    this.#setSpacer(spacer)

    this.input.setup()
    this.config.setup()
    this.camera.setup()
    this.terrain.setup()

    this.emit('setup')
  }

  #setSpacer(el: HTMLDivElement) {
    this.spacer = el
  }

  #setParent(el: HTMLDivElement) {
    this.parent = el
  }

  #setCanvas(c: HTMLCanvasElement) {
    this.canvas = c

    const ctx = c.getContext('2d')
    if (ctx) this.ctx = ctx
    else throw new Error('Failed to acquire canvas context')
  }

  dismount() {
    this.stop()

    // Dismount sub-modules
    this.camera.dismount()
    this.config.dismount()

    this.emit('dismount')

    this.removeAllListeners()
  }
}
