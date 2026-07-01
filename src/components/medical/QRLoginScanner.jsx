import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QRLoginScanner({ onDetected }) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const scannerRef = useRef(null)
  const containerId = 'qr-scanner-container'

  const start = async () => {
    setError(null)
    try {
      const qr = new Html5Qrcode(containerId)
      scannerRef.current = qr
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 240 },
        (decoded) => {
          onDetected(decoded)
          qr.stop().catch(() => {})
          setScanning(false)
        },
        () => {},
      )
      setScanning(true)
    } catch (e) {
      setError('No se pudo acceder a la cámara. Puedes pegar el token manualmente.')
      setScanning(false)
    }
  }

  const stop = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch {
        /* ignore */
      }
      scannerRef.current = null
    }
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="space-y-2">
      <div id={containerId} className="w-full max-w-sm mx-auto border rounded" style={{ minHeight: 240 }} />
      <div className="flex gap-2 justify-center">
        {!scanning ? (
          <button
            type="button"
            onClick={start}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Iniciar cámara
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Detener
          </button>
        )}
      </div>
      {error && <div className="text-sm text-red-600 text-center">{error}</div>}
    </div>
  )
}
