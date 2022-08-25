import debug from "debug";
import mqtt, { Client } from "mqtt";
import { fromEvent, Observable } from "rxjs";

import config from "../../../config";
import mqttEvents from "./mqttEvents";

export const log: debug.IDebugger = debug(config.namespace + ":mqtt_client");

class MqttError extends Error {}

export default class MqttClient {
  public readonly client: Client;
  public readonly connection$: Observable<any>;
  public readonly message$: Observable<any>;

  constructor({
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
    log("Connecting to MQTT broker...");

    this.client = mqtt.connect(host, {
      username,
      password,
      port,
    });
    this.connection$ = fromEvent(this.client, "connect");
    this.message$ = fromEvent(this.client, "message");

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

      log("Subscribed to topic " + topic);
    });
  }

  unsubscribe(topic: string | []): void {
    if (!this.client) {
      throw new MqttError("Mqtt client not initialised");
    }

    this.client.unsubscribe(topic, (error: Error) => {
      if (error) {
        throw new MqttError(error.message);
      }

      log("Unsubscribed to topic " + topic);
    });
  }
}
