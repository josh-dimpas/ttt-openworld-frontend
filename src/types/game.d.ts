export interface Game {
  id: number
  players: [GamePlayer, GamePlayer]
  config: GameConfig
  state: GameState
  reveal_buffer: Uint8Array
  can_put: boolean
}

export interface GamePlayer {
  id: number
  revealBuffer: Uint8Array
}

export interface GameConfig {
  seed: string
  chunk_size: number
  win_points_threshold: number

  shared_fog: boolean
  time_limit_seconds: number
  reveal_radius: number
}

export interface GameState {
  mapLayer: Uint8Array
  pieces: Uint8Array // Contains map data

  turn: GamePlayer['id']
}

export interface GameEvent {
  id: number
  account: number
  x: number
  y: number
  piece_type: 'O' | 'X'
  reveal_radius: number
  event_type: 'put' | 'initial'
  created_at: string
}
