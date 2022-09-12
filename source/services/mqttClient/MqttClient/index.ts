import mqtt, { Client } from "mqtt";
import { fromEvent, Observable } from "rxjs";

import mqttEvents from "./mqttEvents";
import log from "../../../helpers/debug";

class MqttError extends Error {}

export default class MqttClient {
  public readonly namespace: string = "mqtt_client";
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
    log(this.namespace, "Connecting to MQTT broker...");

    this.client = mqtt.connect(host, {
      username,
      password,
      port,
    });
    this.connection$ = fromEvent(this.client, "connect");
    this.message$ = fromEvent(this.client, "message");

    mqttEvents(this.namespace, this.client);
  }

  subscribe(topic: string): void {
    if (!this.client) {
      throw new MqttError("Mqtt client not initialised");
    }

    this.client.subscribe(topic, (error: Error) => {
      if (error) {
        throw new MqttError(error.message);
      }

      log(this.namespace, "Subscribed to topic " + topic);
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

      log(this.namespace, "Unsubscribed to topic " + topic);
    });
  }
}
