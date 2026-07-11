import { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import { listSLAPolicies, updateSLAPolicy } from '../api/tickets'

const ORDER = ['critica', 'alta', 'media', 'baja']

export default function AdminSLA() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingRow, setSavingRow] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const refresh = () => {
    setLoading(true)
    listSLAPolicies()
      .then((rows) => {
        const byPri = Object.fromEntries(rows.map((r) => [r.priority, r]))
        setPolicies(ORDER.filter((p) => byPri[p]).map((p) => byPri[p]))
      })
      .catch(() => setError('No se pudieron cargar las políticas SLA'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const updateLocal = (priority, field, value) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.priority === priority ? { ...p, [field]: Number(value) } : p,
      ),
    )
  }

  const save = async (policy) => {
    setError(null)
    setNotice(null)
    setSavingRow(policy.priority)
    try {
      await updateSLAPolicy(policy.priority, {
        response_minutes: policy.response_minutes,
        resolution_minutes: policy.resolution_minutes,
      })
      setNotice(`Política ${policy.priority} guardada. Los tickets abiertos fueron recalculados.`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar')
    } finally {
      setSavingRow(null)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Políticas SLA</h1>
        <p className="text-sm text-gray-600">
          Umbrales en minutos, contados desde la creación del ticket. Al guardar, los
          tickets abiertos con esa prioridad se recalculan automáticamente.
        </p>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {notice && <div className="text-sm text-emerald-700">{notice}</div>}

        {loading ? (
          <div className="text-sm text-gray-500">Cargando…</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-3 py-2">Prioridad</th>
                  <th className="px-3 py-2">Respuesta (min)</th>
                  <th className="px-3 py-2">Resolución (min)</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.priority} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium capitalize">{p.priority}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        className="w-28 border border-gray-300 rounded px-2 py-1"
                        value={p.response_minutes}
                        onChange={(e) => updateLocal(p.priority, 'response_minutes', e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        className="w-28 border border-gray-300 rounded px-2 py-1"
                        value={p.resolution_minutes}
                        onChange={(e) => updateLocal(p.priority, 'resolution_minutes', e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        disabled={savingRow === p.priority}
                        onClick={() => save(p)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs disabled:opacity-50"
                      >
                        {savingRow === p.priority ? 'Guardando…' : 'Guardar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
