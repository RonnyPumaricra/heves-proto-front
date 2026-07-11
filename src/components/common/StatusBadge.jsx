const STATUS_STYLES = {
  CREADO: 'bg-blue-100 text-blue-800',
  ASIGNADO: 'bg-indigo-100 text-indigo-800',
  EN_PROCESO: 'bg-yellow-100 text-yellow-800',
  RESUELTO: 'bg-green-100 text-green-800',
  CERRADO: 'bg-gray-200 text-gray-700',
}

const PRIORITY_STYLES = {
  baja: 'bg-gray-100 text-gray-700',
  media: 'bg-blue-100 text-blue-700',
  alta: 'bg-orange-100 text-orange-700',
  critica: 'bg-red-100 text-red-700',
}

export function StatusBadge({ value }) {
  const cls = STATUS_STYLES[value] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{value}</span>
}

export function PriorityBadge({ value }) {
  const cls = PRIORITY_STYLES[value] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{value}</span>
}

const SLA_STYLES = {
  on_track: 'bg-green-50 text-green-700 border border-green-200',
  at_risk: 'bg-amber-50 text-amber-700 border border-amber-200',
  breached: 'bg-red-50 text-red-700 border border-red-200',
  met: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const SLA_LABEL = {
  on_track: 'SLA ok',
  at_risk: 'SLA en riesgo',
  breached: 'SLA vencido',
  met: 'SLA cumplido',
}

export function SLABadge({ value }) {
  if (!value) return null
  const cls = SLA_STYLES[value] || 'bg-gray-50 text-gray-700 border border-gray-200'
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {SLA_LABEL[value] || value}
    </span>
  )
}
