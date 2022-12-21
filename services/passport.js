const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Generates a cookie from the user id that's inserted into the browser
passport.serializeUser((user, done) => {
    done(null, user.id);
}); 

// Desearlizes the cookie from the current user from the browser
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken); 
      console.log('refresh token', refreshToken); 
      console.log('profile', profile.id); 
      console.log({ googleId: profile.id })
      // console.log(User.findOne({ googleId: profile.id }))

        // .then((existingUser) => {
        //     console.log(existingUser)
        //     // done(null, existingUser);
        // })
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
            if (existingUser) {
                // User already exists
                console.log('User Already Exists!')
                done(null, existingUser);
            } else {
                // User does not exist so create a new record.
                console.log('User Does not Already Exists!')
                new User({ googleId: profile.id })
                    .save()
                    .then(user => done(null, user));
            }
        })
    })
  );