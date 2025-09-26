import {
  createMovieController,
  delMovieController,
  getMovieByCatagory,
  getMovieByIdController,
  getMovieByKeyWord,
  getMovieByTageController,
  getMoviesController,
  searchMovieController,
  updateMovieController,
  updateStatusMovieController,
  updateViewMovie,
} from '../controllers/movie.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createMulterUpload } from '../utils/multer';
import express from 'express';
const router = express.Router();

const uploadMovie = createMulterUpload('movies');

router.post(
  '/create-movie',
  // authMiddleware,
  uploadMovie.fields([
    { name: 'film_poster', maxCount: 1 },
    { name: 'video_url', maxCount: 1 },
  ]),
  createMovieController,
);
router.get('/get-movies', getMoviesController);
router.get('/get-movie/:id', getMovieByIdController);
router.post('/search-movie', searchMovieController);
router.post('/get-moviebycatagory', getMovieByCatagory);
router.post('/get-moviebytage', getMovieByTageController);
router.post('/get-moviebykeyword', getMovieByKeyWord);
router.put('/update-status/:id', authMiddleware, updateStatusMovieController);
router.put('/update-view/:id', updateViewMovie);
router.patch(
  '/update-movie/:id',
  authMiddleware,
  uploadMovie.fields([
    { name: 'film_poster', maxCount: 1 },
    { name: 'video_url', maxCount: 1 },
  ]),
  updateMovieController,
);
router.delete('/del-movie/:id', authMiddleware, delMovieController);

export default router;
