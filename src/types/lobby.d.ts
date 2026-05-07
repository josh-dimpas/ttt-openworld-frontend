import type { GameConfig } from './game'

interface Lobby {
  id: number
  join_code: string
  status: 'open' | 'full' | 'started'
  created_at: string
  created_by: number
  players: { id: number; name: string }[]
  config: GameConfig
}
