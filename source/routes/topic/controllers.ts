import debug from "debug";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { TypedResponse, JsonResponse } from "../../types";
import TopicsDAO from "../../services/DAO/Topics";
import TopicsDTO from "../../services/DTO/Topics";
import PublishersDAO from "../../services/DAO/Publishers";

const log: debug.IDebugger = debug(config.namespace + ":controllers:topics");

class TopicControllerError extends Error {}

export async function createTopic(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { name } = req.body;
    const newTopic = await TopicsDTO.create(name);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic created", data: newTopic });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function getTopic(req: Request, res: TypedResponse<JsonResponse>) {
  try {
    const { topicId } = req.params;
    const topic = await TopicsDAO.getById(topicId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function getAllTopics(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const topics = await TopicsDAO.getAll();

    res.status(StatusCodes.OK).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function updateTopicName(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { topicId } = req.params;
    const { name } = req.body;

    await TopicsDTO.rename({ topicId, name });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic renamed" });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function deleteTopic(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { topicId } = req.params;

    const publishers = await PublishersDAO.getAllPublisherIdsForTopic(topicId);

    if (publishers.length) {
      throw new TopicControllerError("Unable to delete topic while in use");
    }

    await TopicsDTO.delete(topicId);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic deleted" });
  } catch (error) {
    log((error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}
