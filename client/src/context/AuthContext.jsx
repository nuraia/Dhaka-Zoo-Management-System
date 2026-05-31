import { useEffect, useMemo, useState } from 'react'
import { apiRequest, storeToken, getStoredToken } from '../api/client.js'
import { AuthContext } from './useAuth.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(Boolean(getStoredToken()))

  useEffect(() => {
    let active = true

    async function loadUser() {
      if (!getStoredToken()) {
        setInitializing(false)
        return
      }

      try {
        const data = await apiRequest('/auth/me')
        if (active) setUser(data.user)
      } catch {
        storeToken(null)
        if (active) setUser(null)
      } finally {
        if (active) setInitializing(false)
      }
    }

    loadUser()
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({
    user,
    initializing,
    async signin(credentials) {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      storeToken(data.token)
      setUser(data.user)
      return data.user
    },
    async register(details) {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details),
      })
      storeToken(data.token)
      setUser(data.user)
      return data.user
    },
    signout() {
      storeToken(null)
      setUser(null)
    },
  }), [user, initializing])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
