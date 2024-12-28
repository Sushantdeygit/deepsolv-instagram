import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comments.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createComment } from "../services/comments.service.js";
import { Post } from "../models/posts.model.js";

const createCommentController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user?._id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const comment = await createComment({ text, userId, postId });
  return res
    .status(201)
    .json(new ApiResponse(200, { comment }, "Comment created successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const postExists = await Post.findById(postId);
  if (!postExists) {
    throw new ApiError(404, "Post not found");
  }

  const totalComments = await Comment.countDocuments({ postId });
  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username profileImage");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, total: totalComments, page, pageSize: comments.length },
        "Comments fetched successfully"
      )
    );
});

export { createCommentController, getComments };
