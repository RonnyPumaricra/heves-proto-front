import { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import TicketFilters from '../components/it/TicketFilters'
import TicketQueue from '../components/it/TicketQueue'
import { listTickets, summaryStats } from '../api/tickets'

export default function ITDashboard() {
  const [filters, setFilters] = useState({})
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([listTickets(filters), summaryStats()])
      .then(([ts, s]) => {
        setTickets(ts)
        setStats(s)
      })
      .catch(() => {
        setTickets([])
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Abiertos" value={stats.by_status?.open || 0} />
            <StatCard label="En progreso" value={stats.by_status?.in_progress || 0} />
            <StatCard label="Resueltos" value={stats.by_status?.resolved || 0} />
            <StatCard
              label="Críticos"
              value={stats.by_urgency?.critica || 0}
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
