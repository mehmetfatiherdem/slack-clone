import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV == 'production'
          ? process.env.GOOGLE_AUTH_CALLBACK_URL
          : 'http://localhost:3000/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({
        provider: 'google',
        providerId: profile.id,
        email: profile.emails[0].value,
        role: 'normal',
      });

      if (user) {
        return cb(null, user);
      } else {
        const newUser = new User();
        newUser.name = profile.name.givenName;
        newUser.lastName = profile.name.familyName;
        newUser.email = profile.emails[0].value;
        newUser.provider = 'google';
        newUser.providerId = profile.id;

        await userRepository.save(newUser);

        return cb(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export default passport;
