import debug from "debug";
import bcrypt from "bcrypt";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { RequestWithUser, TypedResponse, JsonResponse } from "../../types";
import Jwt from "../../helpers/jsonwebtoken";
import UsersDAO from "../../services/DAO/Users";

const log: debug.IDebugger = debug(config.namespace + ":controllers:user");

class AuthControllerError extends Error {}

export async function loginUser(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { userName, password } = req.body;

    const user = await UsersDAO.getUserByUsername(userName);
    if (!user) throw new AuthControllerError("User does not exist");

    const checkPassword = await bcrypt.compare(password, user.hash);
    if (!checkPassword) throw new AuthControllerError("Passwords do not match");

    const token = await Jwt.sign(user);

    res
      .status(StatusCodes.OK)
      .cookie(config.jwtCookieName, token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        data: {
          id: user._id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: (error as Error).message });
  }
}

export async function logoutUser(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  res
    .clearCookie(config.jwtCookieName, {
      httpOnly: true,
      secure: true,
    })
    .json({ success: true });
}
