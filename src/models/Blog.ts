import { Schema, Document, model, Model } from "mongoose";
import { BlogContentSchema, IBlogContent } from "./BlogContent";
import { FileContentType, FileSchema } from "./File";

export interface IBlog extends Document {
  blogNanoId: string;
  title: string;
  shortIntroduction: string;
  thumbNail: FileContentType;
  publicationDate: string | Date;
  tag: string;
  blogContents: Array<IBlogContent>;
}

const BlogSchema: Schema<IBlog> = new Schema<IBlog>(
  {
    blogNanoId: {
      type: String,
      required: [true, "Please provide blog nanoId"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
    },
    shortIntroduction: {
      type: String,
      required: [true, "Please provide short introduction"],
      trim: true,
    },
    thumbNail: {
      type: FileSchema,
      required: [true, "Please provide blog thumbnail"],
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
    blogContents: {
      default: undefined,
      type: [BlogContentSchema],
      required: [true, "Please provide blog contents"],
    },
  },
  { timestamps: true }
);

const Blog: Model<IBlog> = model<IBlog>("Blogs", BlogSchema);

export default Blog;
