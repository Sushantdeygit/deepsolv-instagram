import { Router } from "express";
import passport from "passport";
import {
  loginValidator,
  userregisterValidator,
  getUserProfileValidator,
  searchUserValidator,
  followUserValidator,
  unfollowUserValidator,
  updateBioValidator,
  validateRequest,
} from "../helpers/validators.js";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  searchUser,
  followUser,
  unfollowUser,
  updateProfilePicture,
  updateBio,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router
  .route("/register")
  .post(userregisterValidator(), validateRequest, registerUser);

router.route("/login").post(loginValidator(), validateRequest, loginUser);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  asyncHandler(async (req, res) => {
    const token = req.user.generateAccessToken();
    res.cookie("user_token", token, { httpOnly: true, secure: false });

    return res.json({
      message: "Google login successful",
      user: req.user,
      token,
    });
  })
);
router
  .route("/:username")
  .get(verifyJWT, getUserProfileValidator(), validateRequest, getUserProfile);
router
  .route("/:username/follow")
  .post(verifyJWT, followUserValidator(), validateRequest, followUser);
router
  .route("/:username/unfollow")
  .post(verifyJWT, unfollowUserValidator(), validateRequest, unfollowUser);

router
  .route("/searchUser")
  .get(searchUserValidator(), validateRequest, searchUser);

router
  .route("/profilePicture")
  .put(
    verifyJWT,
    upload.fields([{ name: "profilePicture", maxCount: 1 }]),
    updateProfilePicture
  );

router
  .route("/bio")
  .patch(verifyJWT, updateBioValidator(), validateRequest, updateBio);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
