import { env } from '#/env'
import type { UserData } from '#/types/auth'
import { createServerFn } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'
import z from 'zod'

export function useAppSession() {
  return useSession<UserData>({
    name: 'app-session',
    password: env.VITE_SESSION_SECRET,
    cookie: {
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}

export const getSessionData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    return session.data
  },
)

export const setSessionData = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      access: z.string(),
      refresh: z.string(),
      user_id: z.number(),
      username: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    await session.update(data)
  })
