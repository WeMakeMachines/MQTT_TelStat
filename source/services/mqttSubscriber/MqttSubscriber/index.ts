import { Packet } from "mqtt";
import { concat } from "rxjs";

import MongoDb from "../../MongoDb";
import mqttClient from "../../mqttClient";
import TopicRepository from "../../Repositories/Topic";
import PublisherRepository from "../../Repositories/Publisher";
import log from "../../../helpers/debug";
import { topicChange$ } from "../../../models/Topic";
import { DbOperationTypes } from "../../../types/db";

type Payload = {
  nanoId: string;
  data: object;
};

class MqttSubscriberError extends Error {}

export default class MqttSubscriber {
  public readonly namespace: string = "mqtt_subscriber";

  public initialise() {
    this.awaitServices().then(() => {
      this.subscribeToTopics();
      this.subscribeToMessageEvents();
      this.subscribeToTopicChangeEvents();
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

  private subscribeToTopic(topicName: string) {
    mqttClient.subscribe(topicName);
  }

  private subscribeToTopics() {
    TopicRepository.getAll().then((topics) => {
      topics.forEach((topic) => this.subscribeToTopic(topic.name));
    });
  }

  private unsubscribeFromTopic(topicName: string) {
    mqttClient.unsubscribe(topicName);
  }

  private subscribeToTopicChangeEvents() {
    topicChange$.subscribe((change) => {
      if (
        change.operationType === DbOperationTypes.UPDATE &&
        change.fullDocument!._deleting
      ) {
        this.unsubscribeFromTopic(change.fullDocument!.name);
      }

      if (change.operationType === DbOperationTypes.INSERT) {
        this.subscribeToTopic(change.fullDocument!.name);
      }
    });
  }

  private subscribeToMessageEvents() {
    mqttClient.message$.subscribe((message: [string, Buffer, Packet]) => {
      const [topic, payloadAsBuffer] = message;
      const payload = JSON.parse(payloadAsBuffer.toString());

      this.publishMessage(topic, payload).catch((error) =>
        log(this.namespace, error.message)
      );
    });
  }

  private async publishMessage(topic: string, payload: Payload) {
    try {
      const publisher = await PublisherRepository.getByNanoId(payload.nanoId);

      if (
        !publisher.topic ||
        (publisher.topic && publisher.topic.name !== topic)
      )
        throw new MqttSubscriberError("Publisher topic mismatch");

      await PublisherRepository.publishTelemetry(publisher._id, payload.data);
    } catch (error) {
      log(this.namespace, (error as Error).message);

      return Promise.reject(
        "Unable to publish telemetry: " + (error as Error).message
      );
    }
  }
}
