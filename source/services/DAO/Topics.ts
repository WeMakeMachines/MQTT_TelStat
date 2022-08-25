import mongoose, { FilterQuery } from "mongoose";

import Topic from "../../models/Topic";
import { TopicType } from "../../types/schemas/Topic";

interface TopicAggregate extends TopicType {
  totalPublishers: number;
}

const TopicAggregate = {
  addPublisherCount: [
    {
      $lookup: {
        from: "publishers",
        localField: "_id",
        foreignField: "topic",
        as: "publishers",
      },
    },
    {
      $addFields: {
        totalPublishers: { $size: "$publishers" },
      },
    },
    {
      $unset: "publishers",
    },
  ],
  isNotDeleting: [
    {
      $match: { _deleting: { $exists: false } },
    },
  ],
};

class TopicDAO_Error extends Error {}

export default class TopicsDAO {
  public static async getById(
    topicId: string
  ): Promise<FilterQuery<TopicAggregate> | null> {
    const topics = await Topic.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(topicId) },
      },
      ...TopicAggregate.isNotDeleting,
      ...TopicAggregate.addPublisherCount,
    ]);

    if (!topics) return Promise.resolve(null);

    return Promise.resolve(topics[0]);
  }

  public static async getTopicForPublisher(
    publisherId: string
  ): Promise<TopicType | null> {
    return Topic.findOne({
      publishers: publisherId,
      _deleting: { $exists: false },
    })
      .select("_id")
      .lean();
  }

  public static async checkPublisherExistsOnTopic(
    topicName: string,
    publisherId: string
  ) {
    const topic = await Topic.findOne({
      name: topicName,
      publishers: publisherId,
    });

    if (topic) {
      return Promise.resolve();
    }

    return Promise.reject(
      new TopicDAO_Error("Topic name and publisher ID mismatch")
    );
  }

  public static async getAll(): Promise<FilterQuery<TopicAggregate[]>> {
    return Topic.aggregate([
      ...TopicAggregate.isNotDeleting,
      ...TopicAggregate.addPublisherCount,
    ]);
  }
}
