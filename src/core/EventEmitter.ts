type EventCallback<T extends unknown[] = unknown[]> = (...args: T) => void

export class EventEmitter<
  T extends Record<string, unknown[]> = Record<string, unknown[]>,
> {
  private _sources: Map<string, Map<number, EventCallback>> = new Map()

  // @ts-expect-error enforcing event callback with a generic passed on causes conflict on loose-typed event emitters
  on<TKey extends keyof T>(
    event: TKey,
    callback: EventCallback<T[TKey]>,
    abort?: AbortSignal,
  ): void
  on(event: string, callback: EventCallback, abort?: AbortSignal): void
  on(
    event: keyof T | string,
    callback: EventCallback,
    abort?: AbortSignal,
  ): () => void {
    const callbacks = this._sources.get(event as string) ?? new Map()

    const id = [...callbacks.keys()].length
    console.log(
      `REGISTERING EVENT: ${String(event)}[${id}] | ${String(callback)}`,
    )

    callbacks.set(id, callback)
    this._sources.set(event as string, callbacks)

    const unsubscribe = () => {
      console.log(`UNSUBSCRIBED : ${event.toString()}`)
      this.off(event, callback)
    }

    if (abort) abort.addEventListener('abort', unsubscribe.bind(this))

    return unsubscribe // Return the unsubscribe
  }

  // @ts-expect-error enforcing event callback with a generic passed on causes conflict on loose-typed event emitters
  off<TKey extends keyof T>(event: TKey, callback: EventCallback<T[TKey]>): void
  off(event: string, callback: EventCallback): void
  off(event: string, id: number): void
  off(event: keyof T | string, callback: number | EventCallback): void {
    const callbacks = this._sources.get(event as string)
    if (!callbacks) return

    const index =
      typeof callback === 'number'
        ? callback
        : [...callbacks.entries()].find(([_, v]) => v === callback)?.[0]

    if (index !== undefined) {
      callbacks.delete(index)
    }
  }

  // @ts-expect-error enforcing event callback with a generic passed on causes conflict on loose-typed event emitters
  once<TKey extends keyof T>(
    event: TKey,
    callback: EventCallback<T[TKey]>,
  ): void
  once(event: string, callback: EventCallback): void
  once(event: keyof T | string, callback: EventCallback): void {
    const wrapper: EventCallback = (...args: unknown[]) => {
      callback(...(args as any))
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  emit<TKey extends keyof T>(event: TKey, ...args: T[TKey]): void
  emit(event: keyof T | string, ...args: unknown[]): void {
    const callbacks = this._sources.get(event as string)
    if (!callbacks) return

    for (const callback of callbacks.values()) {
      callback(...args)
    }
  }

  removeAllListeners(event?: keyof T | string): void {
    if (event) {
      this._sources.delete(event as string)
    } else {
      this._sources.clear()
    }
  }
}
