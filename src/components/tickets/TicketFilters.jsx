const STATUSES = ['', 'CREADO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO']
const PRIORITIES = ['', 'baja', 'media', 'alta', 'critica']

export default function TicketFilters({
  value,
  onChange,
  areas = [],
  technicians = [],
  showAssignedTo = true,
  showAtRisk = true,
}) {
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
            <option key={s} value={s}>{s || 'todos'}</option>
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
            <option key={p} value={p}>{p || 'todas'}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Área</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={value.area_id || ''}
          onChange={(e) => set('area_id', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">todas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
      {showAssignedTo && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Técnico</label>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={value.assigned_to || ''}
            onChange={(e) => set('assigned_to', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">todos</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>{t.full_name}</option>
            ))}
          </select>
        </div>
      )}
      {showAtRisk && (
        <div className="flex items-center gap-2">
          <input
            id="atRisk"
            type="checkbox"
            checked={!!value.at_risk}
            onChange={(e) => set('at_risk', e.target.checked || undefined)}
          />
          <label htmlFor="atRisk" className="text-sm text-gray-700">
            En riesgo o vencidos
          </label>
        </div>
      )}
    </div>
  )
}
