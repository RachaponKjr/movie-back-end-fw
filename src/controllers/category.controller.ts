import {
  createCatagoryService,
  delCatagoryService,
  getCatagoryByIdService,
  getCatagorysService,
  updateCatagoryService,
  updateIsShowService,
} from '../services/catagory.service';
import { Request, Response } from 'express';

const createCatagoryController = async (req: Request, res: Response) => {
  try {
    const { title, isShow } = req.body as { title: string; isShow: boolean };
    if (!title) {
      res.status(400).send({ message: 'กรุณาใส่ชื่อ catagory' });
    }
    const create = await createCatagoryService({ title, isShow });
    if (!create) {
      res.status(400).send({ message: 'สร้างไม่สำเร็จ' });
      return;
    }
    res.status(201).send({ create, message: 'สร้างสำเร็จ' });
    return;
  } catch (err) {
    console.log(err, 'Error');
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const getCatagorysController = async (req: Request, res: Response) => {
  try {
    const getRes = await getCatagorysService();
    if (!getRes) {
      res.status(400).send({ message: 'ไม่พบ catagory' });
    }
    res.status(200).send({ data: [...getRes] });
  } catch (err) {
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const getCatagoryByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      res.status(400).send({ message: 'ไม่พบ ID' });
      return;
    }
    const getRes = await getCatagoryByIdService({ id });

    if (!getRes) {
      res.status(400).send({ message: 'ไม่พบข้อมูล catagory' });
    }
    res.status(200).send({ getRes });
    return;
  } catch (err) {
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const updateCatagoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title } = req.body as { title: string };
    if (!id) {
      res.status(400).send({ message: 'ไม่พบ ID' });
      return;
    }
    if (!title) {
      res.status(400).send({ message: 'กรุณาใส่ชื่อ catagory' });
      return;
    }
    const resUpdate = await updateCatagoryService({ id, title });
    if (!resUpdate) {
      res.status(400).send({ message: 'อัพเดทไม่สำเร็จ' });
      return;
    }
    res.status(200).send({ data: { ...resUpdate }, message: 'อัพเดทสำเร็จ' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const updateCatagoryIsShowController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isShow } = req.body;

    if (!id) {
      res.status(400).json({ message: 'ไม่มี ID', success: false });
      return;
    }

    const updateRes = await updateIsShowService({ id, isShow });

    res.status(200).json({ data: { ...updateRes }, success: true });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const delCatagoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      res.status(400).send({ message: 'ไม่พบ ID' });
      return;
    }
    const delRes = await delCatagoryService(id);
    res.status(200).send({ delRes, message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

export {
  createCatagoryController,
  delCatagoryController,
  getCatagorysController,
  getCatagoryByIdController,
  updateCatagoryController,
  updateCatagoryIsShowController,
};
