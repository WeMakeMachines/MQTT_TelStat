import mongoose from "mongoose";
import { fromEvent, Observable } from "rxjs";

import mongoDbEvents from "./mongoDbEvents";

class MongoDbError extends Error {}

interface MongoDbConnectionProps {
  username: string;
  password: string;
  host: string;
  dbName: string;
}

export default class MongoDb {
  public static readonly connection$: Observable<any> = fromEvent(
    mongoose.connection,
    "connected"
  );

  public static connect({
    username,
    password,
    host,
    dbName,
  }: MongoDbConnectionProps) {
    mongoDbEvents(mongoose.connection);

    mongoose
      .connect(
        `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`
      )
      .catch((error) => {
        throw new MongoDbError(`Critical error, ${error.message}`);
      });
  }
}
