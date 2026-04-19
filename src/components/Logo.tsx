import { Badge } from "./ui/badge";

export function Logo({
    hideOpenWorld = false,
    className = "",
}: React.ComponentProps<"div"> & { hideOpenWorld?: boolean }) {
    return (
        <div className={"relative text-[.5rem] lg:text-[1rem] " + className}>
            <h1 className="text-[6em]">Tic•Tac•Toe</h1>
            {!hideOpenWorld && (
                <Badge className="bg-primary/50 text-error absolute top-[3.4em] right-0 -rotate-13 rounded-lg border-4 px-2 pb-1 text-[2em] font-bold">
                    Open World
                </Badge>
            )}
        </div>
    );
}
