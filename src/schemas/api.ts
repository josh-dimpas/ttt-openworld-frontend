import { object, string } from "yup";

import type { ApiSignatures } from "@/types/api";

export const apiSchema = {
    // Auth
    login: {
        params: object({
            username: string().required(),
            password: string().required(),
        }),
        response: object({
            access: string().required(),
            refresh: string().required(),
        }),
    },

    register: {
        params: object({
            username: string().required(),
            password: string().required(),
        }),
        response: object({ message: string().required() }),
    },

    // Games
    // create_game: {
    //     params: gameConfigSchema,
    //     response: gameSchema,
    // },

    // get_game: {
    //     params: object({ id: number().required() }),
    //     response: gameSchema.optional(),
    // },
} as const satisfies ApiSignatures;

export type ApiSchema = typeof apiSchema;
