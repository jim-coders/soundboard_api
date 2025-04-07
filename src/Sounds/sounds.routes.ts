import { Router } from 'express';
import {
  postSounds,
  getSoundByUser,
  getManySounds,
  getUploadUrl,
} from './sounds.controller';

const router: Router = Router();
router.get('/', getManySounds);
router.get('/users/:id', getSoundByUser);
router.post('/', postSounds);
router.get('/upload-url', getUploadUrl);

export default router;
