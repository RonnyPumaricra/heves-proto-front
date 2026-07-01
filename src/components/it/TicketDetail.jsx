import { useEffect, useState } from 'react'
import { addComment, listComments, listItUsers, updateTicket } from '../../api/tickets'
import { StatusBadge, UrgencyBadge } from '../common/StatusBadge'

const STATUSES = ['open', 'in_progress', 'resolved', 'closed']

export default function TicketDetail({ ticket, onUpdated }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [itUsers, setItUsers] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!ticket) return
    listComments(ticket.id).then(setComments).catch(() => setComments([]))
    listItUsers().then(setItUsers).catch(() => setItUsers([]))
  }, [ticket?.id])

  if (!ticket) return null

  const doUpdate = async (patch) => {
    setSaving(true)
    try {
      const updated = await updateTicket(ticket.id, patch)
      onUpdated?.(updated)
    } finally {
      setSaving(false)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const c = await addComment(ticket.id, newComment.trim())
    setComments((prev) => [...prev, c])
    setNewComment('')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              #{ticket.id} · {ticket.title}
            </h1>
            <div className="text-sm text-gray-500 mt-1">
              {ticket.area_name || 'Sin área'} · Reportó {ticket.reporter?.full_name}
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge value={ticket.status} />
            <UrgencyBadge value={ticket.urgency} />
          </div>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <label className="text-sm">
            <span className="block text-xs text-gray-500 mb-1">Cambiar estado</span>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1"
              value={ticket.status}
              disabled={saving}
              onChange={(e) => doUpdate({ status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs text-gray-500 mb-1">Asignar a</span>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1"
              value={ticket.assigned_to?.id ?? ''}
              disabled={saving}
              onChange={(e) =>
                doUpdate({ assigned_to_id: e.target.value ? Number(e.target.value) : null })
              }
            >
              <option value="">Sin asignar</option>
              {itUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6">
        <h2 className="font-semibold mb-3">Comentarios</h2>
        <div className="space-y-3 mb-4">
          {comments.length === 0 && (
            <div className="text-sm text-gray-500">Sin comentarios aún.</div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="border-l-2 border-blue-400 pl-3">
              <div className="text-xs text-gray-500">
                {c.author_name} · {new Date(c.created_at).toLocaleString()}
              </div>
              <div className="text-sm">{c.body}</div>
            </div>
          ))}
        </div>
        <form onSubmit={submitComment} className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="Agregar comentario…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
