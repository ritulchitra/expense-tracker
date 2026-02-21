import api from './index'

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (userData) =>
    api.post('/auth/register', userData),

  logout: () =>
    api.post('/auth/logout'),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (userData) =>
    api.put('/auth/profile', userData),

  refreshToken: () =>
    api.post('/auth/refresh'),
}
