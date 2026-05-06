import { env } from '#/env'
import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId: string
  username: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'app-session',
    password: env.VITE_SESSION_SECRET,
    cookie: {
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}
