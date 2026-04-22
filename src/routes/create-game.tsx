import { DiceThreeIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { GameConfig } from "@/schemas/game";

import { LocalApiService } from "../services/ApiService.Local";
import { random } from "../utils/string";
import { useSearchQuery } from "../utils/url";

const api = new LocalApiService();

const createRandomCode = () => random(10, random.ALPHABETIC_LOW);
const defaultConfig: GameConfig = {
    seed: createRandomCode(),
    chunkSize: 16,
    winPointsThreshold: 10,
    sharedFog: false,
    timeLimit: 30,
    revealSize: 1,
};

export const Route = createFileRoute("/create-game")({
    component: RouteComponent,
});

function RouteComponent() {
    const router = useRouter();
    const [mapSeed, setMapSeed] = useSearchQuery("mapSeed", defaultConfig.seed, true);
    const [winPointsThreshold, setWinPointsThreshold] = useSearchQuery(
        "winPointsThreshold",
        defaultConfig.winPointsThreshold,
        true,
    );
    const [sharedFog, setSharedFog] = useSearchQuery("sharedFog", defaultConfig.sharedFog);
    const [timeLimit, setTimeLimit] = useSearchQuery("timeLimit", defaultConfig.timeLimit, true);
    const [revealRadius, setRevealRadius] = useSearchQuery(
        "revealRadius",
        defaultConfig.revealSize,
        true,
    );
    const [multiplayer, setMultiplayer] = useSearchQuery<boolean>("multiplayer", false, true);

    const { isPending: isLoading, mutate: onSubmit } = useMutation({
        mutationFn: async () => {
            const config = {
                seed: mapSeed!,
                chunkSize: defaultConfig.chunkSize!,
                winPointsThreshold: winPointsThreshold!,
                timeLimit: timeLimit!,
                revealSize: revealRadius!,
                sharedFog: !multiplayer || sharedFog!,
            } satisfies GameConfig;
            console.log(config);
            return await api.fetch("create_game", config);
        },
        onSuccess: (data) => {
            console.log("Game created:", data);
            router.navigate({ to: "/game/$gameid", params: { gameid: String(data.id) } });
        },
        onError: (error) => {
            console.error("Error creating game:", error);
        },
    });

    return (
        <div className="container mx-auto flex h-full max-w-2xl flex-col justify-center p-4">
            <BackButton />

            <h1 className="mb-6 text-2xl font-bold">Create Game</h1>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                    <Button
                        type="button"
                        onClick={() => setMapSeed(createRandomCode())}
                        animation={"pop"}
                    >
                        Randomize
                        <DiceThreeIcon className="size-6!" weight="fill" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <TooltipContent>
                        How many cells will be revealed once a cell has been chosen
                    </TooltipContent>
                    <TooltipTrigger className="block w-full">
                        <Input
                            name="revealRadius"
                            type="number"
                            value={revealRadius}
                            onChange={(e) => setRevealRadius(Number(e.target.value))}
                        />
                    </TooltipTrigger>
                </Tooltip>

                <div className="flex h-6 gap-4">
                    <div className="space-x-2">
                        <Checkbox
                            name="multiplayer"
                            id="multiplayer"
                            checked={multiplayer}
                            onCheckedChange={(value: boolean) => setMultiplayer(value)}
                        />
                        <Tooltip delayDuration={0}>
                            <TooltipContent>Play with someone through the internet</TooltipContent>
                            <TooltipTrigger>
                                <Label htmlFor="multiplayer">Multiplayer</Label>
                            </TooltipTrigger>
                        </Tooltip>
                    </div>

                    {multiplayer && (
                        <div className="space-x-2">
                            <Checkbox
                                name="sharedFog"
                                id="sharedFog"
                                checked={sharedFog}
                                onCheckedChange={(value: boolean) => setSharedFog(value)}
                            />
                            <Tooltip delayDuration={0}>
                                <TooltipContent>
                                    Everyone will be able to see what anyone revealed
                                </TooltipContent>
                                <TooltipTrigger className="space-x-2">
                                    <Label htmlFor="sharedFog">Shared Fog</Label>
                                </TooltipTrigger>
                            </Tooltip>
                        </div>
                    )}
                </div>

                <div>
                    <Button
                        onClick={() => onSubmit()}
                        disabled={isLoading}
                        type="submit"
                        className="btn mt-4 w-full! text-xl tracking-wider uppercase"
                    >
                        {isLoading ? "Creating..." : "Start"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
