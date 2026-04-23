type EventCallback<T extends unknown[] = unknown[]> = (...args: T) => void;

export class EventEmitter<T extends Record<string, unknown[]> = Record<string, unknown[]>> {
    private _events: Map<string, Map<number, EventCallback>> = new Map();

    // @ts-expect-error enforcing event callback with a generic passed on causes conflict on loose-typed event emitters
    on<K extends keyof T>(event: K, callback: EventCallback<T[K]>): void;
    on(event: string, callback: EventCallback): void;
    on(event: keyof T | string, callback: EventCallback): number {
        const callbacks = this._events.get(event as string) ?? new Map();

        const id = [...callbacks.keys()].length;
        console.log(`REGISTERING EVENT: ${String(event)}[${id}] | ${String(callback)}`);

        callbacks.set(id, callback);
        this._events.set(event as string, callbacks);
        return id;
    }

    // @ts-expect-error enforcing event callback with a generic passed on causes conflict on loose-typed event emitters
    off<K extends keyof T>(event: K, callback: EventCallback<T[K]>): void;
    off(event: string, callback: EventCallback): void;
    off(event: string, id: number): void;
    off(event: keyof T | string, callback: number | EventCallback): void {
        const callbacks = this._events.get(event as string);
        if (!callbacks) return;

        const index =
            typeof callback === "number"
                ? callback
                : [...callbacks.entries()].find(([_, v]) => v === callback)?.[0];

        if (index !== undefined) {
            callbacks.delete(index);
        }
    }

    // @ts-expect-error enforcing event callback with a generic passed on causes conflict on loose-typed event emitters
    once<K extends keyof T>(event: K, callback: EventCallback<T[K]>): void;
    once(event: string, callback: EventCallback): void;
    once(event: keyof T | string, callback: EventCallback): void {
        const wrapper: EventCallback = (...args: unknown[]) => {
            callback(...(args as any));
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    emit<K extends keyof T>(event: K, ...args: T[K]): void;
    emit(event: keyof T | string, ...args: unknown[]): void {
        const callbacks = this._events.get(event as string);
        if (!callbacks) return;

        for (const callback of callbacks.values()) {
            callback(...args);
        }
    }

    removeAllListeners(event?: keyof T | string): void {
        if (event) {
            this._events.delete(event as string);
        } else {
            this._events.clear();
        }
    }
}
