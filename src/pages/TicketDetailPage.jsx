import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import TicketDetail from '../components/tickets/TicketDetail'
import { getTicket } from '../api/tickets'

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTicket(id)
      .then(setTicket)
      .catch((err) => setError(err.response?.data?.detail || 'Error'))
  }, [id])

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <Link to="/tecnico" className="text-sm text-blue-600 hover:underline">
          ← Volver al panel
        </Link>
        <div className="mt-4">
          {error && <div className="text-red-600">{error}</div>}
          {ticket && <TicketDetail ticket={ticket} onUpdated={setTicket} />}
        </div>
      </div>
    </div>
  )
}
