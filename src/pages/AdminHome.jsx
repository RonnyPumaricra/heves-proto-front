import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

const SECTIONS = [
  { to: '/admin/users', label: 'Usuarios', desc: 'Alta, edición, cambio de rol, desactivar.' },
  { to: '/admin/areas', label: 'Áreas', desc: 'Catálogo de áreas académicas y administrativas.' },
  { to: '/admin/devices', label: 'Dispositivos', desc: 'Equipos e infraestructura.' },
  { to: '/admin/sla', label: 'Políticas SLA', desc: 'Umbrales de respuesta y resolución por prioridad.' },
]

export default function AdminHome() {
  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Administración</h1>
        <div className="grid gap-3 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="block bg-white border border-gray-200 rounded p-4 hover:bg-blue-50"
            >
              <div className="font-medium text-blue-700">{s.label}</div>
              <div className="text-sm text-gray-500 mt-1">{s.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
