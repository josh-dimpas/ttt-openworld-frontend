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
        console.log("useEffect");
        if (containerRef.current && canvasRef.current && spacerRef.current) {
            console.log("refs are found");
            controller.setup({
                parent: containerRef.current,
                canvas: canvasRef.current,
                spacer: spacerRef.current,
            });
            controller.start();
        }
    }, [controller]);

    return (
        <div
            {...props}
            ref={containerRef}
            className={`absolute top-0 h-screen w-screen overflow-auto ${className}`}
        >
            <canvas className="fixed inset-0 h-full w-full bg-transparent" ref={canvasRef} />
            <div ref={spacerRef} className="relative" style={{ zIndex: 1 }} />
        </div>
    );
}
