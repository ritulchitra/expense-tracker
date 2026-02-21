import api from './index'

export const expenseAPI = {
  getExpenses: (params) =>
    api.get('/expenses', { params }),

  getExpenseById: (id) =>
    api.get(`/expenses/${id}`),

  createExpense: (data) =>
    api.post('/expenses', data),

  updateExpense: (id, data) =>
    api.put(`/expenses/${id}`, data),

  deleteExpense: (id) =>
    api.delete(`/expenses/${id}`),

  getExpenseStatistics: () =>
    api.get('/expenses/statistics'),

  exportExpenses: (format = 'csv') =>
    api.get(`/expenses/export?format=${format}`, {
      responseType: 'blob',
    }),
}
