import { createFileRoute } from "@tanstack/react-router";
import type { SubmitEventHandler } from "react";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DiceThreeIcon } from '@phosphor-icons/react';
import type { GameConfig } from "../types/game";
import { random } from "../utils/string";
import { useSearchQuery } from "../utils/url";

const createRandomCode = () => random(10, random.ALPHABETIC_LOW);
const defaultConfig: GameConfig = {
    mapSeed: createRandomCode(),
    chunkSize: 16,
    vectorOrientation: 0,
    winPointsThreshold: 10,
    sharedFog: false,
    timeLimit: 30,
    mapSize: { width: 32, height: 32 },
    revealRadius: 1,
};

export const Route = createFileRoute("/create-game")({
    component: RouteComponent,
});

function RouteComponent() {
    const [mapSeed, setMapSeed] = useSearchQuery("mapSeed", defaultConfig.mapSeed, true);
    const [winPointsThreshold, setWinPointsThreshold] = useSearchQuery(
        "winPointsThreshold",
        defaultConfig.winPointsThreshold,
        true,
    );
    const [sharedFog, setSharedFog] = useSearchQuery("sharedFog", defaultConfig.sharedFog);
    const [timeLimit, setTimeLimit] = useSearchQuery("timeLimit", defaultConfig.timeLimit, true);
    const [revealRadius, setRevealRadius] = useSearchQuery(
        "revealRadius",
        defaultConfig.revealRadius,
        true,
    );
    const [multiplayer, setMultiplayer] = useSearchQuery<boolean>("multiplayer", false, true);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(data);
    };

    return (
        <div className="flex flex-col justify-center mx-auto p-4 max-w-2xl h-full container">
            <BackButton />

            <h1 className="mb-6 font-bold text-2xl">Create Game</h1>

            <form onSubmit={onSubmit} className="space-y-4">

                <Label htmlFor="mapSeed">Map Seed</Label>
                <div className="flex w-full">
                    <Input
                        id="mapSeed"
                        name="mapSeed"
                        type="text"
                        value={mapSeed}
                        onChange={(e) => setMapSeed(e.target.value)}
                        className="join-item"
                    />
                    <Button onClick={() => setMapSeed(createRandomCode())} animation={"pop"}>
                        Randomize
                        <DiceThreeIcon className="size-6!" weight="fill" />
                    </Button>
                </div>

                <div className="gap-4 grid grid-cols-2">
                    <div>
                        <Label htmlFor="mapSeed">Win Points Threshold</Label>
                        <Input
                            name="winPointsThreshold"
                            type="number"
                            value={winPointsThreshold}
                            onChange={(e) => setWinPointsThreshold(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label>Time Limit Per Turn (seconds)</Label>
                        <Input
                            name="timeLimit"
                            type="number"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                        />
                    </div>
                </div>


                <Label htmlFor="mapSeed">Reveal Radius</Label>
                <Tooltip delayDuration={0}>
                    <TooltipContent>How many cells will be revealed once a cell has been chosen</TooltipContent>
                    <TooltipTrigger className="block w-full">
                        <Input
                            name="revealRadius"
                            type="number"
                            value={revealRadius}
                            onChange={(e) => setRevealRadius(Number(e.target.value))}
                        />
                    </TooltipTrigger>
                </Tooltip>

                <div className="flex gap-4 h-6">
                    <Tooltip delayDuration={0}>
                        <TooltipContent>Everyone will be able to see what anyone revealed</TooltipContent>
                        <TooltipTrigger className="space-x-2">
                            <Checkbox
                                name="sharedFog"
                                id="sharedFog"
                                checked={sharedFog}
                                onCheckedChange={(value: boolean) => setSharedFog(value)}
                            />
                            <Label htmlFor="sharedFog">Shared Fog</Label>
                        </TooltipTrigger>
                    </Tooltip>

                    <Tooltip delayDuration={0}>
                        <TooltipContent>Play with someone through the internet</TooltipContent>
                        <TooltipTrigger className="space-x-2">
                            <Checkbox
                                name="multiplayer"
                                id="multiplayer"
                                checked={multiplayer}
                                onCheckedChange={(value: boolean) => setMultiplayer(value)}
                            />
                            <Label htmlFor="multiplayer">Multiplayer</Label>
                        </TooltipTrigger>
                    </Tooltip>
                </div>

                <div>
                    <input
                        type="submit"
                        className="mt-4 w-full! text-xl uppercase tracking-wider btn"
                        value="Start"
                    />
                </div>
            </form>
        </div>
    );
}
