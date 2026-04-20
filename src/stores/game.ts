import { proxy } from "valtio";

import { type GameSchema } from "@/schemas/game";

export const gameStore = proxy<{
    game: GameSchema | undefined;
}>({
    game: undefined,
});
