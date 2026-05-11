import { GameSchema } from '#/schemas/game'
import type { Game, GameEvent } from '#/types/game'
import { api } from '#/utils/api'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { currentUserFn } from './auth'

export const createGameFn = createServerFn()
  .inputValidator(GameSchema.config)
  .handler(async ({ data }) => {
    const context = await currentUserFn()
    return await api.post('/games/', { body: data, context })
  })

export const getGamesFn = createServerFn({ strict: { output: false } }).handler(
  async () => {
    const context = await currentUserFn()
    return await api.get<Game[]>('/games/', { context })
  },
)

export const getGameFn = createServerFn({
  strict: { output: false },
  method: 'GET',
})
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const context = await currentUserFn()
    return await api.get<Game | undefined>(`/games/${data.id}`, { context })
  })

export const putPieceFn = createServerFn({ strict: { output: false } })
  .inputValidator(
    z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const context = await currentUserFn()
    return await api.put<Game | undefined>(
      `/games/${data.id}/piece/${data.x}/${data.y}`,
      { context },
    )
  })

export const getGameEvents = createServerFn({
  strict: { output: false },
  method: 'GET',
})
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const context = await currentUserFn()
    return await api.get<GameEvent[]>(`/games/${data.id}/events`, {
      context,
    })
  })
