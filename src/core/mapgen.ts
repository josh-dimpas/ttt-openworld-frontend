import { i2c } from "../utils/number";

export class MapGen {
    seed: string;

    constructor(args: { seed: string }) {
        this.seed = args.seed;
    }

    generateChunk(x: number, y: number) {
        return { x, y };
    }

    generateCluster(cx: number, cy: number, radius: number = 1) {
        // Get amount of chunks from radius
        const clusterWidth = radius * 2 + 1;
        const chunkCount = clusterWidth ** 2;

        const clusterStart = { x: cx - radius, y: cy - radius };

        return Array(chunkCount)
            .fill(0)
            .map((_, i) => {
                const [dx, dy] = i2c(i, clusterWidth);
                return this.generateChunk(clusterStart.x + dx, clusterStart.y + dy);
            });
    }
}

export class Chunk {}
