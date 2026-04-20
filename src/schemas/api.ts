import { bool, number, object, string } from "yup";

import type { ApiSignatures } from "@/types/api";

import { gameConfigSchema, gameSchema } from "./game";

export const apiSchema = {
    // Auth
    login: {
        params: object({
            username: string().required(),
            password: string().required(),
        }),
        response: object({
            success: bool().required(),
            token: string(),
        }),
    },

    register: {
        params: object({
            username: string().required(),
            password: string().required(),
        }),
        response: object({ success: bool().required() }),
    },

    // Games
    create_game: {
        params: gameConfigSchema,
        response: gameSchema,
    },

    get_game: {
        params: object({ id: number().required() }),
        response: gameSchema.optional(),
    },
} as const satisfies ApiSignatures;

export type ApiSchema = typeof apiSchema;
