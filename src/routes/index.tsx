import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="flex flex-col items-center mx-auto p-4 h-full container">
            <div className="relative flex flex-col items-center gap-2 grow shrink">
                <Logo />
                <div className="max-h-[30vh] shrink grow" />

                {/* Play Expansion */}
                <div className="collapse">
                    <input type="checkbox" className="peer" />
                    <button className="collapse-title peer-checked:bg-neutral-500! min-w-20 lg:min-w-45 peer-checked:text-neutral-700! text-xl uppercase tracking-wider btn">Play</button>

                    <div className="collapse-content flex lg:flex-row flex-col gap-2 px-0! pt-2">
                        <Link to="/create-game" search={{}} className="min-w-20 lg:min-w-45 text-xl uppercase tracking-wider grow btn">Create</Link>
                        <Link to="/join-game" search={{}} className="min-w-20 lg:min-w-45 text-xl uppercase tracking-wider grow btn">Join</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
