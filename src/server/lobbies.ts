import type { Game } from '#/types/game'
import type { Lobby } from '#/types/lobby'
import { api } from '#/utils/api'
import { hasSession } from '#/utils/session'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { useAppSession } from './session'

export const currentLobbyFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await useAppSession()
    if (!hasSession(session.data)) return undefined

    const lobby = await api.get('/lobby/own', { context: session.data })

    if (!lobby || !('id' in lobby)) return undefined
    return lobby as Lobby
  },
)

export const getLobbiesFn = createServerFn({
  method: 'POST',
  strict: { output: false },
}).handler(async () => {
  const session = await useAppSession()
  if (!hasSession(session.data)) return []

  const lobbies = await api.get('/lobby/', { context: session.data })
  return lobbies as Lobby[]
})

export const joinLobbyFn = createServerFn({ method: 'POST' })
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    const context = await useAppSession()
    if (!hasSession(context.data)) return

    await api.post(`/lobby/${data}/join`, { context: context.data })
    return true
  })

export const leaveLobbyFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const context = await useAppSession()
    if (!hasSession(context.data)) return

    await api.post(`/lobby/leave`, { context: context.data })
    return true
  },
)

export const startLobbyFn = createServerFn({
  method: 'POST',
  strict: { output: false },
}).handler(async () => {
  const context = await useAppSession()
  if (!hasSession(context.data)) return

  return await api.post<Game | undefined>(`/lobby/start`, {
    context: context.data,
  })
})
