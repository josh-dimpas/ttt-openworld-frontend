import { BackButton } from '#/components/BackButton'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useSearchQuery } from '#/hooks/search'
import { getRouter } from '#/router'
import { createGameFn } from '#/server/games'
import type { GameConfig } from '#/types/game'
import { requireAuth } from '#/utils/session'
import { random } from '#/utils/string'
import { DiceThreeIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/(auth)/create-game')({
  component: RouteComponent,
  loader: () => requireAuth(),
})

const createRandomCode = () => random(10, random.ALPHABETIC_LOW)
const defaultConfig: GameConfig = {
  seed: createRandomCode(),
  chunk_size: 25,
  win_points_threshold: 10,
  shared_fog: false,
  time_limit_seconds: 30,
  reveal_radius: 1,
}

function RouteComponent() {
  const router = getRouter()

  const [mapSeed, setMapSeed] = useSearchQuery(
    'mapSeed',
    defaultConfig.seed,
    true,
  )
  const [winPointsThreshold, setWinPointsThreshold] = useSearchQuery(
    'winPointsThreshold',
    defaultConfig.win_points_threshold,
    true,
  )
  const [sharedFog, setSharedFog] = useSearchQuery(
    'sharedFog',
    defaultConfig.shared_fog,
  )
  const [timeLimit, setTimeLimit] = useSearchQuery(
    'timeLimit',
    defaultConfig.time_limit_seconds,
    true,
  )
  const [revealRadius, setRevealRadius] = useSearchQuery(
    'revealRadius',
    defaultConfig.reveal_radius,
    true,
  )

  const _createGame = useServerFn(createGameFn)

  const { isPending: isLoading, mutate: onSubmit } = useMutation({
    mutationFn: async () => {
      const config: GameConfig = {
        seed: mapSeed!,
        chunk_size: defaultConfig.chunk_size,
        win_points_threshold: winPointsThreshold!,
        time_limit_seconds: timeLimit!,
        reveal_radius: revealRadius!,
        shared_fog: !!sharedFog,
      } satisfies GameConfig

      return _createGame({ data: config })
    },
    onSuccess: (data) => {
      router.navigate({
        to: '/lobby',
        params: { gameid: String(data.id) },
      })
    },
    onError: (error) => {
      console.error('Error creating game:', error)
    },
  })

  return (
    // <div className="flex flex-col justify-center mx-auto p-4 max-w-2xl h-full container">
    <div className="flex flex-col justify-center items-center mx-auto h-full">
      <Header />
      <div className="flex items-center grow">
        <div className="bg-white px-8 pt-8 pb-12 border-3 grow">
          <div className="mb-6">
            <h1 className="font-bold text-2xl">Create Game</h1>
            <div>Enter your preferred game settings</div>
          </div>

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
                animation={'pop'}
              >
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
                  onChange={(e) =>
                    setWinPointsThreshold(Number(e.target.value))
                  }
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

            <div className="flex gap-4 h-6">
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
            </div>

            <div>
              <Button
                onClick={() => onSubmit()}
                disabled={isLoading}
                type="submit"
                className="mt-4 w-full! text-xl uppercase tracking-wider btn"
              >
                {isLoading ? 'Creating...' : 'Start'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
