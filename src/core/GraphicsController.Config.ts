import { subscribeKey } from "valtio/utils";

import { type GameSchema } from "@/schemas/game";
import { gameStore } from "@/stores/game";

import { GraphicsControllerSubModule, type GraphicsController } from "./GraphicsController";

// Handles syncing of the current game state and config by managing the Valtio observable
export class GraphicsConfigController extends GraphicsControllerSubModule {
    // @ts-expect-error Initialized on component mount
    game: GameSchema;
    // @ts-expect-error Initialized on component mount
    #stop: Function;

    constructor(gc: GraphicsController) {
        super(gc);
    }

    setup() {
        const game = gameStore.game;
        if (!game) throw new Error("Setting up ConfigController without Game Config");

        this.game = game;
        this.#stop = subscribeKey(gameStore, "game", (game) => {
            if (!game) throw new Error("Game has been removed from the store");
            this.game = game;
        });
    }

    dismount() {
        this.#stop();
    }
}
