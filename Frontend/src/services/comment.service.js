

import api from './api';

export const getAllComments = async (videoId) => {
    // Accepts a string id and calls the backend without the route-param ':' prefix
    console.log('landed in getAllComments', videoId)
    const res = await api.get(`/comment/getAllComments/${videoId}`)
    return res
}

export const AddComment = async (videoId, content) => {
     console.log('landed in AddComment', videoId, content)
    const res = await api.post(`comment/addComments/${videoId}`, { content: content })
    return res;
    
}

export const deleteComment = async (commentId)=> {
   
    const res = await api.delete(`comment/deleteComment/${commentId}`)
    return res;
}  
