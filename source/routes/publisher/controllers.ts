import debug from "debug";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { RequestWithUser, TypedResponse, JsonResponse } from "../../types";
import { PublisherType } from "../../types/schemas/Publisher";
import { UserType } from "../../types/schemas/User";
import PublishersDAO from "../../services/DAO/Publishers";
import PublishersDTO from "../../services/DTO/Publishers";
import TopicsDAO from "../../services/DAO/Topics";
import TopicsDTO from "../../services/DTO/Topics";

const log: debug.IDebugger = debug(
  config.namespace + ":controllers:publishers"
);

export async function createPublisher(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { name } = req.body;

    // TODO Remove casting here
    const user = <UserType>req.user;

    const publisher = await PublishersDTO.create({
      userId: user._id,
      name,
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher created", data: publisher });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function getPublisherById(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { publisherId } = req.params;

    // TODO Remove casting here
    const publisher = <PublisherType>await PublishersDAO.getById(publisherId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: publisher,
    });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function getPublisherList(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const publishers = await PublishersDAO.getListProtected();

    res.status(StatusCodes.OK).json({
      success: true,
      data: publishers,
    });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function renamePublisher(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { publisherId } = req.params;
    const { name } = req.body;

    await PublishersDTO.rename({
      publisherId,
      name,
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher renamed" });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function deletePublisher(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { publisherId } = req.params;

    await PublishersDTO.delete(publisherId);

    const topics = await TopicsDAO.getAllTopicsForPublisher(publisherId);

    topics.forEach((topic) => {
      TopicsDTO.removePublisher({
        topicId: topic._id,
        publisherId,
      });
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher deleted" });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function deletePublisherTelemetry(
  req: RequestWithUser,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { publisherId } = req.params;

    await PublishersDTO.deleteTelemetry(publisherId);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Telemetry deleted" });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}
