export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiClientOptions {
	baseUrl?: string
	defaultHeaders?: Record<string, string>
}

export class ApiError extends Error {
	status: number
	url: string
	body?: unknown

	constructor(message: string, status: number, url: string, body?: unknown) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.url = url
		this.body = body
	}
}

function getBaseUrl(): string {
	const envUrl = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined
	return envUrl?.replace(/\/$/, '') || '/api/v1'
}

export class ApiClient {
	private readonly baseUrl: string
	private readonly defaultHeaders: Record<string, string>

	constructor(options?: ApiClientOptions) {
		this.baseUrl = (options?.baseUrl || getBaseUrl()).replace(/\/$/, '')
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...options?.defaultHeaders,
		}
	}

	private buildUrl(path: string): string {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`
		return `${this.baseUrl}${normalizedPath}`
	}

	private async handleResponse<T>(res: Response, url: string): Promise<T> {
		const contentType = res.headers.get('content-type') || ''
		const isJson = contentType.includes('application/json')
		let parsed: unknown = undefined
		try {
			parsed = isJson ? await res.json() : await res.text()
		} catch (_) {
			// ignore parse errors
		}

		if (!res.ok) {
			const message = isJson && parsed && typeof parsed === 'object' && 'detail' in (parsed as any)
				? String((parsed as any).detail)
				: `Request failed with status ${res.status}`
			throw new ApiError(message, res.status, url, parsed)
		}

		return parsed as T
	}

	async request<T>(method: HttpMethod, path: string, init?: RequestInit & { query?: Record<string, string | number | boolean | null | undefined> }): Promise<T> {
		const url = new URL(this.buildUrl(path), window.location.origin)
		if (init?.query) {
			for (const [key, value] of Object.entries(init.query)) {
				if (value !== undefined && value !== null) {
					url.searchParams.set(key, String(value))
				}
			}
		}
		const res = await fetch(url.toString(), {
			method,
			headers: this.defaultHeaders,
			body: init?.body,
			signal: init?.signal,
			credentials: 'include',
		})
		return this.handleResponse<T>(res, url.toString())
	}

	get<T>(path: string, init?: RequestInit & { query?: Record<string, string | number | boolean | null | undefined> }) {
		return this.request<T>('GET', path, init)
	}
	post<T>(path: string, body?: unknown) {
		return this.request<T>('POST', path, { body: body ? JSON.stringify(body) : undefined })
	}
	put<T>(path: string, body?: unknown) {
		return this.request<T>('PUT', path, { body: body ? JSON.stringify(body) : undefined })
	}
	patch<T>(path: string, body?: unknown) {
		return this.request<T>('PATCH', path, { body: body ? JSON.stringify(body) : undefined })
	}
	delete<T>(path: string) {
		return this.request<T>('DELETE', path)
	}
}

export const apiClient = new ApiClient()
