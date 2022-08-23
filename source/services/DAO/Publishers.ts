import mongoose, { FilterQuery } from "mongoose";

import Publishers from "../../models/Publisher";
import { PublisherType } from "../../types/schemas/Publisher";
import { UserType } from "../../types/schemas/User";

interface PublisherAggregate extends PublisherType {
  owner: UserType;
  topic: {
    _id: string | null;
    name: string | null;
  };
}

const PublishersAggregate = {
  lookUpOwnerProtected: [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $unset: "owner.hash",
    },
  ],
  lookUpTopic: [
    {
      $lookup: {
        from: "topics",
        localField: "_id",
        foreignField: "publishers",
        as: "topic",
      },
    },
    {
      $unwind: { path: "$topic", preserveNullAndEmptyArrays: true },
    },
    {
      $unset: "topic.publishers",
    },
    {
      $addFields: {
        topic: { $ifNull: ["$topic", { _id: null, name: null }] },
      },
    },
  ],
};

class PublishersDAO_Error extends Error {}

export default class PublishersDAO {
  public static async getByIdProtected(
    publisherId: string
  ): Promise<FilterQuery<PublisherAggregate> | null> {
    const publishers = await Publishers.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(publisherId) },
      },
      ...PublishersAggregate.lookUpOwnerProtected,
      ...PublishersAggregate.lookUpTopic,
    ]);

    if (!publishers) return Promise.resolve(null);

    return Promise.resolve(publishers[0]);
  }

  public static async getIdFromNanoId(nanoId: string): Promise<string> {
    const publisher = await Publishers.findOne({ nanoId })
      .select(["_id"])
      .lean();

    if (!publisher) {
      return Promise.reject(new PublishersDAO_Error("Publisher not found"));
    }

    return publisher._id;
  }

  // TODO run performance tests against regular find()
  public static async getListProtected(): Promise<
    FilterQuery<PublisherAggregate>[]
  > {
    return Publishers.aggregate([
      ...PublishersAggregate.lookUpOwnerProtected,
      ...PublishersAggregate.lookUpTopic,
      {
        $unset: "telemetry",
      },
    ]);
  }
}
