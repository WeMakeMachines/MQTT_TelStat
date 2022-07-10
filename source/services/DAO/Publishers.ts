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

  public static async getByNanoId(
    nanoId: string
  ): Promise<PublisherType | null> {
    return Publishers.findOne({ nanoid: nanoId })
      .select(["name", "lastPublishDate", "telemetry"])
      .lean();
  }

  public static async getOwnerProtected(
    publisherId: string
  ): Promise<Pick<PublisherType, "owner"> | null> {
    return Publishers.findById(publisherId)
      .lean()
      .select("owner")
      .populate("owner", ["-hash"]);
  }

  public static async getListProtected() {
    return Publishers.find()
      .lean()
      .select("-telemetry")
      .populate("owner", ["-hash"]);
  }
}
