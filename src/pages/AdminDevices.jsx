import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import {
  createDevice,
  deleteDevice,
  listAreas,
  listDevices,
  updateDevice,
} from '../api/tickets'

const TYPES = ['PC', 'Impresora', 'Proyector', 'Tablet', 'Otro']

export default function AdminDevices() {
  const [devices, setDevices] = useState([])
  const [areas, setAreas] = useState([])
  const [form, setForm] = useState({
    name: '',
    device_type: 'PC',
    area_id: '',
    location: '',
    serial_number: '',
  })
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    Promise.all([listDevices(), listAreas()]).then(([ds, ars]) => {
      setDevices(ds)
      setAreas(ars)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  const create = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy('create')
    try {
      await createDevice({
        name: form.name,
        device_type: form.device_type,
        area_id: form.area_id ? Number(form.area_id) : null,
        location: form.location || null,
        serial_number: form.serial_number || null,
      })
      setForm({ name: '', device_type: 'PC', area_id: '', location: '', serial_number: '' })
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (d) => {
    if (!confirm(`¿Dar de baja "${d.name}"?`)) return
    setBusy(`del-${d.id}`)
    try {
      await deleteDevice(d.id)
      refresh()
    } finally {
      setBusy(null)
    }
  }

  const setLocation = async (d, location) => {
    setBusy(`loc-${d.id}`)
    try {
      await updateDevice(d.id, { location })
      refresh()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/admin" className="text-sm text-blue-600 hover:underline">← Admin</Link>
          <h1 className="text-xl font-semibold">Dispositivos</h1>
        </div>

        <form
          onSubmit={create}
          className="bg-white border border-gray-200 rounded p-4 grid gap-3 md:grid-cols-6"
        >
          <input
            required
            className="border border-gray-300 rounded px-2 py-1 text-sm md:col-span-2"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={form.device_type}
            onChange={(e) => setForm({ ...form, device_type: e.target.value })}
          >
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={form.area_id}
            onChange={(e) => setForm({ ...form, area_id: e.target.value })}
          >
            <option value="">Sin área</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Ubicación"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Serie"
            value={form.serial_number}
            onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
          />
          <button
            disabled={busy === 'create'}
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm hover:bg-blue-700 disabled:opacity-50 md:col-span-6"
          >
            Crear dispositivo
          </button>
          {error && <div className="text-sm text-red-600 md:col-span-6">{error}</div>}
        </form>

        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Área</th>
                <th className="px-3 py-2">Ubicación</th>
                <th className="px-3 py-2">Serie</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{d.name}</td>
                  <td className="px-3 py-2">{d.device_type}</td>
                  <td className="px-3 py-2 text-gray-500">{d.area_name || '—'}</td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={d.location || ''}
                      disabled={busy === `loc-${d.id}`}
                      onBlur={(e) => {
                        if (e.target.value !== (d.location || '')) {
                          setLocation(d, e.target.value || null)
                        }
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-xs w-40"
                    />
                  </td>
                  <td className="px-3 py-2 text-gray-500">{d.serial_number || '—'}</td>
                  <td className="px-3 py-2">
                    <button
                      disabled={busy === `del-${d.id}`}
                      onClick={() => remove(d)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Dar de baja
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
