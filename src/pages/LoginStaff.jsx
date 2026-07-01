import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../hooks/useAuth'

export default function LoginStaff() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { loginWith } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const data = await login(email, password)
      loginWith(data)
      nav(data.role === 'medico' ? '/medico' : '/ti', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="bg-white p-8 border border-gray-200 rounded shadow-sm w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Ingreso TI / Admin</h1>
        <input
          type="email"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="correo@hospital.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
        <div className="text-sm text-center text-gray-500">
          ¿Personal médico?{' '}
          <Link to="/login/qr" className="text-blue-600 hover:underline">
            Ingresar con QR
          </Link>
        </div>
      </form>
    </div>
  )
}
