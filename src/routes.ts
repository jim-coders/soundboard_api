import { Router } from 'express';
import userRoutes from './Users/users.routes';
import soundRoutes from './Sounds/sounds.routes';
import { authHandler } from './middlewares';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/sounds', authHandler, soundRoutes);

export default router;
