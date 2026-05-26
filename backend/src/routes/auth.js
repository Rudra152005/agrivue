const express = require('express');
const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { passport, FRONTEND_URL } = require('../config/passport');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// ─── Google OAuth ──────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent('Google login failed')}` }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// ─── GitHub OAuth ──────────────────────────────────────────────────────────
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent('GitHub login failed')}` }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;

