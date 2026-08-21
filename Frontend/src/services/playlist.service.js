import api from './api'

export const getUserPlaylists = async () => {
	return api.get('/playlist/getUserPlaylists')
}

export const getPlaylistById = async (playlistId) => {
	return api.get(`/playlist/getPlaylistById/${playlistId}`)
}

export const createPlaylist = async (name, description) => {
	return api.post('/playlist/createPlaylist', { name, description })
}

export const addVideoToPlaylist = async (playlistId, videoId) => {
	return api.put(`/playlist/addVideoToPlaylist/${playlistId}/${videoId}`)
}

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
	return api.put(`/playlist/removeVideoFromPlaylist/${playlistId}/${videoId}`)
}

export const deletePlaylist = async (playlistId) => {
	return api.delete(`/playlist/deletePlaylist/${playlistId}`)
}

export const updatePlaylist = async (playlistId, name, description) => {
	return api.patch(`/playlist/updatePlaylist/${playlistId}`, { name, description })
}
