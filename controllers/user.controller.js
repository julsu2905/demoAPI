const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

exports.createUser = passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback",
		},
		(profile, done) => {
			// Check if google profile exist.
			if (profile.id) {
				User.findOne({ googleId: profile.id }).then((existingUser) => {
					if (existingUser) {
						done(null, existingUser);
					} else {
						new User({
							googleId: profile.id,
							email: profile.emails[0].value,
							name: profile.name.familyName + " " + profile.name.givenName,
						})
							.save()
							.then((user) => done(null, user));
					}
				});
			}
		}
	)
);
