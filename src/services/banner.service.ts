import { PrismaClient } from '@prisma/client';

interface BannerProps {
  banner_url: string;
  banner_image: string;
}

const db = new PrismaClient();

const createBannerService = async ({ payload }: { payload: BannerProps }) => {
  const res = await db.banner.create({
    data: payload,
  });
  return res;
};

const getBannerService = async () => {
  const res = await db.banner.findMany();
  return res;
};

const gerBannerById = async ({ id }: { id: string }) => {
  const res = await db.banner.findUnique({
    where: { id },
  });

  return res;
};

const delBanner = async ({ id }: { id: string }) => {
  const res = await db.banner.delete({
    where: { id },
  });

  return res;
};

export { createBannerService, getBannerService, gerBannerById, delBanner };
