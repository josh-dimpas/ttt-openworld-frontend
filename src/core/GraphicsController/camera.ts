import { proxy } from 'valtio'

import { fract } from '#/utils/number'
import type { GraphicsController } from './main'
import { GraphicsControllerSubModule } from './submodule'

export class GraphicsCameraController extends GraphicsControllerSubModule {
  get CELL_SIZE() {
    return this.config.CELL_SIZE
  }

  get HALF_CELL() {
    return this.config.CELL_SIZE / 2
  }

  // @ts-expect-error Initialized on component mount
  viewport: HTMLDivElement

  scroll = proxy({ x: 0, y: 0 })
  center = proxy({ x: 1.5, y: 1.5 }) // Determines the camera 'center' (should be duplex bind to scroll)

  world = proxy({ w: 7, h: 7 }) // Size of the world, controlled by the reveal size dimensions

  // Determines the world 'center'. If 0,0 then there will never be negative (-) coordinates
  // Should be loosely bind to world since offset will change based on the size of the world
  worldOffset = proxy({ x: 1, y: 1 })

  /*
        Scroll Values
        sx, sy = Virtual Scroll X, Y (Internal Copy)
        psx, psy = Actual Scroll X, Y (Dom Value)

        Both needs to be separate data in the memory
        in order to have two-way control 
            - actual set virtual for camera (viewport)
            - virtual set actual for non-player scrolls (transitions)
    */

  get sx() {
    return this.scroll.x
  }

  get sy() {
    return this.scroll.y
  }

  set sx(value: number) {
    this.scroll.x = value

    if (this.sx != this.psx) this.parent.scrollBy({ left: value })
  }

  set sy(value: number) {
    this.scroll.y = value
    if (this.sy != this.psy) this.parent.scrollBy({ top: value })
  }

  get psx() {
    return this.parent.scrollLeft
  }
  get psy() {
    return this.parent.scrollTop
  }

  // Parent Dimensions

  get pw() {
    return this.canvas.clientWidth
  }

  get ph() {
    return this.canvas.clientHeight
  }

  get pcw() {
    return this.pw / 2
  }

  get pch() {
    return this.ph / 2
  }

  // Canvas ClientRect
  get canvasRect() {
    return this.canvas.getBoundingClientRect()
  }

  // Spacer Dimensions (Parent-max-x/y scroll values)
  get pmx() {
    return this.spacer.clientWidth
  }

  get pmy() {
    return this.spacer.clientHeight
  }

  // Center Camera (Controls relativity and maintains view when spacer expands)
  get cx() {
    return this.center.x
  }

  get cy() {
    return this.center.y
  }

  get wx() {
    return this.world.w
  }

  get wy() {
    return this.world.h
  }

  get wox() {
    return this.worldOffset.x
  }

  get woy() {
    return this.worldOffset.y
  }

  get cellsPerRow() {
    return this.pxToGrid(this.pmx)
  }

  get cellsPerColumn() {
    return this.pxToGrid(this.pmy)
  }

  get cellsPerRowScreen() {
    return this.pxToGrid(this.pw) + 1
  }

  get cellsPerColumnScreen() {
    return this.pxToGrid(this.ph) + 1
  }

  // Map Bounds (By Pixel)
  get boundsPixel(): [l: number, t: number, r: number, b: number] {
    return [this.sx, this.sy, this.sx + this.pw, this.sy + this.ph]
  }

  get boundsOffsetPixel() {
    const { x: _x, y: _y } = this.center
    const cxR = fract(_x)
    const cyR = fract(_y)

    const cpr = ~~(this.cellsPerRowScreen / 2)
    const cpc = ~~(this.cellsPerColumnScreen / 2)

    const ow = (cpr + cxR) * this.CELL_SIZE
    const oh = (cpc + cyR) * this.CELL_SIZE

    const leftOffset = ow - this.pcw
    const topOffset = oh - this.pch

    // return [this.sx % this.CELL_SIZE, this.sy % this.CELL_SIZE]
    return [leftOffset, topOffset]
  }

  // Map Bounds (By Grid) (contains +1 for the padding)
  get boundsGrid() {
    const [ox, oy] = this.boundsOffsetPixel

    const startX = this.sx - ox
    const startY = this.sy - oy

    const t = this.pxToGrid(startY)
    const l = this.pxToGrid(startX)
    const r = l + this.cellsPerRowScreen
    const b = t + this.cellsPerColumn

    return [l, t, r, b]
  }

  get boundsWorld() {
    const [l, t, r, b] = this.boundsGrid
    const { x: ox, y: oy } = this.worldOffset

    return [l - ox, t - oy, r - ox, b - oy]
  }

  get viewportSize(): [width: number, height: number] {
    return [this.pw, this.ph]
  }

  constructor(gc: GraphicsController) {
    super(gc)
  }

  setup() {
    const { parent } = this
    this.viewport = parent

    this.handleResize()

    this.gc.on('resize', this.handleResize.bind(this))
    this.gc.on('scroll', this.onScroll.bind(this))
  }

  handleResize() {
    this.syncWorldSizeToScrollable()
  }

  onScroll() {
    this.sx = this.psx
    this.sy = this.psy
  }

  syncWorldSizeToScrollable() {
    const { h, w } = this.world
    const fh = h * this.CELL_SIZE
    const fw = w * this.CELL_SIZE

    this.canvas.style.height = fh + 'px'
    this.canvas.style.width = fw + 'px'

    this.canvas.height = fh
    this.canvas.width = fw
  }

  dismount() {}

  // Util Methods
  getGridCoords(x: number, y: number) {
    const [l, t] = this.boundsGrid
    const [gx, gy] = this.pxToGrid([x, y])

    return [l + gx, t + gy]
  }

  getGridCoordsWorld(x: number, y: number) {
    const [l, t] = this.getGridCoords(x, y)
    return [l - this.wox, t - this.wox]
  }

  pxToGrid(values: number[]): number[]
  pxToGrid(value: number): number
  pxToGrid(value: number | number[]) {
    if (Array.isArray(value)) return value.map((v) => ~~(v / this.CELL_SIZE))
    return ~~(value / this.CELL_SIZE)
  }

  coordToGridOffsetted(x: number, y: number) {
    return [
      (x + this.worldOffset.x) * this.CELL_SIZE,
      (y + this.worldOffset.y) * this.CELL_SIZE,
    ]
  }
}

// class revealbuffermanager {
//   game: gameschema

//   constructor(game: gameschema) {
//     this.game = game
//   }
// }
