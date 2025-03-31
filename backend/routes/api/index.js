const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  console.log('Received request body:', req.body); // Log request body
  res.json({ requestBody: req.body });
});

module.exports = router;
