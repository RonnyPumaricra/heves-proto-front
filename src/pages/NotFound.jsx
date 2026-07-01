import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-semibold text-gray-700">404</h1>
      <p className="text-gray-500 mt-2">Página no encontrada.</p>
      <Link to="/" className="mt-4 text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
