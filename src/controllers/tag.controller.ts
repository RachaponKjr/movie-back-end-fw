import {
  createTageService,
  delTageService,
  getTageService,
  updateTageService,
} from '@/services/tage.service';
import { Request, Response } from 'express';

export interface TageProps {
  tag_name: string;
  is_show_menu?: boolean;
}

const createTageController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const payload = req.body as TageProps;
    if (!payload?.tag_name) {
      return res
        .status(400)
        .json({ success: false, message: 'ไม่พบ tag_name' });
    }

    const createRes = await createTageService(payload);
    return res.status(201).json({ success: true, data: createRes });
  } catch (err) {
    console.error('Error creating tage:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getTageController = async (
  _req: Request,
  res: Response,
): Promise<any> => {
  try {
    const getRes = await getTageService();
    if (!getRes || getRes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'ไม่พบข้อมูล Tage' });
    }
    return res.status(200).json({ success: true, data: getRes });
  } catch (err) {
    console.error('Error fetching tage:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const delTageController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'ไม่พบ ID ที่ส่งมา' });
    }

    const delRes = await delTageService(id);
    if (!delRes) {
      return res
        .status(400)
        .json({ success: false, message: 'ไม่สามารถลบข้อมูลได้' });
    }

    return res.status(200).json({
      success: true,
      data: delRes,
      message: 'ลบข้อมูล Tage เรียบร้อย',
    });
  } catch (err) {
    console.error('Error deleting tage:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateTageController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'ไม่พบ ID ที่ส่งมา' });
    }

    const payload = req.body as Partial<TageProps>;
    const updateRes = await updateTageService(id, payload);

    if (!updateRes) {
      return res
        .status(400)
        .json({ success: false, message: 'ไม่สามารถอัปเดตข้อมูลได้' });
    }

    return res.status(200).json({
      success: true,
      data: updateRes,
      message: 'อัปเดตเรียบร้อย!',
    });
  } catch (err) {
    console.error('Error updating tage:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export {
  createTageController,
  getTageController,
  delTageController,
  updateTageController,
};
