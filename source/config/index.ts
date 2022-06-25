import dotenv, { DotenvParseOutput } from "dotenv";
import fs from "fs";
import debug from "debug";

interface EnvironmentVariables extends DotenvParseOutput {
  MONGO_DB_HOST: string;
  MONGO_DB_NAME: string;
  MONGO_DB_USER: string;
  MONGO_DB_PASS: string;
  TELSTAT_PORT: string;
  PRIVATE_KEY_FILENAME: string;
  PUBLIC_KEY_FILENAME: string;
  MQTT_BROKER_HOST: string;
  MQTT_BROKER_PORT: string;
  MQTT_BROKER_USER: string;
  MQTT_BROKER_PASS: string;
}

const namespace = "app.telstat";

const log: debug.IDebugger = debug(`${namespace}:config`);

class ConfigError extends Error {}

class Config {
  public readonly jwtCookieName = "token";
  public readonly namespace: string;
  public readonly dbHost: string;
  public readonly dbName: string;
  public readonly dbUser: string;
  public readonly dbPass: string;
  public readonly port: number;
  public readonly privateKey: string;
  public readonly publicKey: string;
  public readonly mqttBrokerHost: string;
  public readonly mqttBrokerPort: number;
  public readonly mqttBrokerUser: string;
  public readonly mqttBrokerPass: string;

  constructor(props: EnvironmentVariables, namespace: string) {
    this.namespace = namespace;
    this.dbHost = props.MONGO_DB_HOST;
    this.dbName = props.MONGO_DB_NAME;
    this.dbUser = props.MONGO_DB_USER;
    this.dbPass = props.MONGO_DB_PASS;
    this.port = Number(props.TELSTAT_PORT);
    this.privateKey = this.readKeyFile(props.PRIVATE_KEY_FILENAME);
    this.publicKey = this.readKeyFile(props.PUBLIC_KEY_FILENAME);
    this.mqttBrokerHost = props.MQTT_BROKER_HOST;
    this.mqttBrokerPort = Number(props.MQTT_BROKER_PORT) || 1883;
    this.mqttBrokerUser = props.MQTT_BROKER_USER;
    this.mqttBrokerPass = props.MQTT_BROKER_PASS;
  }

  private readKeyFile(filename: string) {
    log(`reading ${filename}`);

    // Only use asynchronous file read on application load
    return fs.readFileSync(filename, "utf8");
  }
}

const { parsed } = dotenv.config();

const config = new Config(parsed as EnvironmentVariables, namespace);

export default config;
