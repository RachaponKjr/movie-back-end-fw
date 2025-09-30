import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createCatagoryService = async ({
  title,
  isShow = false,
}: {
  title: string;
  isShow: boolean;
}) => {
  const res = await db.categoryMovies.create({
    data: {
      catagory_name: title,
      isShow: isShow,
    },
  });
  return res;
};

const updateIsShowService = async ({
  id,
  isShow,
}: {
  id: string;
  isShow: boolean;
}) => {
  const res = await db.categoryMovies.update({
    where: {
      id,
    },
    data: {
      isShow,
    },
  });
  return res
};

const getCatagorysService = async () => {
  const categories = await db.categoryMovies.findMany();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const showCount = await db.movie.count({
        where: {
          category_id: cat.id,
          isShow: true,
        },
      });

      const hideCount = await db.movie.count({
        where: {
          category_id: cat.id,
          isShow: false,
        },
      });

      return {
        ...cat,
        showCount,
        hideCount,
      };
    }),
  );

  return categoriesWithCounts;
};

const getCatagoryByIdService = async ({ id }: { id: string }) => {
  const res = await db.categoryMovies.findUnique({
    where: {
      id,
    },
    include: {
      movies: true,
    },
  });
  return res;
};

const checkCatagoryService = async (id: string) => {
  const res = await db.categoryMovies.findUnique({
    where: {
      id,
    },
  });

  return res;
};

const updateCatagoryService = async ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => {
  const res = await db.categoryMovies.update({
    where: {
      id,
    },
    data: {
      catagory_name: title,
    },
  });
  return res;
};

const delCatagoryService = async (id: string) => {
  const res = await db.categoryMovies.delete({
    where: {
      id,
    },
  });

  return res;
};

export {
  createCatagoryService,
  delCatagoryService,
  getCatagorysService,
  getCatagoryByIdService,
  updateCatagoryService,
  checkCatagoryService,
  updateIsShowService,
};
