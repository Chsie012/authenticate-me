const express = require('express');
const router = express.Router();

// Test route to check CSRF functionality
router.get('/hello/world', (req, res) => {
  // Set CSRF token as a cookie
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: true, // Prevent JavaScript access to the cookie
    secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS required)
    sameSite: 'Lax' // Help mitigate CSRF attacks
  });

  // Send a response with a simple message
  res.send('Hello World!');
});

module.exports = router;
