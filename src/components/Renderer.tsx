import { useEffect, useRef } from "react";

import type { GraphicsController } from "../core/GraphicsController";

type RendererProps = {
    controller: GraphicsController;
} & React.ComponentProps<"div">;

// The component for the custom renderer
export function Renderer({ controller, className, ...props }: RendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && canvasRef.current && spacerRef.current) {
            controller.setup({
                parent: containerRef.current,
                canvas: canvasRef.current,
                spacer: spacerRef.current,
            });

            controller.start();
        }

        return () => {
            console.log("dismount");
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
            <div
                ref={spacerRef}
                className="relative h-750 w-750 bg-transparent"
                style={{ zIndex: 1 }}
            />
            <div className="fixed top-0 right-0 z-10">
                <button
                    className="btn btn-sm!"
                    onClick={() => {
                        controller.terrain.toggleShowGuidelines();
                    }}
                >
                    Toggle Guidelines
                </button>
            </div>
        </div>
    );
}
