import { Router } from 'express';
import {
  postUsers,
  loginUser,
  logoutUser,
  getManyUsers,
  getUserById,
  getCurrentUser,
} from './users.controller';
import { authHandler } from '../middlewares';

const router = Router();

// Public routes
router.post('/register', postUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', authHandler, getCurrentUser);
router.get('/:id', authHandler, getUserById);
router.get('/', authHandler, getManyUsers);

export default router;
