// utils/multer.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * สร้าง Multer instance โดยกำหนดโฟลเดอร์ที่ต้องการอัปโหลด
 * @param folder โฟลเดอร์ที่จะเก็บไฟล์ เช่น 'posters' หรือ 'videos'
 */
export const createMulterUpload = (folder: string) => {
  const uploadPath = path.join(__dirname, '..', 'uploads', folder);

  // สร้างโฟลเดอร์ถ้ายังไม่มี
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP images and MP4 videos are allowed'));
    }
  };

  return multer({ storage, fileFilter });
};
