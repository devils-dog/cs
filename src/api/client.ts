import { MapResponse, LineupResponse, LineupListResponse } from './types'

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (errorData.error?.code) {
        throw new ApiError(errorData.error.code, errorData.error.message)
      } else {
        throw new ApiError('UNKNOWN_ERROR', `HTTP ${response.status}: ${response.statusText}`)
      }
    }

    return response.json() as Promise<T>
  }

  async getMaps(): Promise<MapResponse[]> {
    return this.fetchJson<MapResponse[]>(`${this.baseUrl}/maps`)
  }

  async getMap(id: string): Promise<MapResponse> {
    return this.fetchJson<MapResponse>(`${this.baseUrl}/maps/${id}`)
  }

  async getMapTargets(
    mapId: string,
    filters?: {
      side?: 'T' | 'CT'
      grenade_type?: 'smoke' | 'flash' | 'molotov' | 'he'
    }
  ): Promise<string[]> {
    const params = new URLSearchParams()
    if (filters?.side) params.append('side', filters.side)
    if (filters?.grenade_type) params.append('grenade_type', filters.grenade_type)

    return this.fetchJson<string[]>(
      `${this.baseUrl}/maps/${mapId}/targets${params.toString() ? '?' + params.toString() : ''}`
    )
  }

  async getMapLineups(
    mapId: string,
    filters?: {
      side?: 'T' | 'CT'
      grenade_type?: 'smoke' | 'flash' | 'molotov' | 'he'
      target?: string
      page?: number
      limit?: number
    }
  ): Promise<LineupListResponse> {
    const params = new URLSearchParams()
    if (filters?.side) params.append('side', filters.side)
    if (filters?.grenade_type) params.append('grenade_type', filters.grenade_type)
    if (filters?.target) params.append('target', filters.target)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    return this.fetchJson<LineupListResponse>(
      `${this.baseUrl}/maps/${mapId}/lineups${params.toString() ? '?' + params.toString() : ''}`
    )
  }

  async getLineup(id: string): Promise<LineupResponse> {
    return this.fetchJson<LineupResponse>(`${this.baseUrl}/lineups/${id}`)
  }
}