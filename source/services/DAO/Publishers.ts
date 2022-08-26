import Publisher from "../../models/Publisher";
import { PublisherType } from "../../types/schemas/Publisher";
import { UserType } from "../../types/schemas/User";
import { TopicType } from "../../types/schemas/Topic";

interface PublisherPopulated extends PublisherType {
  owner: UserType;
  topic: TopicType;
}

export default class PublishersDAO {
  public static async getById(
    publisherId: string
  ): Promise<PublisherPopulated> {
    return Publisher.findById(publisherId)
      .populate({ path: "owner", select: "-hash" })
      .populate({ path: "topic" })
      .lean();
  }

  public static async getByNanoId(nanoId: string): Promise<PublisherPopulated> {
    return Publisher.findOne({ nanoId })
      .populate({ path: "owner", select: "-hash" })
      .populate({ path: "topic" })
      .lean();
  }

  public static async getAll(): Promise<PublisherPopulated[]> {
    return Publisher.find()
      .populate({ path: "owner", select: "-hash" })
      .populate({ path: "topic" })
      .select("-telemetry")
      .lean();
  }

  public static async getAllPublisherIdsForTopic(
    topicId: string
  ): Promise<PublisherPopulated[]> {
    return Publisher.find({ topic: topicId }).select(["_id", "name"]).lean();
  }
}
