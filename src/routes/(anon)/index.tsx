import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { Logo } from "../../components/Logo";

export const Route = createFileRoute("/(anon)/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="relative flex shrink grow flex-col items-center gap-2 pt-[10vh]">
            <Logo />
            <div className="max-h-[20vh] shrink grow" />

            {/* Play Expansion */}
            <div className="flex flex-col">
                <input type="checkbox" className="peer hidden" id="expand" />
                <Button
                    asChild
                    size={"xl"}
                    className="bg-destructive peer-checked:bg-primary min-w-92.5 select-none peer-checked:translate-1! peer-checked:shadow-none!"
                >
                    <label htmlFor="expand">Play</label>
                </Button>

                <div className="hidden flex-col px-0 pl-1 peer-checked:flex lg:flex-row">
                    <Button asChild variant={"secondary"}>
                        <Link
                            to="/create-game"
                            search={{}}
                            className="btn min-w-20 grow text-xl tracking-wider uppercase lg:min-w-45"
                        >
                            Create
                        </Link>
                    </Button>
                    <Button asChild variant={"accent"}>
                        <Link
                            to="/join-game"
                            search={{}}
                            className="btn min-w-20 grow text-xl tracking-wider uppercase lg:min-w-45"
                        >
                            Join
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
