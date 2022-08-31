import dotenv, { DotenvParseOutput } from "dotenv";
import path from "path";

enum TelstatEnv {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}

class EnvironmentVariablesError extends Error {}

class EnvironmentVariables {
  public readonly dotenvParseOutput: DotenvParseOutput | undefined;

  constructor(environment: string = "development") {
    switch (environment) {
      case TelstatEnv.PRODUCTION:
        this.dotenvParseOutput = dotenv.config({
          path: path.resolve(".env"),
        }).parsed;

        if (!this.dotenvParseOutput)
          throw new EnvironmentVariablesError(
            "Unable to load production environment variables from .env"
          );

        break;
      case TelstatEnv.TEST:
        this.dotenvParseOutput = dotenv.config({
          path: path.resolve(".env.test"),
        }).parsed;

        if (!this.dotenvParseOutput)
          throw new EnvironmentVariablesError(
            "Unable to load test environment variables from .env.test"
          );

        break;
      default:
      case TelstatEnv.DEVELOPMENT:
        this.dotenvParseOutput = dotenv.config({
          path: path.resolve(".env.development"),
        }).parsed;

        if (!this.dotenvParseOutput)
          throw new EnvironmentVariablesError(
            "Unable to load development environment variables from .env.development"
          );

        break;
    }
  }
}

export default new EnvironmentVariables(process.env.TELSTAT_ENV);
