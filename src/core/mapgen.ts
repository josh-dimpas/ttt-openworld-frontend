import { i2c } from "../utils/number";

export class MapGen {
    seed: string;

    constructor(args: { seed: string }) {
        this.seed = args.seed;
    }

    generate_chunk(x: number, y: number) {
        return { x, y };
    }

    generate_chunk_cluster(cx: number, cy: number, radius: number = 1) {
        // Get amount of chunks from radius
        const cluster_width = radius * 2 + 1;
        const chunk_count = cluster_width ** 2;

        const cluster_start = { x: cx - radius, y: cy - radius };

        return Array(chunk_count)
            .fill(0)
            .map((_, i) => {
                const [dx, dy] = i2c(i, cluster_width);
                return this.generate_chunk(
                    cluster_start.x + dx,
                    cluster_start.y + dy,
                );
            });
    }
}

export class Chunk {

}
