import Topic from "../../models/Topic";
import { TopicType } from "../../types/schemas/Topic";

class TopicsDTO_Error extends Error {}

export default class TopicsDTO {
  public static async create(name: string): Promise<TopicType | Error> {
    try {
      const topicExists = await Topic.findOne({ name }).lean();

      if (topicExists) throw new TopicsDTO_Error("Topic already exists");

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

      if (!topic) throw new TopicsDTO_Error("Topic does not exist");

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

      if (!topic) throw new TopicsDTO_Error("Topic does not exist");

      await topic.updateOne({ $pull: { publishers: publisherId } });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async delete(topicId: string) {
    try {
      const topic = await Topic.findById(topicId).lean();

      if (!topic) throw new TopicsDTO_Error("Topic does not exist");

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
