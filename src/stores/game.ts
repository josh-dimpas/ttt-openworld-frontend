import type { Game } from '#/types/game'
import { proxy } from 'valtio'

export const gameStore = proxy<{
  game: Game | undefined
}>({
  game: undefined,
})
