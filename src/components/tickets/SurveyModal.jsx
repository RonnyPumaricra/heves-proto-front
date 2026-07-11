import { useState } from 'react'
import { submitTicketSurvey } from '../../api/tickets'

export default function SurveyModal({ ticketId, onDone, onDismiss }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const send = async () => {
    if (!rating) {
      setError('Elige de 1 a 5 estrellas')
      return
    }
    setError(null)
    setSaving(true)
    try {
      const survey = await submitTicketSurvey(ticketId, {
        rating,
        comment: comment.trim() || null,
      })
      onDone?.(survey)
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo enviar la encuesta')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">¿Cómo fue la atención?</h2>
          <p className="text-sm text-gray-500">
            Tu ticket ya fue cerrado. Ayúdanos con tu evaluación.
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              aria-label={`${n} estrellas`}
              className={`text-3xl leading-none ${
                n <= rating ? 'text-amber-500' : 'text-gray-300'
              } hover:text-amber-400`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 h-24 text-sm"
          placeholder="Comentario (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onDismiss}
            className="px-3 py-2 text-sm text-gray-600 hover:underline"
          >
            Más tarde
          </button>
          <button
            disabled={saving}
            onClick={send}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            {saving ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
