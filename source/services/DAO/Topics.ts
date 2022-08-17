import mongoose, { FilterQuery } from "mongoose";

import Topics from "../../models/Topic";
import { TopicType } from "../../types/schemas/Topic";

interface TopicAggregate extends TopicType {
  totalPublishers: number;
}

const TopicsAggregate = {
  addPublisherCount: [
    {
      $addFields: {
        totalPublishers: { $size: "$publishers" },
      },
    },
  ],
};

class TopicsDAO_Error extends Error {}

export default class TopicsDAO {
  public static async getById(
    topicId: string
  ): Promise<FilterQuery<TopicAggregate> | null> {
    const topics = await Topics.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(topicId) },
      },
      ...TopicsAggregate.addPublisherCount,
    ]);

    if (!topics) return Promise.resolve(null);

    return Promise.resolve(topics[0]);
  }

  public static async getTopicForPublisher(
    publisherId: string
  ): Promise<TopicType | null> {
    return Topics.findOne({
      publishers: publisherId,
    })
      .select("_id")
      .lean();
  }

  public static async checkPublisherExistsOnTopic(
    topicName: string,
    publisherId: string
  ) {
    const topic = await Topics.findOne({
      name: topicName,
      publishers: publisherId,
    });

    if (topic) {
      return Promise.resolve();
    }

    return Promise.reject(
      new TopicsDAO_Error("Topic name and publisher ID mismatch")
    );
  }

  public static async getAll(): Promise<FilterQuery<TopicAggregate[]>> {
    return Topics.aggregate([...TopicsAggregate.addPublisherCount]);
  }
}
