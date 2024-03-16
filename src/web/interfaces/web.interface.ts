import { Document } from 'mongoose';

export interface IWebData extends Document {
  readonly name: string;
  readonly gender: string;
  readonly email: string;
}
