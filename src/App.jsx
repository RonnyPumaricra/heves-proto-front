import { Navigate, Route, Routes } from 'react-router-dom'
import LoginStaff from './pages/LoginStaff'
import UserHome from './pages/UserHome'
import TechnicianDashboard from './pages/TechnicianDashboard'
import SupervisorDashboard from './pages/SupervisorDashboard'
import AdminHome from './pages/AdminHome'
import AdminSLA from './pages/AdminSLA'
import AdminUsers from './pages/AdminUsers'
import AdminAreas from './pages/AdminAreas'
import AdminDevices from './pages/AdminDevices'
import TicketDetailPage from './pages/TicketDetailPage'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

const HOME_BY_ROLE = {
  usuario: '/usuario',
  tecnico: '/tecnico',
  supervisor: '/supervisor',
  admin: '/admin',
}

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Cargando…</div>
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />
}

const ADMIN_ROUTES = [
  { path: '/admin', element: <AdminHome /> },
  { path: '/admin/sla', element: <AdminSLA /> },
  { path: '/admin/users', element: <AdminUsers /> },
  { path: '/admin/areas', element: <AdminAreas /> },
  { path: '/admin/devices', element: <AdminDevices /> },
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginStaff />} />
      <Route
        path="/usuario"
        element={
          <ProtectedRoute roles={['usuario']}>
            <UserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tecnico"
        element={
          <ProtectedRoute roles={['tecnico', 'supervisor', 'admin']}>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute roles={['supervisor', 'admin']}>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />
      {ADMIN_ROUTES.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<ProtectedRoute roles={['admin']}>{r.element}</ProtectedRoute>}
        />
      ))}
      <Route
        path="/tecnico/tickets/:id"
        element={
          <ProtectedRoute roles={['tecnico', 'supervisor', 'admin']}>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuario/tickets/:id"
        element={
          <ProtectedRoute roles={['usuario']}>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
