import api from './axios'

export const login = (data) => {
  return api.post('/accounts/login/', data)
}

export const register = (data) => {
  return api.post('/accounts/register/', data)
}