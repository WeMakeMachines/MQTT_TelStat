import dotenv, { DotenvParseOutput } from "dotenv";

interface EnvironmentVariables extends DotenvParseOutput {
  MONGO_DB_HOST: string;
  MONGO_DB_NAME: string;
  MONGO_DB_USER: string;
  MONGO_DB_PASS: string;
}

class DbConfigError extends Error {}

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

const { parsed } = dotenv.config();
const dbConfig = new DbConfig(parsed as EnvironmentVariables);

export default dbConfig;
