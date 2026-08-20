
import { Router } from "express";
import { getLikedVideos, getVideoLikes, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../contollers/like.controller.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.patch("/Like/toggleVideoLike/:videoId", verifyJWT, toggleVideoLike)
router.patch("/Like/toggleCommentLike/:commentId", verifyJWT, toggleCommentLike)
router.patch("/Like/toggleTweetLike/:tweetId", verifyJWT, toggleTweetLike)
router.get("/Like/getLikedVideos", verifyJWT, getLikedVideos)
router.get("/Like/getVideoLikes/:videoId", optionalVerifyJWT, getVideoLikes)

export default router;