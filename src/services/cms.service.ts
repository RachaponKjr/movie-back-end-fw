import { Cms, PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createCmsService = async ({ payload }: { payload: Cms }) => {
  const res = await db.cms.create({
    data: payload,
  });
  return res;
};

const getCmsService = async () => {
  const res = await db.cms.findFirst();
  return res;
};

const getCmsByIdService = async (id: string) => {
  const res = await db.cms.findUnique({ where: { id } });
  return res;
};

const updateCmsService = async (id: string, payload: Partial<Cms>) => {
  const res = await db.cms.update({ where: { id }, data: payload });
  return res;
};

export { createCmsService, getCmsService, getCmsByIdService, updateCmsService };
