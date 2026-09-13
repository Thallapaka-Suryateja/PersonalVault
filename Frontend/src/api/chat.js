import api from './axios'

export const askQuestion = (question) => {
  return api.post('/chat/ask/', {
    question,
  })
}

export const getChatHistory = () => {
  return api.get('/chat/history/')
}