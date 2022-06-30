import {
  DocumentType,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

import UserSchema from "./User";

@modelOptions({
  options: { customName: "publishers", allowMixed: Severity.ALLOW },
})
export default class PublisherSchema {
  @prop({
    required: true,
    ref: () => UserSchema,
  })
  public owner!: Ref<UserSchema>;

  @prop({ default: null })
  public lastPublishDate!: Date;

  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ type: () => [mongoose.Schema.Types.Mixed] })
  telemetry?: object[];
}

export type PublisherType = DocumentType<PublisherSchema>;
