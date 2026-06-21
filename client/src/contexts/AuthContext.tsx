import { useState, useEffect, type ReactNode } from 'react'
import { api } from '../lib/api'
import { type User } from '../interfaces/user'
import { AuthContext } from './useAuth'


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken)
      api.setToken(storedToken)
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get<User>('/auth/me')
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    })
    if (response.success && response.data) {
      const { token: newToken, user: userData } = response.data
      setToken(newToken)
      setUser(userData)
      api.setToken(newToken)
    } else {
      throw new Error(response.message || 'Login failed')
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', {
      email,
      password,
      name,
    })
    if (response.success && response.data) {
      const { token: newToken, user: userData } = response.data
      setToken(newToken)
      setUser(userData)
      api.setToken(newToken)
    } else {
      throw new Error(response.message || 'Registration failed')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    api.setToken(null)
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

