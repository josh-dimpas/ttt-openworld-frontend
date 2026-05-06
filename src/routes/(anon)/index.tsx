import { Logo } from '#/components/Logo'
import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(anon)/')({ component: Home })

function Home() {
  return (
    <div className="relative flex flex-col items-center gap-2 pt-[10vh] h-screen shrink grow">
      <Logo />
      <div className="max-h-[20vh] shrink grow" />

      {/* Play Expansion */}
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
              to="/join-game"
              search={{}}
              className="min-w-20 lg:min-w-45 text-xl uppercase tracking-wider btn grow"
            >
              Join
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
