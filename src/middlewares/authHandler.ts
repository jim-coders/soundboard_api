import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../Users/User.model';

const authHandler = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: any, user: IUser) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = user;
    next();
  })(req, res, next);
};

export default authHandler;
