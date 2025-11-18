import axios, { AxiosInstance } from 'axios'
import { API_URL } from '../constants'
import type {
  IUser,
  ILoginRequest,
  IRegisterRequest,
  IPasswordChangeRequest,
  IPasswordResetRequest,
  IPasswordResetConfirmRequest,
  IUserUpdateRequest,
  IAuthResponse,
} from '../types/user'

// Create axios instance with credentials support
const authApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add CSRF token to requests
authApi.interceptors.request.use((config) => {
  // Get CSRF token from cookie
  const csrfToken = getCookie('csrftoken')
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  return config
})

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

// Auth API methods
export const authAPI = {
  // Register new user
  register: async (data: IRegisterRequest): Promise<IAuthResponse> => {
    const response = await authApi.post<IAuthResponse>('/auth/register/', data)
    return response.data
  },

  // Login user
  login: async (data: ILoginRequest): Promise<IAuthResponse> => {
    const response = await authApi.post<IAuthResponse>('/auth/login/', data)
    return response.data
  },

  // Logout user
  logout: async (): Promise<IAuthResponse> => {
    const response = await authApi.post<IAuthResponse>('/auth/logout/')
    return response.data
  },

  // Get current user
  getCurrentUser: async (): Promise<IUser> => {
    const response = await authApi.get<IUser>('/auth/me/')
    return response.data
  },

  // Update user profile
  updateProfile: async (data: IUserUpdateRequest): Promise<IUser> => {
    const response = await authApi.put<IUser>('/auth/profile/', data)
    return response.data
  },

  // Change password
  changePassword: async (data: IPasswordChangeRequest): Promise<IAuthResponse> => {
    const response = await authApi.post<IAuthResponse>('/auth/password/change/', data)
    return response.data
  },

  // Request password reset
  resetPassword: async (data: IPasswordResetRequest): Promise<IAuthResponse> => {
    const response = await authApi.post<IAuthResponse>('/auth/password/reset/', data)
    return response.data
  },

  // Confirm password reset
  confirmPasswordReset: async (data: IPasswordResetConfirmRequest): Promise<IAuthResponse> => {
    const response = await authApi.post<IAuthResponse>('/auth/password/reset/confirm/', data)
    return response.data
  },
}

export default authAPI
