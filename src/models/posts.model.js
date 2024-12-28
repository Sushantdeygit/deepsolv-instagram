import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    caption: {
      type: String,
      trim: true,
    },
    mediaURL: {
      type: String, // aws s3 url
      required: true,
    },
    backgroundMusicURL: {
      type: String, // aws s3 url
      default: "",
    },
    category: {
      type: String,
      enum: ["Tech", "Entertainment", "Business", "Lifestyle", "Other"],
      default: "Other",
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    hashtags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hashtag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
