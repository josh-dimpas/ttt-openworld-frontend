// oxlint-disable typescript/unbound-method - Requires unbound methods

import { GraphicsControllerSubModule, type GraphicsController } from "./GraphicsController";

export class GraphicsCameraController extends GraphicsControllerSubModule {
    // @ts-expect-error Initialized on component mount
    viewport: HTMLDivElement;

    #scroll = this.onScroll.bind(this);

    #x = 0;
    #y = 0;

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
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
        return this.spacer.clientWidth;
    }

    get pmy() {
        return this.spacer.clientHeight;
    }

    set x(value: number) {
        this.#x = value;
        if (this.#x != this.px) this.parent.scrollBy({ left: value });
    }

    set y(value: number) {
        this.#y = value;
        if (this.#y != this.py) this.parent.scrollBy({ top: value });
    }

    get viewportSize(): [width: number, height: number] {
        return [this.pw, this.ph];
    }

    get viewportBounds(): [l: number, t: number, r: number, b: number] {
        // Offset the positions based on 'x' and 'y'
        // TODO: Perform calculation to get 'bounds' from revealed map data

        return [this.x, this.y, this.x + this.px, this.y + this.py];
    }

    constructor(gc: GraphicsController) {
        super(gc);

        // TODO: Get from the
    }

    setup() {
        const { canvas, parent } = this;

        this.viewport = parent;
        parent.addEventListener("scroll", this.#scroll);

        const handleResize = () => {
            canvas.width = this.pw;
            canvas.height = this.ph;
        };
        handleResize();

        window.addEventListener("resize", handleResize);

        this.gc.on("dismount", () => {
            window.removeEventListener("resize", handleResize);
        });
    }

    onScroll() {
        this.x = this.px;
        this.y = this.py;
    }

    dismount() {
        this.viewport.removeEventListener("scroll", this.#scroll);
    }
}
