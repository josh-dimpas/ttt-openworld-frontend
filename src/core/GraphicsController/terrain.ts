import { gameStore } from '@/stores/game'
import { m32 } from '@/utils/mullberry32'

import { c2i, dot, fade, lerp } from '../../utils/number'
import type { GraphicsController } from './main'
import { GraphicsControllerSubModule } from './submodule'

export class GraphicsTerrainController extends GraphicsControllerSubModule {
  #render = this.render.bind(this)

  cellSize = this.camera.CELL_SIZE
  delta = 0

  map: [number, number][] = []

  alphaMapCache: Map<string, number> = new Map()
  imageMapCache: Map<number, ImageData> = new Map()
  randomizer = () => Math.random()

  terrainMapping: Record<number, [number, number, number]> = {
    50: [8, 51, 120], // Deep Ocean
    100: [17, 111, 189], // Shallow Ocean,
    120: [74, 231, 255], // Shore
    140: [245, 212, 122], // Sand
    180: [9, 224, 88], // Grass
    200: [48, 48, 48], // Rocky Mountain
    210: [99, 99, 99], // Tundra
    256: [250, 250, 250], // Mountain Peaks
  }

  showGuideLines = false

  #terrainMapKeys = Object.keys(this.terrainMapping).map(Number)
  #terrainMapValue = Object.values(this.terrainMapping)

  get gridX() {
    return ~~(this.camera.sx / this.cellSize)
  }

  get gridY() {
    return ~~(this.camera.sy / this.cellSize)
  }

  get maxGridX() {
    return ~~(this.camera.pmx / this.cellSize)
  }

  get maxGridY() {
    return ~~(this.camera.pmy / this.cellSize)
  }

  get gridBounds(): [l: number, t: number, r: number, b: number] {
    const cellSize = this.cellSize

    const [cl, ct, cr, cb] = this.camera.boundsPixel
    const [pw, ph] = this.camera.viewportSize

    // Get nearest grid position to render from viewportBounds
    const nearX = 0 - (cl % cellSize)
    const nearY = 0 - (ct % cellSize)
    const farX = pw - (cr % cellSize)
    const farY = ph - (cb % cellSize)

    return [nearX, nearY, farX, farY]
  }

  get gridSize(): [columns: number, rows: number] {
    const cellSize = this.cellSize
    const [l, t, r, b] = this.gridBounds

    const columns = ~~((r - l) / cellSize) + 2
    const rows = ~~((b - t) / cellSize) + 2

    return [columns, rows]
  }

  constructor(gc: GraphicsController) {
    super(gc)
    this.randomizer = m32(gameStore.game!.config.seed)
  }

  setup() {
    // Start listening for frame updates
    this.gc.on('render', this.#render)

    this.map = Array((this.maxGridX + 2) ** 2)
      .fill(0)
      .map((_) => {
        const r = this.randomizer() * 2 * Math.PI
        return [Math.cos(r), Math.sin(r)]
      })
  }

  render() {
    const { cellSize, ctx } = this
    const [pw, ph] = this.camera.viewportSize

    const [l, t] = this.gridBounds

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, pw, ph)

    this.renderGrid()
    return

  }

  renderGrid() {
    const { ctx } = this

    // Get offsets from camera

    const cols = this.camera.wy
    const rows = this.camera.wx

    const [pw, ph] = this.camera.viewportSize
    const halfCellSize = this.cellSize / 2

    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'

    // cols
    for (let i = 0; i < rows; i++) {
      const x = i * this.cellSize
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ph)
    }

    // rows
    for (let i = 0; i < cols; i++) {
      const y = i * this.cellSize
      ctx.moveTo(0, y)
      ctx.lineTo(pw, y)
    }

    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.fillStyle = 'black'
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = j - this.camera.wox
        const y = i - this.camera.woy

        const sx = j * this.cellSize
        const sy = i * this.cellSize

        const cx = sx + halfCellSize
        const cy = sy + halfCellSize

        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // ctx.strokeText(`${x}, ${y}`, cx, cy)

        const isFilled = !this.config.isFilled(x, y)
        if (isFilled) {
          ctx.fillRect(sx, sy, this.cellSize, this.cellSize)
        }

