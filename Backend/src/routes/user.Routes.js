import { Router } from "express";
import {
  registerUser,
  logOutUser,
  loginUser,
  refreshAccesToken,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  changeCurrentPassword,
  getCurrentUser

} from "../contollers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/user/register",
  upload.single("avatar"),
  registerUser,
);

router.post("/user/login", loginUser);

router.post("/user/logout", verifyJWT, logOutUser);

router.post("/user/refreshToken", refreshAccesToken);
router.post("/user/change-password", verifyJWT, changeCurrentPassword);
router.get("/user/current-user", verifyJWT, getCurrentUser);
router.patch("/user/update-account", verifyJWT, updateUserDetails);
router.patch(
  "/user/avatar",
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar,
);
router.patch(
  "/user/cover-Image",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage,
);
router.get("/user/channel/:userId", optionalVerifyJWT, getUserChannelProfile);
router.get("/user/WatchHistory", verifyJWT, getWatchHistory);
export default router;
