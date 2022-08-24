import User from "../../models/User";
import { UserType } from "../../types/schemas/User";

export default class UsersDAO {
  public static async getUserByUsername(
    userName: string
  ): Promise<UserType | null> {
    return User.findOne({ userName }).lean();
  }

  public static async getUserById(id: string): Promise<UserType | null> {
    return User.findById(id).lean();
  }

  public static async getUserByIdProtected(
    id: string
  ): Promise<UserType | null> {
    return User.findById(id).select("-hash").lean();
  }
}
