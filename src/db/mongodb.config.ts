import mongoose from 'mongoose';
import { db_uri, env } from '../config/globalConfig';

const connectToMongoDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    const connected = await mongoose.connect(db_uri);
    const connectionName = connected.connections[0].name;

    if (connected && env === 'dev') {
      console.log(`Connected to mongo - ${connectionName} ;)`);
    }
  } catch (error) {
    console.error('Error connecting to mongo', error);
  }
};

export default connectToMongoDB;
