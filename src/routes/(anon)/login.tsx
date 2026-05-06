import { createFileRoute } from '@tanstack/react-router'

import { AuthForms } from '@/components/blocks/auth-forms'
import { getRouter } from '#/router'
// import { DjangoApiService } from "@/services/ApiService.Django";

export const Route = createFileRoute('/(anon)/login')({
  component: RouteComponent,
})

// const api = new DjangoApiService();

function RouteComponent() {
  const router = getRouter()

  return (
    <AuthForms.Login
      title="Login"
      description="Enter your credentials to access the game"
      className="pt-24"
      onSignUp={() => router.navigate({ to: '/register' })}
      onSubmit={async (data) => {
        // const response = await api.fetch("login", data);
        // api.accessToken = response.access;
        // api.refreshToken = response.refresh;
        router.navigate({ to: '/' })
      }}
    />
  )
}
