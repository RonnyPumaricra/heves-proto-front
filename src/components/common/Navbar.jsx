import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const HOME_BY_ROLE = {
  usuario: '/usuario',
  tecnico: '/tecnico',
  supervisor: '/supervisor',
  admin: '/tecnico',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  if (!user) return null
  const home = HOME_BY_ROLE[user.role] || '/'
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <Link to={home} className="font-semibold text-blue-700">
        Servicedesk · Universidad
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user.role === 'admin' && (
          <Link to="/admin/sla" className="text-blue-700 hover:underline">
            SLA
          </Link>
        )}
        <span className="text-gray-600">
          {user.full_name} · <span className="uppercase">{user.role}</span>
        </span>
        <button
          onClick={() => {
            logout()
            nav('/login', { replace: true })
          }}
          className="text-red-600 hover:underline"
        >
          Salir
        </button>
      </div>
    </nav>
  )
}
