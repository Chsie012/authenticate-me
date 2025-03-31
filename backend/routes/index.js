//backend/routes/index.js

const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const path = require('path');

console.log('Setting up routes...');
router.use('/api', apiRouter);

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      httpOnly: false, // Allow access to CSRF token cookie via JavaScript in production
      secure: true, // Secure cookie over HTTPS
      sameSite: 'Strict', // Protect against CSRF attacks more strictly in production
    });
    return res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve(__dirname, "../../frontend/build")));

  // Serve the frontend's index.html file for any route not starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      httpOnly: false, // Allow access to CSRF token cookie via JavaScript
      secure: true, // Secure cookie over HTTPS
      sameSite: 'Strict', // Protect against CSRF attacks more strictly in production
    });
    return res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      httpOnly: false, // Allow access to CSRF token cookie via JavaScript
      secure: false, // No HTTPS in development
      sameSite: 'Lax', // More relaxed setting for development
    });
    return res.json({});
  });
}

// Test route to check CSRF functionality
router.get('/hello/world', (req, res) => {
  // Set CSRF token as a cookie (for testing purposes)
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: true, // Prevent JavaScript access to the cookie
    secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS required)
    sameSite: 'Lax', // Help mitigate CSRF attacks
  });

  // Send a response with a simple message
  res.send('Hello World!');
});

module.exports = router;
