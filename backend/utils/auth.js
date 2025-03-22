// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token with the user's safe data
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // JWT expiration time in seconds
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true, // Prevents client-side JavaScript access to the cookie
    secure: isProduction, // Ensure the cookie is sent over HTTPS in production
    sameSite: isProduction ? 'Lax' : 'Strict' // Configure cookie policy for cross-site requests
  });

  return token;
};

// Middleware to restore the user from the JWT cookie
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(); // No token, continue to next middleware

  return jwt.verify(token, secret, async (err, jwtPayload) => {
    if (err) {
      // Log token verification errors but continue processing
      console.error("Token verification error:", err);
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope('currentUser').findByPk(id); // Fetch user based on the ID in the token payload
    } catch (e) {
      // If an error occurs, clear the token and continue
      res.clearCookie('token');
      console.error("User not found or error restoring user:", e);
      return next();
    }

    // If no user found, clear the token cookie
    if (!req.user) {
      res.clearCookie('token');
    }

    return next();
  });
};

// Middleware to require the user to be authenticated
const requireAuth = [
  restoreUser,
  function (req, _res, next) {
    if (req.user) return next(); // If user is authenticated, continue to the next middleware/route

    // If user is not authenticated, return Unauthorized error
    const err = new Error('Unauthorized');
    err.title = 'Unauthorized';
    err.errors = ['User not authenticated'];
    err.status = 401;
    return next(err); // Pass to the error-handling middleware
  }
];

module.exports = { setTokenCookie, restoreUser, requireAuth };
