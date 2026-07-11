const STATUS_STYLES = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-200 text-gray-700',
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
