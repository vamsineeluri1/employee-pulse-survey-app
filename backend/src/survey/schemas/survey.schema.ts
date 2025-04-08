import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Survey extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  response!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);