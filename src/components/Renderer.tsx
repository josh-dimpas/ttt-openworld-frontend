import { useEffect, useRef } from "react";
import type { GraphicsController } from "../core/GraphicsController";

type RendererProps = {
    controller: GraphicsController
} & React.ComponentProps<'div'>;

// The component for the custom renderer
export function Renderer({ controller, className, ...props }: RendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect")
        if (containerRef.current && canvasRef.current && spacerRef.current) {
            console.log("refs are found")
            controller.setup({
                parent: containerRef.current,
                canvas: canvasRef.current,
                spacer: spacerRef.current
            });
            controller.start()
        }
    }, [])

    return (
        <div {...props} ref={containerRef} className={`absolute w-screen h-screen top-0 overflow-auto ${className}`}>
            <canvas
                className="fixed inset-0 bg-transparent w-full h-full"
                ref={canvasRef}
            />
            <div ref={spacerRef} className="relative w-2499.75 h-2499" style={{ zIndex: 1 }} />
        </div>
    )
}
