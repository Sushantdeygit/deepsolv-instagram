import { Router } from "express";
import {
  createCommentController,
  getComments,
} from "../controllers/comments.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateRequest,
  createCommentValidator,
  getCommentsValidator,
} from "../helpers/validators.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJWT,
    createCommentValidator(),
    validateRequest,
    createCommentController
  );

router
  .route("/:postId")
  .get(verifyJWT, getCommentsValidator(), validateRequest, getComments);

export default router;
