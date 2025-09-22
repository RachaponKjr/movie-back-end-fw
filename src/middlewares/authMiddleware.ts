import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || '6vP12GkCJGfkgrGjBsNMoPdH0BqJ2I4o';

interface JwtPayload {
  id: string;
  role: 'User' | 'Admin' | 'Owner';
  username: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accept_token;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;

    if (decoded.role !== 'Admin' && decoded.role !== 'Owner') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
};
