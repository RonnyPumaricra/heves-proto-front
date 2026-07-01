import { createContext, useEffect, useState } from 'react'
import { me as fetchMe } from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      setLoading(true)
      fetchMe()
        .then((u) => {
          setUser(u)
          localStorage.setItem('user', JSON.stringify(u))
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loginWith = ({ access_token, role, user_id, full_name }) => {
    localStorage.setItem('token', access_token)
    const partial = { id: user_id, full_name, role, email: '', area_id: null, area_name: null }
    localStorage.setItem('user', JSON.stringify(partial))
    setUser(partial)
    fetchMe().then((u) => {
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWith, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
