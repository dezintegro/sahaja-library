import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../api/auth'
import type {
  IUser,
  ILoginRequest,
  IRegisterRequest,
  IPasswordChangeRequest,
  IPasswordResetRequest,
  IPasswordResetConfirmRequest,
  IUserUpdateRequest,
} from '../types/user'

interface IAuthContext {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: ILoginRequest) => Promise<void>
  register: (data: IRegisterRequest) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: IUserUpdateRequest) => Promise<void>
  changePassword: (data: IPasswordChangeRequest) => Promise<void>
  resetPassword: (data: IPasswordResetRequest) => Promise<void>
  confirmPasswordReset: (data: IPasswordResetConfirmRequest) => Promise<void>
  clearError: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = user !== null

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
      setError(null)
    } catch (err: any) {
      // User is not authenticated
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: ILoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authAPI.login(data)
      if (response.user) {
        setUser(response.user)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: IRegisterRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authAPI.register(data)
      if (response.user) {
        setUser(response.user)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await authAPI.logout()
      setUser(null)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: IUserUpdateRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedUser = await authAPI.updateProfile(data)
      setUser(updatedUser)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Profile update failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (data: IPasswordChangeRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      await authAPI.changePassword(data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Password change failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (data: IPasswordResetRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      await authAPI.resetPassword(data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Password reset request failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const confirmPasswordReset = async (data: IPasswordResetConfirmRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      await authAPI.confirmPasswordReset(data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Password reset confirmation failed. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const clearError = () => {
    setError(null)
  }

  const value: IAuthContext = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    confirmPasswordReset,
    clearError,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
