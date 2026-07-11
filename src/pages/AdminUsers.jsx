import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import {
  changeUserRole,
  createUser,
  listAreas,
  listUsers,
  updateUser,
} from '../api/tickets'

const ROLES = ['usuario', 'tecnico', 'supervisor', 'admin']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [areas, setAreas] = useState([])
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    role: 'usuario',
    password: '',
    area_id: '',
  })
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    Promise.all([listUsers(), listAreas()]).then(([us, ars]) => {
      setUsers(us)
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
      await createUser({
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        password: form.password,
        area_id: form.area_id ? Number(form.area_id) : null,
      })
      setForm({ full_name: '', email: '', role: 'usuario', password: '', area_id: '' })
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear usuario')
    } finally {
      setBusy(null)
    }
  }

  const setRole = async (id, role) => {
    setBusy(`role-${id}`)
    try {
      await changeUserRole(id, role)
      refresh()
    } finally {
      setBusy(null)
    }
  }

  const toggleActive = async (u) => {
    setBusy(`active-${u.id}`)
    try {
      await updateUser(u.id, { is_active: !u.is_active })
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
          <Link to="/admin" className="text-sm text-blue-600 hover:underline">
            ← Admin
          </Link>
          <h1 className="text-xl font-semibold">Usuarios</h1>
        </div>

        <form
          onSubmit={create}
          className="bg-white border border-gray-200 rounded p-4 grid gap-3 md:grid-cols-6"
        >
          <input
            required
            className="border border-gray-300 rounded px-2 py-1 text-sm md:col-span-2"
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            required
            type="email"
            className="border border-gray-300 rounded px-2 py-1 text-sm md:col-span-2"
            placeholder="correo@untels.edu.pe"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
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
            required
            type="password"
            className="border border-gray-300 rounded px-2 py-1 text-sm md:col-span-5"
            placeholder="contraseña inicial"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            disabled={busy === 'create'}
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {busy === 'create' ? 'Creando…' : 'Crear'}
          </button>
          {error && <div className="text-sm text-red-600 md:col-span-6">{error}</div>}
        </form>

        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Rol</th>
                <th className="px-3 py-2">Área</th>
                <th className="px-3 py-2">Activo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{u.full_name}</td>
                  <td className="px-3 py-2 text-gray-600">{u.email}</td>
                  <td className="px-3 py-2">
                    <select
                      value={u.role}
                      disabled={busy === `role-${u.id}`}
                      onChange={(e) => setRole(u.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {areas.find((a) => a.id === u.area_id)?.name || '—'}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      disabled={busy === `active-${u.id}`}
                      onClick={() => toggleActive(u)}
                      className={`px-3 py-1 rounded text-xs text-white disabled:opacity-50 ${
                        u.is_active ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      {u.is_active ? 'Activo' : 'Inactivo'}
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
