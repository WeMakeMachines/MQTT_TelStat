import debug from "debug";
import { Packet } from "mqtt";
import { concat } from "rxjs";

import config from "../../../config";
import MongoDb from "../../MongoDb";
import mqttClient from "../../mqttClient";
import TopicsDAO from "../../DAO/Topics";
import PublishersDTO from "../../DTO/Publishers";
import PublishersDAO from "../../DAO/Publishers";

export const log: debug.IDebugger = debug(
  config.namespace + ":mqtt_subscriber"
);

type Payload = {
  nanoId: string;
  data: object;
};

class MqttSubscriberError extends Error {}

export default class MqttSubscriber {
  public initialise() {
    this.awaitServices().then(() => {
      this.subscribeToTopics();
      this.subscribeToMessages();
    });
  }

  private async awaitServices(): Promise<void> {
    return new Promise((resolve) => {
      const observables = concat([mqttClient.connection$, MongoDb.connection$]);

      observables.subscribe({
        complete: () => resolve(),
      });
    });
  }

  private subscribeToTopics() {
    TopicsDAO.getAll().then((topics) => {
      topics.forEach((topic) => mqttClient.subscribe(topic.name));
    });
  }

  private subscribeToMessages() {
    mqttClient.message$.subscribe((message: [string, Buffer, Packet]) => {
      const [topic, payloadAsBuffer] = message;
      const payload = JSON.parse(payloadAsBuffer.toString());

      this.publishMessage(topic, payload).catch((error) => log(error));
    });
  }

  private async publishMessage(topic: string, payload: Payload) {
    try {
      const publisher = await PublishersDAO.getByNanoId(payload.nanoId);

      if (topic !== publisher.topic.name)
        throw new MqttSubscriberError("Publisher topic mismatch");

      await PublishersDTO.publishTelemetry(publisher._id, payload.data);
    } catch (error) {
      log((error as Error).message);

      return Promise.reject(
        "Unable to publish telemetry: " + (error as Error).message
      );
    }
  }
}
