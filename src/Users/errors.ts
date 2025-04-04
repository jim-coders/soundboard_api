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

export class UserNotFound extends CustomError {
  constructor(message: string = 'User not found') {
    super(message, 404);
    this.name = 'UserNotFound';
  }
}

export class UserServiceError extends CustomError {
  constructor(message: string = 'Something went wrong with the user service') {
    super(message, 500);
    this.name = 'UserServiceError';
  }
}
