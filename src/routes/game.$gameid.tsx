import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/game/$gameid')({
    component: GamePage,
})

function GamePage() {
    const { gameid } = Route.useParams()
    return (
        <div>
            Game: {gameid}
        </div>
    )
}