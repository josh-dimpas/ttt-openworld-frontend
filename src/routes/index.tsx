import { Header } from '#/components/Header'
import { Logo } from '#/components/Logo'
import { Button } from '#/components/ui/button'
import Preload from '#/Preload'
import { currentUserFn } from '#/server/auth'
import { currentLobbyFn } from '#/server/lobbies'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => ({
    session: await currentUserFn(),
    lobby: await currentLobbyFn(),
  }),
  pendingComponent: Preload,
})

function Home() {
  const { session, lobby } = Route.useLoaderData()

  return (
    <div className="flex flex-col h-screen">
      <Header user={session} />

      <div className="relative flex flex-col items-center gap-2 pt-[10vh] shrink grow">
        <Logo />
        <div className="max-h-[20vh] shrink grow" />

        {/* Play Expansion */}
        {session != null ? (
          <div className="space-y-2 w-92.5">
            {lobby && (
              <Button
                size="xl"
                className="min-w-92.5"
                variant="outline"
                asChild
              >
                <Link to="/lobby">Open Lobby</Link>
              </Button>
            )}

            {!lobby && (
              <div className="flex flex-col">
                <input type="checkbox" className="peer hidden" id="expand" />
                <Button
                  asChild
                  size={'xl'}
                  className="bg-destructive peer-checked:bg-primary peer-checked:shadow-none! min-w-92.5 peer-checked:translate-1! select-none"
                >
                  <label htmlFor="expand">Play</label>
                </Button>

                <div className="hidden peer-checked:flex lg:flex-row flex-col px-0 pl-1">
                  <Button asChild variant={'secondary'}>
                    <Link
                      to="/create-game"
                      search={{}}
                      className="min-w-20 lg:min-w-45 text-xl uppercase tracking-wider btn grow"
                    >
                      Create
                    </Link>
                  </Button>
                  <Button asChild variant={'accent'}>
                    <Link
                      to="/lobby/join"
                      search={{}}
                      className="min-w-20 lg:min-w-45 text-xl uppercase tracking-wider btn grow"
                    >
                      Join
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <Button className="bg-amber-500 w-full" asChild>
              <Link to="/events">History</Link>
            </Button>
          </div>
        ) : (
          <div>- Please Login -</div>
        )}
      </div>
    </div>
  )
}
