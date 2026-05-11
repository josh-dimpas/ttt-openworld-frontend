import type { WSEvent } from '#/types/ws-events'
import { EventEmitter } from './EventEmitter'

export enum WebsocketState {
  Idle,
  Connecting,
  Connected,
  Disconnected,
}

type WSEvents = {
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
}

export class WebsocketService extends EventEmitter<WSEvents> {
  static instance: WebsocketService

  ws?: WebSocket
  state!: WebsocketState

  get connected() {
    return this.state === WebsocketState.Connected
  }

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (WebsocketService.instance) return WebsocketService.instance

    super()
    this.state = WebsocketState.Idle

    WebsocketService.instance = this
  }

  connect(url: string, token: string) {
    // DO NOT CONNECT WHEN ALREADY CONNECTED
    // HAVE TO EXPLICITLY CALL DISCONNECT TO RECONNECT
    if (this.connected) return

    this.ws = new WebSocket(`${url}?token=${token}`)
    this.state = WebsocketState.Connecting

    this.setup()
  }

  setup() {
    const { ws } = this
    if (!ws) return

    ws.onopen = () => {
      this.state = WebsocketState.Connected
      this.emit('statechanged', this.state)
      this.emit('connect')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('WS EVENT:', data)
      this.emit('message', data)
      this.handle(data)
    }

    ws.onclose = (event) => {
      this.state = WebsocketState.Disconnected
      this.emit('statechanged', this.state)
      this.emit('disconnect', event)
    }

    ws.onerror = (event) => {
      this.emit('error', event)
    }
  }

  getEventType(event: WSEvent.All) {
    const type = event.type
    switch (type) {
      case 'lobby:join':
      case 'lobby:start':
      case 'lobby:leave':
      case 'lobby:create':
      case 'game:put':
        return type
      default:
        throw new Error(`Unhandled Event Type: ${type}`)
    }
  }

  handle(payload: WSEvent.All) {
    const type = this.getEventType(payload)
    // @ts-expect-error payload union type messes up without validation
    this.emit(type, payload)
  }

  disconnect() {
    if (!this.ws || !this.connected) return

    this.ws.close()
  }
}
