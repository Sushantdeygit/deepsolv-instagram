import { Comment } from "../models/comments.model.js";

export const createComment = async ({ text, userId, postId }) => {
  if (!text || !userId || !postId) {
    throw new Error("All fields are required");
  }
  const comment = await Comment.create({
    text,
    userId,
    postId,
  });

  return comment;
};
