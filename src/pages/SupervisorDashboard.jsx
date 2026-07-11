import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge'
import {
  assignTicket,
  listTechnicians,
  listTickets,
  summaryStats,
} from '../api/tickets'

export default function SupervisorDashboard() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    setLoading(true)
    Promise.all([
      listTickets({ status: 'CREADO' }),
      listTechnicians(),
      summaryStats(),
    ])
      .then(([ts, techs, s]) => {
        setTickets(ts)
        setTechnicians(techs)
        setStats(s)
      })
      .catch(() => setError('Error al cargar la bandeja'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const doAssign = async (ticketId, tecnicoId) => {
    setError(null)
    try {
      await assignTicket(ticketId, tecnicoId)
      setAssigning(null)
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo asignar')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-baseline justify-between">
          <h1 className="text-xl font-semibold">Bandeja del supervisor</h1>
          {stats && (
            <div className="text-sm text-gray-500">
              CREADO: <b>{stats.by_status?.CREADO || 0}</b> · ASIGNADO:{' '}
              <b>{stats.by_status?.ASIGNADO || 0}</b> · EN_PROCESO:{' '}
              <b>{stats.by_status?.EN_PROCESO || 0}</b>
            </div>
          )}
        </header>

        {error && <div className="text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="text-sm text-gray-500">Cargando…</div>
        ) : tickets.length === 0 ? (
          <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded p-6">
            No hay tickets pendientes de asignación.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Título</th>
                  <th className="px-3 py-2">Área</th>
                  <th className="px-3 py-2">Prioridad</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Reportado por</th>
                  <th className="px-3 py-2">Creado</th>
                  <th className="px-3 py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tecnico/tickets/${t.id}`)}
                    className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-3 py-2 text-blue-600 font-medium">#{t.id}</td>
                    <td className="px-3 py-2">{t.title}</td>
                    <td className="px-3 py-2">{t.area_name || '—'}</td>
                    <td className="px-3 py-2"><PriorityBadge value={t.priority} /></td>
                    <td className="px-3 py-2"><StatusBadge value={t.status} /></td>
                    <td className="px-3 py-2">{t.reporter?.full_name}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      {assigning === t.id ? (
                        <select
                          autoFocus
                          className="border border-gray-300 rounded px-2 py-1"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) doAssign(t.id, Number(e.target.value))
                          }}
                          onBlur={() => setAssigning(null)}
                        >
                          <option value="" disabled>Elegir técnico…</option>
                          {technicians.map((u) => (
                            <option key={u.id} value={u.id}>{u.full_name}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setAssigning(t.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                        >
                          Asignar técnico
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
