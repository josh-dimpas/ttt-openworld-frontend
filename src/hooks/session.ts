import { useAppSession } from '#/server/session'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const getSessionData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    return session.data
  },
)

export const setSessionData = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      access: z.string().optional(),
      refresh: z.string().optional(),
      user_id: z.number().optional(),
      username: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    await session.update({ ...session.data, ...data })
  })
