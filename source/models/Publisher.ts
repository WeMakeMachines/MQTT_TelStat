import { getModelForClass } from "@typegoose/typegoose";

import Publisher from "../types/schemas/Publisher";

const PublisherModel = getModelForClass(Publisher);

export { PublisherModel as default };
