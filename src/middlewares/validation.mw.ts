import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../models/error";

export const hasValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Unprocessable Entity", errors.array()));
  }
  next();
};
