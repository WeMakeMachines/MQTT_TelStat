import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import http from "http";

import config from "./config/";
import dbConfig from "./config/db";
import routes from "./routes";
import log from "./helpers/debug";
import MongoDb from "./services/MongoDb";
import mqttSubscriber from "./services/mqttSubscriber";
import { waitForServices } from "./middleware/setup";

const app: express.Application = express();
const server: http.Server = http.createServer(app);

MongoDb.connect({
  username: dbConfig.dbUser,
  password: dbConfig.dbPass,
  host: dbConfig.dbHost,
  dbName: dbConfig.dbName,
});

mqttSubscriber.initialise();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use("/api", waitForServices, routes);

server.listen(config.port, () => {
  log("server", `Server running at http://localhost:${config.port}`);
});
