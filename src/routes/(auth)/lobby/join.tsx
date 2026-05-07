import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useSearchQuery } from '#/hooks/search'
import type { Lobby } from '#/types/lobby'
import { api } from '#/utils/api'
import { requireAuth } from '#/utils/session'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(auth)/lobby/join')({
  ssr: false,
  component: RouteComponent,
  loader: async () => {
    const context = await requireAuth()
    const lobbies = (await api.get(`/lobby/`, { context })) as Lobby[]
    return { context, lobbies }
  },
})

function RouteComponent() {
  const { context, lobbies } = Route.useLoaderData()
  const [code, setCode] = useState<string>('')

  return (
    <div className="flex flex-col justify-center items-center grow">
      <div className="h-20"></div>
      <div className="flex flex-col justify-center items-center">
        <div className="font-bold text-2xl">JOIN LOBBY</div>
        <div>Join someone's lobby or enter a lobby code</div>
      </div>

      <div className="h-20"></div>

      <div className="flex justify-center items-center w-full">
        <div className="flex gap-2">
          <div className="border-3 w-80! h-120! overflow-auto">
            <div className="flex flex-col gap-2 p-4">
              {lobbies.map((l, i) => (
                <Button onClick={() => setCode(l.join_code)} key={i}>
                  {l.players.at(0)?.name}'s Lobby
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Input
              className="w-50"
              placeholder="Enter Join Code"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />

            {!!code && code.length > 1 && (
              <Button variant="secondary" asChild>
                <Link to="/lobby/$code" params={{ code }}>
                  Join
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
