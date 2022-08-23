import Publishers from "../../models/Publisher";
import { PublisherType } from "../../types/schemas/Publisher";
import { UserType } from "../../types/schemas/User";
import { TopicType } from "../../types/schemas/Topic";

interface PublisherPopulated extends PublisherType {
  owner: UserType;
  topic: TopicType;
}

interface PublisherTopicPopulated extends PublisherType {
  topic: TopicType;
}

class PublishersDAO_Error extends Error {}

export default class PublishersDAO {
  public static async getById(
    publisherId: string
  ): Promise<PublisherPopulated | null> {
    return Publishers.findById(publisherId)
      .populate({ path: "owner", select: "-hash" })
      .populate({ path: "topic" })
      .lean();
  }

  public static async getByNanoId(
    nanoId: string
  ): Promise<PublisherTopicPopulated> {
    const publisher = await Publishers.findOne({ nanoId })
      .populate({ path: "owner", select: "-hash" })
      .lean();

    if (!publisher) {
      return Promise.reject(new PublishersDAO_Error("Publisher not found"));
    }

    return publisher._id;
  }

  public static async getAll(): Promise<PublisherPopulated[]> {
    return Publishers.find()
      .populate({ path: "owner", select: "-hash" })
      .populate({ path: "topic" })
      .select("-telemetry")
      .lean();
  }

  public static async getAllPublisherIdsForTopic(
    topicId: string
  ): Promise<PublisherPopulated[]> {
    return Publishers.find({ topic: topicId }).select(["_id", "name"]).lean();
  }
}
