import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/create-game')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/create-game"!</div>
}
