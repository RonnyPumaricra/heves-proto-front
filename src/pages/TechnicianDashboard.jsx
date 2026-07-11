import { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import TicketFilters from '../components/tickets/TicketFilters'
import TicketQueue from '../components/tickets/TicketQueue'
import {
  listAreas,
  listTechnicians,
  listTickets,
  summaryStats,
} from '../api/tickets'
import { useAuth } from '../hooks/useAuth'

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const isTecnico = user?.role === 'tecnico'
  const [filters, setFilters] = useState({})
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [areas, setAreas] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAreas().then(setAreas).catch(() => setAreas([]))
    if (!isTecnico) {
      listTechnicians().then(setTechnicians).catch(() => setTechnicians([]))
    }
  }, [isTecnico])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const { at_risk, ...serverFilters } = filters
    const listParams = isTecnico
      ? { ...serverFilters, assigned_to: user.id }
      : serverFilters
    Promise.all([listTickets(listParams), summaryStats()])
      .then(([ts, s]) => {
        const filtered = at_risk
          ? ts.filter((t) => ['at_risk', 'breached'].includes(t.sla_status))
          : ts
        setTickets(filtered)
        setStats(s)
      })
      .catch(() => {
        setTickets([])
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [filters, user?.id, isTecnico])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-xl font-semibold">
          {isTecnico ? 'Mis tickets asignados' : 'Panel de tickets'}
        </h1>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Creados" value={stats.by_status?.CREADO || 0} />
            <StatCard label="En proceso" value={stats.by_status?.EN_PROCESO || 0} />
            <StatCard
              label="SLA en riesgo"
              value={stats.sla?.at_risk || 0}
              accent="text-amber-700"
            />
            <StatCard
              label="SLA vencidos"
              value={stats.sla?.breached || 0}
              accent="text-red-600"
            />
          </div>
        )}
        <TicketFilters
          value={filters}
          onChange={setFilters}
          areas={areas}
          technicians={technicians}
          showAssignedTo={!isTecnico}
        />
        {loading ? (
          <div className="text-sm text-gray-500">Cargando tickets…</div>
        ) : (
          <TicketQueue tickets={tickets} />
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent = 'text-blue-700' }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  )
}
