import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WebScrapEmbeddings extends Document {
  @Prop()
  websiteUrl: string;

  @Prop()
  text: string;

  @Prop()
  embedding: [number];
}

export const WebScrapEmbeddingsSchema =
  SchemaFactory.createForClass(WebScrapEmbeddings);
