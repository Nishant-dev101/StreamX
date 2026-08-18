import api from './api.js'

export const getSubscribedChannels = async () => {
  const res = await api.get('/subscriptions/getSubscribedChannels')
  return res
}

export const toggleSubscription = async (channelId) => {
    
   const res = await api.patch(`/subscriptions/toggleSubscription/${channelId}`)
   return res
}