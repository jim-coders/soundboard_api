import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import router from './routes';
import { connectToMongoDB } from './db';
import { appPort, passportConfig } from './config';
import { errorHandler } from './middlewares';
import { corsOrigin } from './config/globalConfig';

dotenv.config();

// Connect to the database
connectToMongoDB();

const app: Application = express();
const port = appPort || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);
console.log('CORS configured with origin:', corsOrigin);
app.use(helmet());
app.use(passport.initialize());
passportConfig(passport);

// Routes
app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Our Soundboard Server');
});

// Error handling
app.use(errorHandler);

// 404 handling
app.get('*', function (_req, res) {
  return res.status(404).json('Sir, this is a Wendys');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
