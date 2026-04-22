import { GraphicsControllerSubModule, type GraphicsController } from "./GraphicsController";

export class GraphicStatController extends GraphicsControllerSubModule {
    panel: HTMLDivElement;

    get x() {
        return this.camera.x;
    }
    get y() {
        return this.camera.y;
    }

    constructor(gc: GraphicsController) {
        super(gc);
        this.panel = document.createElement("div");
    }

    setup() {
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
        this.gc.on("render", () => this.showStat());

        this.gc.parent.appendChild(this.panel);

        const toggleGuidelinesButton = document.createElement("button");
        toggleGuidelinesButton.classList.add("btn");
        toggleGuidelinesButton.innerHTML = "Toggle Guidelines";

        toggleGuidelinesButton.addEventListener("click", () => {
            const showGuidelines = this.gc.terrain.showGuideLines;
            this.gc.terrain.showGuideLines = !showGuidelines;
        });
        this.panel.append(toggleGuidelinesButton);
    }

    showStat() {
        let str = `x: ${this.x}, y: ${this.y} \n`;
        str += `maxX: ${this.gc.terrain.maxGridX}, maxY: ${this.gc.terrain.maxGridY} \n`;
        str += `topleft: ${this.gc.terrain.getGridIndexAtViewport(1, 1)} \n`;

        this.panel.innerText = str;
    }

    dismount() {
        this.panel.remove();
    }
}
