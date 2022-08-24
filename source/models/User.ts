import { getModelForClass } from "@typegoose/typegoose";

import User from "../types/schemas/User";

const UserModel = getModelForClass(User);

export { UserModel as default };
