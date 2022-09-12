import mqtt from "mqtt";

import log from "../../../helpers/debug";
import mqttConfig from "../../../config/mqtt";

export default function mqttEvents(namespace: string, client: mqtt.Client) {
  client.on("connect", () =>
    log(namespace, `Connected to MQTT Broker on ${mqttConfig.mqttBrokerHost}`)
  );

  client.on("error", (error) => log(namespace, error.message));
}
