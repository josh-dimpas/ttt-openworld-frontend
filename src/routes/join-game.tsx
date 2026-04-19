import { createFileRoute } from "@tanstack/react-router";

import { BackButton } from '@/components/ui/BackButton';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchQuery } from "../utils/url";

export const Route = createFileRoute("/join-game")({
    component: RouteComponent,
});

function RouteComponent() {
    const [mapSeed, setMapSeed] = useSearchQuery<string>("gamecode", "");

    return (
        <div className="flex flex-col justify-center mx-auto p-4 max-w-2xl h-full container">
            <BackButton />

            <h1 className="mb-6 font-bold text-2xl">Join Game</h1>
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
