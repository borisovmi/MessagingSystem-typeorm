import { NextFunction } from "express";
import { ValidationError } from "express-validator";

export class HttpException extends Error {
  constructor(
    readonly status: number,
    readonly message: string,
    readonly validationErrors: ValidationError[] = []
  ) {
    super(message);
    this.status = status;
    this.message = message.toString();
    this.validationErrors = validationErrors;
  }
}

export function throwHttpException(status: number, message: string) {
  throw new HttpException(status, message);
}

export function handleError(
  error: Error | HttpException,
  message: string,
  next: NextFunction
) {
  if (error instanceof HttpException) {
    return next(error);
  }
  next(new HttpException(500, error.message || message));
}
