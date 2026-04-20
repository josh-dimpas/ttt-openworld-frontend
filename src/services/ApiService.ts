import type { AnySchema, InferType } from "yup";

import type { ApiEntrypoint, ApiSignatures } from "@/types/api";

type ExtractParams<T> = T extends ApiEntrypoint<infer P, any> ? P : AnySchema;
type ExtractResponse<T> = T extends ApiEntrypoint<any, infer R> ? R : AnySchema;

export type ParamsInput<S extends ApiSignatures, K extends keyof S> = InferType<
    ExtractParams<S[K]>
>;
export type ResponseOutput<S extends ApiSignatures, K extends keyof S> = Awaited<
    ReturnType<ExtractResponse<S[K]>["validate"]>
>;

type SignatureHandlers<S extends ApiSignatures> = {
    [K in keyof S]: (input: ParamsInput<S, K>) => unknown | PromiseLike<unknown>; // oxlint-disable-line no-redundant-type-constituents
};

abstract class ApiService<S extends ApiSignatures> {
    protected signatures: S;
    protected handlers: SignatureHandlers<S>;

    constructor(signatures: S, handler: SignatureHandlers<S>) {
        this.signatures = signatures;
        this.handlers = handler;
    }

    async fetch<K extends keyof S>(
        key: K,
        params: ParamsInput<S, K>,
    ): Promise<ResponseOutput<S, K>> {
        const validatedParams = await this.validateParams(key, params);
        const rawResponse = await this.handlers[key](validatedParams);
        return await this.validateResponse(key, rawResponse);
    }

    protected async validateParams<K extends keyof S>(
        key: K,
        params: ParamsInput<S, K>,
    ): Promise<ParamsInput<S, K>> {
        const schema = this.signatures[key]?.params;
        if (schema) {
            return await schema.validate(params);
        }
        return params;
    }

    protected async validateResponse<K extends keyof S>(
        key: K,
        response: unknown,
    ): Promise<ResponseOutput<S, K>> {
        const schema = this.signatures[key]?.response;
        if (schema) {
            return await schema.validate(response);
        }
        return response as ResponseOutput<S, K>;
    }
}

export { ApiService };
export type { ApiEntrypoint, ApiSignatures };
