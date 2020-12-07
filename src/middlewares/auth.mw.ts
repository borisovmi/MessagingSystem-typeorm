import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpException, throwHttpException } from "../models/error";
import { UserJwtPayload } from "../models/User";
import { jwtSecret } from "../utils/jwt.secret";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    const token = authHeader?.split(" ")[1] || "";
    
    let decodedUser: UserJwtPayload = jwt.verify(
      token,
      jwtSecret
    ) as UserJwtPayload;
    req.user = decodedUser;
  } catch (error) {
    throwHttpException(401, "Please login or signup.");
  }
  next();
};
