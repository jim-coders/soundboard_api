import { Router } from 'express';
import {
  postSounds,
  getManySounds,
  getSoundByUser,
  getSoundUrl,
  deleteSound,
  getUploadUrl,
} from './sounds.controller';
import validateSoundUpload from '../middlewares/validateSound';

const router = Router();

// Sound routes
router.get('/', getManySounds);
router.get('/users/:id', getSoundByUser);
router.get('/:id', getSoundByUser);
router.get('/:id/url', getSoundUrl);
router.get('/upload-url', getUploadUrl);
router.post('/', validateSoundUpload, postSounds);
router.delete('/:id', deleteSound);

export default router;
