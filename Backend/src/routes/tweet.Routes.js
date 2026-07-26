import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../contollers/tweet.controllers.js";

const router = Router()


router.post("/tweet/createTweet", verifyJWT ,createTweet )
router.patch("/tweet/updateTweet/:tweetId", verifyJWT, updateTweet)
router.delete("/tweet/deleteTweet/:tweetId", verifyJWT, deleteTweet)
router.get("/tweet/getUserTweets", verifyJWT, getUserTweets)

export default router;