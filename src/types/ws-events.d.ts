import type { Lobby } from './lobby'

export namespace WSEvent {
  export type LobbyJoin = {
    type: string
    lobby_id: number
    player: { id: number; username: string }
  }

  export type LobbyStart = {
    type: string
    lobby_id: number
    game_id: number
  }

  export type LobbyLeave = {
    type: string
    lobby_id: number
    player: {
      id: number
      username: string
    }
  }

  export type LobbyCreate = {
    type: string
    lobby: Lobby
  }

  export type GamePutPiece = {
    type: string
    x: number
    y: number
    user_id: number
    game_id: number
  }

  export type All =
    | LobbyJoin
    | LobbyStart
    | LobbyLeave
    | LobbyCreate
    | GamePutPiece
}
