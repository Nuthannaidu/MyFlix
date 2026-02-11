const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

/* --------------------------------------------------
   SESSION HANDLING
-------------------------------------------------- */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* --------------------------------------------------
   GOOGLE STRATEGY (STORE googleId)
-------------------------------------------------- */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ Check if user already exists by googleId
        let user = await User.findOne({
          where: { googleId: profile.id },
        });

        // 2️⃣ If not found, check by email (account linking)
        if (!user) {
          user = await User.findOne({ where: { email } });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
          } else {
            // 3️⃣ Create brand new Google user
            user = await User.create({
              email,
              googleId: profile.id,
              password: null,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        console.error('❌ Google OAuth Error:', err);
        return done(err, null);
      }
    }
  )
);

/* --------------------------------------------------
   GITHUB STRATEGY (STORE githubId)
-------------------------------------------------- */

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
          || `${profile.username}@github.com`;

        // 1️⃣ Check by githubId first
        let user = await User.findOne({
          where: { githubId: profile.id },
        });

        // 2️⃣ If not found, check by email
        if (!user) {
          user = await User.findOne({ where: { email } });

          if (user) {
            // Link GitHub account
            user.githubId = profile.id;
            await user.save();
          } else {
            // 3️⃣ Create new GitHub user
            user = await User.create({
              email,
              githubId: profile.id,
              password: null,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        console.error('❌ GitHub OAuth Error:', err);
        return done(err, null);
      }
    }
  )
);
