import debug from "debug";
import bcrypt from "bcrypt";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { UserAuthenticationError } from "../../Errors/User";
import { RequestWithUser, TypedResponse, JsonResponse } from "../../types";
import Jwt from "../../helpers/jsonwebtoken";
import UsersDAO from "../../services/DAO/Users";

const log: debug.IDebugger = debug(config.namespace + ":controllers:user");

export async function loginUser(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { userName, password } = req.body;
    const user = await UsersDAO.getByUsername(userName);

    if (!user)
      throw new UserAuthenticationError("Username or password incorrect");

    const checkPassword = await bcrypt.compare(password, user.hash);

    if (!checkPassword)
      throw new UserAuthenticationError("Username or password incorrect");

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
          _id: user._id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
  } catch (error) {
    if (error instanceof UserAuthenticationError) {
      // https://httpwg.org/specs/rfc7235.html#RFC7231
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: error.message });
    }

    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
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
