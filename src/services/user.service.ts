import { ReqUpdate } from '../controllers/user.controller';
import { ReqAccept } from '../types/accept';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createAcceptService = async (payload: ReqAccept) => {
  const res = await db.user.create({
    data: payload,
  });

  return res;
};

const getAcceptsService = async () => {
  const res = await db.user.findMany();
  return res;
};

const getAcceptById = async ({ id }: { id: string }) => {
  const res = await db.user.findFirst({
    where: {
      id,
    },
  });
  return res
};

const getAcceptByUsername = async (username: string) => {
  const res = await db.user.findFirst({
    where: {
      username,
    },
  });
  return res;
};

const updateAccept = async ({
  id,
  payload,
}: {
  id: string;
  payload: ReqUpdate;
}) => {
  const res = await db.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return res;
};

const delAcceptService = async (id: string) => {
  const res = await db.user.delete({
    where: {
      id,
    },
  });
  return res;
};

export {
  createAcceptService,
  getAcceptByUsername,
  getAcceptsService,
  delAcceptService,
  updateAccept,
  getAcceptById
};
