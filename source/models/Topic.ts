import { ChangeStreamDocument } from "mongodb";
import { fromEventPattern } from "rxjs";
import { getModelForClass } from "@typegoose/typegoose";

import Topic from "../types/schemas/Topic";

const TopicModel = getModelForClass(Topic);
const topicEventEmitter = TopicModel.watch([], {
  hydrate: true,
  fullDocument: "updateLookup",
});

const topicChange$ = fromEventPattern<ChangeStreamDocument<Topic>>(
  (handler) => {
    topicEventEmitter.on("change", handler);
  }
);

export { TopicModel as default, topicChange$ };
