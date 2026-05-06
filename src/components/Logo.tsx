import { Badge } from './ui/badge'

export function Logo({
  hideOpenWorld = false,
  className = '',
}: React.ComponentProps<'div'> & { hideOpenWorld?: boolean }) {
  return (
    <div className={'relative text-[.5rem] lg:text-[1rem] ' + className}>
      <h1 className="text-[6em]">Tic•Tac•Toe</h1>
      {!hideOpenWorld && (
        <Badge className="top-[3.4em] right-0 absolute bg-primary/50 px-2 pb-1 border-4 rounded-lg font-bold text-[2em] text-error -rotate-13">
          Open World
        </Badge>
      )}
    </div>
  )
}
