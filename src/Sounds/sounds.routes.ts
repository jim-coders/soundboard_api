import { Router } from 'express';
import {
  postSounds,
  getSoundByUser,
  getManySounds,
  getUploadUrl,
  getSoundUrl,
  deleteSound,
} from './sounds.controller';

const router: Router = Router();
router.get('/', getManySounds);
router.get('/users/:id', getSoundByUser);
router.post('/', postSounds);
router.get('/upload-url', getUploadUrl);
router.get('/:id/url', getSoundUrl);
router.delete('/:id', deleteSound);

export default router;
