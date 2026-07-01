import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { getDeviceByQR, listDevices } from '../../api/tickets'

export default function DeviceSelector({ areaId, selectedDevice, onSelect }) {
  const [devices, setDevices] = useState([])
  const [scanning, setScanning] = useState(false)
  const [qrError, setQrError] = useState(null)
  const scannerRef = useRef(null)
  const containerId = 'device-qr-scanner'

  useEffect(() => {
    listDevices(areaId ? { area_id: areaId } : {})
      .then(setDevices)
      .catch(() => setDevices([]))
  }, [areaId])

  useEffect(() => {
    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(() => {})
    }
  }, [])

  const startScan = async () => {
    setQrError(null)
    try {
      const qr = new Html5Qrcode(containerId)
      scannerRef.current = qr
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        async (decoded) => {
          await qr.stop().catch(() => {})
          scannerRef.current = null
          setScanning(false)
          try {
            const device = await getDeviceByQR(decoded.trim())
            onSelect(device)
          } catch {
            setQrError('QR no reconocido como dispositivo')
          }
        },
        () => {},
      )
      setScanning(true)
    } catch {
      setQrError('No se pudo acceder a la cámara. Selecciona el equipo del listado.')
      setScanning(false)
    }
  }

  const stopScan = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {})
      scannerRef.current = null
    }
    setScanning(false)
  }

  if (selectedDevice) {
    return (
      <div className="flex items-center gap-3 border border-green-300 bg-green-50 rounded px-3 py-2">
        <span className="text-green-700 text-sm font-medium">
          ✓ {selectedDevice.name} · {selectedDevice.device_type}
          {selectedDevice.location && ` · ${selectedDevice.location}`}
        </span>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="ml-auto text-xs text-gray-500 hover:text-red-600 underline"
        >
          cambiar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Equipo afectado <span className="text-red-500">*</span>
      </label>

      <div id={containerId} className="w-full max-w-sm border rounded" style={{ minHeight: scanning ? 220 : 0 }} />

      <div className="flex gap-2">
        {!scanning ? (
          <button
            type="button"
            onClick={startScan}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Escanear QR del equipo
          </button>
        ) : (
          <button
            type="button"
            onClick={stopScan}
            className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Cancelar
          </button>
        )}
      </div>

      {qrError && <div className="text-xs text-red-600">{qrError}</div>}

      {devices.length > 0 && (
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value=""
          onChange={(e) => {
            const d = devices.find((x) => String(x.id) === e.target.value)
            if (d) onSelect(d)
          }}
        >
          <option value="">— o seleccionar del listado —</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} · {d.device_type}{d.location ? ` · ${d.location}` : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
