const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
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
app.use('/', routes);

// Export the app for use in your server or routes
module.exports = app;
