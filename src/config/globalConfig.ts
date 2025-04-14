import { config } from 'dotenv';

config();

export const appPort = process.env.PORT;
export const db_uri = process.env.MONGO_URI ?? '';
export const env = process.env.ENV;
export const jwtSecret = process.env.JWT_SECRET ?? '';
export const corsOrigin = process.env.CORS_ORIGIN;
