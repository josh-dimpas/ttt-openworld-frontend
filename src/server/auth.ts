import { useAppSession } from '#/hooks/session'
import { api } from '#/utils/api'
import { hasSession } from '#/utils/session'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

// Get current user
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    if (!hasSession(session.data)) return undefined

    return session.data
  },
)

const loginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user_id: z.number(),
  username: z.string(),
})

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const response = await api.post('/login', { body: data })
    const payload = loginResponseSchema.parse(response)

    const session = await useAppSession()
    await session.update(payload)

    return payload
  })

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => await api.post('/register', { body: data }))

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  if (!hasSession(session.data)) return undefined

  // await api.post('/logout', { context: session.data })
  await session.clear()
})
