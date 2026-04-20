import { bool, object, string } from "yup";

import type { ApiSignatures } from "@/types/api";

export const apiSchema = {
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
} as const satisfies ApiSignatures;

export type apiSchema = typeof apiSchema;
