import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/posts.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createPost } from "../services/posts.service.js";
import { uploadToS3 } from "../helpers/s3Bucket.js";

const createPostController = asyncHandler(async (req, res) => {
  const { caption, mediaURL, backgroundMusicURL, category, hashtags } =
    req.body;
  const publisher = req.user?._id;

  const post = await createPost({
    caption,
    mediaURL,
    backgroundMusicURL,
    category,
    publisher,
    hashtags,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, { post }, "Post created successfully"));
});

const getPosts = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalPosts = await Post.countDocuments({ publisher: user });
  const posts = await Post.find({ publisher: user })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("publisher", "username profileImage");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, total: totalPosts, page, pageSize: posts.length },
        "Posts fetched successfully"
      )
    );
});

const getUserPosts = asyncHandler(async (req, res) => {
  const user = req.params.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalPosts = await Post.countDocuments({ publisher: user });
  const posts = await Post.find({ publisher: user })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("publisher", "username profileImage");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, total: totalPosts, page, pageSize: posts.length },
        "Posts fetched successfully"
      )
    );
});

const getSinglePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate("publisher", "username profileImage")
    .populate("likes", "username profileImage");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post fetched successfully"));
});

const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;
  const post = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: userId } },
    { new: true }
  ).populate("likes", "username");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post liked successfully"));
});

const unlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;
  const post = await Post.findByIdAndUpdate(
    postId,
    { $pull: { likes: userId } },
    { new: true }
  ).populate("likes", "username");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post unliked successfully"));
});

const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const currentUser = await User.findById(userId).select("following");
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  const followingIds = currentUser.following;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalPosts = await Post.countDocuments({
    publisher: { $in: followingIds },
  });
  const posts = await Post.find({ publisher: { $in: followingIds } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("publisher", "username profileImage");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, total: totalPosts, page, pageSize: posts.length },
        "Posts fetched successfully"
      )
    );
});

const searchPosts = asyncHandler(async (req, res) => {
  const { hashtag, category, date } = req.query;
  const query = {};

  if (hashtag) {
    query.hashtags = { $regex: new RegExp(hashtag, "i") };
  }

  if (category) {
    query.category = category;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    query.createdAt = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  const posts = await Post.find(query)
    .populate("publisher", "username profileImage")
    .sort({ createdAt: -1 })
    .limit(50);

  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
});

const hashtagPosts = asyncHandler(async (req, res) => {
  const { hashtag } = req.params;
  const posts = await Post.find({ hashtags: hashtag })
    .populate("publisher", "username profileImage")
    .sort({ createdAt: -1 })
    .limit(50);

  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
});

export {
  createPostController,
  getPosts,
  getUserPosts,
  getSinglePost,
  likePost,
  unlikePost,
  getFeed,
  searchPosts,
  hashtagPosts,
};
