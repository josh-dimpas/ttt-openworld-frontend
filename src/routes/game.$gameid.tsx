import { createFileRoute } from '@tanstack/react-router';
import { Renderer } from '../components/Renderer';
import { GraphicsController } from '../core/GraphicsController';

export const Route = createFileRoute('/game/$gameid')({
    component: GamePage,
})

function GamePage() {
    const { gameid } = Route.useParams()
    const controller = new GraphicsController();

    return (
        <div className='relative'>
            <div className="mx-auto container">
                Game ID: {gameid}
            </div>
            <Renderer controller={controller} />
        </div>
    )
}
