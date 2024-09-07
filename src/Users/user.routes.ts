import { Router } from 'express';
import { postUsers, getUserById, getManyUsers } from './user.controller';

const router: Router = Router();
router.get('/', getManyUsers);
router.get('/:id', getUserById);
router.post('/', postUsers);

export default router;
