import Topics from "../../models/Topic";
import { TopicType } from "../../types/schemas/Topic";

class TopicsDTO_Error extends Error {}

export default class TopicsDTO {
  public static async create(name: string): Promise<TopicType | Error> {
    try {
      const topicExists = await Topics.findOne({ name }).lean();

      if (topicExists) throw new TopicsDTO_Error("Topic already exists");

      const topic = await Topics.create({
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
      await Topics.findByIdAndUpdate(topicId, {
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
      const topic = await Topics.findById(topicId);

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
      const topic = await Topics.findById(topicId);

      if (!topic) throw new TopicsDTO_Error("Topic does not exist");

      await topic.updateOne({ $pull: { publishers: publisherId } });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async delete(topicId: string) {
    try {
      const topic = await Topics.findById(topicId).lean();

      if (!topic) throw new TopicsDTO_Error("Topic does not exist");
      if (topic.publishers.length > 0)
        throw new TopicsDTO_Error("Topic receiving data; remove devices first");

      await Topics.findByIdAndDelete(topicId);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
