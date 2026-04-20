import { number, object, string } from 'yup';
import { ApiService, type ApiSignatures } from './ApiService';

const apiSchema = {
    getUsers: {
        params: object({
            name: string().required(),
            age: number()
        }),
        response: object({
            id: number().required(),
            name: string().required(),
            age: number()
        })
    },
    test: { params: object({ name: string() }) },
    getUserId: {
        params: object({ id: number().required() }),
        response: object({ id: number(), name: string() })
    }

} as const satisfies ApiSignatures;

type apiSchema = typeof apiSchema;

export class DjangoApiService extends ApiService<apiSchema> {
    constructor() {
        super(apiSchema, {
            getUsers: async () => false,
            test: () => fetch('test/', { method: 'get', headers: { 'Content-Type': 'application/json' } }),
            getUserId: ({ id }) => fetch(`/user/${id}`)
        })
    }
}

