import { NextFunction, Request, Response } from "express";
import { HttpException, throwHttpException } from "../models/error";

export const errorController = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status;
  const message = error.message;
  const validationErrors = error.validationErrors;
  res
    .status(status)
    .json({ status, message, validationErrors: validationErrors });
};

export const error404Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throwHttpException(404, "Not Found.");
};
