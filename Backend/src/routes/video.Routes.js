import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getSearchedVideos,
  getRecommendedVideos,
  togglePublisedStatus,
  updateVideo,
  uploadAVideo,
  getVideoById,
  getUserVideos,
  updateVideoViews,
} from "../contollers/video.controller.js";
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
router.get("/video/getRecommendedVideos/:videoId", getRecommendedVideos)

router.patch("/video/updateVideo/:videoId"
    ,verifyJWT
    , upload.single("thumbnail"),
     updateVideo)

router.delete("/video/deleteVideo/:videoId", verifyJWT, deleteVideo)
router.post("/video/changePublishedStatus/:videoId", verifyJWT, togglePublisedStatus)
router.get("/video/getVideoById/:id", getVideoById)
router.get("/video/getUserVideos/:userId", getUserVideos)
router.post("/video/updateVideoView/:videoId",updateVideoViews)
export default router;