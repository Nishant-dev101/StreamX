
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../contollers/subscription.controller.js";


const router = Router()


router.patch("/subscriptions/toggleSubscription/:channelId", verifyJWT, toggleSubscription)
router.get("/subscriptions/getUserChannelSubscribers/:channelId", getUserChannelSubscribers)
router.get("/subscriptions/getSubscribedChannels", verifyJWT,  getSubscribedChannels )

export default router;