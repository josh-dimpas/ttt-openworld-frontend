import { proxy } from "valtio";

import type { GameSchema } from "@/schemas/game";

import { GraphicsController } from "./main";
import { GraphicsControllerSubModule } from "./submodule";

export class GraphicsCameraController extends GraphicsControllerSubModule {
    // @ts-expect-error Initialized on component mount
    viewport: HTMLDivElement;

    scroll = proxy({ x: 0, y: 0 });
    center = proxy({ x: 0, y: 0 });

    /*
        Scroll Values
        sx, sy = Virtual Scroll X, Y (Internal Copy)
        psx, psy = Actual Scroll X, Y (Dom Value)

        Both needs to be separate data in the memory
        in order to have two-way control 
            - actual set virtual for camera (viewport)
            - virtual set actual for non-player scrolls (transitions)
    */

    get sx() {
        return this.scroll.x;
    }

    get sy() {
        return this.scroll.y;
    }

    set sx(value: number) {
        this.scroll.x = value;

        if (this.sx != this.psx) this.parent.scrollBy({ left: value });
    }

    set sy(value: number) {
        this.scroll.y = value;
        if (this.sy != this.psy) this.parent.scrollBy({ top: value });
    }

    get psx() {
        return this.parent.scrollLeft;
    }
    get psy() {
        return this.parent.scrollTop;
    }

    // Parent Dimensions

    get pw() {
        return this.parent.clientWidth;
    }

    get ph() {
        return this.parent.clientHeight;
    }

    // Spacer Dimensions (Parent-max-x/y scroll values)
    get pmx() {
        return this.spacer.clientWidth;
    }

    get pmy() {
        return this.spacer.clientHeight;
    }

    // Map Bounds (grid)
    get mgx() {}

    // Center Camera (Controls relativity and maintains view when spacer expands)
    get cx() {
        return this.center.x;
    }

    get cy() {
        return this.center.y;
    }

    set cx(value: number) {
        this.center.x = value;
        // if(this.sx != this.cx) this.sx =
    }

    get viewportSize(): [width: number, height: number] {
        return [this.pw, this.ph];
    }

    get viewportBounds(): [l: number, t: number, r: number, b: number] {
        // Offset the positions based on 'x' and 'y'
        // TODO: Perform calculation to get 'bounds' from revealed map data

        return [this.sx, this.sy, this.sx + this.pw, this.sy + this.ph];
    }

    constructor(gc: GraphicsController) {
        super(gc);

        // TODO: Get from the
    }

    setup() {
        const { parent } = this;
        this.viewport = parent;

        this.handleResize();

        this.gc.on("resize", this.handleResize);
        this.gc.on("scroll", this.onScroll);
    }

    handleResize() {
        const canvas = this.canvas;

        canvas.width = this.pw;
        canvas.height = this.ph;
    }

    onScroll() {
        this.sx = this.psx;
        this.sy = this.psy;
    }

    dismount() {}
}

class RevealBufferManager {
    game: GameSchema;

    constructor(game: GameSchema) {
        this.game = game;
    }
}
