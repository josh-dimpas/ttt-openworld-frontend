import { Renderer } from '#/components/Renderer'
import { Button } from '#/components/ui/button'
import { GraphicsController } from '#/core/GraphicsController/main'
import { WebsocketService } from '#/core/Websockets'
import Preload from '#/Preload'
import { getGameFn, putPieceFn } from '#/server/games'
import { gameStore } from '#/stores/game'
import { promiseTimeout } from '#/utils/promise'
import { requireAuth } from '#/utils/session'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/game/$gameid')({
  ssr: false,
  component: RouteComponent,
  loader: async ({ params }) => {
    await requireAuth()
    const game = await getGameFn({ data: { id: params.gameid } })

    if (!game) throw redirect({ to: '/' })

    gameStore.game = game
    return game
  },
  pendingComponent: Preload,
  errorComponent: ErrorComponent,
})

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

function RouteComponent() {
  const { gameid } = Route.useParams()
  const controller = new GraphicsController()

  const putPiece = useServerFn(putPieceFn)
  const getGame = useServerFn(getGameFn)

  useEffect(() => {
    const abort = new AbortController()
    const ws = new WebsocketService()

    ws.on(
      'game:put',
      async () => {
        const game = await getGame({ data: { id: gameid } })
        gameStore.game = game
      },
      abort.signal,
    )

    return () => abort.abort()
  }, [])

  return (
    <div className="relative">
      <div className="mx-auto container">Game ID: {gameid}</div>
      <Renderer
        controller={controller}
        onPut={async (x, y) => {
          if (!controller.config.canPut) return

          await putPiece({ data: { id: gameid, x, y } })
          await promiseTimeout(200)
          const game = await getGame({ data: { id: gameid } })
          gameStore.game = game
        }}
      />
    </div>
  )
}
