import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { createArea, deleteArea, listAreas, updateArea } from '../api/tickets'

export default function AdminAreas() {
  const [areas, setAreas] = useState([])
  const [newName, setNewName] = useState('')
  const [edits, setEdits] = useState({})
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => listAreas().then(setAreas)

  useEffect(() => {
    refresh()
  }, [])

  const create = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setError(null)
    setBusy('create')
    try {
      await createArea({ name: newName.trim() })
      setNewName('')
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear')
    } finally {
      setBusy(null)
    }
  }

  const save = async (a) => {
    const name = (edits[a.id] ?? a.name).trim()
    if (!name || name === a.name) {
      setEdits((prev) => ({ ...prev, [a.id]: undefined }))
      return
    }
    setError(null)
    setBusy(`edit-${a.id}`)
    try {
      await updateArea(a.id, { name })
      setEdits((prev) => ({ ...prev, [a.id]: undefined }))
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (a) => {
    if (!confirm(`¿Eliminar el área "${a.name}"?`)) return
    setError(null)
    setBusy(`del-${a.id}`)
    try {
      await deleteArea(a.id)
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al eliminar')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/admin" className="text-sm text-blue-600 hover:underline">← Admin</Link>
          <h1 className="text-xl font-semibold">Áreas</h1>
        </div>

        <form onSubmit={create} className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Nombre de la nueva área"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            disabled={busy === 'create'}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Añadir
          </button>
        </form>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <ul className="space-y-2">
          {areas.map((a) => {
            const editing = edits[a.id] !== undefined
            return (
              <li key={a.id} className="bg-white border border-gray-200 rounded p-3 flex items-center gap-2">
                {editing ? (
                  <input
                    autoFocus
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    value={edits[a.id]}
                    onChange={(e) => setEdits({ ...edits, [a.id]: e.target.value })}
                  />
                ) : (
                  <span className="flex-1">{a.name}</span>
                )}
                {editing ? (
                  <button
                    disabled={busy === `edit-${a.id}`}
                    onClick={() => save(a)}
                    className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => setEdits({ ...edits, [a.id]: a.name })}
                    className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Editar
                  </button>
                )}
                <button
                  disabled={busy === `del-${a.id}`}
                  onClick={() => remove(a)}
                  className="text-xs px-2 py-1 text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
