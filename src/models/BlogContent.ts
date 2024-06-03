import { Document, Schema } from "mongoose";
import { FileContentType, FileSchema } from "./File";

type BlogContentType = "heading" | "paragraph" | "image" | "list";
type BlogContentInputType = "text" | "textarea" | "file" | "multiple-input";

interface IBlogContent extends Document {
  type: BlogContentType;
  inputType: BlogContentInputType;
  nanoId: string;
  listContent?: Array<string>;
  textContent?: string;
  fileContent?: FileContentType;
}

const BlogContentSchema: Schema<IBlogContent> = new Schema<IBlogContent>(
  {
    type: {
      type: String,
      enum: {
        values: ["heading", "paragraph", "image", "list"],
        message: "Invalid blog content type",
      },
      required: [true, "Please provide blog content type"],
      trim: true,
    },
    inputType: {
      type: String,
      enum: {
        values: ["text", "textarea", "file", "multiple-input"],
        message: "Invalid blog content input type",
      },
      required: [true, "Please provide blog content input type"],
      trim: true,
    },
    nanoId: {
      type: String,
      required: [true, "Please provide blog content nanoId"],
      trim: true,
    },
    listContent: {
      type: [String],
      required: function () {
        return this.type === "list";
      },
      // validate: {
      //   validator: function (this: IBlogContent) {
      //     console.log("List Validator");
      //     return (
      //       this.type !== "list" ||
      //       (this.listContent && this.listContent.length > 0)
      //     );
      //   },
      //   message: "Please provide blog content list content",
      // },
      // trim: true,
    },
    textContent: {
      type: String,
      // validate: {
      //   validator: function (this: IBlogContent) {
      //     console.log("Text Validator");
      //     return (
      //       (this.type !== "heading" && this.type !== "paragraph") ||
      //       !!this.textContent
      //     );
      //   },
      //   message: "Please provide blog content text content",
      // },
      trim: true,
      required: function () {
        return this.type === "heading" || this.type === "paragraph";
      },
    },
    fileContent: {
      type: FileSchema,
      required: function () {
        return this.type === "image";
      },
    },
  },
  { timestamps: true }
);

// const BlogContent = model<IBlogContent>("BlogContent", BlogContentSchema);

export { IBlogContent, BlogContentSchema };
