import { array, bool, number, object, string, tuple, type InferType } from "yup";

// 0 - X, 1 - O
export enum PieceType {
    X,
    O,
}

const pieceSchema = number<PieceType>().oneOf(Object.values(PieceType) as number[]);

export const gameStateSchema = object({
    pieceLayer: array(
        object({
            x: number().required(),
            y: number().required(),
            v: number().required(),
        }),
    ).required(),

    turn: pieceSchema.required(),
});

export const gameConfigSchema = object({
    seed: string().required(),
    chunkSize: number().required(),

    winPointsThreshold: number().required(),
    timeLimit: number().required(),
    revealSize: number().required(),

    sharedFog: bool().required(),
});

export const gamePlayerSchema = object({
    turn: pieceSchema.required(),
    revealBuffer: array(number().required()).required(),
});

export const gameSchema = object({
    id: number().required().positive(),

    players: tuple([gamePlayerSchema, gamePlayerSchema]),
    config: gameConfigSchema,
    state: gameStateSchema,
});

export type GameSchema = InferType<typeof gameSchema>;
export type GameConfig = InferType<typeof gameConfigSchema>;
