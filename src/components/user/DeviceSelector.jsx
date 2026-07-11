import { useEffect, useState } from 'react'
import { listDevices } from '../../api/tickets'

export default function DeviceSelector({ areaId, selectedDevice, onSelect }) {
  const [devices, setDevices] = useState([])

  useEffect(() => {
    listDevices(areaId ? { area_id: areaId } : {})
      .then(setDevices)
      .catch(() => setDevices([]))
  }, [areaId])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Equipo afectado <span className="text-gray-400 text-xs">(opcional)</span>
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        value={selectedDevice?.id ?? ''}
        onChange={(e) => {
          const d = devices.find((x) => String(x.id) === e.target.value)
          onSelect(d || null)
        }}
      >
        <option value="">— sin equipo específico —</option>
        {devices.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} · {d.device_type}{d.location ? ` · ${d.location}` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
