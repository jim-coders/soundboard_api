import { Router } from 'express';
import userRoutes from '../Users/user.routes';
// import soundRoutes from './soundRoutes'

const router: Router = Router();

router.use('/users', userRoutes);
// router.use(soundRoutes)

export default router;
