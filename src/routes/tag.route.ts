import {
  createTageController,
  delTageController,
  getTageController,
  updateTageController,
} from '../controllers/tag.controller';
import express from 'express';
const router = express.Router();

router.post('/create-tag', createTageController);
router.patch('/update-tag/:id', updateTageController);
router.get('/get-tags', getTageController);
router.delete('/del-tag/:id', delTageController);

export default router;
