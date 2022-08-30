import { Request, Response } from "express";
import { Send } from "express-serve-static-core";

import { UserType } from "./schemas/User";

export interface RequestWithUser extends Request {
  user?: UserType;
}

export interface ResponseAsJson {
  success: boolean;
  message?: string;
  data?: object | [] | null;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
