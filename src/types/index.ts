export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface User {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

export interface Article {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: string
  updatedAt: string
  viewCount: number
  tags: string[]
}

export interface ArticleRequest {
  title: string
  content: string
  tags?: string[]
}

export interface ApiError {
  timestamp?: string
  status?: number
  error?: string
  message?: string
}
