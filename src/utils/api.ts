import { setAccessToken } from '#/server/auth'
import type { UserData } from '#/types/auth'

type BodyType = Record<string, any>
type ExtraOpts = { context?: UserData; refresh?: boolean }

type GetRequestParams = Omit<RequestInit, 'method' | 'body'> & ExtraOpts
type PostRequestParams = GetRequestParams & { body?: BodyType }

class API {
  static REFRESH_TOKEN_PATH = '/refresh-token'

  #access?: string
  #refresh?: string

  constructor() {}

  async setTokens(data: { access: string; refresh: string }) {
    const oldtoken = this.#access
    this.#access = data.access
    this.#refresh = data.refresh

    if (oldtoken !== data.access) await setAccessToken(this.#access)
  }

  private get baseHeaders(): RequestInit['headers'] {
    return {
      ...(this.#access ? { Authorization: `Bearer ${this.#access}` } : {}),
      'Content-Type': 'application/json',
    }
  }

  path(path: string) {
    const url = 'http://localhost:8000' + path
    console.log(import.meta.env)
    return url
  }

  async #processContext(context: UserData) {
    await this.setTokens(context)
  }

  async get<T = any>(path: string, params: GetRequestParams = {}): Promise<T> {
    if (params.context) this.#processContext(params.context)
    const response = await fetch(this.path(path), {
      ...params,
      method: 'GET',
      headers: { ...params.headers, ...this.baseHeaders },
    })

    const data = await response.json()

    if (this.isJWTExpired(response) && params.refresh !== false) {
      await this.refresh()
      return await this.get(path, { ...params, refresh: false })
    }

    return data
  }

  async post<T = any>(
    path: string,
    params: PostRequestParams = {},
  ): Promise<T> {
    if (params.context) this.#processContext(params.context)
    const response = await fetch(this.path(path), {
      ...params,
      body: JSON.stringify(params.body),
      method: 'POST',
      headers: { ...params.headers, ...this.baseHeaders },
    })

    const data = await response.json()

    if (this.isJWTExpired(response) && params.refresh !== false) {
      await this.refresh()
      return await this.post(path, { ...params, refresh: false })
    }

    return data
  }

  async put<T = any>(path: string, params: PostRequestParams): Promise<T> {
    if (params.context) this.#processContext(params.context)

    const response = await fetch(this.path(path), {
      ...params,
      body: JSON.stringify(params.body),
      method: 'PUT',
      headers: { ...params.headers, ...this.baseHeaders },
    })

    const data = await response.json()

    if (this.isJWTExpired(response) && params.refresh !== false) {
      await this.refresh()
      return await this.put(path, { ...params, refresh: false })
    }

    return data
  }

  async refresh() {
    const response = await fetch(this.path(API.REFRESH_TOKEN_PATH), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify({ refresh: this.#refresh }),
    })

    const data = await response.json()
    await this.setTokens({ access: data.access, refresh: this.#refresh! })
  }

  private isJWTExpired(response: Response) {
    // TODO: Let's use this error code for now, much better detection later
    return response.status === 401
  }
}

export const api = new API()
