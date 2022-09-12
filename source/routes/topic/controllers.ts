import { Request } from "express";
import { StatusCodes } from "http-status-codes";

import log from "../../helpers/debug";
import PublisherRepository from "../../services/Repositories/Publisher";
import TopicRepository from "../../services/Repositories/Topic";
import { TypedResponse, ResponseAsJson } from "../../types/express";

const namespace = "controllers:topics";

class TopicControllerError extends Error {}

export async function createTopic(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { name } = req.body;
    const newTopic = await TopicRepository.create(name);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic created", data: newTopic });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function getTopicById(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { topicId } = req.params;
    const topic = await TopicRepository.getById(topicId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function getAllTopics(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const topics = await TopicRepository.getAll();

    res.status(StatusCodes.OK).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function updateTopicName(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { topicId } = req.params;
    const { name } = req.body;

    await TopicRepository.rename({ topicId, name });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic renamed" });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function deleteTopic(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { topicId } = req.params;

    const publishers = await PublisherRepository.getAllPublisherIdsForTopic(
      topicId
    );

    if (publishers.length) {
      throw new TopicControllerError("Unable to delete topic while in use");
    }

    await TopicRepository.delete(topicId);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Topic deleted" });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}
