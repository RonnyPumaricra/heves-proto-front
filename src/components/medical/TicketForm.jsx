import { useEffect, useState } from 'react'
import { createTicket, listAreas } from '../../api/tickets'
import { useAuth } from '../../hooks/useAuth'
import DeviceSelector from './DeviceSelector'

const URGENCIES = ['baja', 'media', 'alta', 'critica']

export default function TicketForm({ onCreated }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('media')
  const [areaId, setAreaId] = useState('')
  const [device, setDevice] = useState(null)
  const [areas, setAreas] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listAreas().then(setAreas).catch(() => setAreas([]))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!device) {
      setError('Debes seleccionar un equipo')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const t = await createTicket({
        title,
        description,
        urgency,
        area_id: areaId ? Number(areaId) : null,
        device_id: device.id,
      })
      setTitle('')
      setDescription('')
      setUrgency('media')
      setAreaId('')
      setDevice(null)
      onCreated?.(t)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow-sm border border-gray-200 space-y-3">
      <h2 className="font-semibold text-lg">Reportar incidencia</h2>
      <input
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Título breve (ej. Impresora no imprime)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 h-24"
        placeholder="Descripción del problema"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <DeviceSelector
        areaId={user?.area_id}
        selectedDevice={device}
        onSelect={setDevice}
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        >
          {URGENCIES.map((u) => (
            <option key={u} value={u}>
              Urgencia: {u}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
        >
          <option value="">Área (usar la mía)</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Enviando…' : 'Reportar'}
      </button>
    </form>
  )
}
