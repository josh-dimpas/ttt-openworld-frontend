import { createFileRoute, Link } from "@tanstack/react-router";
import type { SubmitEventHandler } from "react";

import { Checkbox } from "../components/daisy/Checkbox";
import { Input } from "../components/daisy/Input";
import { DiceIcon } from "../components/icons/Dice";
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
    const [multiplayer, setMultiplayer] = useSearchQuery("multiplayer", false, true);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(data);
    };

    return (
        <div className="container mx-auto flex h-full max-w-2xl flex-col justify-center p-4">
            <div className="pb-6">
                <Link to="/" className="w-fit underline">
                    {" "}
                    Back{" "}
                </Link>
            </div>

            <h1 className="mb-6 text-2xl font-bold">Create Game</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="join w-full">
                    <Input
                        name="mapSeed"
                        type="text"
                        value={mapSeed}
                        onChange={(e) => setMapSeed(e.target.value)}
                        rootClassName="grow "
                        className="join-item"
                    />
                    <button
                        className="btn btn-md! join-item uppercase"
                        onClick={() => setMapSeed(createRandomCode())}
                    >
                        {" "}
                        <DiceIcon />{" "}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        name="winPointsThreshold"
                        label="Win Points Threshold"
                        type="number"
                        value={winPointsThreshold}
                        onChange={(e) => setWinPointsThreshold(Number(e.target.value))}
                    />
                    <Input
                        name="timeLimit"
                        label="Time Limit Per Turn (seconds)"
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                    />
                </div>

                <div
                    className="tooltip w-full"
                    data-tip="How many grids will be revealed once a grid has been chosen "
                >
                    <Input
                        name="revealRadius"
                        label="Reveal Radius"
                        type="number"
                        value={revealRadius}
                        onChange={(e) => setRevealRadius(Number(e.target.value))}
                    />
                </div>

                <div className="flex gap-4">
                    <div
                        className="tooltip"
                        data-tip="Everyone will be able to see what anyone revealed"
                    >
                        <Checkbox
                            name="sharedFog"
                            label="Shared Fog"
                            checked={sharedFog}
                            onChange={(e) => setSharedFog(e.target.checked)}
                        />
                    </div>

                    <div className="tooltip" data-tip="Play with someone through the internet">
                        <Checkbox
                            name="multiplayer"
                            label="Multiplayer"
                            checked={multiplayer}
                            onChange={(e) => setMultiplayer(e.target.checked)}
                        />
                    </div>
                </div>

                <div>
                    <input
                        type="submit"
                        className="btn mt-4 w-full! text-xl tracking-wider uppercase"
                        value="Start"
                    />
                </div>
            </form>
        </div>
    );
}
