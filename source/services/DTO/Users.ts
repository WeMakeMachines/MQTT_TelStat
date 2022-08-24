import bcrypt from "bcrypt";

import User from "../../models/User";

export default class UsersDTO {
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