        const data = this.config.getData(x, y)
        if (data) {
          ctx.font = 'bold 60px Arial'
          ctx.fillText(`${data === 1 ? 'X' : 'O'}`, cx, cy)
          // ctx.fillText(`${data}`, cx, cy)
        }
      }
    }
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    const ownStrikes = this.config.ownStrikes

    for (const s of ownStrikes) {
      const [start, _, end] = s.cells

      ctx.lineWidth = 20
      ctx.strokeStyle = 'green'
      ctx.lineCap = 'round'
      const [sx, sy] = this.camera.coordToGridOffsetted(start.x, start.y)
      const [ex, ey] = this.camera.coordToGridOffsetted(end.x, end.y)

      ctx.moveTo(sx + halfCellSize, sy + halfCellSize)
      ctx.lineTo(ex + halfCellSize, ey + halfCellSize)
    }

    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    const otherStrikes = this.config.otherStrikes

    for (const s of otherStrikes) {
      const [start, _, end] = s.cells

      ctx.lineWidth = 20
      ctx.strokeStyle = 'red'
      ctx.lineCap = 'round'
      const [sx, sy] = this.camera.coordToGridOffsetted(start.x, start.y)
      const [ex, ey] = this.camera.coordToGridOffsetted(end.x, end.y)

      ctx.moveTo(sx + halfCellSize, sy + halfCellSize)
      ctx.lineTo(ex + halfCellSize, ey + halfCellSize)
    }

    ctx.stroke()
    ctx.closePath()
  }

  renderPerlin(x: number, y: number, index: number) {
    const vectors = this.getVectorCornersAtIndex(index)

    // Get coordinates from 'x' and 'y'
    const halfCellSize = this.cellSize / 2
    const cx = x + halfCellSize
    const cy = y + halfCellSize

    const ctx = this.ctx
    // const [vx, vy] = this.map[index]

    if (this.showGuideLines) {
      const [_x, _y] = this.camera.getGridCoordsWorld(cx, cy)

      ctx.textAlign = 'center'
      ctx.strokeText(`${_x}, ${_y}`, cx, cy)

      ctx.moveTo(x, y)
      // ctx.lineTo(x + vx * halfCellSize, y + vy * halfCellSize)
      ctx.stroke()
    }

    return

  }

  renderPerlinPixel(
    x: number, // relative to its own grid
    y: number,
    [tl, tr, bl, br]: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
  ): number {
    // const key = `${gx}.${gy}.${x}.${y}`;
    // let stored = this.alphaMapCache.get(key);

    // if (!stored) {
    const tx = x / this.cellSize
    const ty = y / this.cellSize

    const u = fade(tx)
    const v = fade(ty)

    const delta = this.delta

    const dot_0 = dot(tl[0] + delta, tl[1] + delta, tx, -ty)
    const dot_1 = dot(tr[0] + delta, tr[1] + delta, tx - 1, -ty)
    const dot_2 = dot(bl[0] + delta, bl[1] + delta, tx, 1 - ty)
    const dot_3 = dot(br[0] + delta, br[1] + delta, tx - 1, 1 - ty)

    const nx0 = lerp(dot_0, dot_2, v)
    const nx1 = lerp(dot_1, dot_3, v)

    const alpha = lerp(nx0, nx1, u)
    const beta = (2 * alpha) / (1 + Math.abs(alpha))
    const alphaN = ~~(((beta + 1) / 2) * 255)

    return alphaN
  }

  getVectorCornersAtViewport(vx: number, vy: number) {
    const [vl, vt] = this.camera.boundsPixel
    return this.getVectorCornersAt(vl + vx, vt + vy)
  }

  getVectorCornersAt(
    gx: number,
    gy: number,
  ): [[number, number], [number, number], [number, number], [number, number]] {
    const x = ~~(gx / this.cellSize)
    const y = ~~(gy / this.cellSize)

    const tlIndex = c2i(x, y, this.maxGridX)

    return [
      this.map[tlIndex],
      this.map[tlIndex + 1],
      this.map[tlIndex + this.maxGridX],
      this.map[tlIndex + this.maxGridX + 1],
    ]
  }

  getVectorCornersAtIndex(
    index: number,
  ): [[number, number], [number, number], [number, number], [number, number]] {
    const w = this.maxGridX
    const y = ~~(index / w)

    const tl = index + y
    const tr = tl + 1
    const bl = tr + w
    const br = bl + 1

    return [this.map[tl], this.map[tr], this.map[bl], this.map[br]]
  }

  getGridIndexAtViewport(x: number, y: number) {
    // Get current viewport bounds
    const [vl, vt] = this.camera.boundsPixel

    // Get relative position from viewport bounds
    const rx = vl + x
    const ry = vt + y

    return this.getGridIndexAt(rx, ry)
  }

  getGridIndexAt(x: number, y: number): number {
    const xOffset = ~~(x / this.cellSize)
    const yOffset = ~~(y / this.cellSize)

    return c2i(xOffset, yOffset, this.maxGridX)
  }

  getTerrainMap(value: number): [number, number, number] {
    let index = 0

    while (this.#terrainMapKeys[index] < value) {
      index++
    }

    return this.#terrainMapValue[index]
  }

  toggleShowGuidelines() {
    this.showGuideLines = !this.showGuideLines
  }
}
