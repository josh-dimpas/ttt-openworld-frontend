import type { GraphicsController } from "./GraphicsController";
import { GraphicsControllerSubModule } from "./GraphicsController.Submodule";

export class GraphicsInputController extends GraphicsControllerSubModule {
    #abortController = new AbortController();

    constructor(gc: GraphicsController) {
        super(gc);
    }

    setup() {
        const p = this.parent;
        const signal = this.#abortController.signal;

        // Add event listeners to dom elements
        p.addEventListener("scroll", this.onScroll.bind(this), { signal });
        window.addEventListener("resize", this.onWindowResize.bind(this), { signal });
    }

    onScroll() {
        this.gc.emit("scroll", this.camera.px, this.camera.py);
    }

    onWindowResize() {
        this.gc.emit("resize");
    }

    dismount() {
        this.#abortController.abort();
    }
}
