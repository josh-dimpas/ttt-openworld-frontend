import { requireAuth } from '#/utils/session'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/join-game')({
  component: RouteComponent,
  loader: () => requireAuth(),
})

function RouteComponent() {
  return <div>Hello "/(auth)/join-game"!</div>
}
