import { DotenvParseOutput } from "dotenv";
import fs from "fs";

import environment from "./environment";
import log from "../helpers/debug";

interface EnvironmentVariables extends DotenvParseOutput {
  TELSTAT_PORT: string;
  PRIVATE_KEY_FILENAME: string;
  PUBLIC_KEY_FILENAME: string;
}

class Config {
  public readonly jwtCookieName = "token";
  public readonly port: number;
  public readonly privateKey: string;
  public readonly publicKey: string;

  constructor(props: EnvironmentVariables) {
    this.port = Number(props.TELSTAT_PORT);
    this.privateKey = this.readKeyFile(props.PRIVATE_KEY_FILENAME);
    this.publicKey = this.readKeyFile(props.PUBLIC_KEY_FILENAME);
  }

  private readKeyFile(filename: string) {
    log("config", `reading ${filename}`);

    // Only use asynchronous file read on application load
    return fs.readFileSync(filename, "utf8");
  }
}

const config = new Config(
  environment.dotenvParseOutput as EnvironmentVariables
);

export default config;
