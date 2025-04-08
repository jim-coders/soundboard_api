import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../Users/errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
];

export const validateSoundUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fileType, fileSize, title, description } = req.body;

  // Validate file type
  if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType)) {
    throw new ValidationError(
      `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }

  // Validate file size
  if (!fileSize || fileSize > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }

  // Validate required fields
  if (!title || !description) {
    throw new ValidationError('Title and description are required');
  }

  // Validate field lengths
  if (title.length > 100) {
    throw new ValidationError('Title must be less than 100 characters');
  }

  if (description.length > 500) {
    throw new ValidationError('Description must be less than 500 characters');
  }

  next();
};

export default validateSoundUpload;
