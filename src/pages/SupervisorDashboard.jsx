import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { StatusBadge, PriorityBadge, SLABadge } from '../components/common/StatusBadge'
import {
  assignTicket,
  listTechnicians,
  listTickets,
  summaryStats,
  statsByTechnician,
} from '../api/tickets'

function KPICard({ label, value, sub, accent = 'text-blue-700' }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

function minutesToStr(m) {
  if (m == null) return '—'
  if (m < 60) return `${m} min`
  const h = m / 60
  if (h < 24) return `${h.toFixed(1)} h`
  return `${(h / 24).toFixed(1)} d`
}

export default function SupervisorDashboard() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [stats, setStats] = useState(null)
  const [byTec, setByTec] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    setLoading(true)
    Promise.all([
      listTickets({ status: 'CREADO' }),
      listTechnicians(),
      summaryStats(),
      statsByTechnician(),
    ])
      .then(([ts, techs, s, tec]) => {
        setTickets(ts)
        setTechnicians(techs)
        setStats(s)
        setByTec(tec)
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
        </header>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KPICard
              label="Cumplimiento SLA"
              value={stats.sla?.compliance_percent != null ? `${stats.sla.compliance_percent}%` : '—'}
              sub={`${stats.sla?.met || 0} cumplidos · ${stats.sla?.breached || 0} vencidos`}
              accent="text-emerald-700"
            />
            <KPICard
              label="En riesgo"
              value={stats.sla?.at_risk || 0}
              accent="text-amber-700"
            />
            <KPICard
              label="Vencidos"
              value={stats.sla?.breached || 0}
              accent="text-red-600"
            />
            <KPICard
              label="T. respuesta prom."
              value={minutesToStr(stats.avg_response_minutes)}
            />
            <KPICard
              label="T. resolución prom."
              value={minutesToStr(stats.avg_resolution_minutes)}
            />
          </div>
        )}

        <section>
          <h2 className="font-semibold mb-2">Pendientes de asignación</h2>
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
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
                    <th className="px-3 py-2">SLA</th>
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
                      <td className="px-3 py-2"><SLABadge value={t.sla_status} /></td>
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
        </section>

        {byTec.length > 0 && (
          <section>
            <h2 className="font-semibold mb-2">Carga por técnico</h2>
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-3 py-2">Técnico</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Abiertos</th>
                    <th className="px-3 py-2">Resueltos</th>
                    <th className="px-3 py-2">En riesgo</th>
                    <th className="px-3 py-2">Vencidos</th>
                    <th className="px-3 py-2">T. resolución prom.</th>
                  </tr>
                </thead>
                <tbody>
                  {byTec.map((r) => (
                    <tr key={r.tecnico_id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{r.full_name}</td>
                      <td className="px-3 py-2">{r.total}</td>
                      <td className="px-3 py-2">{r.open}</td>
                      <td className="px-3 py-2">{r.resolved}</td>
                      <td className="px-3 py-2 text-amber-700">{r.at_risk}</td>
                      <td className="px-3 py-2 text-red-600">{r.breached}</td>
                      <td className="px-3 py-2 text-gray-500">
                        {minutesToStr(r.avg_resolution_minutes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
