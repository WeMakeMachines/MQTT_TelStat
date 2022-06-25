import debug from "debug";
import mqtt, { Client } from "mqtt";

import config from "../../config";
import mqttEvents from "./mqttEvents";

const log: debug.IDebugger = debug(config.namespace + ":mqtt");

class MqttError extends Error {}

class MqttClient {
  private client: Client | null = null;

  connect({
    host,
    username,
    password,
    port,
  }: {
    host: string;
    username: string;
    password: string;
    port: number;
  }) {
    this.client = mqtt.connect(host, {
      username,
      password,
      port,
    });

    log("Connecting to MQTT broker...");
    mqttEvents(this.client);
  }

  subscribe(topic: string): void {
    if (!this.client) {
      throw new MqttError("Mqtt client not initialised");
    }

    this.client.subscribe(topic, (error: Error) => {
      if (error) {
        throw new MqttError(error.message);
      }
    });
  }
}

export default new MqttClient();
