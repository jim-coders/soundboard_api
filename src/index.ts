import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';

import { appPort } from './utils/config';
import { connectToMongoDB } from './configs';
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
app.use(router); // TODO: Change this

// Error handling middleware
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Our Soundboard Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
