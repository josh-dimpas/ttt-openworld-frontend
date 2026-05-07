import { getCurrentUserFn } from '#/server/auth'
import { api } from '#/utils/api'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/game/$gameid')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const context = await getCurrentUserFn()
    const game = await api.get(`/games/${params.gameid}`, { context })
    return game
  },
})

function RouteComponent() {
  const { gameid } = Route.useParams()
  const game = Route.useLoaderData()

  return (
    <div>
      Hello "/(auth)/game/{gameid}"! <br />
      <pre>{JSON.stringify(game)}</pre>
    </div>
  )
}
