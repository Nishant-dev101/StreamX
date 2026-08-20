
import api from "./api";

export const toggleLike = async (videoId) => {

    const res = await api.patch(`Like/toggleVideoLike/${videoId}`)
    return res;
}

export const getVideoLikes = async (videoId) => {
    const res = await api.get(`Like/getVideoLikes/${videoId}`)
    return res;
}