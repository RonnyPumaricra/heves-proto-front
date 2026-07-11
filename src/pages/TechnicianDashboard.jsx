import { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import TicketFilters from '../components/tickets/TicketFilters'
import TicketQueue from '../components/tickets/TicketQueue'
import { listTickets, summaryStats } from '../api/tickets'
import { useAuth } from '../hooks/useAuth'

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const isTecnico = user?.role === 'tecnico'
  const [filters, setFilters] = useState({})
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const listParams = isTecnico ? { ...filters, assigned_to: user.id } : filters
    Promise.all([listTickets(listParams), summaryStats()])
      .then(([ts, s]) => {
        setTickets(ts)
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
            <StatCard label="Resueltos" value={stats.by_status?.RESUELTO || 0} />
            <StatCard
              label="Críticos"
              value={stats.by_priority?.critica || 0}
              accent="text-red-600"
            />
          </div>
        )}
        <TicketFilters value={filters} onChange={setFilters} />
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
