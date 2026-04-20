// ------------------------
//        Follow this Guide:
// ------------------------
//
// This file is the whole "backend", so always remember to minimize the imports from other files to reduce cohesion
// For the later "actual" backend to be used

import { apiSchema } from "@/schemas/api";
import type { User } from "@/schemas/user";

import { ApiService } from "./ApiService";

const USERS_KEY = "users";
const USERS_LAST_INDEX = "users-last-index";

export class LocalApiService extends ApiService<apiSchema> {
    constructor() {
        super(apiSchema, {
            login: (data) => {
                const user = this.getItem<User[]>(USERS_KEY, [])
                    .filter((u) => u.username === data.password && u.password === data.password)
                    .at(0);

                if (!user || user.password != data.password) return { success: false };

                const token = this.generateToken(user);

                return { success: false, token: token };
            },
            register: ({ username, password }) => {
                // Check if username is existing
                const user = this.getItem<User[]>(USERS_KEY, [])
                    .filter((u) => u.username === username)
                    .at(0);

                if (user) return { success: false };

                const id = this.getItem<number>(USERS_LAST_INDEX, 0) + 1;
                this.additem(USERS_KEY, { id, username, password });
                return { success: true };
            },
        });
    }

    // Utility Methods
    private additem(key: string, item: any) {
        const items = this.getItem<any[]>(key);
        if (!items) throw new Error(`Attempt to add item on a non-existing store with key: ${key}`);

        items.push(item);
        this.setItem(key, items);
    }

    private setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private getItem<T>(key: string, defaultValue?: T) {
        const value = localStorage.getItem(key);
        if (!value) return defaultValue as T;
        return JSON.parse(value) as T;
    }

    // Auth
    private generateToken(user: User, life: number = 3600) {
        // Using magic number here for default lifetime
        // but this should be defined in the actual backend
        // Just join the id, username, and life
        const token = `${user.id}-${user.username}-${Date.now() + life}`;
        return token;
    }
}
