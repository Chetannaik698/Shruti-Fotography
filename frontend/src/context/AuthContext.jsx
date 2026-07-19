import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('lumiframe_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('lumiframe_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  const signup = async ({ name, email, password }) => {
    const { data } = await api.post('/auth/signup', { name, email, password })
    localStorage.setItem('lumiframe_token', data.token)
    setUser(data.user)
    return data.user
  }

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('lumiframe_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // Ignore network errors on logout — clear client state regardless
    }
    localStorage.removeItem('lumiframe_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
