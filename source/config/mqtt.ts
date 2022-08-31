import { DotenvParseOutput } from "dotenv";

import environment from "./environment";

interface EnvironmentVariables extends DotenvParseOutput {
  MQTT_BROKER_HOST: string;
  MQTT_BROKER_PORT: string;
  MQTT_BROKER_USER: string;
  MQTT_BROKER_PASS: string;
}

class MqttConfig {
  public readonly mqttBrokerHost: string;
  public readonly mqttBrokerPort: number;
  public readonly mqttBrokerUser: string;
  public readonly mqttBrokerPass: string;

  constructor(props: EnvironmentVariables) {
    this.mqttBrokerHost = props.MQTT_BROKER_HOST;
    this.mqttBrokerPort = Number(props.MQTT_BROKER_PORT) || 1883;
    this.mqttBrokerUser = props.MQTT_BROKER_USER;
    this.mqttBrokerPass = props.MQTT_BROKER_PASS;
  }
}

const mqttConfig = new MqttConfig(
  environment.dotenvParseOutput as EnvironmentVariables
);

export default mqttConfig;
