const STATUSES = ['', 'CREADO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO']
const PRIORITIES = ['', 'baja', 'media', 'alta', 'critica']

export default function TicketFilters({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <div className="flex flex-wrap gap-3 items-end bg-white p-4 border border-gray-200 rounded">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Estado</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={value.status || ''}
          onChange={(e) => set('status', e.target.value || undefined)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s || 'todos'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Prioridad</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={value.priority || ''}
          onChange={(e) => set('priority', e.target.value || undefined)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p || 'todas'}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
