import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg', // .mp3
  'audio/wav', // .wav
  'audio/ogg', // .ogg
  'audio/aac', // .aac
  'audio/m4a', // .m4a
];

export const generateUploadUrl = async (
  fileType: string,
  fileName: string
): Promise<{ url: string; key: string }> => {
  if (!ALLOWED_AUDIO_TYPES.includes(fileType)) {
    throw new Error('Invalid file type. Only audio files are allowed.');
  }

  // Generate a unique key for the file
  const fileExtension = fileName.split('.').pop();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const key = `${randomBytes}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url, key };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Failed to generate upload URL');
  }
};

export const deleteObject = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting object from S3:', error);
    throw new Error('Failed to delete object from S3');
  }
};
