import mqtt from "mqtt";

import mqttConfig from "../../../config/mqtt";
import { log } from "./";

export default function mqttEvents(client: mqtt.Client) {
  client.on("connect", () =>
    log(`Connected to MQTT Broker on ${mqttConfig.mqttBrokerHost}`)
  );

  client.on("error", (error) => log(error.message));
}
