import { Router } from 'express';
import { createUser } from '../controllers/userController';

const router: Router = Router();

router.post('/users', createUser);

export default router;
