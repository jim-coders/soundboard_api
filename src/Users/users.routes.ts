import { Router } from 'express';
import {
  registerUsers,
  getUserById,
  getManyUsers,
  userLogin,
} from './users.controller';

const router: Router = Router();
router.get('/', getManyUsers);
router.get('/:id', getUserById);
router.post('/login', userLogin);
router.post('/register', registerUsers);

export default router;
