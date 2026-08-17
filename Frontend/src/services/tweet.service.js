import api from './api.js'

export const getUserTweets = async () => {
  
    const response = await api.get('/tweet/getUserTweets')
    return response
 
}

export const createTweet = async (content) => {

    const response = await api.post('/tweet/createTweet', { content })
    return response
}

export const updateTweet = async (tweetId, newContent) => {
  
    const response = await api.patch(`/tweet/updateTweet/${tweetId}`, { newContent })
    return response
}

export const deleteTweet = async (tweetId) => {

    const response = await api.delete(`/tweet/deleteTweet/${tweetId}`)
    return response
}
