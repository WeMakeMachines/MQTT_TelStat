import Users from "../../models/User";
import { UserType } from "../../types/schemas/User";

class UsersDAO_Error extends Error {}

export default class UsersDAO {
  public static async getUserByUsername(userName: string): Promise<UserType> {
    return Users.findOne({ userName }).lean();
  }

  public static async getUserById(id: string): Promise<UserType> {
    return Users.findById(id).lean();
  }

  public static async getUserByIdProtected(id: string): Promise<UserType> {
    return Users.findById(id).select("-hash").lean();
  }
}
