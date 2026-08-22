

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

export const getUserVideos = async (userId) => {
   const res = await api.get(`/video/getUserVideos/${userId}`)
   return res
}

export const searchVideos = async (query) => {
   const res = await api.get('/video/getSearchedVideos', { params: { query } })
   return res
}

export const uploadVideo = async (videoData) => {
   const formData = new FormData()
   formData.append('title', videoData.title)
   formData.append('description', videoData.description)
   formData.append('thumbnail', videoData.thumbnail)
   formData.append('videoFile', videoData.videoFile)
   return api.post('/video/uploadAVideo', formData)
}

export const updateVideo = async (videoId, videoData) => {
   const formData = new FormData()
   formData.append('newTitle', videoData.title)
   formData.append('description', videoData.description)
   if (videoData.thumbnail) formData.append('thumbnail', videoData.thumbnail)
   return api.patch(`/video/updateVideo/${videoId}`, formData)
}

export const deleteVideo = async (videoId) => {
   return api.delete(`/video/deleteVideo/${videoId}`)
}

export const togglePublishedStatus = async (videoId) => {
   return api.post(`/video/changePublishedStatus/${videoId}`)
}