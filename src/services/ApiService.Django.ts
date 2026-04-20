import { ApiSchema } from "@/schemas/api";

import { ApiService } from "./ApiService";

export class DjangoApiService extends ApiService<{}> {
    constructor() {
        super(ApiSchema, {});
    }
}
