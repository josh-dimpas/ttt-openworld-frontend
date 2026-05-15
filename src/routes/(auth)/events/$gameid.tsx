import { Aggregator } from '#/components/Aggregator'
import { Button } from '#/components/ui/button'
import { EventAggregator } from '#/core/EventAggregator/main'
import Preload from '#/Preload'
import { getGameEvents, getGameFn } from '#/server/games'
import type { GameEvent } from '#/types/game'
import { requireAuth } from '#/utils/session'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(auth)/events/$gameid')({
  ssr: false,
  component: RouteComponent,
  loader: async ({ params }) => {
    await requireAuth()
    const game = await getGameFn({ data: { id: params.gameid } })
    const events = await getGameEvents({ data: { id: params.gameid } })

    if (!game) throw redirect({ to: '/' })

    return { game, events }
  },
  pendingComponent: Preload,
  errorComponent: ErrorComponent,
})

function RouteComponent() {
  const { events } = Route.useLoaderData()
  const controller = new EventAggregator()

  function setEvent(events: GameEvent[]) {
    controller.sources = events
  }

  return (
    <div className="flex border w-full min-h-0 grow">
      <EventList
        events={events}
        onShow={(data, i) => {
          setEvent(events.slice(0, i + 1))
          return console.log(data)
        }}
      />
      <Aggregator controller={controller} />
    </div>
  )
}

function EventList({
  events,
  onShow,
}: {
  events: GameEvent[]
  onShow: (event: GameEvent, index: number) => void
}) {
  const [showing, setShowing] = useState<GameEvent | undefined>(undefined)

  return (
    <div className="flex flex-col min-h-0 overflow-auto">
      <div className="bg-white border-b-3 border-l-3 font-black text-center">
        Events
      </div>
      <div className="flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
        {events.map((e, i) => {
          return (
            <Button
              key={e.id}
              onMouseEnter={() => {
                setShowing(e)
                onShow(e, i)
              }}
              className={`bg-white hover:bg-amber-400 ${showing?.id === e.id && 'bg-amber-400'}`}
            >
              {e.piece_type} {e.event_type} {e.x}, {e.y}
            </Button>
          )
        })}
      </div>
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
