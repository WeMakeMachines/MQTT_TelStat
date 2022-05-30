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
      await Publishers.create({
        owner: userId,
        name,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject((error as Error).message);
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
      return Promise.reject((error as Error).message);
    }
  }

  public static async delete(publisherId: string) {
    try {
      await Publishers.findByIdAndDelete(publisherId);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject((error as Error).message);
    }
  }
}