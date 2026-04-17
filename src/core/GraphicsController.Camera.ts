// oxlint-disable typescript/unbound-method - Requires unbound methods

import type { GraphicsController } from "./GraphicsController";

export class GraphicsCameraController {
    // @ts-expect-error Initialized on component mount
    viewport: HTMLDivElement;
    gc: GraphicsController;

    #bindedScrollEvent = this.onScroll.bind(this);

    #x = 0;
    #y = 0;

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }

    get parent() {
        return this.gc.parent;
    }

    set x(value: number) {
        this.#x = value;
        if (this.#x != this.gc.px) this.parent.scrollBy({ left: value });
    }

    set y(value: number) {
        this.#y = value;
        if (this.#y != this.gc.py) this.parent.scrollBy({ top: value });
    }

    get viewportSize(): [width: number, height: number] {
        return [this.gc.pw, this.gc.ph];
    }

    get viewportBounds(): [l: number, t: number, r: number, b: number] {
        // Offset the positions based on 'x' and 'y'
        // TODO: Perform calculation to get 'bounds' from revealed map data

        return [this.x, this.y, this.x + this.gc.px, this.y + this.gc.py];
    }

    constructor(gc: GraphicsController) {
        this.gc = gc;

        // TODO: Get from the
    }

    bindViewPort(el: HTMLDivElement) {
        this.viewport = el;
        el.addEventListener("scroll", this.#bindedScrollEvent);
    }

    onScroll() {
        if (!this.gc) return;

        this.x = this.gc.px;
        this.y = this.gc.py;
    }

    dismount() {
        this.viewport.removeEventListener("scroll", this.#bindedScrollEvent);
    }
}
