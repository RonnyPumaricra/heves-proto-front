import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import TicketDetail from '../components/tickets/TicketDetail'
import { getTicket } from '../api/tickets'
import { useAuth } from '../hooks/useAuth'

const BACK_BY_ROLE = {
  usuario: { to: '/usuario', label: '← Volver a mis reportes' },
  tecnico: { to: '/tecnico', label: '← Volver al panel' },
  supervisor: { to: '/supervisor', label: '← Volver a la bandeja' },
  admin: { to: '/tecnico', label: '← Volver al panel' },
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTicket(id)
      .then(setTicket)
      .catch((err) => setError(err.response?.data?.detail || 'Error'))
  }, [id])

  const back = BACK_BY_ROLE[user?.role] || { to: '/', label: '← Volver' }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <Link to={back.to} className="text-sm text-blue-600 hover:underline">
          {back.label}
        </Link>
        <div className="mt-4">
          {error && <div className="text-red-600">{error}</div>}
          {ticket && <TicketDetail ticket={ticket} onUpdated={setTicket} />}
        </div>
      </div>
    </div>
  )
}
