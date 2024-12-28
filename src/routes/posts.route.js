import { Router } from "express";
import {
  createPostController,
  getPosts,
  getUserPosts,
  getSinglePost,
  likePost,
  unlikePost,
  getFeed,
  searchPosts,
  hashtagPosts,
} from "../controllers/posts.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateRequest,
  createPostValidator,
  getPostsValidator,
  getUserPostsValidator,
  getSinglePostValidator,
  likePostValidator,
  unlikePostValidator,
  getFeedValidator,
  searchPostsValidator,
  hashtagPostsValidator,
} from "../helpers/validators.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJWT,
    createPostValidator(),
    validateRequest,
    createPostController
  );

router
  .route("/:userId")
  .get(verifyJWT, getPostsValidator(), validateRequest, getPosts);

router
  .route("/:userId/:page/:limit")
  .get(verifyJWT, getUserPostsValidator(), validateRequest, getUserPosts);

router
  .route("/:postId")
  .get(verifyJWT, getSinglePostValidator(), validateRequest, getSinglePost);

router
  .route("/:postId/like")
  .post(verifyJWT, likePostValidator(), validateRequest, likePost);

router
  .route("/:postId/unlike")
  .post(verifyJWT, unlikePostValidator(), validateRequest, unlikePost);

router
  .route("/feed")
  .get(verifyJWT, getFeedValidator(), validateRequest, getFeed);

router
  .route("/search")
  .get(verifyJWT, searchPostsValidator(), validateRequest, searchPosts);

router
  .route("/hashtag/:hashtag")
  .get(verifyJWT, hashtagPostsValidator(), validateRequest, hashtagPosts);

export default router;
