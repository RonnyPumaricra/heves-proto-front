# frontend-proto — Sistema de Tickets TI Hospital

React + Vite + Tailwind. Consume el backend en `VITE_API_BASE_URL`.

## Instalación

```bash
cd frontend-proto
npm install
cp .env.example .env
# editar .env con la URL del backend (por defecto http://localhost:8000/api)
```

## Ejecutar

```bash
npm run dev
```

Abrir `http://localhost:5173`.

## Flujos

- `/login/staff` — TI/Admin ingresan con email + contraseña.
- `/login/qr` — Personal médico escanea QR o **pega el token** (fallback dev-friendly).
- `/medico` — Formulario para crear ticket + historial propio.
- `/ti` — Panel con lista de tickets, filtros y stats.
- `/ti/tickets/:id` — Detalle, cambio de estado/asignación y comentarios.

## Credenciales de demo

- `admin@hospital.local` / `admin123`
- `soporte@hospital.local` / `soporte123`
- Tokens QR para los médicos: se imprimen en la consola del backend al arrancar.
