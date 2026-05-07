import { Header } from '#/components/Header'
import { requireAuth } from '#/utils/session'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/lobby')({
  component: RouteComponent,
  loader: async () => {
    const context = await requireAuth()
    return { context }
  },
})

function RouteComponent() {
  const { context } = Route.useLoaderData()
  return (
    <div className="flex flex-col items-center mx-auto h-full">
      <Header user={context} />
      <Outlet />
    </div>
  )
}
