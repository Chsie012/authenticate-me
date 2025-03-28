const express = require('express');
const asyncHandler = require('express-async-handler');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();
const { check, validationResult } = require('express-validator');

// Sign up
router.post(
    '/',
    [
      check('email').isEmail().withMessage('Must be a valid email'),
      check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
      check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username } = req.body;
      const user = await User.signup({ email, username, password });

      await setTokenCookie(res, user);

      return res.json({ user });
    })
  );

module.exports = router;
