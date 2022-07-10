import debug from "debug";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { RequestWithUser, TypedResponse, JsonResponse } from "../../types";
import { UserType } from "../../types/schemas/User";
import UsersDAO from "../../services/DAO/Users";
import UsersDTO from "../../services/DTO/Users";

const log: debug.IDebugger = debug(config.namespace + ":controllers:user");

class UserControllerError extends Error {}

export async function createUser(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { userName, firstName, lastName, password } = req.body;

    const userNameTaken = await UsersDAO.getUserByUsername(userName);

    if (userNameTaken) throw new UserControllerError("Username already taken");

    await UsersDTO.createUser({
      userName,
      firstName,
      lastName,
      password,
    });

    res.status(StatusCodes.OK).json({ success: true, message: "User created" });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: (error as Error).message });
  }
}

export async function getUser(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    // TODO Remove casting here
    const user = <UserType>req.user;

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
      .json({ success: false, message: "An error occurred" });
  }
}

export async function updateUser(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { userName: newUserName, firstName, lastName, password } = req.body;

    // TODO Remove casting here
    const user = <UserType>req.user;

    await UsersDTO.updateUser({
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
      .json({ success: false, message: "An error occurred" });
  }
}
