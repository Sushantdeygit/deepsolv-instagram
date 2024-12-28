import mongoose, { Schema } from "mongoose";

const hashtagSchema = new Schema(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

export const Hashtag = mongoose.model("Hashtag", hashtagSchema);
