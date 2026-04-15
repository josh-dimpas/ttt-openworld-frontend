import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="flex flex-col items-center mx-auto p-4 h-full container">
            <div className="relative flex flex-col items-center grow shrink">
                <Logo />
                <div className="max-h-[30vh] shrink grow" />
                <Link to="/create-game" className="min-w-20 lg:min-w-45 text-xl uppercase tracking-wider btn">Play</Link>
            </div>
        </div>
    );
}
