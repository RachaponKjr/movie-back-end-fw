import fs from 'fs'; // ใช้ fs ปกติสำหรับ existsSync
import ffmpeg from 'fluent-ffmpeg';
import {
  createMovieService,
  delMovieService,
  getMovieByCatagoryName,
  getMovieByIdService,
  getMovieByKeyWordService,
  getMovieByTageService,
  getMoviesService,
  searchMovieService,
  updateMovieService,
  updateStatusMovieService,
  updateViewMovieService,
} from '@/services/movie.service';
import { Movie, MovieSchema } from '../types/movie';
import { Request, Response } from 'express';
import path from 'path';
import { execSync } from 'child_process';

const ffmpegPath = execSync('which ffmpeg').toString().trim();
ffmpeg.setFfmpegPath(ffmpegPath); 

const createMovieController = async (req: Request, res: Response) => {
  try {
    let payload = req.body as Movie;
    if (typeof payload.tage === 'string') {
      payload.tage = JSON.parse(payload.tage);
    }

    if (payload.rate && typeof payload.rate === 'string') {
      payload.rate = parseFloat(payload.rate);
    }
    if (payload.view && typeof payload.view === 'string') {
      payload.view = parseInt(payload.view);
    }
    if (payload.isShow && typeof payload.isShow === 'string') {
      payload.isShow = payload.isShow === 'true';
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.film_poster?.[0]) {
      payload.film_poster = `/uploads/movies/${files.film_poster[0].filename}`;
    }

    if (files?.video_url?.[0]) {
      const originalPath = files.video_url[0].path;
      const optimizedPath = originalPath.replace('.mp4', '_optimized.mp4');

      await new Promise<void>((resolve, reject) => {
        ffmpeg(originalPath)
          .outputOptions('-movflags faststart')
          .outputOptions('-c copy')
          .save(optimizedPath)
          .on('end', () => {
            // ลบไฟล์เก่า (optional)
            fs.unlinkSync(originalPath);

            // ใช้ path ของไฟล์ใหม่
            payload.video_url = `/movies/watch/${path.basename(optimizedPath)}`;
            resolve();
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(err);
          });
      });
    }
    if (payload.status) {
      if (payload.status === 'null') {
        payload.status = 'NotStatus';
      } else if (payload.status === 'New' || payload.status === 'Hot') {
        payload.status = payload.status;
      }
    } else {
      payload.status = 'NotStatus';
    }

    const createRes = await createMovieService({ payload });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: createRes,
    });
    return;
  } catch (err) {
    console.error('Error creating movie:', err);

    if (err instanceof Error && err.message.includes('Unique constraint')) {
      res.status(409).json({
        success: false,
        message: 'Movie with this name already exists',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};

const getMoviesController = async (req: Request, res: Response) => {
  try {
    const getRes = await getMoviesService();
    res.status(200).send({ data: getRes ?? [], status: true });
    return;
  } catch (err) {
    res.status(500).send({
      message: 'Server Error',
      error: (err as Error).message,
    });
    return;
  }
};

const getMovieByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      res.status(400).send({ message: 'ไม่พบ ID' });
      return;
    }
    const resMovie = await getMovieByIdService(id);
    if (!resMovie) {
      res.status(400).send({ message: 'ไม่พบ movie' });
      return;
    }
    res.status(200).send({ data: { ...resMovie }, status: true });
  } catch (err) {
    res.status(500).send({
      message: 'Server Error',
      error: (err as Error).message,
    });
    return;
  }
};

const getMovieByTageController = async (req: Request, res: Response) => {
  try {
    const { tage } = req.body;
    if (!tage) {
      res.status(400).send({ message: 'กรุณาใส่ข้อมูล tage', status: false });
      return;
    }
    const resMovie = await getMovieByTageService({ tage_title: tage });
    if (resMovie.length === 0) {
      res.status(400).send({ message: ' ไม่พบ movies ', status: false });
    }
    res.status(200).send({ data: [...resMovie], status: true });
    return;
  } catch (err) {
    res.status(500).send({
      message: 'Server Error',
      error: (err as Error).message,
    });
    return;
  }
};

const getMovieByCatagory = async (req: Request, res: Response) => {
  try {
    const { catagory_name } = req.body;
    if (!catagory_name) {
      res.status(400).send({ message: 'กรุณาใส่ข้อมูล catagory_name' });
      return;
    }

    const movieRes = await getMovieByCatagoryName(catagory_name);
    if (movieRes.length === 0) {
      res.status(400).send({ message: 'ไม่พบ movies', status: false });
      return;
    }
    res.status(200).send({ data: [...movieRes], status: true });
  } catch (err) {
    res.status(500).send({
      message: 'Server Error',
      error: (err as Error).message,
    });
    return;
  }
};

const getMovieByKeyWord = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      res.status(400).send({ message: 'กรุณาใส่ข้อมูล keyword' });
      return;
    }

    const movieRes = await getMovieByKeyWordService(keyword);
    if (movieRes.length === 0) {
      res.status(400).send({ message: 'ไม่พบ movies', status: false });
      return;
    }
    res.status(200).send({ data: [...movieRes], status: true });
  } catch (err) {
    res.status(500).send({
      message: 'Server Error',
      error: (err as Error).message,
    });
    return;
  }
};

