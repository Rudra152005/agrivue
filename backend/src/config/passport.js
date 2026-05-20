const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BASE_URL = process.env.BASE_URL || 'http://localhost:9090';

// ─── Google ────────────────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/v1/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'), null);

          // Find existing user or create one
          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              oauthProvider: 'google',
              oauthId: profile.id,
              avatar: profile.photos?.[0]?.value || null,
              role: 'farmer',
            });
          } else if (!user.oauthId) {
            // Link the OAuth provider to an existing email-password account
            user.oauthProvider = 'google';
            user.oauthId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value || null;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// ─── GitHub ───────────────────────────────────────────────────────────────
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/v1/auth/github/callback`,
        scope: ['user:email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.find((e) => e.primary)?.value ||
            profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from GitHub'), null);

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              oauthProvider: 'github',
              oauthId: profile.id,
              avatar: profile.photos?.[0]?.value || null,
              role: 'farmer',
            });
          } else if (!user.oauthId) {
            user.oauthProvider = 'github';
            user.oauthId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value || null;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

module.exports = { passport, FRONTEND_URL };
