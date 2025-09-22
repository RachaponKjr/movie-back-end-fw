import {
  createCMSController,
  getCMSController,
  updateCMSController,
} from '../controllers/cms.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createMulterUpload } from '../utils/multer';
import express from 'express';
const router = express.Router();

const uploadMovie = createMulterUpload('cms');

router.post(
  '/create-cms',
  authMiddleware,
  uploadMovie.fields([
    { name: 'image_banner', maxCount: 1 },
    { name: 'image_advert', maxCount: 1 },
  ]),
  createCMSController,
);
router.get('/get-cms', getCMSController);
router.put(
  '/update-cms/:id',authMiddleware,
  uploadMovie.fields([
    { name: 'image_banner', maxCount: 1 },
    { name: 'image_advert', maxCount: 1 },
  ]),
  updateCMSController,
);

export default router;
