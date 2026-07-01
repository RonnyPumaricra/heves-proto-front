import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Cargando…</div>
  if (!user) return <Navigate to="/login/staff" replace />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return children
}
