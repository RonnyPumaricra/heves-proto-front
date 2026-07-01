import { Navigate, Route, Routes } from 'react-router-dom'
import LoginStaff from './pages/LoginStaff'
import LoginQR from './pages/LoginQR'
import MedicalHome from './pages/MedicalHome'
import ITDashboard from './pages/ITDashboard'
import TicketDetailPage from './pages/TicketDetailPage'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Cargando…</div>
  if (!user) return <Navigate to="/login/staff" replace />
  return <Navigate to={user.role === 'medico' ? '/medico' : '/ti'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login/staff" element={<LoginStaff />} />
      <Route path="/login/qr" element={<LoginQR />} />
      <Route
        path="/medico"
        element={
          <ProtectedRoute roles={['medico']}>
            <MedicalHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ti"
        element={
          <ProtectedRoute roles={['it', 'admin']}>
            <ITDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ti/tickets/:id"
        element={
          <ProtectedRoute roles={['it', 'admin']}>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
