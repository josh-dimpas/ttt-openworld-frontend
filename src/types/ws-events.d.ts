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

  export type GameCursor = {
    type: string
    x: number
    y: number
    username: string
    game_id: number
    ox: number // Offset Coordinates
    oy: number
  }

  export type All =
    | LobbyJoin
    | LobbyStart
    | LobbyLeave
    | LobbyCreate
    | GamePutPiece
}

export type WSEvents = {
  statechanged: [state: WebsocketState]
  connect: []
  disconnect: [event: CloseEvent]
  error: [event: Event]
  message: [event: MessageEvent]

  // App Specific Messages
  'lobby:join': [payload: WSEvent.LobbyJoin]
  'lobby:start': [payload: WSEvent.LobbyStart]
  'lobby:leave': [payload: WSEvent.LobbyLeave]
  'lobby:create': [payload: WSEvent.LobbyCreate]

  'game:put': [payload: WSEvent.GamePutPiece]
  'game:cursor': [payload: WSEvent.GameCursor]
}
