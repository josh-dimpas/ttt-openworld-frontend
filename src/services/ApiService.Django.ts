import Cookies from "js-cookie";

import { apiSchema, type ApiSchema } from "@/schemas/api";

import { ApiService } from "./ApiService";

export class DjangoApiService extends ApiService<ApiSchema> {
    API_URL: string = import.meta.env["VITE_API_URL"]!;

    constructor() {
        super(apiSchema, {
            login: async (data) => {
                // Perform fetch here
                const res = await fetch(this.API_URL + "/login", {
                    body: JSON.stringify(data),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return await res.json();
            },

            register: async (data) => {
                const res = await fetch(this.API_URL + "/register", {
                    body: JSON.stringify(data),
                    method: "POST",
                });
                return await res.json();
            },
        });
    }

    get accessToken(): string | undefined {
        return Cookies.get("access_token");
    }

    get refreshToken(): string | undefined {
        return Cookies.get("refresh_token");
    }

    set accessToken(value: string) {
        Cookies.set("access_token", value, { path: "/", sameSite: "strict" });
    }

    set refreshToken(value: string) {
        Cookies.set("refresh_token", value, { path: "/", sameSite: "strict" });
    }
}
