import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import User from '../Users/User.model';
import { jwtSecret } from './globalConfig';

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

const opts: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtSecret,
};

export default (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
    })
  );
};
