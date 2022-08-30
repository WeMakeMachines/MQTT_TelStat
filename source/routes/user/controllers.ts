import debug from "debug";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { UserNameUnavailableError } from "../../Errors/User";
import { RequestWithUser, TypedResponse, JsonResponse } from "../../types";
import UserRepository from "../../services/Repositories/User";

const log: debug.IDebugger = debug(config.namespace + ":controllers:user");

export async function createUser(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { userName, firstName, lastName, password } = req.body;

    const isUserNameAvailable = await UserRepository.checkUserNameIsAvailable(
      userName
    );

    if (!isUserNameAvailable)
      throw new UserNameUnavailableError("Username not available");

    await UserRepository.createUser({
      userName,
      firstName,
      lastName,
      password,
    });

    res.status(StatusCodes.OK).json({ success: true, message: "User created" });
  } catch (error) {
    if (error instanceof UserNameUnavailableError) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: error.message });
    }
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function getUser(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    const user = req.user!;

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function updateUser(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { userName: newUserName, firstName, lastName, password } = req.body;

    const user = req.user!;

    await UserRepository.updateUser({
      userName: user.userName,
      newUserName,
      firstName,
      lastName,
      password,
    });

    res.status(StatusCodes.OK).json({ success: true, message: "User updated" });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}
