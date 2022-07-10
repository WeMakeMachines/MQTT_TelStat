import { NextFunction, Response } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";

import { RequestWithUser } from "../../types";
import { UserType } from "../../types/schemas/User";
import PublishersDAO from "../../services/DAO/Publishers";

export const validatePublisherName = () => [body("name").isString()];

export const sanitisePublisherName = () => {
  const charsNumbers = "0123456789";
  const charsAz = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";

  return [
    body("name").optional().trim().whitelist(`${charsAz}${charsNumbers}`),
  ];
};

export const validatePublisherOwner = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { publisherId } = req.params;

    // TODO Remove casting here
    const user = <UserType>req.user;
    const publisher = await PublishersDAO.getOwnerProtected(publisherId);

    if (!publisher) throw new Error("Publisher not found");
    if (!user._id.equals(publisher.owner._id)) throw new Error("Id mismatch");

    next();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: (error as Error).message,
    });
  }
};
