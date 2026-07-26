
import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../contollers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.patch("/Like/toggleVideoLike/:videoId", verifyJWT, toggleVideoLike)
router.patch("/Like/toggleCommentLike/:commentId", verifyJWT, toggleCommentLike)
router.patch("/Like/toggleTweetLike/:tweetId", verifyJWT, toggleTweetLike)
router.get("/Like/getLikedVideos", verifyJWT, getLikedVideos)

export default router;