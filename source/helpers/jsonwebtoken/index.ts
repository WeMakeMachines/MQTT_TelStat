import jwt from "jsonwebtoken";
import { UserType } from "../../types/schemas/User";

import config from "../../config";
import log from "../debug";
import { JwtPayload } from "../../types/jwt";

export default class Jwt {
  public static async sign(user: UserType): Promise<string> {
    const expiresIn = "1d";
    const payload: JwtPayload = {
      sub: user._id,
      iat: Math.floor(Date.now() / 1000) - 30,
    };

    try {
      const signedToken = jwt.sign(payload, config.privateKey, {
        expiresIn,
        algorithm: "RS256",
      });

      return Promise.resolve(signedToken);
    } catch (error) {
      log("jsonwebtoken", (error as Error).message);
      return Promise.reject();
    }
  }

  public static async verify(token: any): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, config.publicKey, {
        algorithms: ["RS256"],
      }) as JwtPayload;

      return Promise.resolve(payload);
    } catch (_) {
      return Promise.reject();
    }
  }
}
