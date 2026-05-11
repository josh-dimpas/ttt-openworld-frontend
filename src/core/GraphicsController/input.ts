import { proxy } from 'valtio'

import type { GraphicsController } from './main'
import { GraphicsControllerSubModule } from './submodule'

export class GraphicsInputController extends GraphicsControllerSubModule {
  #abortController = new AbortController()

  mouse = proxy({ x: 0, y: 0 })

  get mx() {
    const left = this.camera.canvasRect.left
    return this.mouse.x - left
  }

  get my() {
    const top = this.camera.canvasRect.top
    return this.mouse.y - top
  }

  set mx(v: number) {
    this.mouse.x = v
  }

  set my(v: number) {
    this.mouse.y = v
  }

  get gmx() {
    return this.camera.pxToGrid(this.mx) - this.camera.worldOffset.x
  }

  get gmy() {
    return this.camera.pxToGrid(this.my) - this.camera.worldOffset.y
  }

  constructor(gc: GraphicsController) {
    super(gc)
  }

  setup() {
    const p = this.parent
    const signal = this.#abortController.signal

    // Add event listeners to dom elements
    p.addEventListener('scroll', this.onScroll.bind(this), { signal })
    p.addEventListener('mousemove', this.onMouseMove.bind(this), { signal })
    p.addEventListener('mousedown', this.onMouseClick.bind(this), { signal })
    window.addEventListener('resize', this.onWindowResize.bind(this), {
      signal,
    })
  }

  onScroll() {
    this.gc.emit('scroll', this.camera.psx, this.camera.psy)
  }

  onWindowResize() {
    this.gc.emit('resize')
  }

  onMouseMove(e: MouseEvent) {
    this.mx = e.clientX
    this.my = e.clientY
    this.gc.emit('mousemove', this.mx, this.my)
  }

  onMouseClick(e: MouseEvent) {
    this.mx = e.clientX
    this.my = e.clientY
    this.gc.emit('mouseclick', this.mx, this.my)
  }

  dismount() {
    this.#abortController.abort()
  }
}
