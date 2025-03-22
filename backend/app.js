const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');
const routes = require('./routes');
require('dotenv').config(); // Load environment variables

// Get environment settings
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Morgan middleware for logging
app.use(morgan('dev'));

// Cookie parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development
  app.use(cors());
}

// Helmet helps secure your app by setting various HTTP headers
app.use(helmet());

// CSRF protection middleware
app.use(
  csurf({
    cookie: {
      httpOnly: true,
      secure: isProduction,  // Set to true in production (requires HTTPS)
      sameSite: isProduction ? 'Lax' : 'Strict'
    }
  })
);

// Import and use the routes after setting up the middlewares
app.use(routes);

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource not found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // Check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, next) => {
  res.status(err.status || 500);
  console.log(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

// Export the app for use in your server or routes
module.exports = app;
