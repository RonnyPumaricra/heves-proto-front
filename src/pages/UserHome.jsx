import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import TicketForm from '../components/user/TicketForm'
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge'
import { changeTicketStatus, listMyTickets } from '../api/tickets'

export default function UserHome() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    setLoading(true)
    listMyTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const closeTicket = async (id) => {
    setError(null)
    setClosing(id)
    try {
      await changeTicketStatus(id, 'CERRADO')
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo cerrar el ticket')
    } finally {
      setClosing(null)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <TicketForm onCreated={() => refresh()} />
        <section>
          <h2 className="font-semibold mb-3">Mis reportes</h2>
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          {loading ? (
            <div className="text-sm text-gray-500">Cargando…</div>
          ) : tickets.length === 0 ? (
            <div className="text-sm text-gray-500">Aún no has creado tickets.</div>
          ) : (
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li
                  key={t.id}
                  onClick={() => navigate(`/usuario/tickets/${t.id}`)}
                  className="bg-white border border-gray-200 rounded p-3 flex justify-between items-center gap-3 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">
                      <span className="text-blue-700">#{t.id}</span> · {t.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleString()} · {t.area_name || 'sin área'}
                      {t.assigned_to && ` · Técnico: ${t.assigned_to.full_name}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge value={t.status} />
                    <PriorityBadge value={t.priority} />
                    {t.status === 'RESUELTO' && (
                      <button
                        disabled={closing === t.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          closeTicket(t.id)
                        }}
                        className="px-3 py-1 rounded bg-gray-700 text-white text-xs hover:bg-gray-800 disabled:opacity-50"
                      >
                        {closing === t.id ? 'Cerrando…' : 'Cerrar'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
