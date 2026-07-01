import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  if (!user) return null
  const home = user.role === 'medico' ? '/medico' : '/ti'
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <Link to={home} className="font-semibold text-blue-700">
        Tickets TI · Hospital
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">
          {user.full_name} · <span className="uppercase">{user.role}</span>
        </span>
        <button
          onClick={() => {
            logout()
            nav('/login/staff', { replace: true })
          }}
          className="text-red-600 hover:underline"
        >
          Salir
        </button>
      </div>
    </nav>
  )
}
