const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

// Callback function for Google Strategy
const googleStrategyCallback = (accessToken, refreshToken, profile, callback) => {
  // Use profile.id as the unique identifier for the user
  const user = {
    id: profile.id,
    firstname: profile.given_name,
    lastname: profile.family_name,
    email: profile.emails[0].value,
  };

  // Call the callback function with the user object or an error
  return callback(null, user);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    googleStrategyCallback
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by id
});

passport.deserializeUser(async (id, done) => {
  // Here you can implement your logic to fetch the user from your database by id
  // For example:
  const user = await User.findById(id);
  done(null, user);
});
