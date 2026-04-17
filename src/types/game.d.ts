export interface Game {
    id: number;
    players: [GamePlayer, GamePlayer];
    config: GameConfig;
    state: GameState;
}

export interface GamePlayer {
    id: number;
    revealBuffer: Uint32Array;
}

export interface GameConfig {
    mapSeed: string;
    chunkSize: number;
    vectorOrientation: number;
    winPointsThreshold: number;

    sharedFog: boolean;
    timeLimit: number;
    mapSize: { width: number; height: number };
    revealRadius: number;
}

export interface GameState {
    mapLayer: Uint32Array;
    dataLayer: Uint32Array; // Contains map data

    turn: GamePlayer["id"];
}
