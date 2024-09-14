import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';

import { connectToMongoDB } from './db';
import { appPort } from './config';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

// Connect to the database
connectToMongoDB();

const app: Application = express();
const port = appPort || 4000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:4000', // make dynamic my env vars
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
app.use(helmet());

// Routes
app.use(router);

// Error handling middleware
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Our Soundboard Server');
});

// 404 handling
app.get('*', function (req, res) {
  return res.status(404).json('Sir, this is a Wendys');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