const updateMovieController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const rawPayload = req.body;
    if (!id) {
      res.status(400).send({
        message: 'ไม่พบ ID ที่ส่งมา',
        success: false,
      });
      return;
    }

    const checkMovie = await getMovieByIdService(id);
    if (!checkMovie) {
      res.status(404).send({
        message: 'ไม่พบ movie ที่ต้องการอัพเดท',
        success: false,
      });
      return;
    }

    if (rawPayload.tage && typeof rawPayload.tage === 'string') {
      try {
        rawPayload.tage = JSON.parse(rawPayload.tage);
      } catch {
        rawPayload.tage = [rawPayload.tage];
      }
    }

    if (files) {
      if (files.film_poster) {
        rawPayload.film_poster = `/uploads/movies/${files.film_poster[0].filename}`;
      }
      if (files?.video?.[0]) {
        rawPayload.video_url = `/uploads/movies/${files.video[0].filename}`;
      }
    }

    rawPayload.isShow = rawPayload.isShow === 'true';
    rawPayload.rate = parseFloat(rawPayload.rate);
    rawPayload.view = Number(rawPayload.view);

    const parsed = MovieSchema.partial().safeParse(rawPayload); // ใช้ .partial() สำหรับอัปเดตบางฟิลด์
    if (!parsed.success) {
      console.log(parsed.error.flatten());
      res.status(400).send({
        message: 'ข้อมูลไม่ถูกต้อง',
        success: false,
        errors: parsed.error.flatten(),
      });
      return;
    }

    const filesToDelete = [];
    if (checkMovie.film_poster && files?.film_poster) {
      filesToDelete.push(checkMovie.film_poster);
    }

    if (checkMovie.video_url && files?.video_url) {
      filesToDelete.push(checkMovie.video_url);
    }

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

    const updatedMovie = await updateMovieService(id, parsed.data);

    res.status(200).send({
      message: 'อัปเดต movie สำเร็จ',
      success: true,
      data: updatedMovie,
    });
    return;
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).send({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};

const updateStatusMovieController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { isShow } = req.body as { isShow: boolean };

    const resUpdate = await updateStatusMovieService({ id, status: isShow });

    if (!resUpdate) {
      res.status(400).send({ message: 'อัพเดทไม่สําเร็จ' });
      return;
    }

    res.status(200).send({
      data: resUpdate, // ✅ ส่งข้อมูลที่ได้จาก service
      message: 'อัพเดทสําเร็จ',
    });
    return;
  } catch (err) {
    console.error('Error updating movie status:', err);

    res.status(500).send({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};

const delMovieController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    // ตรวจสอบว่ามี ID ส่งมาหรือไม่
    if (!id) {
      res.status(400).send({
        message: 'ไม่พบ ID ที่ส่งมา',
        success: false,
      });
      return;
    }

    // ตรวจสอบว่าหนังมีอยู่ในระบบหรือไม่
    const checkMovie = await getMovieByIdService(id);

    if (!checkMovie) {
      res.status(404).send({
        message: 'ไม่พบหนังที่ต้องการลบ',
        success: false,
      });
      return;
    }

    // ลบไฟล์รูปภาพที่เกี่ยวข้อง (ถ้ามี)
    const filesToDelete = [];
    if (checkMovie.film_poster) {
      filesToDelete.push(checkMovie.film_poster);
    }
    if (checkMovie.video_url) {
      filesToDelete.push(checkMovie.video_url);
    }

    // ลบไฟล์จาก filesystem
    for (const filePath of filesToDelete) {
      try {
        const fs = require('fs');
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${filePath}`);
        }
      } catch (fileErr) {
        console.warn(`Could not delete file ${filePath}:`, fileErr);
        // ไม่หยุดการทำงาน แค่แสดง warning
      }
    }

    // ลบข้อมูลหนังจากฐานข้อมูล
    await delMovieService(id);

    res.status(200).send({
      message: 'ลบหนังสำเร็จ',
      success: true,
      deletedMovie: {
        id: checkMovie.id,
        movie_name: checkMovie.movie_name,
      },
    });
    return;
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).send({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};

const updateViewMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const resUpdate = await updateViewMovieService(id);
    if (!resUpdate) {
      res.status(400).send({ message: 'อัพเดทไม่สําเร็จ' });
      return;
    }
    res.status(200).send({
      data: resUpdate, // ✅ ส่งข้อมูลที่ได้จาก service
      message: 'อัพเดทสําเร็จ',
    });
  } catch (err) {
    console.error('Error updating movie status:', err);
    res.status(500).send({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};

const searchMovieController = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    if (!search || typeof search !== 'string') {
      res.status(400).json({ error: 'ต้องส่ง query' });
      return;
    }

    const searchRes = await searchMovieService(search);

    res.json({ data: [...searchRes], success: true });
    return;
  } catch (err) {
    res.status(500).send({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};

const watchMovieController = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params as { filename: string };
    const videoPath = path.join(__dirname, '../uploads/movies', filename);

    if (!fs.existsSync(videoPath)) {
      res.status(404).send('File not found');
      return;
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      // ถ้า client ไม่ส่ง range มา — ปฏิเสธ
      res.status(416).send('Requires Range header');
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);

    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    if (start >= fileSize || end >= fileSize) {
      res.status(416).send('Range Not Satisfiable');
      return;
    }

    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    file.pipe(res);
  } catch (err) {
    console.error('Streaming Error:', err);
    res.status(500).send({
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      success: false,
      error: (err as Error).message,
    });
  }
};

export {
  getMovieByIdController,
  getMovieByTageController,
  getMovieByKeyWord,
  getMoviesController,
  delMovieController,
  createMovieController,
  updateMovieController,
  updateStatusMovieController,
  getMovieByCatagory,
  updateViewMovie,
  searchMovieController,
  watchMovieController,
};
