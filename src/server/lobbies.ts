import { useAppSession } from '#/hooks/session'
import type { Lobby } from '#/types/lobby'
import { api } from '#/utils/api'
import { hasSession } from '#/utils/session'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const getCurrentLobbyFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await useAppSession()
    if (!hasSession(session.data)) return undefined

    const lobby = (await api.get('/lobby/own', { context: session.data })) as
      | Lobby
      | undefined

    if (!lobby || !('id' in lobby)) return undefined
    return lobby
  },
)

export const joinLobbyFn = createServerFn({ method: 'POST' })
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    const context = await useAppSession()
    if (!hasSession(context.data)) return

    await api.post(`/lobby/${data}/join`, { context: context.data })
    return true
  })
