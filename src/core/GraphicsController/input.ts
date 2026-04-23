import { proxy } from "valtio";

import type { GraphicsController } from "./main";
import { GraphicsControllerSubModule } from "./submodule";

export class GraphicsInputController extends GraphicsControllerSubModule {
    #abortController = new AbortController();

    mouse = proxy({ x: 0, y: 0 });

    get mx() {
        return this.mouse.x;
    }

    get my() {
        return this.mouse.y;
    }

    set mx(v: number) {
        this.mouse.x = v;
    }

    set my(v: number) {
        this.mouse.y = v;
    }

    constructor(gc: GraphicsController) {
        super(gc);
    }

    setup() {
        const p = this.parent;
        const signal = this.#abortController.signal;

        // Add event listeners to dom elements
        p.addEventListener("scroll", this.onScroll.bind(this), { signal });
        p.addEventListener("mousemove", this.onMouseMove.bind(this), { signal });
        p.addEventListener("mousedown", this.onMouseClick.bind(this), { signal });
        window.addEventListener("resize", this.onWindowResize.bind(this), { signal });
    }

    onScroll() {
        this.gc.emit("scroll", this.camera.psx, this.camera.psy);
    }

    onWindowResize() {
        this.gc.emit("resize");
    }

    onMouseMove(e: MouseEvent) {
        this.mx = e.clientX;
        this.my = e.clientY;
        this.gc.emit("mousemove", this.mx, this.my);
    }

    onMouseClick(e: MouseEvent) {
        this.mx = e.clientX;
        this.my = e.clientY;
        this.gc.emit("mouseclick", this.mx, this.my);
    }

    dismount() {
        this.#abortController.abort();
    }
}
