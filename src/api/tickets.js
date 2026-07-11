import { api } from './client'

export const listTickets = (params = {}) =>
  api.get('/tickets', { params }).then((r) => r.data)

export const listMyTickets = () => api.get('/tickets/me').then((r) => r.data)

export const createTicket = (payload) =>
  api.post('/tickets', payload).then((r) => r.data)

export const getTicket = (id) => api.get(`/tickets/${id}`).then((r) => r.data)

export const updateTicket = (id, payload) =>
  api.patch(`/tickets/${id}`, payload).then((r) => r.data)

export const assignTicket = (id, tecnicoId) =>
  api.patch(`/tickets/${id}/asignacion`, { tecnico_id: tecnicoId }).then((r) => r.data)

export const changeTicketStatus = (id, status) =>
  api.patch(`/tickets/${id}/estado`, { status }).then((r) => r.data)

export const listTicketHistory = (id) =>
  api.get(`/tickets/${id}/history`).then((r) => r.data)

export const listComments = (id) =>
  api.get(`/tickets/${id}/comments`).then((r) => r.data)

export const addComment = (id, body) =>
  api.post(`/tickets/${id}/comments`, { body }).then((r) => r.data)

export const listAreas = () => api.get('/areas').then((r) => r.data)

export const listDevices = (params = {}) =>
  api.get('/devices', { params }).then((r) => r.data)

export const listTechnicians = () =>
  api.get('/users', { params: { role: 'tecnico' } }).then((r) => r.data)

export const submitTicketSurvey = (id, payload) =>
  api.post(`/tickets/${id}/survey`, payload).then((r) => r.data)

export const summaryStats = () => api.get('/stats/summary').then((r) => r.data)

export const statsByTechnician = () =>
  api.get('/stats/by-technician').then((r) => r.data)

export const listSLAPolicies = () =>
  api.get('/sla-policies').then((r) => r.data)

export const updateSLAPolicy = (priority, payload) =>
  api.patch(`/sla-policies/${priority}`, payload).then((r) => r.data)
