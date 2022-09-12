import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../config";
import { UserAuthorisationError } from "../Errors/User";
import Jwt from "../helpers/jsonwebtoken";
import UserRepository from "../services/Repositories/User";
import { RequestWithUser } from "../types/express";

export async function authoriseUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies[config.jwtCookieName];
    const payload = await Jwt.verify(token);
    const user = await UserRepository.getById(payload.sub);

    if (!user) throw new UserAuthorisationError("Invalid token data");

    req.user = user;

    next();
  } catch (error) {
    // https://httpwg.org/specs/rfc7235.html#RFC7231
    res.status(StatusCodes.FORBIDDEN).send({
      success: false,
      message: "Unauthorised request",
    });
  }
}
