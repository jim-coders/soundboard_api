import { Router } from 'express';
import {
  postUsers,
  loginUser,
  getUserById,
  getManyUsers,
  getCurrentUser,
  logoutUser,
} from './users.controller';
import { authHandler } from '../middlewares';

const router: Router = Router();

// Public routes
router.post('/register', postUsers);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authHandler, getCurrentUser);
router.get('/:id', authHandler, getUserById);
router.get('/', authHandler, getManyUsers);
router.post('/logout', authHandler, logoutUser);

export default router;
