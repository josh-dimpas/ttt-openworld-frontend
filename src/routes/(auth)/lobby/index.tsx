/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CopyButton } from '#/components/CopyButton'
import { Button } from '#/components/ui/button'
import { getCurrentLobbyFn } from '#/server/lobbies'
import { requireAuth } from '#/utils/session'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/lobby/')({
  component: RouteComponent,
  loader: async () => {
    const context = await requireAuth()
    const lobby = await getCurrentLobbyFn()

    if (!lobby) throw redirect({ to: '/' })

    return { context, lobby }
  },
})

function RouteComponent() {
  const { context, lobby } = Route.useLoaderData()
  const [owner, joiner] = lobby.players

  

  return (
    <div className="items-center mx-auto container grow">
      <div className="h-10"></div>

      <div className="flex justify-center items-center font-bold text-2xl">
        Lobby
      </div>

      <div className="h-8"></div>

      <div className="flex justify-center text-sm">Join Code</div>
      <div className="flex justify-center items-center">
        {lobby.join_code}
        <span className="w-2"></span>
        <CopyButton text={lobby.join_code} />
      </div>

      <div className="flex justify-center mx-auto py-8 pt-[10vh] w-full">
        {/* Player 1 */}
        <Button size="xl" className="border w-40 h-60" variant="accent">
          {owner.name}
        </Button>

        <div className="flex justify-center items-center w-80">VS</div>

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

      {lobby.created_by == context.user_id && lobby.players.length == 2 && (
        <div className="flex justify-center pt-8">
          <Button className="w-40" variant="secondary" size="xl">
            Play
          </Button>
        </div>
      )}
    </div>
  )
}
