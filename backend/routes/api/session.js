const express = require('express');
const asyncHandler = require('express-async-handler');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Validation middleware for login
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

// Log in
router.post(
  '/',
  validateLogin,
  asyncHandler(async (req, res, next) => {
    const { credential, password } = req.body;

    // Attempt login
    const user = await User.login({ credential, password });

    if (!user) {
      return res.status(401).json({
        message: 'Login failed',
        errors: ['The provided credentials were incorrect.'],
      });
    }

    // Set authentication cookie
    await setTokenCookie(res, user);

    return res.json({ user });
  })
);

// Log out
router.delete(
    '/',
    (req, res) => {
        if (!req.cookies.token) {
            return res.status(400).json({ message: "No active session found" });
        }
        res.clearCookie('token');
        return res.json({ message: 'Successfully logged out' });
    }
);

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
      if (!req.user) return res.json({}); // No session, return empty object

      return res.json({
        user: req.user.toSafeObject() // Return session user
      });
    }
  );

module.exports = router;
