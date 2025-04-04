export class CustomError extends Error {
  statusCode: number; // TODO: dont user number for status code, import lib with status codes
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode; // here you take the statusType and get the number/type from the library
    Error.captureStackTrace(this, this.constructor);
  }
}
