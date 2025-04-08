import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { S3Error } from '../types/errors';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
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
    throw new S3Error('Failed to generate upload URL');
  }
};

export const deleteObject = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`Successfully deleted S3 object: ${key}`);
  } catch (error) {
    console.error(`Error deleting S3 object ${key}:`, error);
    throw new S3Error(`Failed to delete S3 object: ${key}`);
  }
};

export const generateReadUrl = async (key: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error generating read URL:', error);
    throw new S3Error('Failed to generate read URL');
  }
};

export const deleteObjects = async (keys: string[]): Promise<void> => {
  try {
    await Promise.all(keys.map((key) => deleteObject(key)));
    console.log(`Successfully deleted ${keys.length} S3 objects`);
  } catch (error) {
    console.error('Error deleting multiple S3 objects:', error);
    throw new S3Error('Failed to delete S3 objects');
  }
};

export const listObjects = async (
  prefix: string = 'uploads/'
): Promise<string[]> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);
    return (response.Contents || [])
      .map((obj) => obj.Key || '')
      .filter(Boolean);
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    throw new S3Error('Failed to list S3 objects');
  }
};
