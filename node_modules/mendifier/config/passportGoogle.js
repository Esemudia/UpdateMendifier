const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: null, // No password for Google users
        });
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false);
    }
}));
