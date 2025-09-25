import {
  createAdvertService,
  delAdvertService,
  getAdvertByIdService,
  getAdvertService,
  updateAdvertService,
} from '@/services/advert.service';
import { Request, Response } from 'express';
import path from 'path';

export interface AdvertProps {
  advert_image: string;
  advert_link?: string;
}

const createAdvertController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const files = req.file;
    if (!payload) {
      res.status(400).json({ message: 'ไม่พบ payload ที่ส่งมา' });
      return;
    }
    if (files) {
      payload.advert_image = `/uploads/advert/${files.filename}`;
    }

    const createRes = await createAdvertService({ payload });

    if (!createRes) {
      res.status(400).json({ message: 'ไม่สามารถสร้างได้' });
      return;
    }
    res.status(201).json({ data: { ...createRes }, success: true });
    return;
  } catch (err) {
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const getAdvertController = async (req: Request, res: Response) => {
  try {
    const getRes = await getAdvertService();
    if (!getRes) {
      res.status(400).json({ message: 'ดึงไม่สำเร็จ', success: false });
      return;
    }

    res.status(200).json({ data: [...getRes], success: true });
    return;
  } catch (err) {
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const updateAdvertController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const files = req.file;
    if (!id) {
      res.status(400).json({ message: 'ไม่พบ ID ที่ส่งมา' });
      return;
    }
    const checkAdvert = await getAdvertByIdService({ id });
    if (!checkAdvert) {
      res.status(400).json({ success: false, message: 'ไม่พบ advert' });
      return;
    }
    const filesToDelete = [];
    if (checkAdvert.advert_image && files) {
      filesToDelete.push(checkAdvert.advert_image);
      const fs = require('fs');
      for (const filePath of filesToDelete) {
        try {
          const fullPath = path.join(__dirname, '..', filePath as string);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (fileErr) {
          console.warn(`Could not delete file ${filePath}:`, fileErr);
        }
      }
    }
    payload.advert_image = `/uploads/advert/${files?.filename}`;
    console.log(payload);
    const updateRes = await updateAdvertService({ id, payload });
    res.status(400).json({ success: true, data: { ...updateRes } });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const delAdvertController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'ไม่พบ ID ที่ส่งมา' });
      return;
    }
    const checkAdvert = await getAdvertByIdService({ id });
    if (!checkAdvert) {
      res.status(400).json({ success: false, message: 'ไม่พบ advert' });
      return;
    }
    if (checkAdvert.advert_image) {
      const fs = require('fs');
      const fullPath = path.join(__dirname, '..', checkAdvert.advert_image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await delAdvertService({ id });
    res.status(200).json({ message: 'ลบสำเร็จ' });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

export {
  createAdvertController,
  getAdvertController,
  updateAdvertController,
  delAdvertController,
};
