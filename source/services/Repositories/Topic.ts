import mongoose, { FilterQuery } from "mongoose";

import Topic from "../../models/Topic";
import { TopicType } from "../../types/schemas/Topic";
import { TopicNotFoundError, TopicUnavailableError } from "../../Errors/Topic";

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

export default class TopicRepository {
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

  public static async getAll(): Promise<FilterQuery<TopicAggregate[]>> {
    return Topic.aggregate([
      ...TopicAggregate.isNotDeleting,
      ...TopicAggregate.addPublisherCount,
    ]);
  }

  public static async create(name: string): Promise<TopicType> {
    try {
      const topicExists = await Topic.findOne({ name }).lean();

      if (topicExists) throw new TopicUnavailableError("Topic already exists");

      const topic = await Topic.create({
        name,
      });

      return Promise.resolve(topic);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async rename({
    topicId,
    name,
  }: {
    topicId: string;
    name: string;
  }) {
    try {
      await Topic.findByIdAndUpdate(topicId, {
        name,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async addPublisher({
    topicId,
    publisherId,
  }: {
    topicId: string;
    publisherId: string;
  }) {
    try {
      const topic = await Topic.findById(topicId);

      if (!topic) throw new TopicNotFoundError("Topic does not exist");

      await topic.updateOne({ $push: { publishers: publisherId } });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async removePublisher({
    topicId,
    publisherId,
  }: {
    topicId: string;
    publisherId: string;
  }) {
    try {
      const topic = await Topic.findById(topicId);

      if (!topic) throw new TopicNotFoundError("Topic does not exist");

      await topic.updateOne({ $pull: { publishers: publisherId } });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async delete(topicId: string) {
    try {
      const topic = await Topic.findById(topicId).lean();

      if (!topic) throw new TopicNotFoundError("Topic does not exist");

      const updatedTopic = await Topic.findByIdAndUpdate(topicId, {
        _deleting: true,
      });

      if (updatedTopic) {
        await updatedTopic.deleteOne();
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
