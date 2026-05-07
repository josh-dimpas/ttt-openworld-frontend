export interface Game {
  id: number
  players: [GamePlayer, GamePlayer]
  config: GameConfig
  state: GameState
}

export interface GamePlayer {
  id: number
  revealBuffer: Uint32Array
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
  mapLayer: Uint32Array
  dataLayer: Uint32Array // Contains map data

  turn: GamePlayer['id']
}
