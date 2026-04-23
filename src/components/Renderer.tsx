import React, { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";

import type { GraphicsController } from "../core/GraphicsController/main";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type RendererProps = { controller: GraphicsController } & React.ComponentProps<"div">;

// The component for the custom renderer
export function Renderer({ controller, className, ...props }: RendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("SETTING IT UP");
        if (containerRef.current && canvasRef.current && spacerRef.current) {
            controller.setup({
                parent: containerRef.current,
                canvas: canvasRef.current,
                spacer: spacerRef.current,
            });

            console.log("STARTING");

            controller.start();
        }

        return () => {
            console.log("DISMOUNTED");
            return controller.dismount();
        };
    }, [controller]);

    return (
        <div
            {...props}
            ref={containerRef}
            className={`absolute top-0 h-screen w-screen overflow-auto ${className}`}
        >
            <canvas className="fixed inset-0 h-full w-full" ref={canvasRef} />
            <div ref={spacerRef} className="relative bg-transparent" style={{ zIndex: 1 }} />

            <RendererStats controller={controller} />
        </div>
    );
}

type RendererStatProps = { controller: GraphicsController } & React.ComponentProps<"div">;

function RendererStats({ controller }: RendererStatProps) {
    return (
        <div className="fixed top-0 right-0 z-10 rounded-bl-xl border-2 bg-neutral-300 p-2 text-xs opacity-40 hover:opacity-100">
            <div className="text-base font-bold">Renderer Stats</div>
            <RenderStatMouse controller={controller} />
            <RenderStatScroll controller={controller} />
            <hr className="pb-1" />
            <div className="space-x-2">
                <Checkbox
                    id="show-guidelines"
                    onClick={() => controller.terrain.toggleShowGuidelines()}
                />
                <Label htmlFor="show-guidelines" className="text-xs">
                    Show Noise Guidelines
                </Label>
            </div>
        </div>
    );
}

function RenderStatMouse({ controller }: { controller: GraphicsController }) {
    const mouse = useSnapshot(controller.input.mouse);

    return (
        <div>
            Mouse:{" "}
            <span className="font-mono">
                {mouse.x}, {mouse.y}
            </span>
        </div>
    );
}

function RenderStatScroll({ controller }: { controller: GraphicsController }) {
    const mouse = useSnapshot(controller.camera.scroll);

    return (
        <div>
            Scroll:
            <span className="font-mono">
                {mouse.x}, {mouse.y}
            </span>
        </div>
    );
}
