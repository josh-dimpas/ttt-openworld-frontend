import { createFileRoute, Link } from '@tanstack/react-router'
import { Checkbox } from '../components/daisy/Checkbox'
import { Input } from '../components/daisy/Input'
import { DiceIcon } from '../components/icons/Dice'
import type { GameConfig } from '../types/game'
import { random } from '../utils/string'
import { useSearchQuery } from '../utils/url'


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
}

export const Route = createFileRoute('/create-game')({
    component: RouteComponent,
})


function RouteComponent() {
    const [mapSeed, setMapSeed] = useSearchQuery('mapSeed', defaultConfig.mapSeed, true)
    const [winPointsThreshold, setWinPointsThreshold] = useSearchQuery('winPointsThreshold', defaultConfig.winPointsThreshold, true)
    const [sharedFog, setSharedFog] = useSearchQuery('sharedFog', defaultConfig.sharedFog)
    const [timeLimit, setTimeLimit] = useSearchQuery('timeLimit', defaultConfig.timeLimit, true)
    const [revealRadius, setRevealRadius] = useSearchQuery('revealRadius', defaultConfig.revealRadius, true)
    const [multiplayer, setMultiplayer] = useSearchQuery('multiplayer', false, true)

    return (
        <div className="flex flex-col justify-center mx-auto p-4 max-w-2xl h-full container">
            <div className='pb-6'>
                <Link to='/' className="w-fit underline">  Back </Link>
            </div>

            <h1 className="mb-6 font-bold text-2xl">Create Game</h1>

            <div className="space-y-4">
                <div className="w-full join">
                    <Input
                        type="text"
                        value={mapSeed}
                        onChange={(e) => setMapSeed(e.target.value)}
                        rootClassName="grow "
                        className="join-item"
                    />
                    <button className="uppercase btn btn-md! join-item" onClick={() => setMapSeed(createRandomCode())}> <DiceIcon /> </button>
                </div>

                <div className="gap-4 grid grid-cols-2">
                    <Input
                        label="Win Points Threshold"
                        type="number"
                        value={winPointsThreshold}
                        onChange={(e) => setWinPointsThreshold(Number(e.target.value))}
                    />
                    <Input
                        label="Time Limit Per Turn (seconds)"
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                    />
                </div>

                <div className="w-full tooltip" data-tip="How many grids will be revealed once a grid has been chosen ">
                    <Input
                        label="Reveal Radius"
                        type="number"
                        value={revealRadius}
                        onChange={(e) => setRevealRadius(Number(e.target.value))}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="tooltip" data-tip="Everyone will be able to see what anyone revealed">
                        <Checkbox
                            label="Shared Fog"
                            checked={sharedFog}
                            onChange={(e) => setSharedFog(e.target.checked)}
                        />
                    </div>

                    <div className="tooltip" data-tip="Play with someone through the internet">
                        <Checkbox
                            label="Multiplayer"
                            checked={multiplayer}
                            onChange={(e) => setMultiplayer(e.target.checked)}
                        />
                    </div>
                </div>
            </div>

            <button className="mt-4 min-w-20 lg:min-w-45 text-xl uppercase tracking-wider btn">Start</button>

        </div>
    )
}
