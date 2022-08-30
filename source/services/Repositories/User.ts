import bcrypt from "bcrypt";

import User from "../../models/User";
import { UserType } from "../../types/schemas/User";

export default class UserRepository {
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

  public static async createUser({
    userName,
    firstName,
    lastName,
    password,
  }: {
    userName: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  }) {
    try {
      let hash;

      if (password) {
        hash = await bcrypt.hash(password, 12);
      }

      await User.create({
        userName,
        firstName,
        lastName,
        hash,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async updateUser({
    userName,
    newUserName,
    firstName,
    lastName,
    password,
  }: {
    userName: string;
    newUserName?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  }) {
    try {
      let hash;

      if (password) {
        hash = await bcrypt.hash(password, 12);
      }

      await User.findOneAndUpdate(
        { userName },
        {
          userName: newUserName,
          firstName,
          lastName,
          hash,
        }
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
