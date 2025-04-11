import { Router } from 'express';
import {
  postUsers,
  loginUser,
  getCurrentUser,
  logoutUser,
} from './users.controller';
import { authHandler } from '../middlewares';

const router: Router = Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', postUsers);

// Protected routes
router.get('/me', authHandler, getCurrentUser);
router.post('/logout', authHandler, logoutUser);

export default router;
