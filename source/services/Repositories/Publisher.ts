import Publisher from "../../models/Publisher";
import { PublisherType } from "../../types/schemas/Publisher";
import { TopicType } from "../../types/schemas/Topic";
import { UserType } from "../../types/schemas/User";

interface PublisherPopulated extends PublisherType {
  owner: UserType;
  topic: TopicType;
}

export default class PublisherRepository {
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

  public static async create({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }) {
    try {
      const publisher = await Publisher.create({
        owner: userId,
        name,
      });

      return Promise.resolve(publisher);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async rename({
    publisherId,
    name,
  }: {
    publisherId: string;
    name: string;
  }) {
    try {
      await Publisher.findByIdAndUpdate(publisherId, {
        name,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async changeTopic({
    publisherId,
    topicId,
  }: {
    publisherId: string;
    topicId: string | null;
  }) {
    try {
      if (topicId === null) {
        await Publisher.findByIdAndUpdate(publisherId, {
          $unset: { topic: "" },
        });

        return Promise.resolve();
      }

      await Publisher.findByIdAndUpdate(publisherId, {
        topic: topicId,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async delete(publisherId: string) {
    try {
      await Publisher.findByIdAndDelete(publisherId);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async deleteTelemetry(publisherId: string) {
    try {
      await Publisher.findByIdAndUpdate(publisherId, {
        $unset: { lastPublishDate: "", telemetry: "" },
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async publishTelemetry(publisherId: string, telemetry: any) {
    try {
      await Publisher.findByIdAndUpdate(publisherId, {
        $push: { telemetry },
        lastPublishDate: Date.now(),
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
