import { Router } from 'express';
import {
  registerUsers,
  getUserById,
  getManyUsers,
  userLogin,
  // getCurrentUser,
} from './users.controller';
import authHandler from '../middlewares/authHandler';

const router: Router = Router();

// Public routes
router.post('/login', userLogin);
router.post('/register', registerUsers);

// Protected routes
// router.get('/me', authHandler, getCurrentUser);
router.get('/', authHandler, getManyUsers);
router.get('/:id', authHandler, getUserById);

export default router;
