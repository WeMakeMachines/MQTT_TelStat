import debug from "debug";
import mqtt from "mqtt";

import config from "../../config";

const log: debug.IDebugger = debug(config.namespace + ":mqtt");

export default function mqttEvents(client: mqtt.Client) {
  client.on("connect", () => {
    log(`Connected to MQTT Broker on ${config.mqttBrokerHost}`);
  });

  client.on("error", (error) => {
    log(error.message);
  });

  client.on("message", (topic, message) => {
    console.log(message.toString());
    client.end();
  });
}
