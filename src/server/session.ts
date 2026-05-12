import { env } from '#/env'
import type { UserData } from '#/types/auth'

export async function useAppSession() {
  const { useSession } = await import('@tanstack/react-start/server')

  return await useSession<UserData>({
    name: 'app-session',
    password: env.VITE_SESSION_SECRET,
    cookie: {
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}
