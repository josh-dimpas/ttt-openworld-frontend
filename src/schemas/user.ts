import { number, object, string, type InferType } from "yup";

export const userSchema = object({
    id: number().required(),
    username: string().required(),
    password: string().required(),
})

export type User = InferType<typeof userSchema>;
