const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller'); 
const { protect } = require('../middleware/auth.middleware'); 


// 🔓 Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// 🔐 Protected Routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.me);



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


// 🔄 OAuth Callbacks (Session gets created here)
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    req.session.userId = req.user.id;

    req.session.save((err) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
      }
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

    req.session.save((err) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
      }
      res.redirect(process.env.FRONTEND_URL);
    });
  }
);

module.exports = router;
