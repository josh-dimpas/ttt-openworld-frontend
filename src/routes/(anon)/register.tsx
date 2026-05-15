import { createFileRoute } from '@tanstack/react-router'

import { AuthForms } from '@/components/blocks/auth-forms'
// import { DjangoApiService } from "@/services/ApiService.Django";
import { getRouter } from '#/router'
import { registerFn } from '#/server/auth'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/(anon)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = getRouter()
  const register = useServerFn(registerFn)

  return (
    <AuthForms.SignUp
      title="Register"
      className="pt-24"
      onSignIn={() => router.navigate({ to: '/login' })}
      onSubmit={async ({ name: username, password }) => {
        await register({ data: { username, password } })
        router.navigate({ to: '/login' })
      }}
    />
  )
}
