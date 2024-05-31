import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/get-user").get(verifyJwt, getCurrentUser);
router.route("/update-details").patch(verifyJwt, updateAccountDetails);
router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover-image").patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);
router.route("/get-channel-profile/:username").get(verifyJwt, getUserChannelProfile);
router.route("/get-user-watch-history").get(verifyJwt, getWatchHistory);

export default router;