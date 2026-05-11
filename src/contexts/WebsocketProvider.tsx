import { Badge } from '#/components/ui/badge'
import { WebsocketService, WebsocketState } from '#/core/Websockets'
import { env } from '#/env'
import { currentUserFn } from '#/server/auth'
import { useServerFn } from '@tanstack/react-start'
import { CircleIcon } from 'lucide-react'
import React, { createContext, useEffect, useState } from 'react'

export const websocket = createContext<{
  ws: WebsocketService
  connect: () => void
}>({ ws: new WebsocketService(), connect: () => {} })

export function WebsocketProvider({ children }: { children: React.ReactNode }) {
  const ws = new WebsocketService()
  const _currentSession = useServerFn(currentUserFn)
  const [connected, setConnected] = useState(false)

  async function connect() {
    if (ws.connected) return

    const session = await _currentSession()
    if (!session) return
    ws.connect(env.VITE_WS_URL, session.access)
  }

  useEffect(() => {
    const abort = new AbortController()

    ws.on(
      'statechanged',
      (state) => setConnected(state === WebsocketState.Connected),
      abort.signal,
    )

    return () => abort.abort()
  }, [])

  connect()

  return (
    <websocket.Provider value={{ ws, connect }}>
      {children}
      <Badge
        className="bottom-0 left z-50 fixed"
        variant={connected ? 'secondary' : 'destructive'}
      >
        {connected && <CircleIcon className="mr-1 size-3" />}
        {connected ? 'Connected' : 'Disconnected'}
      </Badge>
    </websocket.Provider>
  )
}
