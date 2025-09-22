import {
  createCmsService,
  getCmsByIdService,
  getCmsService,
  updateCmsService,
} from '../services/cms.service';
import { Cms } from '@prisma/client';
import { Request, Response } from 'express';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import path from 'path';
import fs from 'fs';

const createCMSController = async (req: Request, res: Response) => {
  try {
    const body = req.body as Cms;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!body) {
      res.status(400).send({ message: 'กรุณากรอกข้อมูล' });
      return;
    }

    // แนบ path ของไฟล์ภาพ (หากมี)
    if (files?.image_banner?.[0]) {
      body.image_banner = `/uploads/cms/${files.image_banner[0].filename}`;
    }
    if (files?.image_advert?.[0]) {
      body.image_advert = `/uploads/cms/${files.image_advert[0].filename}`;
    }

    // แปลง seo_keyword จาก string เป็น array ถ้าไม่ใช่อยู่แล้ว
    try {
      if (typeof body.seo_keyword === 'string') {
        body.seo_keyword = JSON.parse(body.seo_keyword);
      }
    } catch (error) {
      res.status(400).send({
        message:
          'รูปแบบ seo_keyword ไม่ถูกต้อง ต้องเป็น JSON array string เช่น [\"keyword\"]',
      });
      return;
    }

    const create = await createCmsService({ payload: body });

    if (!create) {
      res.status(400).send({ message: 'สร้างไม่สําเร็จ' });
      return;
    }

    res.status(201).send({ create, message: 'สร้างสําเร็จ' });
    return;
  } catch (err) {
    // หากต้องการตรวจจับ Prisma error แบบละเอียด
    if (err instanceof PrismaClientKnownRequestError) {
      res
        .status(500)
        .send({ message: 'เกิดข้อผิดพลาดจากฐานข้อมูล', detail: err.message });
      return;
    }

    console.error('❌ CMS CREATE ERROR:', err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const getCMSController = async (req: Request, res: Response) => {
  try {
    const getRes = await getCmsService();
    if (!getRes) {
      res.status(400).send({ message: 'ไม่พบ cms' });
      return;
    }
    res.status(200).send({ data: getRes, status: true });
    return;
  } catch (err) {
    console.error('❌ CMS GET ERROR:', err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const updateCMSController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as Cms;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!id) {
      res.status(400).json({ message: 'ไม่พบ ID' });
      return;
    }

    const existingCMS = await getCmsByIdService(id);
    if (!existingCMS) {
      res.status(404).json({ message: 'ไม่พบ CMS ที่ต้องการแก้ไข' });
      return;
    }

    if (!payload) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูล' });
      return;
    }

    const filesToDelete: string[] = [];
    if (files?.image_banner?.[0] && existingCMS.image_banner) {
      filesToDelete.push(existingCMS.image_banner);
    }
    if (files?.image_advert?.[0] && existingCMS.image_advert) {
      filesToDelete.push(existingCMS.image_advert);
    }

    for (const filePath of filesToDelete) {
      const fullPath = path.join(__dirname, '..', filePath);
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ ลบไฟล์: ${filePath}`);
        }
      } catch (err) {
        console.warn(`⚠️ ไม่สามารถลบไฟล์ ${filePath}:`, err);
      }
    }

    if (files?.image_banner?.[0]) {
      payload.image_banner = `/uploads/cms/${files.image_banner[0].filename}`;
    }
    if (files?.image_advert?.[0]) {
      payload.image_advert = `/uploads/cms/${files.image_advert[0].filename}`;
    }

    if (payload.seo_keyword && typeof payload.seo_keyword === 'string') {
      try {
        payload.seo_keyword = JSON.parse(payload.seo_keyword);
      } catch {}
    }

    const updateResult = await updateCmsService(id, payload);
    if (!updateResult) {
      res.status(400).json({ message: 'แก้ไขไม่สำเร็จ' });
      return;
    }

    res.status(200).json({ data: updateResult, message: 'แก้ไขสำเร็จ' });
    return;
  } catch (error) {
    console.error('❌ CMS UPDATE ERROR:', error);
    res.status(500).json({ message: 'Server Error!' });
    return;
  }
};

export { createCMSController, getCMSController, updateCMSController };
