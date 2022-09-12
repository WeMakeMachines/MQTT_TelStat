import { Connection } from "mongoose";

import log from "../../helpers/debug";

const namespace = "service:mongodb";

export default function mongoDbEvents(connection: Connection) {
  connection.on("connecting", () => log(namespace, "Connecting to MongoDB..."));

  connection.on("connected", () => log(namespace, "Connected to MongoDB"));

  connection.on("reconnected", () => log(namespace, "Reconnected to MongoDB"));

  connection.on("reconnectFailed", () =>
    log(
      namespace,
      "Reached number of reconnect tries... unable to reconnect to MongoDB"
    )
  );

  connection.on("error", (exception: Error) =>
    log(namespace, "Error connecting to MongoDB: " + exception.message)
  );

  connection.on("disconnected", () =>
    log(namespace, "Disconnected from MongoDB")
  );
}
