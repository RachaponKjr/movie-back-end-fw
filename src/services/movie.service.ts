import { Movie } from '../types/movie';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const createMovieService = async ({ payload }: { payload: any }) => {
  const tagsArray: string[] = Array.isArray(payload.tags)
    ? payload.tags
    : JSON.parse(payload.tags || '[]');
  const res = await db.movie.create({
    data: {
      movie_name: payload.movie_name,
      duration: payload.duration,
      rate: payload.rate,
      view: payload.view,
      langMovie: payload.langMovie,
      status: payload.status,
      video_url: payload.video_url,
      release_year: payload.release_year,
      video_type: payload.video_type,
      film_poster: payload.film_poster,
      CategoryMovies: {
        connect: { id: payload.category_id },
      },
      tage: {
        create: tagsArray.map((tag: string) => ({
          tag_name: tag,
        })),
      },
    },
    include: { tage: true },
  });

  return res;
};

const getMoviesService = async () => {
  const res = await db.movie.findMany({
    include: {
      CategoryMovies: {
        select: {
          catagory_name: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  const payload = res.map((movie) => {
    const { CategoryMovies, ...rest } = movie;

    return {
      ...rest,
      catagory: CategoryMovies?.catagory_name,
    };
  });

  return payload;
};

const getMovieByCatagoryName = async (catagory_name: string) => {
  const res = await db.movie.findMany({
    where: {
      CategoryMovies: {
        catagory_name,
      },
    },
  });
  return res;
};

const getMovieByIdService = async (id: string) => {
  const res = await db.movie.findUnique({
    where: { id },
    include: {
      CategoryMovies: {
        select: {
          catagory_name: true,
        },
      },
    },
  });

  if (!res) return null;

  const { CategoryMovies, ...rest } = res;

  const payload = {
    ...rest,
    catagory_name: CategoryMovies?.catagory_name,
  };

  return payload;
};

const getMovieByTageService = async ({
  tage_title,
}: {
  tage_title: string;
}) => {
  const res = await db.movie.findMany({
    where: {
      tage: {
        some: {
          tag_name: tage_title,
        },
      },
    },
    include: {
      tage: true,
    },
  });
  return res;
};

const getMovieByKeyWordService = async (keyWord: string) => {
  const res = await db.movie.findMany({
    where: {
      OR: [
        {
          movie_name: {
            contains: keyWord,
            mode: 'insensitive',
          },
        },
        {
          tage: {
            some: {
              tag_name: keyWord,
            },
          },
        },
      ],
    },
  });
  return res;
};

const updateStatusMovieService = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  const res = await db.movie.update({
    where: {
      id,
    },
    data: {
      isShow: status,
    },
  });
  return res;
};

const updateMovieService = async (id: string, payload: Partial<any>) => {
  const { tage, category_id, ...rest } = payload;
  const res = await db.movie.update({
    where: { id },
    data: {
      ...rest,
      ...(category_id && {
        CategoryMovies: {
          connect: { id: category_id },
        },
      }),
      ...(tage && {
        tage: {
          set: tage.map((tagId: string) => ({ id: tagId })),
        },
      }),
    },
    include: {
      tage: true,
      CategoryMovies: true, // จะได้ข้อมูลหมวดหมู่กลับมาด้วย
    },
  });

  return res;
};

const updateViewMovieService = async (id: string) => {
  const res = await db.movie.update({
    where: { id },
    data: {
      view: {
        increment: 1,
      },
    },
  });
  return res;
};

const delMovieService = async (id: string) => {
  const res = await db.movie.delete({
    where: {
      id,
    },
  });
  return res;
};

const searchMovieService = async (search: string) => {
  const movies = await db.movie.findMany({
    where: {
      movie_name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  return movies;
};

export {
  getMovieByIdService,
  getMoviesService,
  getMovieByTageService,
  createMovieService,
  delMovieService,
  updateStatusMovieService,
  getMovieByCatagoryName,
  updateMovieService,
  updateViewMovieService,
  getMovieByKeyWordService,
  searchMovieService,
};
