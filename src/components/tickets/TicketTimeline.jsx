import { useEffect, useState } from 'react'
import { listTicketHistory } from '../../api/tickets'

const FIELD_LABEL = {
  status: 'estado',
  priority: 'prioridad',
  assigned_to: 'técnico asignado',
  area: 'área',
}

function describe(entry) {
  const label = FIELD_LABEL[entry.field] || entry.field
  const from = entry.old_value ?? '—'
  const to = entry.new_value ?? '—'
  return `cambió ${label}: ${from} → ${to}`
}

export default function TicketTimeline({ ticketId, reloadKey }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!ticketId) return
    setLoading(true)
    setError(null)
    listTicketHistory(ticketId)
      .then(setEntries)
      .catch((err) => setError(err.response?.data?.detail || 'No se pudo cargar el historial'))
      .finally(() => setLoading(false))
  }, [ticketId, reloadKey])

  return (
    <div className="bg-white border border-gray-200 rounded p-6">
      <h2 className="font-semibold mb-3">Historial</h2>
      {loading ? (
        <div className="text-sm text-gray-500">Cargando…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : entries.length === 0 ? (
        <div className="text-sm text-gray-500">Sin cambios registrados aún.</div>
      ) : (
        <ol className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="border-l-2 border-indigo-400 pl-3">
              <div className="text-xs text-gray-500">
                {new Date(e.created_at).toLocaleString()} · {e.actor_name}
              </div>
              <div className="text-sm">{describe(e)}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
