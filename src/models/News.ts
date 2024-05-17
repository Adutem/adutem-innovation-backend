import { Schema, Document, model, Model } from "mongoose";

export interface INews extends Document {
  title: string;
  shortDescription: string;
  thumbNail: string;
  publicationDate: string | Date;
  tag: string;
}

const NewsSchema: Schema<INews> = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Please provide short description"],
      trim: true,
    },
    thumbNail: {
      type: String,
      required: [true, "Please provide thumbnail"],
      trim: true,
    },
    publicationDate: {
      type: Date,
      required: [true, "Please provide publication date"],
      trim: true,
    },
    tag: {
      type: String,
      required: [true, "Please provide tag"],
      trim: true,
    },
  },
  { timestamps: true }
);

const News: Model<INews> = model<INews>("News", NewsSchema);

export default News;
