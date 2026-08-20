import { Router } from "express";
import { deleteVideo, getAllVideos, getSearchedVideos, togglePublisedStatus, updateVideo, uploadAVideo, getVideoById, getUserVideos } from "../contollers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()


router.get("/video/getAllVideos", getAllVideos)

router.post("/video/uploadAVideo"
    ,verifyJWT
    ,upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ])
    ,uploadAVideo )

router.get("/video/getSearchedVideos", getSearchedVideos)

router.patch("/video/updateVideo/:title"
    ,verifyJWT
    , upload.single("thumbnail"),
     updateVideo)

router.delete("/video/deleteVideo/:title", verifyJWT, deleteVideo)
router.post("/video/changePublishedStatus/:title", verifyJWT, togglePublisedStatus)
router.get("/video/getVideoById/:id", getVideoById)
router.get("/video/getUserVideos/:userId", getUserVideos)
export default router;