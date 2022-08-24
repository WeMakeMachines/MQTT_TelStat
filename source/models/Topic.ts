import { getModelForClass } from "@typegoose/typegoose";

import Topic from "../types/schemas/Topic";

const TopicModel = getModelForClass(Topic);

export { TopicModel as default };
