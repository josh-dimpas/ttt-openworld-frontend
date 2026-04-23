import { gameStore } from "@/stores/game";
import { m32 } from "@/utils/mullberry32";

import { c2i, dot, fade, i2c, lerp } from "../../utils/number";
import { type GraphicsController } from "./main";
import { GraphicsControllerSubModule } from "./submodule";

export class GraphicsTerrainController extends GraphicsControllerSubModule {
    #render = this.render.bind(this);

    cellSize = 200;
    delta = 0;

    map: [number, number][] = [];

    alphaMapCache: Map<string, number> = new Map();
    imageMapCache: Map<number, ImageData> = new Map();
    randomizer = () => Math.random();

    terrainMapping: Record<number, [number, number, number]> = {
        50: [8, 51, 120], // Deep Ocean
        100: [17, 111, 189], // Shallow Ocean,
        120: [74, 231, 255], // Shore
        140: [245, 212, 122], // Sand
        180: [9, 224, 88], // Grass
        200: [48, 48, 48], // Rocky Mountain
        210: [99, 99, 99], // Tundra
        256: [250, 250, 250], // Mountain Peaks
    };

    showGuideLines = false;

    #terrainMapKeys = Object.keys(this.terrainMapping).map(Number);
    #terrainMapValue = Object.values(this.terrainMapping);

    get gridX() {
        return ~~(this.camera.x / this.cellSize);
    }

    get gridY() {
        return ~~(this.camera.y / this.cellSize);
    }

    get maxGridX() {
        return ~~(this.camera.pmx / this.cellSize);
    }

    get maxGridY() {
        return ~~(this.camera.pmy / this.cellSize);
    }

    get gridBounds(): [l: number, t: number, r: number, b: number] {
        const cellSize = this.cellSize;

        const [cl, ct, cr, cb] = this.camera.viewportBounds;
        const [pw, ph] = this.camera.viewportSize;

        // Get nearest grid position to render from viewportBounds
        const nearX = 0 - (cl % cellSize);
        const nearY = 0 - (ct % cellSize);
        const farX = pw - (cr % cellSize);
        const farY = ph - (cb % cellSize);

        return [nearX, nearY, farX, farY];
    }

    get gridSize(): [columns: number, rows: number] {
        const cellSize = this.cellSize;
        const [l, t, r, b] = this.gridBounds;

        const columns = ~~((r - l) / cellSize) + 2;
        const rows = ~~((b - t) / cellSize) + 2;

        return [columns, rows];
    }

    constructor(gc: GraphicsController) {
        super(gc);
        this.randomizer = m32(gameStore.game?.config.seed ?? "seed");
    }

    setup() {
        // Start listening for frame updates
        this.gc.on("render", this.#render);

        this.map = Array((this.maxGridX + 2) ** 2)
            .fill(0)
            .map((_) => {
                const r = this.randomizer() * 2 * Math.PI;
                return [Math.cos(r), Math.sin(r)];
            });
    }

    render() {
        const { cellSize, ctx } = this;

        const [pw, ph] = this.camera.viewportSize;
        const [l, t] = this.gridBounds;

        const [columns, rows] = this.gridSize;
        const grids = columns * rows;

        // this.delta = ((Date.now() % 64) / 128) * Math.PI;

        if (this.showGuideLines) {
            ctx.beginPath();

            // Draw columns
            for (let i = 0; i < columns; i++) {
                const x = l + i * cellSize;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, ph);
            }

            // Draw Rows
            for (let i = 0; i < rows; i++) {
                const y = t + i * cellSize;
                ctx.moveTo(0, y);
                ctx.lineTo(pw, y);
            }

            ctx.stroke();
            ctx.closePath();
        }

        // Draw Individual Grid
        for (let i = 0; i < grids; i++) {
            const [ix, iy] = i2c(i, columns);

            const x = l + ix * cellSize;
            const y = t + iy * cellSize;

            const rIndex = this.getGridIndexAtViewport(x, y);

            this.renderPerlin(x, y, rIndex);
        }
    }

    renderGrid(x: number, y: number, index: number) {
        this.renderPerlin(x, y, index);
    }

