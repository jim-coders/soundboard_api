import { Router } from 'express';
import {
  postSounds,
  getSoundByUser,
  getManySounds,
  getUploadUrl,
  getSoundUrl,
} from './sounds.controller';

const router: Router = Router();
router.get('/', getManySounds);
router.get('/users/:id', getSoundByUser);
router.post('/', postSounds);
router.get('/upload-url', getUploadUrl);
router.get('/:id/url', getSoundUrl);

export default router;
