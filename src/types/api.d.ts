import type { AnySchema } from 'yup'

export type ApiEntrypoint<P = AnySchema, R = AnySchema> = {
    params?: P
    response?: R
}

export interface ApiSignatures {
    [K: string]: ApiEntrypoint
}
