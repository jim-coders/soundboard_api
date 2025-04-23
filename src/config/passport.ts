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
      console.log('Request headers:', req.headers);
      console.log('Request origin:', req.headers.origin);
      console.log('Request host:', req.headers.host);

      if (req && req.cookies) {
        console.log('Cookies available:', Object.keys(req.cookies));
        const token = req.cookies['auth_token'];
        if (token) {
          console.log('Token found in cookie:', token.substring(0, 20) + '...');
          return token;
        }
        console.log('No auth_token in cookies');
      } else {
        console.log('No cookies object in request');
      }
      return null;
    },
  ]),
  secretOrKey: jwtSecret,
};

export default (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        console.log('JWT payload:', jwt_payload);
        const user = await User.findById(jwt_payload.userId);
        if (user) {
          console.log('User found:', user._id);
          return done(null, user);
        }
        console.log(
          'No user found for JWT payload userId:',
          jwt_payload.userId
        );
        return done(null, false);
      } catch (err) {
        console.error('JWT Strategy Error:', err);
        return done(err, false);
      }
    })
  );
};
