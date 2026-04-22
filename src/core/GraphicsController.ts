import { EventEmitter } from "./EventEmitter";
import { GraphicsCameraController } from "./GraphicsController.Camera";
import { GraphicsConfigController } from "./GraphicsController.Config";
import { GraphicStatController } from "./GraphicsController.Stat";
import { GraphicsTerrainController } from "./GraphicsController.Terrain";

type GraphicsControllerEmits = {
    setup: [];
    render: [];
    beforeRender: [];
    dismount: [];
};

export class GraphicsController extends EventEmitter<GraphicsControllerEmits> {
    // @ts-expect-error initialized on component mount
    canvas: HTMLCanvasElement;
    // @ts-expect-error initialized on component mount
    ctx: CanvasRenderingContext2D;

    // @ts-expect-error initialized on component mount
    spacer: HTMLDivElement;
    // @ts-expect-error initialized on component mount
    parent: HTMLDivElement;

    stat: GraphicStatController;
    camera: GraphicsCameraController;
    terrain: GraphicsTerrainController;

    #running = false;
    #animationId: number | null = null;

    start() {
        if (this.#running) return;
        this.#running = true;
        this.#animationId = requestAnimationFrame(this.#render);
    }

    stop() {
        if (!this.#running) return;
        this.#running = false;
        if (this.#animationId !== null) {
            cancelAnimationFrame(this.#animationId);
            this.#animationId = null;
        }
    }

    #render() {
        if (!this.ready) return;

        this.emit("beforeRender");

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#animationId = requestAnimationFrame(this.#render);

        this.emit("render");
    }

    get running() {
        return this.#running;
    }

    get ready() {
        return this.canvas != null && this.ctx != null;
    }

    constructor() {
        super();
        this.stat = new GraphicStatController(this);
        this.camera = new GraphicsCameraController(this);
        this.terrain = new GraphicsTerrainController(this);
    }

    setup({
        canvas,
        spacer,
        parent,
    }: {
        canvas: HTMLCanvasElement;
        spacer: HTMLDivElement;
        parent: HTMLDivElement;
    }) {
        this.#setParent(parent);
        this.#setCanvas(canvas);
        this.#setSpacer(spacer);

        this.camera.setup();
        this.config.setup();
        this.stat.setup();
        this.terrain.setup();

        this.emit("setup");
    }

    #setSpacer(el: HTMLDivElement) {
        this.spacer = el;
    }

    #setParent(el: HTMLDivElement) {
        this.parent = el;
    }

    #setCanvas(c: HTMLCanvasElement) {
        this.canvas = c;

        const ctx = c.getContext("2d");
        if (ctx) this.ctx = ctx;
    }

    dismount() {
        this.stop();

        // Dismount sub-modules
        this.stat.dismount();
        this.camera.dismount();
        this.config.dismount();

        this.emit("dismount");

        this.removeAllListeners();
    }
}

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

    get state() {
        return this.gc.stat;
    }

    constructor(gc: GraphicsController) {
        this.gc = gc;
    }
}
