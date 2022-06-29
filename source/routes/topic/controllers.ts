import debug from "debug";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { TypedResponse, JsonResponse } from "../../types";
import TopicsDAO from "../../services/DAO/Topics";
import TopicsDTO from "../../services/DTO/Topics";

const log: debug.IDebugger = debug(config.namespace + ":controllers:topics");

export async function createTopic(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { name } = req.body;

    await TopicsDTO.create(name);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic created" });
  } catch (error) {
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function getTopic(req: Request, res: TypedResponse<JsonResponse>) {
  try {
    const { topicId } = req.body;
    const topic = await TopicsDAO.getById(topicId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    log(error);
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
    log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function renameTopic(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { name, topicId } = req.body;

    await TopicsDTO.rename({ topicId, name });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic renamed" });
  } catch (error) {
    log(error);
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
    const { topicId } = req.body;

    await TopicsDTO.delete(topicId);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic deleted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function addPublisherToTopic(
  req: Request,
  res: TypedResponse<JsonResponse>
) {
  try {
    const { publisherId, topicId } = req.body;

    await TopicsDTO.addPublisher({ topicId, publisherId });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher added to topic" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An error occurred" });
  }
}
