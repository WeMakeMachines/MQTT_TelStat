import {
  DocumentType,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

import UserSchema from "./User";
import TopicSchema from "./Topic";

@modelOptions({
  options: { customName: "publishers", allowMixed: Severity.ALLOW },
})
export default class PublisherSchema {
  @prop({
    required: true,
    ref: () => UserSchema,
  })
  public owner!: Ref<UserSchema>;

  @prop({
    ref: () => TopicSchema,
  })
  public topic?: Ref<TopicSchema>;

  @prop({ required: true, unique: true, default: () => nanoid(10) })
  public nanoId!: string;

  @prop({ required: true, unique: true })
  public name!: string;

  @prop()
  public lastPublishDate?: Date;

  @prop({ type: () => [mongoose.Schema.Types.Mixed] })
  telemetry?: object[];
}

export type PublisherType = DocumentType<PublisherSchema>;
