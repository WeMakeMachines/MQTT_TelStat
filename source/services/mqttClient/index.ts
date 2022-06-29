import MqttClient from "./MqttClient";
import mqttConfig from "../../config/mqtt";

export default new MqttClient({
  host: mqttConfig.mqttBrokerHost,
  username: mqttConfig.mqttBrokerUser,
  password: mqttConfig.mqttBrokerPass,
  port: mqttConfig.mqttBrokerPort,
});
