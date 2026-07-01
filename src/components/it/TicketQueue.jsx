import { Link } from 'react-router-dom'
import { StatusBadge, UrgencyBadge } from '../common/StatusBadge'

export default function TicketQueue({ tickets }) {
  if (!tickets.length) {
    return <div className="p-6 text-gray-500 text-sm">No hay tickets con esos filtros.</div>
  }
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Título</th>
            <th className="px-3 py-2">Área</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Urgencia</th>
            <th className="px-3 py-2">Reportado por</th>
            <th className="px-3 py-2">Asignado a</th>
            <th className="px-3 py-2">Creado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-2">
                <Link className="text-blue-600 hover:underline" to={`/ti/tickets/${t.id}`}>
                  {t.id}
                </Link>
              </td>
              <td className="px-3 py-2">{t.title}</td>
              <td className="px-3 py-2">{t.area_name || '—'}</td>
              <td className="px-3 py-2">
                <StatusBadge value={t.status} />
              </td>
              <td className="px-3 py-2">
                <UrgencyBadge value={t.urgency} />
              </td>
              <td className="px-3 py-2">{t.reporter?.full_name}</td>
              <td className="px-3 py-2">{t.assigned_to?.full_name || '—'}</td>
              <td className="px-3 py-2 text-gray-500">
                {new Date(t.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
