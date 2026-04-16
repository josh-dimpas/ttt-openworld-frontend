import { createFileRoute, Link } from '@tanstack/react-router'
import { Input } from '../components/daisy/Input'
import { useSearchQuery } from '../utils/url'

export const Route = createFileRoute('/join-game')({
    component: RouteComponent,
})

function RouteComponent() {
    const [mapSeed, setMapSeed] = useSearchQuery<string>('gamecode', "")


    return <div className='flex flex-col justify-center mx-auto p-4 max-w-2xl h-full container'>
        <div className='pb-6'>
            <Link to='/' className="w-fit underline">  Back </Link>
        </div>

        <h1 className="mb-6 font-bold text-2xl">Join Game</h1>
        <Input placeholder='Enter Game Code...' value={mapSeed} onChange={(e) => setMapSeed(e.target.value)} />
    </div>
}
