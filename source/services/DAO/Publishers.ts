import Publishers from "../../models/Publisher";
import { PublisherType } from "../../types/schemas/Publisher";
import { UserType } from "../../types/schemas/User";

interface PublisherWithOwner extends PublisherType {
  owner: UserType;
}

export default class PublishersDAO {
  public static async getById(
    publisherId: string
  ): Promise<PublisherType | null> {
    return Publishers.findById(publisherId).lean();
  }

  public static async getIdFromNanoId(nanoId: string): Promise<string> {
    const publisher = await Publishers.findOne({ nanoId })
      .select(["_id"])
      .lean();

    if (!publisher) {
      return Promise.reject(new Error("Publisher not found"));
    }

    return publisher._id;
  }

  public static async getOwnerProtected(
    publisherId: string
  ): Promise<PublisherWithOwner | null> {
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
