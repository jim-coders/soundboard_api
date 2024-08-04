import { config } from 'dotenv';

config();

export const db_uri = process.env.MONGO_URI ?? '';
export const appPort = process.env.PORT;
export const env = process.env.ENV;
