import {
  createAdvertController,
  delAdvertController,
  getAdvertController,
  updateAdvertController,
} from '@/controllers/advert.controller';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { createMulterUpload } from '@/utils/multer';
import express from 'express';
const router = express.Router();

const uploadMovie = createMulterUpload('advert');

router.post(
  '/create-advert',
  authMiddleware,
  uploadMovie.single('advert_image'),
  createAdvertController,
);
router.get('/get-adverts', getAdvertController);
router.patch(
  '/update-advert/:id',
  uploadMovie.single('advert_image'),
  updateAdvertController,
);
router.delete('/del-advert/:id', authMiddleware, delAdvertController);

export default router;
