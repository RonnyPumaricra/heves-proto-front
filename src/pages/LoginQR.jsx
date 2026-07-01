import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { qrLogin } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import QRLoginScanner from '../components/medical/QRLoginScanner'

export default function LoginQR() {
  const [token, setToken] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { loginWith } = useAuth()
  const nav = useNavigate()

  const tryLogin = async (t) => {
    setError(null)
    setSubmitting(true)
    try {
      const data = await qrLogin(t)
      loginWith(data)
      nav('/medico', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Token QR inválido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="bg-white p-8 border border-gray-200 rounded shadow-sm w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-center">Ingreso personal médico</h1>
        <QRLoginScanner onDetected={(t) => tryLogin(t)} />
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <p className="text-sm text-gray-500">O pegar el token manualmente:</p>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
            placeholder="token hex..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            disabled={!token || submitting}
            onClick={() => tryLogin(token.trim())}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Validando…' : 'Ingresar con token'}
          </button>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
        <div className="text-sm text-center text-gray-500">
          ¿Personal TI?{' '}
          <Link to="/login/staff" className="text-blue-600 hover:underline">
            Ingresar con usuario/contraseña
          </Link>
        </div>
      </div>
    </div>
  )
}
