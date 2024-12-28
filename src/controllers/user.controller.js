import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createUser } from "../services/user.sevice.js";
import { uploadToS3 } from "../helpers/s3Bucket.js";
import redisClient from "../services/redis.service.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if ([name, username, email, password].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(400).json(new ApiError("Email already exists", 400));
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await createUser({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const token = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("user_token", token, options);
  return res
    .status(201)
    .json(new ApiResponse(200, { user, token }, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or username");
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid password.");
  }

  const token = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("user_token", token, options);
  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username })
    .populate("followers", "username profileImage")
    .populate("following", "username profileImage");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const currentUsername = req.user?.username;

  if (currentUsername === username) {
    throw new ApiError(400, "You can't follow yourself");
  }

  const currentUser = await User.findByIdAndUpdate(
    currentUsername,
    { $addToSet: { following: username } },
    { new: true }
  );

  const followedUser = await User.findByIdAndUpdate(
    username,
    { $addToSet: { followers: currentUsername } },
    { new: true }
  );

  if (!currentUser || !followedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentUser,
        followedUser,
      },
      `You are now following ${followedUser.username}`
    )
  );
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const currentUsername = req.user?.username;

  if (currentUsername === username) {
    throw new ApiError(400, "You can't unfollow yourself");
  }

  const currentUser = await User.findByIdAndUpdate(
    currentUsername,
    { $pull: { following: username } },
    { new: true }
  );

  const followedUser = await User.findByIdAndUpdate(
    username,
    { $pull: { followers: currentUsername } },
    { new: true }
  );

  if (!currentUser || !followedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentUser,
        followedUser,
      },
      `You have unfollowed ${followedUser.username}`
    )
  );
});

const searchUser = asyncHandler(async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const regex = new RegExp(username, "i");
  const users = await User.find({ username: { $regex: regex } }).limit(10);
  return res.status(200).json(new ApiResponse(200, { users }, "Users found"));
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  if (
    !req.files ||
    !req.files?.profilePicture ||
    !req.files?.profilePicture[0]
  ) {
    throw new ApiError(400, "Profile picture file is required");
  }

  if (!profileImage) {
    throw new ApiError(400, "Profile picture is required");
  }

  const profilePictureUrl = await uploadToS3(
    req.files.profilePicture[0],
    "users/profile-pictures"
  );
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { profileImage: profilePictureUrl },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser },
        "Profile picture updated successfully"
      )
    );
});

const updateBio = asyncHandler(async (req, res) => {
  const { bio } = req.body;

  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { bio },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { updatedUser }, "Bio updated successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("user_token");
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  redisClient.set(token, "logout", "EX", 60 * 60 * 24);

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  searchUser,
  followUser,
  unfollowUser,
  updateProfilePicture,
  updateBio,
};
