import { AdvertProps } from '@/controllers/advert.controller';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const createAdvertService = async ({ payload }: { payload: AdvertProps }) => {
  const res = await db.advert.create({
    data: payload,
  });
  return res;
};

const getAdvertService = async () => {
  const res = await db.advert.findMany();
  return res;
};

const getAdvertByIdService = async ({ id }: { id: string }) => {
  const res = await db.advert.findUnique({
    where: { id },
  });
  return res;
};

const updateAdvertService = async ({
  id,
  payload,
}: {
  id: string;
  payload: AdvertProps;
}) => {
  const res = await db.advert.update({
    where: {
      id,
    },
    data: payload,
  });
  return res;
};

const delAdvertService = async ({ id }: { id: string }) => {
  const res = await db.advert.delete({
    where: { id },
  });
  return res;
};

export {
  createAdvertService,
  getAdvertService,
  getAdvertByIdService,
  updateAdvertService,
  delAdvertService,
};
