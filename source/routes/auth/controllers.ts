import bcrypt from "bcrypt";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { UserAuthenticationError } from "../../Errors/User";
import Jwt from "../../helpers/jsonwebtoken";
import log from "../../helpers/debug";
import UserRepository from "../../services/Repositories/User";
import {
  RequestWithUser,
  TypedResponse,
  ResponseAsJson,
} from "../../types/express";

const namespace = "controllers:user";

export async function loginUser(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { userName, password } = req.body;
    const user = await UserRepository.getByUsername(userName);

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

    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function logoutUser(
  req: RequestWithUser,
  res: TypedResponse<ResponseAsJson>
) {
  res
    .clearCookie(config.jwtCookieName, {
      httpOnly: true,
      secure: true,
    })
    .json({ success: true });
}
