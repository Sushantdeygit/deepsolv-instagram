An Instagram-like social media backend built with Node.js, Express, MongoDB, and JWT for authentication. Includes OAuth login via Google (and possibly others like GitHub). Users can create posts, follow/unfollow, like/unlike, comment on posts, and more.

Postman Collection: added json files for postman collection ./postman_collections

Table of Contents:

Project Overview:
Installation:
Running the Application:
Authentication:
API Endpoints:
Users:
Posts:
Comments:
Error Handling:

# Project Overview

This project is a social media backend built with Node.js, Express, MongoDB, and JWT for authentication. It includes OAuth login via Google (and possibly others like GitHub). Users can create posts, follow/unfollow, like/unlike, comment on posts, and more.

Technologies Used:

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- Passport.js for OAuth (Google)
- bcrypt (or similar) for password hashing
- Docker for containerization
- Docker Compose for easy deployment
- Redis for token blacklisting
- AWS S3 for file storage
- AWS EC2 for container deployment

Features

- User registration and login
- OAuth login via Google
- User profiles (view profile, update bio/picture, follow/unfollow)
- Posts (create, like/unlike, feed, search)
- Comments (create, fetch, pagination)
- Logout (with token blacklisting)

====================================================================================

Installation

1. Clone the repository
2. Install dependencies using npm install
3. Create a .env file in the root directory and add your environment variables
4. Run the application using npm run dev
5. Open http://localhost:8080 in your browser

Running the Application
The application is built using Express.js and Mongoose. It uses MongoDB as the database and JWT for authentication. The application uses environment variables for configuration. You can create a .env file in the root directory and add your environment variables.

To run the application, use the following command:

npm run dev

This will start the application on port 8080. You can access the application by opening http://localhost:8080 in your browser.

Authentication
The application uses JWT for authentication. When a user logs in, a JWT token is generated and stored in a cookie. The token is then sent in the Authorization header of subsequent requests. The token is verified using the verifyJWT middleware function.

API Endpoints
The application provides the following API endpoints:

/api/v1/users
/api/v1/users/register
/api/v1/users/login
/api/v1/users/profile-picture
/api/v1/users/bio
/api/v1/users/logout
/api/v1/posts
/api/v1/posts/create
/api/v1/posts/:userId
/api/v1/posts/:userId/:page/:limit
/api/v1/posts/:postId
/api/v1/posts/:postId/like
/api/v1/posts/:postId/unlike
/api/v1/posts/feed
/api/v1/posts/search
/api/v1/posts/hashtag/:hashtag
/api/v1/comments
/api/v1/comments/create
/api/v1/comments/:postId

Users
The application provides the following endpoints for users:

/api/v1/users
/api/v1/users/register
/api/v1/users/login
/api/v1/users/profile-picture
/api/v1/users/bio
/api/v1/users/logout

Posts
The application provides the following endpoints for posts:

/api/v1/posts
/api/v1/posts/create
/api/v1/posts/:userId
/api/v1/posts/:userId/:page/:limit
/api/v1/posts/:postId
/api/v1/posts/:postId/like
/api/v1/posts/:postId/unlike
/api/v1/posts/feed
/api/v1/posts/search
/api/v1/posts/hashtag/:hashtag

Comments
The application provides the following endpoints for comments:

/api/v1/comments
/api/v1/comments/create
/api/v1/comments/:postId

Error Handling
The application provides a custom error handler that handles errors in a standardized way. It returns a JSON response with the error message and status code. The error handler also logs the error to the console.

    const { ApiError } = require("./utils/ApiError.js");

    // Example usage
    throw new ApiError(400, "Invalid request");

    // Example response
    {
      success: false,
      message: "Invalid request",
      errors: []
    }
    """
    return {
        success: false,
        message: error.message,
        errors: error.errors || [],
    };
    """ ;
