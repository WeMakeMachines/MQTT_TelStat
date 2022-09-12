import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import log from "../../helpers/debug";
import PublisherRepository from "../../services/Repositories/Publisher";
import TopicRepository from "../../services/Repositories/Topic";
import {
  RequestWithUser,
  TypedResponse,
  ResponseAsJson,
} from "../../types/express";

const namespace = "controllers:publishers";

class PublisherControllerError extends Error {}

export async function createPublisher(
  req: RequestWithUser,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { name } = req.body;
    const user = req.user!;
    const publisher = await PublisherRepository.create({
      userId: user._id,
      name,
    });

    await publisher.populate("owner", "-hash");

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher created", data: publisher });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function getPublisherById(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { publisherId } = req.params;
    const publisher = await PublisherRepository.getById(publisherId);

    if (!publisher) throw new PublisherControllerError("Publisher not found");

    res.status(StatusCodes.OK).json({
      success: true,
      data: publisher,
    });
  } catch (error) {
    if (error instanceof PublisherControllerError) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: error.message });
    }

    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function getAllPublishers(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const publishers = await PublisherRepository.getAll();

    res.status(StatusCodes.OK).json({
      success: true,
      data: publishers,
    });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function updatePublisherName(
  req: Request,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { publisherId } = req.params;
    const { name } = req.body;

    await PublisherRepository.rename({
      publisherId,
      name,
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher renamed" });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function updatePublisherTopic(req: Request, res: Response) {
  try {
    const { publisherId } = req.params;
    const { topicId } = req.body;

    await PublisherRepository.changeTopic({
      publisherId,
      topicId,
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher updated" });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function deletePublisher(
  req: RequestWithUser,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { publisherId } = req.params;

    await PublisherRepository.delete(publisherId);

    const topic = await TopicRepository.getTopicForPublisher(publisherId);

    if (topic) {
      await TopicRepository.removePublisher({
        topicId: topic._id,
        publisherId,
      });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Publisher deleted" });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}

export async function deletePublisherTelemetry(
  req: RequestWithUser,
  res: TypedResponse<ResponseAsJson>
) {
  try {
    const { publisherId } = req.params;

    await PublisherRepository.deleteTelemetry(publisherId);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Telemetry deleted" });
  } catch (error) {
    log(namespace, (error as Error).message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "An unspecified error occurred" });
  }
}
