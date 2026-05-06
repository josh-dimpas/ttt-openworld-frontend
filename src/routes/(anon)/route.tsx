import { Header } from '#/components/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(anon)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center mx-auto h-full">
      <Header />
      <Outlet />
    </div>
  )
}
