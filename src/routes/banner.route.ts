import {
  createBannerService,
  delBanner,
  gerBannerById,
  getBannerService,
} from '@/services/banner.service';
import { createMulterUpload } from '@/utils/multer';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { authMiddleware } from '@/middlewares/authMiddleware';
const route = express.Router();

const uploadMovie = createMulterUpload('banner');

route.post(
  '/create-banner',
  authMiddleware,
  uploadMovie.single('banner_image'),
  async (req: Request, res: Response) => {
    try {
      const { banner_url } = req.body as { banner_url: string };
      const file = req.file;
      const payload = {
        banner_image: '',
        banner_url,
      };
      if (file) {
        payload.banner_image = `/uploads/banner/${file.filename}`;
      }
      const createRes = await createBannerService({ payload });
      // ส่ง response กลับ
      if (!createRes) {
        res.status(400).json({ success: false, message: 'ไม่สามารถสร้างได้' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Banner created!', data: { ...createRes } });
      return;
    } catch (err) {
      console.error(err, 'Server Error!');
      res.status(500).json({ message: 'Server Error!' });
      return;
    }
  },
);
route.get('/get-banner', async (req: Request, res: Response) => {
  try {
    const getRes = await getBannerService();
    if (!getRes) {
      res.status(400).json({ success: false, message: 'ไม่มีข้อมูล' });
      return;
    }
    res.status(200).json({ message: 'Banner created!', data: [...getRes] });
    return;
  } catch (err) {
    console.error(err, 'Server Error!');
    res.status(500).json({ message: 'Server Error!' });
    return;
  }
});
route.delete('/del-banner/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const checkBanner = await gerBannerById({ id });
    if (!checkBanner) {
      res.status(404).json({ success: false, message: 'ไม่พบBanner' });
    }

    if (checkBanner?.banner_image) {
      const fullPath = path.join(__dirname, '..', checkBanner.banner_image);
      try {
        await fs.unlink(fullPath);
        console.log(`Deleted file: ${checkBanner.banner_image}`);
      } catch (fileErr) {
        console.warn(
          `Could not delete file ${checkBanner.banner_image}:`,
          fileErr,
        );
      }
    }
    await delBanner({ id });
    res.status(200).json({ success: true, message: 'ลบสำเร็จ' });
    return;
  } catch (err) {
    console.error(err, 'Server Error!');
    res.status(500).json({ message: 'Server Error!' });
    return;
  }
});

export default route;
