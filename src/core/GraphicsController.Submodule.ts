import type { GraphicsController } from "./GraphicsController";

export abstract class GraphicsControllerSubModule {
    gc: GraphicsController;

    get parent() {
        return this.gc.parent;
    }

    get spacer() {
        return this.gc.spacer;
    }

    get canvas() {
        return this.gc.canvas;
    }

    get ctx() {
        return this.gc.ctx;
    }

    get camera() {
        return this.gc.camera;
    }

    get terrain() {
        return this.gc.terrain;
    }

    get config() {
        return this.gc.config;
    }

    get input() {
        return this.gc.input;
    }

    get stat() {
        return this.gc.stat;
    }

    constructor(gc: GraphicsController) {
        this.gc = gc;
    }
}
