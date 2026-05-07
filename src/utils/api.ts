import { env } from '#/env'
import type { UserData } from '#/types/auth'

type BodyType = Record<string, any>
type ContextType = { context?: UserData }

type GetRequestParams = Omit<RequestInit, 'method' | 'body'> & ContextType
type PostRequestParams = GetRequestParams & { body?: BodyType }

class API {
  static REFRESH_TOKEN_PATH = '/refresh-token'

  #access?: string
  #refresh?: string

  constructor() {}

  setTokens(data: { access: string; refresh: string }) {
    this.#access = data.access
    this.#refresh = data.refresh
  }

  private get baseHeaders(): RequestInit['headers'] {
    return {
      ...(this.#access ? { Authorization: `Bearer ${this.#access}` } : {}),
      'Content-Type': 'application/json',
    }
  }

  path(path: string) {
    return env.VITE_API_URL + path
  }

  #processContext(context: UserData) {
    this.setTokens(context)
  }

  async get(path: string, params: GetRequestParams = {}) {
    if (params.context) this.#processContext(params.context)
    return await (
      await fetch(this.path(path), {
        ...params,
        method: 'GET',
        headers: { ...params.headers, ...this.baseHeaders },
      })
    ).json()
  }

  async post(path: string, params: PostRequestParams = {}) {
    if (params.context) this.#processContext(params.context)
    return await (
      await fetch(this.path(path), {
        ...params,
        body: JSON.stringify(params.body),
        method: 'POST',
        headers: { ...params.headers, ...this.baseHeaders },
      })
    ).json()
  }

  async put(path: string, params: PostRequestParams) {
    if (params.context) this.#processContext(params.context)
    return await (
      await fetch(this.path(path), {
        ...params,
        body: JSON.stringify(params.body),
        method: 'PUT',
        headers: { ...params.headers, ...this.baseHeaders },
      })
    ).json()
  }

  refresh() {
    return fetch(this.path(API.REFRESH_TOKEN_PATH), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify({ token: this.#refresh }),
    })
  }
}

export const api = new API()
