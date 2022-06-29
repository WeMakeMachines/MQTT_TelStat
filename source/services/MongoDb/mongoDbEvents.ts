import { Connection } from "mongoose";

import { log } from "./";

export default function mongoDbEvents(connection: Connection) {
  connection.on("connecting", () => log("Connecting to MongoDB..."));

  connection.on("connected", () => log("Connected to MongoDB"));

  connection.on("reconnected", () => log("Reconnected to MongoDB"));

  connection.on("reconnectFailed", () =>
    log("Reached number of reconnect tries... unable to reconnect to MongoDB")
  );

  connection.on("error", (exception: Error) =>
    log("Error connecting to MongoDB: " + exception.message)
  );

  connection.on("disconnected", () => log("Disconnected from MongoDB"));
}
