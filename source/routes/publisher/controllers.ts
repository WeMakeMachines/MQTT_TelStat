import debug from "debug";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { RequestWithUser, TypedResponse, JsonResponse } from "../../types";
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

    await publisher.populate("owner", "-hash");

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher created", data: publisher });
  } catch (error) {
    log((error as Error).message);
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
    const publisher = await PublishersDAO.getById(publisherId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: publisher,
    });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function getAllPublishers(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const publishers = await PublishersDAO.getAll();

    res.status(StatusCodes.OK).json({
      success: true,
      data: publishers,
    });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function updatePublisherName(
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
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function updatePublisherTopic(req: Request, res: Response) {
  try {
    const { publisherId } = req.params;
    const { topicId } = req.body;

    await PublishersDTO.changeTopic({
      publisherId,
      topicId,
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher updated" });
  } catch (error) {
    log((error as Error).message);
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

    const topic = await TopicsDAO.getTopicForPublisher(publisherId);

    if (topic) {
      await TopicsDTO.removePublisher({
        topicId: topic._id,
        publisherId,
      });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher deleted" });
  } catch (error) {
    log((error as Error).message);
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
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}
