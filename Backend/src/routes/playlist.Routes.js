import { Router } from "express"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../contollers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/playlist/createPlaylist",verifyJWT, createPlaylist)
router.get("/playlist/getUserPlaylists", verifyJWT, getUserPlaylists)
router.get("/playlist/getPlaylistById/:playlistId",verifyJWT, getPlaylistById)
router.put("/playlist/addVideoToPlaylist/:playlistId/:videoId", verifyJWT,addVideoToPlaylist )
router.put("/playlist/removeVideoFromPlaylist/:playlistId/:videoId", verifyJWT, removeVideoFromPlaylist )
router.delete("/playlist/deletePlaylist/:playlistId", verifyJWT, deletePlaylist)
router.patch("/playlist/updatePlaylist/:playlistId",verifyJWT, updatePlaylist)
export default router