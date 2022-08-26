import User from "../../models/User";
import { UserType } from "../../types/schemas/User";

export default class UsersDAO {
  public static async getById(id: string): Promise<UserType> {
    return User.findById(id).lean();
  }

  public static async getByUsername(userName: string): Promise<UserType> {
    return User.findOne({ userName }).lean();
  }

  public static async checkUserNameIsAvailable(
    userName: string
  ): Promise<boolean> {
    const user = await User.findOne({ userName }).lean();

    return !user;
  }
}
