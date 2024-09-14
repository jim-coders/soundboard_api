import { Router } from 'express';
import userRoutes from '../Users/users.routes';
import soundRoutes from '../Sounds/sounds.routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/sounds', soundRoutes);

// make this just a file at the index level called routes

export default router;
