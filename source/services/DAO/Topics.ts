import Topics from "../../models/Topic";

export default class TopicsDAO {
  public static async getById(id: string) {
    return Topics.findById(id).lean().populate("publishers", ["name"]);
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

    return Promise.reject("Topic name and publisher ID mismatch");
  }

  public static async getAll() {
    return Topics.find().lean();
  }
}
