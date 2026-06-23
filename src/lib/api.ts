import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { Article, ArticleRequest, AuthResponse, User } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let accessToken: string | null = localStorage.getItem('accessToken')
let refreshToken: string | null = localStorage.getItem('refreshToken')

export function setTokens(auth: AuthResponse) {
  accessToken = auth.accessToken
  refreshToken = auth.refreshToken
  localStorage.setItem('accessToken', auth.accessToken)
  localStorage.setItem('refreshToken', auth.refreshToken)
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export function getAccessToken() {
  return accessToken
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) return null
  try {
    const { data } = await axios.post<AuthResponse>(`${BASE_URL}/auth/refresh`, {
      refreshToken,
    })
    setTokens(data)
    return data.accessToken
  } catch {
    clearTokens()
    return null
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry && refreshToken) {
      original._retry = true
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const newToken = await refreshPromise
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data && typeof data === 'object' && 'error' in data) {
      return String((data as { error: string }).error)
    }
    if (data && typeof data === 'object' && 'message' in data) {
      return String((data as { message: string }).message)
    }
  }
  return 'Something went wrong'
}

// Auth
export async function signup(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/signup', { email, password })
  setTokens(data)
  return data
}

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  setTokens(data)
  return data
}

export async function logout() {
  if (refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken })
    } catch {
      // ignore
    }
  }
  clearTokens()
}

export async function getMe() {
  const { data } = await api.get<User>('/auth/me')
  return data
}

// Articles
export async function getArticles(page = 0, size = 10) {
  const { data } = await api.get<Article[]>('/articles', { params: { page, size } })
  return data
}

export async function getArticle(id: number) {
  const { data } = await api.get<Article>(`/articles/${id}`)
  return data
}

export async function searchArticles(q: string, tags?: string[]) {
  const { data } = await api.get<Article[]>('/articles/search', {
    params: { q, tags },
    paramsSerializer: (params) => {
      const search = new URLSearchParams()
      search.set('q', params.q)
      if (params.tags) {
        for (const tag of params.tags) search.append('tags', tag)
      }
      return search.toString()
    },
  })
  return data
}

export async function createArticle(body: ArticleRequest) {
  const { data } = await api.post<Article>('/articles', body)
  return data
}

export async function updateArticle(id: number, body: ArticleRequest) {
  const { data } = await api.put<Article>(`/articles/${id}`, body)
  return data
}

export async function deleteArticle(id: number) {
  await api.delete(`/articles/${id}`)
}

export async function getAdminArticles() {
  const { data } = await api.get<Article[]>('/admin/articles')
  return data
}

export async function getPresignedUploadUrl(fileName: string, contentType: string) {
  const { data } = await api.post('/articles/images/presigned-url', {
    fileName,
    contentType,
  })
  return data
}
