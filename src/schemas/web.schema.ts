import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class WebScrapEmbeddings {
  @Prop()
  websiteUrl: string;

  @Prop()
  text: string;

  @Prop()
  embedding: [number];
}

export const WebScrapEmbeddingsSchema =
  SchemaFactory.createForClass(WebScrapEmbeddings);
