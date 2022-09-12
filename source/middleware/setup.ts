import { NextFunction, Request, Response } from "express";

import log from "../helpers/debug";
import MongoDb from "../services/MongoDb";
import { StatusCodes } from "http-status-codes";
import { concat } from "rxjs";
import mqttClient from "../services/mqttClient";

const namespace = "middleware:setup";

let connected: boolean = false;

const subscribeToServiceConnections = (): Promise<void> => {
  return new Promise((resolve) => {
    const observables = concat([mqttClient.connection$, MongoDb.connection$]);

    observables.subscribe({
      complete: () => resolve(),
    });
  });
};

subscribeToServiceConnections().then(() => (connected = true));

export const waitForServices = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!connected) {
    log(namespace, "Unable to handle request; awaiting services");
    return res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
  }
  next();
};
