import { DocumentType, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  options: { customName: "topics" },
})
export default class TopicSchema {
  @prop({ required: true, unique: true })
  public name!: string;
}

export type TopicType = DocumentType<TopicSchema>;
