import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { appPort } from './utils/config';
import { connectToMongoDB } from './configs';
import userRoutes from './routes/userRoutes';
import errorHandler from './middlewares/errorHandler';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectToMongoDB();

const app: Application = express();
const port = appPort || 4000;

// Middleware setup
app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: false,
//   })
// ); Should we use this? Look at the docs
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api', userRoutes); // TODO: Change this

// Error handling middleware
app.use(errorHandler);

// TEMP v v v v
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Our Soundboard Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
