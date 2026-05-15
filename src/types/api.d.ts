import type { AnySchema } from 'yup'

export type ApiEntrypoint<TParams = AnySchema, TResponse = AnySchema> = {
  params?: TParams
  response?: TResponse
}

export interface ApiSignatures {
  [K: string]: ApiEntrypoint
}
