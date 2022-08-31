import { DotenvParseOutput } from "dotenv";

import environment from "./environment";

interface EnvironmentVariables extends DotenvParseOutput {
  MONGO_DB_HOST: string;
  MONGO_DB_NAME: string;
  MONGO_DB_USER: string;
  MONGO_DB_PASS: string;
}

class DbConfig {
  public readonly dbHost: string;
  public readonly dbName: string;
  public readonly dbUser: string;
  public readonly dbPass: string;

  constructor(props: EnvironmentVariables) {
    this.dbHost = props.MONGO_DB_HOST;
    this.dbName = props.MONGO_DB_NAME;
    this.dbUser = props.MONGO_DB_USER;
    this.dbPass = props.MONGO_DB_PASS;
  }
}

const dbConfig = new DbConfig(
  environment.dotenvParseOutput as EnvironmentVariables
);

export default dbConfig;
