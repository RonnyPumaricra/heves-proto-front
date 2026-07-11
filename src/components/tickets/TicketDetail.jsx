import { useEffect, useState } from 'react'
import {
  addComment,
  assignTicket,
  changeTicketStatus,
  listComments,
  listTechnicians,
} from '../../api/tickets'
import { StatusBadge, PriorityBadge, SLABadge } from '../common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import TicketTimeline from './TicketTimeline'
import SurveyModal from './SurveyModal'

export default function TicketDetail({ ticket, onUpdated }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [technicians, setTechnicians] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [assignPickerOpen, setAssignPickerOpen] = useState(false)
  const [surveyDismissed, setSurveyDismissed] = useState(false)

  const canManage = user?.role === 'supervisor' || user?.role === 'admin'
  const isReporter = user?.id === ticket?.reporter?.id
  const showSurveyModal =
    isReporter &&
    ticket?.status === 'CERRADO' &&
    !ticket?.survey &&
    !surveyDismissed

  useEffect(() => {
    if (!ticket) return
    listComments(ticket.id).then(setComments).catch(() => setComments([]))
    if (canManage) {
      listTechnicians().then(setTechnicians).catch(() => setTechnicians([]))
    }
  }, [ticket?.id, canManage])

  if (!ticket) return null

  const run = async (fn) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await fn()
      onUpdated?.(updated)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar')
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

  const actions = buildActions({ ticket, user, run })

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              #{ticket.id} · {ticket.title}
            </h1>
            <div className="text-sm text-gray-500 mt-1 space-y-0.5">
              <div>{ticket.area_name || 'Sin área'} · Reportó {ticket.reporter?.full_name}</div>
              {ticket.assigned_to && (
                <div>Asignado a: <span className="font-medium text-gray-700">{ticket.assigned_to.full_name}</span></div>
              )}
              {ticket.device && (
                <div>
                  Equipo: <span className="font-medium text-gray-700">{ticket.device.name}</span>
                  {' · '}{ticket.device.device_type}
                  {ticket.device.location && ` · ${ticket.device.location}`}
                </div>
              )}
              {ticket.sla_resolution_due_at && (
                <div>
                  SLA resolución: {new Date(ticket.sla_resolution_due_at).toLocaleString()}
                </div>
              )}
              {ticket.closed_at && (
                <div>Cerrado: {new Date(ticket.closed_at).toLocaleString()}</div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 max-w-[50%]">
            <StatusBadge value={ticket.status} />
            <PriorityBadge value={ticket.priority} />
            <SLABadge value={ticket.sla_status} />
          </div>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>

        {(actions.length > 0 || canManage) && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            {actions.map((a) => (
              <button
                key={a.label}
                disabled={saving}
                onClick={a.onClick}
                className={`px-3 py-1.5 rounded text-sm text-white disabled:opacity-50 ${a.className}`}
              >
                {a.label}
              </button>
            ))}
            {canManage && ticket.status !== 'CERRADO' && (
              assignPickerOpen ? (
                <select
                  autoFocus
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  defaultValue=""
                  disabled={saving}
                  onChange={(e) => {
                    if (e.target.value) {
                      const tecId = Number(e.target.value)
                      setAssignPickerOpen(false)
                      run(() => assignTicket(ticket.id, tecId))
                    }
                  }}
                  onBlur={() => setAssignPickerOpen(false)}
                >
                  <option value="" disabled>
                    {ticket.assigned_to ? 'Reasignar a…' : 'Asignar a…'}
                  </option>
                  {technicians.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name}</option>
                  ))}
                </select>
              ) : (
                <button
                  disabled={saving}
                  onClick={() => setAssignPickerOpen(true)}
                  className="px-3 py-1.5 rounded text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {ticket.assigned_to ? 'Reasignar técnico' : 'Asignar técnico'}
                </button>
              )
            )}
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      {ticket.survey && (
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="font-semibold mb-2">Evaluación del reportante</h2>
          <div className="flex items-center gap-2 text-amber-500 text-xl">
            {'★'.repeat(ticket.survey.rating)}
            <span className="text-gray-300">
              {'★'.repeat(5 - ticket.survey.rating)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(ticket.survey.created_at).toLocaleString()}
            </span>
          </div>
          {ticket.survey.comment && (
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {ticket.survey.comment}
            </p>
          )}
        </div>
      )}

      {showSurveyModal && (
        <SurveyModal
          ticketId={ticket.id}
          onDone={(survey) => onUpdated?.({ ...ticket, survey })}
          onDismiss={() => setSurveyDismissed(true)}
        />
      )}

      <TicketTimeline ticketId={ticket.id} reloadKey={ticket.updated_at} />

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

function buildActions({ ticket, user, run }) {
  if (!user) return []
  const isAssigned = ticket.assigned_to?.id === user.id
  const isReporter = ticket.reporter?.id === user.id
  const isAdmin = user.role === 'admin'
  const isTec = user.role === 'tecnico'
  const acts = []

  if (ticket.status === 'ASIGNADO' && (isAdmin || (isTec && isAssigned))) {
    acts.push({
      label: 'Tomar (EN_PROCESO)',
      className: 'bg-yellow-600 hover:bg-yellow-700',
      onClick: () => run(() => changeTicketStatus(ticket.id, 'EN_PROCESO')),
    })
  }
  if (ticket.status === 'EN_PROCESO' && (isAdmin || (isTec && isAssigned))) {
    acts.push({
      label: 'Marcar resuelto',
      className: 'bg-green-600 hover:bg-green-700',
      onClick: () => run(() => changeTicketStatus(ticket.id, 'RESUELTO')),
    })
  }
  if (ticket.status === 'RESUELTO' && (isAdmin || isReporter)) {
    acts.push({
      label: 'Cerrar ticket',
      className: 'bg-gray-700 hover:bg-gray-800',
      onClick: () => run(() => changeTicketStatus(ticket.id, 'CERRADO')),
    })
  }

  return acts
}
