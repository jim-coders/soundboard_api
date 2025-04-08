import { CustomError } from '../error';

export class UserAlreadyRegistered extends CustomError {
  constructor(message: string = 'Something went wrong') {
    super(message, 409); // this will be statusType not a number
    this.name = 'UserAlreadyRegistered';
  }
}

export class InvalidCredentials extends CustomError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401);
    this.name = 'InvalidCredentials';
  }
}

export class UserNotFound extends Error {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFound';
  }
}

export class UserServiceError extends Error {
  constructor(message = 'An error occurred while processing your request') {
    super(message);
    this.name = 'UserServiceError';
  }
}

export class UserCreateError extends Error {
  constructor(message = 'Failed to create user') {
    super(message);
    this.name = 'UserCreateError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message = 'Invalid input data') {
    super(message);
    this.name = 'ValidationError';
  }
}