    renderPerlin(x: number, y: number, index: number) {
        const vectors = this.getVectorCornersAtIndex(index);

        // Get coordinates from 'x' and 'y'
        const halfCellSize = this.cellSize / 2;
        const cx = x + halfCellSize;
        const cy = y + halfCellSize;

        const ctx = this.ctx;

        const [vx, vy] = this.map[index];

        if (this.showGuideLines) {
            ctx.textAlign = "center";
            ctx.strokeText(`${index}`, cx, cy);

            ctx.moveTo(x, y);
            ctx.lineTo(x + vx * halfCellSize, y + vy * halfCellSize);
            ctx.stroke();
        }

        // Get # of pixels
        const cellArea = this.cellSize ** 2;
        const resolution = 1; // Smaller the better

        const buffer = ctx.createImageData(this.cellSize, this.cellSize);

        for (let i = 0; i < cellArea; i += resolution) {
            const [px, py] = i2c(i, this.cellSize);
            const alpha = this.renderPerlinPixel(px, py, vectors);

            const terrain = this.getTerrainMap(alpha);

            const bi = i * 4;
            buffer.data[bi] = terrain[0];
            buffer.data[bi + 1] = terrain[1];
            buffer.data[bi + 2] = terrain[2];
            buffer.data[bi + 3] = 255;
        }

        ctx.putImageData(buffer, x, y);
    }

    renderPerlinPixel(
        x: number, // relative to its own grid
        y: number,
        [tl, tr, bl, br]: [[number, number], [number, number], [number, number], [number, number]],
    ): number {
        // const key = `${gx}.${gy}.${x}.${y}`;
        // let stored = this.alphaMapCache.get(key);

        // if (!stored) {
        const tx = x / this.cellSize;
        const ty = y / this.cellSize;

        const u = fade(tx);
        const v = fade(ty);

        const delta = this.delta;

        const dot_0 = dot(tl[0] + delta, tl[1] + delta, tx, -ty);
        const dot_1 = dot(tr[0] + delta, tr[1] + delta, tx - 1, -ty);
        const dot_2 = dot(bl[0] + delta, bl[1] + delta, tx, 1 - ty);
        const dot_3 = dot(br[0] + delta, br[1] + delta, tx - 1, 1 - ty);

        const nx0 = lerp(dot_0, dot_2, v);
        const nx1 = lerp(dot_1, dot_3, v);

        const alpha = lerp(nx0, nx1, u);
        const beta = (2 * alpha) / (1 + Math.abs(alpha));
        const alphaN = ~~(((beta + 1) / 2) * 255);

        return alphaN;
    }

    getVectorCornersAtViewport(vx: number, vy: number) {
        const [vl, vt] = this.camera.viewportBounds;
        return this.getVectorCornersAt(vl + vx, vt + vy);
    }

    getVectorCornersAt(
        gx: number,
        gy: number,
    ): [[number, number], [number, number], [number, number], [number, number]] {
        const x = ~~(gx / this.cellSize);
        const y = ~~(gy / this.cellSize);

        const tlIndex = c2i(x, y, this.maxGridX);

        return [
            this.map[tlIndex],
            this.map[tlIndex + 1],
            this.map[tlIndex + this.maxGridX],
            this.map[tlIndex + this.maxGridX + 1],
        ];
    }

    getVectorCornersAtIndex(
        index: number,
    ): [[number, number], [number, number], [number, number], [number, number]] {
        const w = this.maxGridX;
        const y = ~~(index / w);

        const tl = index + y;
        const tr = tl + 1;
        const bl = tr + w;
        const br = bl + 1;

        return [this.map[tl], this.map[tr], this.map[bl], this.map[br]];
    }

    getGridIndexAtViewport(x: number, y: number) {
        // Get current viewport bounds
        const [vl, vt] = this.camera.viewportBounds;

        // Get relative position from viewport bounds
        const rx = vl + x;
        const ry = vt + y;

        return this.getGridIndexAt(rx, ry);
    }

    getGridIndexAt(x: number, y: number): number {
        const xOffset = ~~(x / this.cellSize);
        const yOffset = ~~(y / this.cellSize);

        return c2i(xOffset, yOffset, this.maxGridX);
    }

    getTerrainMap(value: number): [number, number, number] {
        let index = 0;

        while (this.#terrainMapKeys[index] < value) {
            index++;
        }

        return this.#terrainMapValue[index];
    }

    toggleShowGuidelines() {
        this.showGuideLines = !this.showGuideLines;
    }
}
