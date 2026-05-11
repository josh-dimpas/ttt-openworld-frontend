/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CopyButton } from '#/components/CopyButton'
import { Button } from '#/components/ui/button'
import { WebsocketService } from '#/core/Websockets'
import { getRouter } from '#/router'
import { currentLobbyFn, leaveLobbyFn, startLobbyFn } from '#/server/lobbies'
import type { Game } from '#/types/game'
import { promiseTimeout } from '#/utils/promise'
import { requireAuth } from '#/utils/session'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/(auth)/lobby/')({
  component: RouteComponent,
  loader: async () => {
    const context = await requireAuth()
    const lobby = await currentLobbyFn()

    if (!lobby) throw redirect({ to: '/' })

    return { context, lobby }
  },
  staleTime: 0,
  gcTime: 0,
})

function RouteComponent() {
  const { context, lobby } = Route.useLoaderData()
  const [[owner, joiner], setPlayers] = useState(lobby.players)
  const router = getRouter()

  const _startLobby = useServerFn(startLobbyFn)
  const _leaveLobby = useServerFn(leaveLobbyFn)

  const { isPending: isStarting, mutate: play } = useMutation({
    mutationFn: async () => {
      console.log('CLICKED')
      const data = await _startLobby()
      return data as Game
    },
    onSuccess: (data) => {
      // Redirect that route
      router.navigate({
        to: '/game/$gameid',
        params: { gameid: data.id.toString() },
      })
    },
  })

  const { isPending: isLeaving, mutate: leave } = useMutation({
    mutationFn: async () => {
      await _leaveLobby()
      await promiseTimeout(200)
    },
    onSuccess: () => {
      router.navigate({ to: '/lobby/join' })
    },
  })

  useEffect(() => {
    const abort = new AbortController()
    const ws = new WebsocketService()

    ws.on(
      'lobby:join',
      ({ player: { id, username: name } }) => setPlayers([owner, { id, name }]),
      abort.signal,
    )

    ws.on('lobby:leave', () => setPlayers([owner]), abort.signal)

    ws.on(
      'lobby:start',
      (data) => {
        router.navigate({
          to: '/game/$gameid',
          params: { gameid: data.game_id.toString() },
        })
      },
      abort.signal,
    )

    return () => abort.abort()
  }, [])

  return (
    <div className="items-center mx-auto container grow">
      <div className="h-10"></div>

      <div className="flex justify-center items-center font-bold text-2xl">
        Lobby
      </div>

      <div className="h-8"></div>

      <div className="bg-white mx-auto border-3 w-fit">
        <div className="flex justify-center border-b-3 text-sm">Join Code</div>

        <div className="flex justify-center items-center p-4">
          {lobby.join_code}
          <span className="w-2"></span>
          <CopyButton text={lobby.join_code} />
        </div>
      </div>

      <div className="flex justify-center mx-auto py-8 pt-[10vh] w-full">
        {/* Player 1 */}
        <Button size="xl" className="border w-40 h-60" variant="accent">
          {owner.name}
        </Button>

        <div className="flex justify-center items-center w-80">
          <span className="bg-white px-4 py-3 border-3 font-black">VS </span>
        </div>

        {/* Player 2 */}
        {joiner ? (
          <Button size="xl" className="border w-40 h-60">
            {joiner.name}
          </Button>
        ) : (
          <Button size="xl" className="bg-white border w-40 h-60">
            [No Player]
          </Button>
        )}
      </div>

      {lobby.created_by == context.user_id && owner && joiner && (
        <div className="flex justify-center pt-8">
          <Button
            disabled={isStarting}
            className="w-40"
            variant="secondary"
            size="xl"
            onClick={() => play()}
          >
            Play
          </Button>
        </div>
      )}

      {lobby.created_by !== context.user_id && (
        <div className="flex justify-center pt-8">
          <Button
            disabled={isLeaving}
            className="w-40"
            variant="destructive"
            size="xl"
            onClick={() => leave()}
          >
            Leave
          </Button>
        </div>
      )}
    </div>
  )
}
