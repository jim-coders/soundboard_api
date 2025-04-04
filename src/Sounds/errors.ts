import { CustomError } from '../error';

export class SoundCreateError extends CustomError {
  constructor(message: string = 'Error creating sound') {
    super(message, 409);
    this.name = 'SoundCreateError';
  }
}

export class SoundServiceError extends CustomError {
  constructor(message: string = 'Something went wrong') {
    super(message, 500);
    this.name = 'SoundServiceError';
  }
}

export class MissingFileTypeError extends CustomError {
  constructor(message: string = 'Missing file type') {
    super(message, 400);
    this.name = 'MissingFileTypeError';
  }
}

export class MissingFileNameError extends CustomError {
  constructor(message: string = 'Missing file name') {
    super(message, 400);
    this.name = 'MissingFileNameError';
  }
}
