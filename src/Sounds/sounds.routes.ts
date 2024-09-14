import { Router } from 'express';
import { postSounds, getSoundByUser, getManySounds } from './sounds.controller';

const router: Router = Router();
router.get('/', getManySounds);
router.get('/users/:id', getSoundByUser);
router.post('/', postSounds);

export default router;
