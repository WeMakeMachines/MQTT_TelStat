import { NextFunction, Response } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";

import { PublisherUnavailableError } from "../../Errors/Publisher";
import { UserAuthorisationError } from "../../Errors/User";
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
    const publisher = await PublishersDAO.getById(publisherId);

    if (!publisher) throw new PublisherUnavailableError("Publisher not found");
    if (!user._id.equals(publisher.owner._id))
      throw new UserAuthorisationError("User not authorised for this action");

    next();
  } catch (error) {
    if (error instanceof PublisherUnavailableError) {
      return res.status(StatusCodes.NOT_FOUND).send({
        success: false,
        message: error.message,
      });
    }
    if (error instanceof UserAuthorisationError) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        success: false,
        message: error.message,
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: "An unspecified error occurred",
    });
  }
};
