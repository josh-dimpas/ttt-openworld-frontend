import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button'
import { getGamesFn } from '#/server/games'
import type { Game } from '#/types/game'
import { requireAuth } from '#/utils/session'
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/events')({
  component: RouteComponent,
  loader: async () => {
    await requireAuth()
    const games = await getGamesFn()
    return games
  },
  errorComponent: ErrorComponent,
})

function RouteComponent() {
  const games = Route.useLoaderData()

  useEffect(() => {})

  return (
    <div className="flex flex-col items-center mx-auto h-full">
      <Header />

      <div className="flex border w-full min-h-0 grow">
        <GameList games={games} />
        <Outlet />
      </div>
    </div>
  )
}

function GameList({ games }: { games: Game[] }) {
  const route = useLocation()

  return (
    <div className="flex flex-col">
      {games.map((g) => {
        const isActive = route.pathname === `/events/${g.id}`

        return (
          <Button key={g.id} asChild className={`${!isActive && 'bg-white'}`}>
            <Link to="/events/$gameid" params={{ gameid: g.id.toString() }}>
              {g.config.seed}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
      <div className="text-red-500 text-xl">
        {error.message || 'Game not found'}
      </div>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}
