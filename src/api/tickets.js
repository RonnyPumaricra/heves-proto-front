import { api } from './client'

export const listTickets = (params = {}) =>
  api.get('/tickets', { params }).then((r) => r.data)

export const listMyTickets = () => api.get('/tickets/me').then((r) => r.data)

export const createTicket = (payload) =>
  api.post('/tickets', payload).then((r) => r.data)

export const getTicket = (id) => api.get(`/tickets/${id}`).then((r) => r.data)

export const updateTicket = (id, payload) =>
  api.patch(`/tickets/${id}`, payload).then((r) => r.data)

export const listComments = (id) =>
  api.get(`/tickets/${id}/comments`).then((r) => r.data)

export const addComment = (id, body) =>
  api.post(`/tickets/${id}/comments`, { body }).then((r) => r.data)

export const listAreas = () => api.get('/areas').then((r) => r.data)

export const listItUsers = () =>
  api.get('/users', { params: { role: 'it' } }).then((r) => r.data)

export const summaryStats = () => api.get('/stats/summary').then((r) => r.data)
