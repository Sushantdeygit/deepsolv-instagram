import { body, check, validationResult, param, query } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

//user validator
export const userregisterValidator = () => [
  body("name", "Please enter name.")
    .notEmpty()
    .withMessage(" Name cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),
  body("email", "Please enter email.")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password", "Please enter password.")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const loginValidator = () => [
  body("identifier").notEmpty().withMessage("Email or username is required"),
  body("password", "Please enter password.").notEmpty(),
];

export const getUserProfileValidator = () => [
  param("username").notEmpty().withMessage("Username is required"),
];

export const searchUserValidator = () => [
  query("username").notEmpty().withMessage("Username is required"),
];

export const followUserValidator = () => [
  param("username").notEmpty().withMessage("Username is required"),
];

export const unfollowUserValidator = () => [
  param("username").notEmpty().withMessage("Username is required"),
];

export const updateBioValidator = () => [
  body("bio").notEmpty().withMessage("Bio is required"),
];

//posts validator

export const createPostValidator = () => [
  body("caption").notEmpty().withMessage("Caption is required"),
  body("mediaURL").notEmpty().withMessage("Media URL is required"),
  body("publisher").notEmpty().withMessage("Publisher is required"),
];

export const getPostsValidator = () => [
  query("page").isInt().withMessage("Page is required"),
  query("limit").isInt().withMessage("Limit is required"),
];

export const getUserPostsValidator = () => [
  query("page").isInt().withMessage("Page is required"),
  query("limit").isInt().withMessage("Limit is required"),
];

export const getSinglePostValidator = () => [
  param("postId").isMongoId().notEmpty().withMessage("Post ID is required"),
];

export const likePostValidator = () => [
  param("postId").isMongoId().notEmpty().withMessage("Post ID is required"),
];

export const unlikePostValidator = () => [
  param("postId").isMongoId().notEmpty().withMessage("Post ID is required"),
];

export const getFeedValidator = () => [
  query("page").isInt().withMessage("Page is required"),
  query("limit").isInt().withMessage("Limit is required"),
];

export const searchPostsValidator = () => [
  query("hashtag").isString().withMessage("Hashtag is required"),
  query("category").isString().withMessage("Category is required"),
  query("date").isISO8601().withMessage("Date is required"),
];

export const hashtagPostsValidator = () => [
  param("hashtag").isString().withMessage("Hashtag is required"),
];

//comments validator

export const createCommentValidator = () => [
  body("text").notEmpty().withMessage("Text is required"),
  param("postId").isMongoId().notEmpty().withMessage("Post ID is required"),
];

export const getCommentsValidator = () => [
  param("postId").isMongoId().notEmpty().withMessage("Post ID is required"),
  query("page").isInt().withMessage("Page is required"),
  query("limit").isInt().withMessage("Limit is required"),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Errors:", errors.array()); // Debug log
    throw new ApiError(
      400,
      errors
        .array()
        .map((e) => e.msg)
        .join(", ")
    );
  }
  next();
};
