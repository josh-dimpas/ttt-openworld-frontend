import { createFileRoute } from '@tanstack/react-router'

import { getRouter } from '#/router'
import { loginFn } from '#/server/auth'
import { AuthForms } from '@/components/blocks/auth-forms'

export const Route = createFileRoute('/(anon)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = getRouter()

  return (
    <AuthForms.Login
      title="Login"
      description="Enter your credentials to access the game"
      className="pt-24"
      onSignUp={() => router.navigate({ to: '/register' })}
      onSubmit={async (data) => {
        await loginFn({ data })
        router.navigate({ to: '/' })
      }}
    />
  )
}
