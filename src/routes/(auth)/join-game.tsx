import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/join-game')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/join-game"!</div>
}
