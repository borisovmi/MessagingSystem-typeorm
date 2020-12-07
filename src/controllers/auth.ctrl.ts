import { compareSync, hash } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { handleError, throwHttpException } from "../models/error";
import {
  AuthResponse,
  User,
  UserJwtPayload,
  UserLoginRequest,
  UserSignupRequest,
} from "../models/User";
import { jwtSecret } from "../utils/jwt.secret";

export const signupController = async (
  req: Request<{}, {}, UserSignupRequest>,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const userExists = await getRepository(User).findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return throwHttpException(422, "E-Mail address already exists!");
    }

    const hashedPassword = await hash(req.body.password, 12);
    const createdUser = await getRepository(User).save({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
    });
    const token = signUserToken({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    });
    res.status(201).json({ token });
  } catch (error) {
    handleError(error, "User signup failed.", next);
  }
};

export const loginController = async (
  req: Request<{}, {}, UserLoginRequest>,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  const password = req.body.password;
  try {
    const user = await getRepository(User).findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return throwHttpException(
        422,
        `User with email ${req.body.email} doesn't exist.`
      );
    }

    const isCorrectPassword = compareSync(password, user.password);
    if (!isCorrectPassword) {
      return throwHttpException(422, "Wrong password");
    }

    const token = signUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.status(200).json({ token });
  } catch (error) {
    handleError(error, "Login failed.", next);
  }
};

const signUserToken = (userJwtPayload: UserJwtPayload): string => {
  return jwt.sign(
    {
      id: userJwtPayload.id,
      email: userJwtPayload.email,
      name: userJwtPayload.name,
    },
    jwtSecret,
    { expiresIn: "24h" }
  );
};
