import { Router } from 'express';
import userRoutes from '../Users/user.routes';
// import soundRoutes from './soundRoutes'

const router: Router = Router();

router.use('/users', userRoutes);
// router.use(soundRoutes)

// make this just a file at the index level called routes

export default router;
