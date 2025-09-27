import {
  createCatagoryController,
  delCatagoryController,
  getCatagoryByIdController,
  getCatagorysController,
  updateCatagoryController,
} from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
const router = express.Router();

router.post('/create-catagory', authMiddleware, createCatagoryController);
router.get('/get-catagorys', getCatagorysController);
router.get('/get-catagory/:id', getCatagoryByIdController);
router.patch('/update-catagory/:id', authMiddleware, updateCatagoryController);
router.delete('/del-catagory/:id', authMiddleware, delCatagoryController);

export default router;
