import { JwtPayload as _JwtPayload } from "jsonwebtoken";

export interface JwtPayload extends _JwtPayload {
  sub: string;
  iat: number;
}
