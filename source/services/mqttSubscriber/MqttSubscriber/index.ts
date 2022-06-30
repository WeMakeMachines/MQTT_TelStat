import debug from "debug";
import { Packet } from "mqtt";
import { concat } from "rxjs";

import config from "../../../config";
import MongoDb from "../../MongoDb";
import mqttClient from "../../mqttClient";
import TopicsDAO from "../../DAO/Topics";
import PublishersDTO from "../../DTO/Publishers";

export const log: debug.IDebugger = debug(
  config.namespace + ":mqtt_subscriber"
);

type Payload = {
  id: string;
  data: object;
};

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

      this.publishMessage(topic, payload);
    });
  }

  private publishMessage(topic: string, payload: Payload) {
    Promise.all([
      TopicsDAO.checkPublisherExistsOnTopic(topic, payload.id),
      PublishersDTO.publishTelemetry(payload.id, payload.data),
    ]).catch((error) => {
      log("Unable to publish telemetry: " + error);
    });
  }
}
