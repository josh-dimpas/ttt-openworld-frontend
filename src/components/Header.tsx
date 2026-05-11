import { Link, useLocation } from '@tanstack/react-router'

import { BackButton } from './BackButton'
import { Button } from './ui/button'
import type { UserData } from '#/types/auth'
import { useServerFn } from '@tanstack/react-start'
import { logoutFn } from '#/server/auth'
import { useMutation } from '@tanstack/react-query'
import { getRouter } from '#/router'
import { Loader2 } from 'lucide-react'
import { WebsocketService } from '#/core/Websockets'

export function Header({ user }: { user?: UserData }) {
  const router = getRouter()
  const pathname = useLocation({ select: (l) => l.pathname })
  const _logout = useServerFn(logoutFn)
  const ws = new WebsocketService()

  const { isPending: isLoggingOut, mutate: logout } = useMutation({
    mutationFn: async () => {
      await _logout()
      ws.disconnect()
    },
    onSuccess: () => router.navigate({ to: '/', reloadDocument: true }),
  })

  return (
    <header className="top-0 z-50 sticky bg-background p-4 border-foreground border-b-3 w-full">
      <div className="flex justify-between mx-auto container">
        {/* Left Side */}
        <div>{pathname !== '/' && <BackButton />}</div>

        {/* Right Side */}

        {user ? (
          <div className="flex items-center gap-8">
            <div>Welcome {user.username}</div>
            <Button
              disabled={isLoggingOut}
              variant="link"
              className="underline"
              onClick={() => logout()}
            >
              {isLoggingOut && <Loader2 className="animate-spin" />}
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-x-2">
            {pathname === '/' && (
              <>
                <Button variant="reverse" className="bg-secondary" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="reverse" className="bg-info" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
