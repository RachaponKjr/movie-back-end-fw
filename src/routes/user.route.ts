import {
  createAccept,
  delAcceptController,
  getAcceptsController,
  loginController,
  updateAcceptController,
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
const router = express.Router();

router.post('/create-account',authMiddleware, createAccept);
router.post('/login-admin', loginController);
router.get('/get-accounts', authMiddleware, getAcceptsController);
router.put('/update-account/:id', authMiddleware, updateAcceptController);
router.delete('/del-account/:id', authMiddleware, delAcceptController);

export default router;
