import {
  createAcceptService,
  delAcceptService,
  getAcceptById,
  getAcceptByUsername,
  getAcceptsService,
  updateAccept,
} from '../services/user.service';
import { ReqAccept } from '../types/accept';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface ReqUpdate {
  username?: string;
  password?: string;
  role?: 'User' | 'Admin' | 'Owner';
}

const createAccept = async (req: Request, res: Response) => {
  try {
    const { password, role, username } = req.body as ReqAccept;
    const SALT_ROUNDS = 10;
    if (!password || !username) {
      res.status(400).send({ message: 'ไม่พบ password หรือ username' });
      return;
    }

    const checkAccept = await getAcceptByUsername(username);

    if (checkAccept) {
      res.status(400).send({ message: 'มี username นี้เเล้ว' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const payload = {
      password: hashedPassword,
      role: role as 'User' | 'Admin' | 'Owner' | undefined,
      username: username,
    };
    const createAcceptRes = await createAcceptService(payload);
    if (!createAcceptRes) {
      res.status(400).send({ message: 'ไม่สามารถสร้าง Accept ได้' });
      return;
    }
    res
      .status(201)
      .send({ data: { ...createAcceptRes }, message: 'สมัครเสร็จสิ้น' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as ReqAccept;

    if (!username || !password) {
      res.status(400).json({ message: 'กรุณาใส่ username และ password' });
      return;
    }

    const accept = await getAcceptByUsername(username);
    if (!accept) {
      res.status(400).json({ message: 'ไม่พบผู้ใช้' });
      return;
    }

    const isMatch = await bcrypt.compare(password, accept.password);
    if (!isMatch) {
      res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      return;
    }

    const token = jwt.sign(
      { id: accept.id, role: accept.role, username: accept.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    res.cookie('accept_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = accept;

    res.status(200).json({
      data: userWithoutPassword,
      message: 'เข้าสู่ระบบสำเร็จ',
    });
    return;
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server Error!', error: err });
    return;
  }
};

const getAcceptsController = async (req: Request, res: Response) => {
  try {
    const accepts = await getAcceptsService();
    if (!accepts) {
      res.status(400).send({ message: 'ไม่มี Accepts' });
    }
    res.status(200).send({ data: [...accepts] });
    return;
  } catch (err) {
    res.status(500).send({ message: 'Server Error!' });
    return;
  }
};

const updateAcceptController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as ReqUpdate;
    const { id } = req.params as { id: string };
    const SALT_ROUNDS = 10;

    if (!id || typeof id !== 'string') {
      res.status(400).send({ message: 'Missing or invalid ID' });
      return;
    }

    if (payload.password) {
      const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
      payload.password = hashedPassword;
    }

    const updateRes = await updateAccept({ id, payload });

    res.status(200).send({ data: updateRes, message: 'สำเร็จ' });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Server Error',
      error: (err as Error).message,
    });
    return;
  }
};

const delAcceptController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id || typeof id !== 'string') {
      res.status(400).send({ message: 'Missing or invalid ID' });
      return;
    }

    const delRes = await delAcceptService(id);

    if (!delRes) {
      res.status(404).send({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
      return;
    }

    res.status(200).send({ data: delRes, message: 'ลบสำเร็จ' });
    return;
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Server Error', error: (err as Error).message });
    return;
  }
};

export {
  createAccept,
  getAcceptsController,
  delAcceptController,
  updateAcceptController,
  loginController,
};
