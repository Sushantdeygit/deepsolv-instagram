import express from "express";
import passport from "./passport.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000" || process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(passport.initialize());

//routes import
import userRouter from "./routes/user.route.js";
import postsRouter from "./routes/posts.route.js";
import commentsRouter from "./routes/comments.route.js";
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);

// Global error handler
app.use((err, req, res, next) => {
  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    // Custom error message format for ApiError
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // If the error is not an instance of ApiError, handle it generically
  console.error(err); // Log the error for debugging purposes
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

export { app };
