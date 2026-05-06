import { Link, useLocation } from '@tanstack/react-router'

import { BackButton } from './BackButton'
import { Button } from './ui/button'

export function Header() {
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <header className="top-0 z-50 sticky bg-background p-4 border-foreground border-b-3 w-full">
      <div className="flex justify-between mx-auto container">
        {/* Left Side */}
        <div>{pathname !== '/' && <BackButton />}</div>

        {/* Right Side */}
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
      </div>
    </header>
  )
}
