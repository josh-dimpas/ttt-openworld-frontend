import { EventEmitter } from "./EventEmitter";
import { GraphicsCameraController } from "./GraphicsController.Camera";
import { GraphicStatController } from "./GraphicsController.Stat";

type GraphicsControllerEmits = {
    setup: [];
    frame: [];
    tick: [];
    dismount: [];
};

export class GraphicsController extends EventEmitter<GraphicsControllerEmits> {
    // @ts-expect-error initialized on component mount
    canvas: HTMLCanvasElement;
    // @ts-expect-error initialized on component mount
    ctx: CanvasRenderingContext2D;

    // @ts-expect-error initialized on component mount
    #spacer: HTMLDivElement;
    // @ts-expect-error initialized on component mount
    parent: HTMLDivElement;

    stat: GraphicStatController;
    camera: GraphicsCameraController;

    #running = false;
    #animationId: number | null = null;

    #tick = () => {
        this.#render();
        this.#animationId = requestAnimationFrame(this.#tick);
        this.emit("tick");
    };

    start() {
        if (this.#running) return;
        this.#running = true;
        this.#animationId = requestAnimationFrame(this.#tick);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.emit("frame");
    }

    get running() {
        return this.#running;
    }

    get px() {
        return this.parent.scrollLeft;
    }
    get py() {
        return this.parent.scrollTop;
    }

    get pw() {
        return this.parent.clientWidth;
    }

    get ph() {
        return this.parent.clientHeight;
    }

    get pmx() {
        return this.#spacer.clientWidth;
    }

    get pmy() {
        return this.#spacer.clientHeight;
    }

    get ready() {
        return this.canvas != null && this.ctx != null;
    }

    constructor() {
        super();
        this.stat = new GraphicStatController(this);
        this.camera = new GraphicsCameraController(this);
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
        console.log("setup");

        this.#setParent(parent);
        this.#setCanvas(canvas);
        this.#setSpacer(spacer);

        this.stat.setup();
        this.emit("setup");
    }

    #setSpacer(el: HTMLDivElement) {
        this.#spacer = el;
    }

    #setParent(el: HTMLDivElement) {
        this.parent = el;
        this.camera.bindViewPort(el);
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

        this.emit("dismount");

        this.removeAllListeners();
    }
}
