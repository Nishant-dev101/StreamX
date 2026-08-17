import api from './api.js'

export const getSubscribedChannels = async () => {
  const res = await api.get('/subscriptions/getSubscribedChannels')
  return res
}
