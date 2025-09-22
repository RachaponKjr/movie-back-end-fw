import { TageProps } from '@/controllers/tag.controller';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createTageService = async (payload: TageProps) => {
  const res = await db.tags.create({
    data: payload,
  });
  return res;
};

const getTageService = async () => {
  const res = await db.tags.findMany();
  return res;
};

const updateTageService = async (id: string, payload: Partial<TageProps>) => {
  const res = await db.tags.update({
    where: {
      id,
    },
    data: payload,
  });

  return res;
};

const delTageService = async (id: string) => {
  const res = await db.tags.delete({
    where: { id },
  });
  return res;
};

export { createTageService, getTageService, delTageService, updateTageService };
