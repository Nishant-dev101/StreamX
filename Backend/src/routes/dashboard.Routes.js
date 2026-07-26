

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../contollers/dashboard.controller.js";


const router = Router()


router.get("/dashboard/getChannelVideos", verifyJWT, getChannelVideos)
router.get("/dashboard/getChannelStats", verifyJWT, getChannelStats)

export default router;