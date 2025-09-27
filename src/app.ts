import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import CatagoryRoute from './routes/catagory.route';
import AuthRoute from './routes/user.route';
import MovieRoute from './routes/movie.route';
import TageRoute from './routes/tag.route';
import BannerRoute from './routes/banner.route';
import AdvertRoute from './routes/advert.route';
import { errorHandler } from './middlewares/errorHandler';
import helmet from 'helmet';
import path from 'path';
import conditionalJsonParser from './middlewares/conditinal';
import cookieParser from 'cookie-parser';
const app = express();
const apiVersion = '/api/v1';

const corsOptions = {
  origin: [
    'http://119.59.124.133:3010',
    'http://119.59.124.133:3011',
    'http://localhost:3000',
    'http://localhost:4000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
};

app.use(cookieParser());

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('combined'));
// app.use(express.json({ limit: '10mb' }));

app.use(conditionalJsonParser);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Routes
app.use(`${apiVersion}/catagory`, CatagoryRoute);
app.use(`${apiVersion}/movies`, MovieRoute);
app.use(`${apiVersion}/auth`, AuthRoute);
app.use(`${apiVersion}/tag`, TageRoute);
app.use(`${apiVersion}/banner`, BannerRoute);
app.use(`${apiVersion}/advert`, AdvertRoute);

app.get('/ping', (req, res) => {
  res.send('docker test');
  return;
});

// Serve static files (uploaded images)
// app.use('/cms', express.static(path.join(__dirname, './cms')));
// app.use('/banner', express.static(path.join(__dirname, './banner')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
