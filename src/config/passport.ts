import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { PassportStatic } from 'passport';
import User from '../Users/User.model';
import { jwtSecret } from './globalConfig';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['auth_token'];
        if (!token) {
          console.log('No auth_token cookie found');
        }
      }
      return token;
    },
  ]),
  secretOrKey: jwtSecret,
};

export default (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.userId);
        if (user) {
          console.log('User found:', user._id);
          return done(null, user);
        }
        console.log('No user found for JWT payload');
        return done(null, false);
      } catch (err) {
        console.error('JWT Strategy Error:', err);
        return done(err, false);
      }
    })
  );
};
