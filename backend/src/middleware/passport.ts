import express from 'express';
import passport from 'passport';

import { prisma } from '../utils/db';

const router = express.Router();

// Note: This must be in this order! See https://stackoverflow.com/questions/29111571/passports-req-isauthenticated-always-returning-false-even-when-i-hardcode-done
// Initialize passport authentication.
router.use(passport.initialize());
// To persist login sessions.
router.use(passport.session());

const GoogleStrategy = require('passport-google-oauth2');

// The comment block below was derived from https://github.com/passport/todos-express-google/blob/main/routes/auth.js
// ----
// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email', 'profile' ],
  passReqToCallback: true,
  // https://stackoverflow.com/questions/56818870/why-am-i-getting-redirect-uri-mismatch-error-on-heroku-with-my-oauth2-authentica
  // https://stackoverflow.com/questions/66392718/what-is-the-use-of-a-proxy-in-passport-google-oauth20-in-nodejs
  // Proxy also applies to express-session when dealing with cookies.
  proxy: process.env.NODE_ENV === 'production'
},
async function (req: any, accessToken: any, refreshToken: any, profile: any, done: any) {
  const { email, displayName, picture } = profile;

  let user = await prisma.user.findUnique({ where: { email } });

  // If Prisma User does not exist in DB, create.
  if (!user) {
    user = await prisma.user.create({
      data: { email, displayName, avatarURL: picture }
    });
  }
  else {
    // If the user updates their Google profile and logs back in after the changes, then auto-update their profile info.
    if (user.avatarURL !== picture || user.displayName !== displayName) {
      user = await prisma.user.update({
        where: { email },
        data: {
          displayName: displayName,
          avatarURL: picture
        }
      });
    }
  }

  return done(null, user);
}));

// The (modified) comment block below was derived from https://github.com/passport/todos-express-google/blob/main/routes/auth.js#L54
// ----
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that the "todos-express-google"
// example does not have a database, the complete Google profile is serialized and deserialized.
passport.serializeUser(function(user: any, done) {
  return done(null, user);
});

passport.deserializeUser(function(user: any, done) {
  return done(null, user);
});

// The comment block below was derived from https://github.com/passport/todos-express-google/blob/main/routes/auth.js
/* GET /login/federated/accounts.google.com
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0.  This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'.  Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/accounts.google.com`.
 */
router.get('/login/federated/google', passport.authenticate('google'));

// The comment block below was derived from https://github.com/passport/todos-express-google/blob/main/routes/auth.js
/*
    This route completes the authentication sequence when Google redirects the
    user back to the application.  When a new user signs in, a user account is
    automatically created and their Google account is linked.  When an existing
    user returns, they are signed in to their linked account.
*/
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: `${process.env.FRONTEND_URL}/`,
  failureRedirect: `${process.env.FRONTEND_URL}/login_error`,
}));

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    // This is mainly for Redis in production (MemoryStorage for dev).
    //  Prevents persistence of logged out users.
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

export default router;
