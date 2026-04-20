import { createFileRoute } from "@tanstack/react-router";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSearchQuery } from "../utils/url";

export const Route = createFileRoute("/join-game")({
    component: RouteComponent,
});

function RouteComponent() {
    const [mapSeed, setMapSeed] = useSearchQuery<string>("gamecode", "");

    return (
        <div className="container mx-auto flex h-full max-w-2xl flex-col justify-center p-4">
            <BackButton />

            <h1 className="mb-6 text-2xl font-bold">Join Game</h1>
            <div className="flex">
                <Input
                    placeholder="Enter Game Code..."
                    value={mapSeed}
                    onChange={(e) => setMapSeed(e.target.value)}
                />
                <Button>Join</Button>
            </div>
        </div>
    );
}
