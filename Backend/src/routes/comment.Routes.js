import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddComment, deleteComment, getAllComments, updateComment } from "../contollers/comment.controller.js";



const router = Router()


router.post("/comment/addComments/:videoId", verifyJWT, AddComment)
router.patch("/comment/updateComment/:videoId",verifyJWT,updateComment)
router.delete("/comment/deleteComment/:commentId",verifyJWT,deleteComment)
router.get("/comment/getAllComments/:videoId", getAllComments)

export default router