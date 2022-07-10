import Publishers from "../../models/Publisher";
import { PublisherType } from "../../types/schemas/Publisher";

export default class PublishersDAO {
  public static async getById(
    publisherId: string
  ): Promise<PublisherType | null> {
    return Publishers.findById(publisherId)
      .select(["name", "lastPublishDate", "telemetry"])
      .lean();
  }

  public static async getOwner(
    publisherId: string
  ): Promise<Pick<PublisherType, "owner"> | null> {
    return Publishers.findById(publisherId).lean().select("owner");
  }

  public static async getList() {
    return Publishers.find()
      .lean()
      .select("-telemetry")
      .populate("owner", ["userName"]);
  }
}
