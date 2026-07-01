import { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import TicketForm from '../components/medical/TicketForm'
import { StatusBadge, UrgencyBadge } from '../components/common/StatusBadge'
import { listMyTickets } from '../api/tickets'

export default function MedicalHome() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <TicketForm onCreated={() => refresh()} />
        <section>
          <h2 className="font-semibold mb-3">Mis reportes</h2>
          {loading ? (
            <div className="text-sm text-gray-500">Cargando…</div>
          ) : tickets.length === 0 ? (
            <div className="text-sm text-gray-500">Aún no has creado tickets.</div>
          ) : (
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li
                  key={t.id}
                  className="bg-white border border-gray-200 rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      #{t.id} · {t.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleString()} · {t.area_name || 'sin área'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={t.status} />
                    <UrgencyBadge value={t.urgency} />
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
