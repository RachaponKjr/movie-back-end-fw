import { Request, Response, NextFunction } from 'express';
import express from 'express';

const conditionalJsonParser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    // ใช้ express.json() เฉพาะเมื่อ Content-Type เป็น JSON
    return express.json()(req, res, next);
  }

  // ถ้าไม่ใช่ JSON ให้ข้ามไปเฉยๆ
  next();
};

export default conditionalJsonParser;
