import { joinLobbyFn } from '#/server/lobbies'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/lobby/$code')({
  component: RouteComponent,
  loader: async ({ params }) => {
    await joinLobbyFn({ data: params.code })
    throw redirect({ to: '/lobby' })
  },
})

function RouteComponent() {
  return (
    <div className="flex justify-center items-center grow">
      <div className="flex gap-2">
        <SpinnerGapIcon className="text-3xl animate-spin" />
        <div>Joining</div>
      </div>
    </div>
  )
}
