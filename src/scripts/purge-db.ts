import mongoose from 'mongoose';
import Sound from '../Sounds/Sound.model';
import User from '../Users/User.model';

const purgeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Delete all sounds
    const soundResult = await Sound.deleteMany({});
    console.log(`Deleted ${soundResult.deletedCount} sounds`);

    // Delete all users
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);

    console.log('Database purge completed successfully');
  } catch (error) {
    console.error('Error purging database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the purge
purgeDatabase();
