const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller'); // Adjust path as needed

// ---------- NORMAL AUTH ----------
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.me);

// ---------- START OAUTH ----------
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// ---------- OAUTH CALLBACKS (THE FIX IS HERE) ----------

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // 1. Manually set the userId so your 'me' controller can find it
    req.session.userId = req.user.id;

    // 2. ⚠️ CRITICAL FIX: Save session explicitly before redirecting
    // This forces the server to write to the DB before telling the browser to move
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
      }
      
      // 3. Only redirect AFTER save is complete
      res.redirect(process.env.FRONTEND_URL);
    });
  }
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    req.session.userId = req.user.id;

    // ⚠️ CRITICAL FIX: Save session explicitly here too
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
      }
      res.redirect(process.env.FRONTEND_URL);
    });
  }
);

module.exports = router;