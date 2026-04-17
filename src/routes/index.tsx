import { createFileRoute, Link } from "@tanstack/react-router";

import { Logo } from "../components/Logo";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="container mx-auto flex h-full flex-col items-center p-4">
            <div className="relative flex shrink grow flex-col items-center gap-2">
                <Logo />
                <div className="max-h-[30vh] shrink grow" />

                {/* Play Expansion */}
                <div className="collapse">
                    <input type="checkbox" className="peer" />
                    <button className="collapse-title btn min-w-20 text-xl tracking-wider uppercase peer-checked:bg-neutral-500! peer-checked:text-neutral-700! lg:min-w-45">
                        Play
                    </button>

                    <div className="collapse-content flex flex-col gap-2 px-0! pt-2 lg:flex-row">
                        <Link
                            to="/create-game"
                            search={{}}
                            className="btn min-w-20 grow text-xl tracking-wider uppercase lg:min-w-45"
                        >
                            Create
                        </Link>
                        <Link
                            to="/join-game"
                            search={{}}
                            className="btn min-w-20 grow text-xl tracking-wider uppercase lg:min-w-45"
                        >
                            Join
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
