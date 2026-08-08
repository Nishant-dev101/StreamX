

import api from './api.js'


export const getVideos = async () => {
     console.log("into get all video APi")
    const res = await api.get("/video/getAllVideos")
    return res
}

export const getLikedVideos = async () => {
    console.log("into get liked video APi")
    const res = await api.get('/Like/getLikedVideos')
    return res
}


export const getVideoById = async (id) => {
     
   const res = await api.get(`/video/getVideoById/${id}`)
   return res
}