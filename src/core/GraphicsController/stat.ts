import { type GraphicsController } from "./main";
import { GraphicsControllerSubModule } from "./submodule";

export class GraphicStatController extends GraphicsControllerSubModule {
    // @ts-expect-error Initialized on component mount
    panel: HTMLDivElement;

    #showStat = this.showStat.bind(this);

    get x() {
        return this.camera.x;
    }
    get y() {
        return this.camera.y;
    }

    constructor(gc: GraphicsController) {
        super(gc);
    }

    setup() {
        this.panel = document.createElement("div");
        this.panel.classList.add(
            "fixed",
            "z-50",
            "top-0",
            "left-0",
            "p-2",
            "pt-6",
            "mt-6",
            "border",
            "border-error",
            "bg-neutral-300",
            "opacity-30",
            "hover:opacity-100",
        );

        this.parent.append(this.panel);
        this.gc.on("render", this.#showStat);
    }

    showStat() {
        let str = `x: ${this.x}, y: ${this.y} \n`;
        str += `maxX: ${this.gc.terrain.maxGridX}, maxY: ${this.gc.terrain.maxGridY} \n`;
        str += `topleft: ${this.gc.terrain.getGridIndexAtViewport(1, 1)} \n`;
        str += `revealBuffer: \n${this.config.revealBuffer
            .map((n) => {
                const str = n.toString(2).padStart(32, "0");

                return Array(5)
                    .fill(0)
                    .map((_, i) => `${str.slice(i * 5, (i + 1) * 5)}`)
                    .join("\n");
            })
            .join("\n\n")}`;

        this.panel.innerText = str;
    }

    dismount() {
        this.panel.remove();
    }
}
