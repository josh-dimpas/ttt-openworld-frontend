import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { gameStore } from "@/stores/game";

import { Renderer } from "../components/Renderer";
import { GraphicsController } from "../core/GraphicsController";
import { LocalApiService } from "../services/ApiService.Local";

const api = new LocalApiService();

export const Route = createFileRoute("/game/$gameid")({
    loader: async ({ params }) => {
        const gameId = Number(params.gameid);
        const game = await api.fetch("get_game", { id: gameId });
        if (!game) {
            throw new Error("Game not found");
        }

        gameStore.game = game;

        return game;
    },
    component: GamePage,
    pendingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
});

function LoadingComponent() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="text-xl">Loading game...</div>
        </div>
    );
}

function ErrorComponent({ error }: { error: Error }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <div className="text-xl text-red-500">{error.message || "Game not found"}</div>
            <Button asChild>
                <Link to="/">Go back home</Link>
            </Button>
        </div>
    );
}

function GamePage() {
    const { gameid } = Route.useParams();
    const controller = new GraphicsController();

    return (
        <div className="relative">
            <div className="container mx-auto">Game ID: {gameid}</div>
            <Renderer controller={controller} />
        </div>
    );
}
