import { connectToMongoDB } from '../db';
import soundService from '../Sounds/sounds.service';

const cleanupOrphanedFiles = async () => {
  try {
    console.log('Starting orphaned file cleanup...');

    // Connect to database
    await connectToMongoDB();
    console.log('Connected to database');

    // Run cleanup
    const result = await soundService.cleanupOrphanedFiles();

    console.log('Cleanup completed:');
    console.log(`- Deleted ${result.deleted.length} orphaned files`);
    if (result.errors.length > 0) {
      console.log(`- Failed to delete ${result.errors.length} files`);
      console.log('Failed files:', result.errors);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanupOrphanedFiles();
