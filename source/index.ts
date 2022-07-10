import cors from "cors";
import cookieParser from "cookie-parser";
import debug from "debug";
import express from "express";
import http from "http";

import config from "./config/";
import dbConfig from "./config/db";
import routes from "./routes";
import MongoDb from "./services/MongoDb";
import mqttSubscriber from "./services/mqttSubscriber";

const log: debug.IDebugger = debug(config.namespace);
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

app.use("/api", routes);

server.listen(config.port, () => {
  log(`Server running at http://localhost:${config.port}`);
});
