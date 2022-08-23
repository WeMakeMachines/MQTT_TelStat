import Publishers from "../../models/Publisher";

export default class PublishersDTO {
  public static async create({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }) {
    try {
      const publisher = await Publishers.create({
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
      await Publishers.findByIdAndUpdate(publisherId, {
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
        await Publishers.findByIdAndUpdate(publisherId, {
          $unset: { topic: "" },
        });

        return Promise.resolve();
      }

      await Publishers.findByIdAndUpdate(publisherId, {
        topic: topicId,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async delete(publisherId: string) {
    try {
      await Publishers.findByIdAndDelete(publisherId);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async deleteTelemetry(publisherId: string) {
    try {
      await Publishers.findByIdAndUpdate(publisherId, {
        $unset: { lastPublishDate: "", telemetry: "" },
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async publishTelemetry(publisherId: string, telemetry: any) {
    try {
      await Publishers.findByIdAndUpdate(publisherId, {
        $push: { telemetry },
        lastPublishDate: Date.now(),
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
