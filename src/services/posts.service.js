import { Post } from "../models/posts.model.js";

export const createPost = async ({
  caption,
  mediaURL,
  backgroundMusicURL,
  category,
  publisher,
  hashtags,
}) => {
  if (!caption || !mediaURL || !publisher) {
    throw new Error("All fields are required");
  }
  const post = await Post.create({
    caption,
    mediaURL,
    backgroundMusicURL,
    category,
    publisher,
    hashtags,
  });

  return post;
};
