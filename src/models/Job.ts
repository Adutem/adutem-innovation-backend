import { Document, Schema, model, Model } from "mongoose";
import { urlRegex, emailRegex, phoneNumberRegex } from "../utils";

export interface IJobs extends Document {
  role: string;
  jobDescription: string;
  requirements: Array<string>;
  contactLink: string;
  applicationLink: string;
  applicationDeadline: Date;
  contactLinkType: "email" | "phoneNumber";
}

const JobSchema: Schema<IJobs> = new Schema<IJobs>(
  {
    role: {
      type: String,
      required: [true, "Please provide role"],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, "Please provide job description"],
      trim: true,
    },
    requirements: {
      type: [String],
      required: [true, "Please provide job requirements"],
      trim: true,
    },
    contactLinkType: {
      type: String,
      enum: {
        values: ["email", "phoneNumber"],
        message: "Invalid contact link type",
      },
      required: [true, "Please provide contact link type"],
      trim: true,
    },
    contactLink: {
      type: String, // TODO: Add validation for URL
      required: [true, "Please provide contact link"],
      validate: {
        validator: function (value: string) {
          const thisSchema = this as any;
          if (thisSchema.ownerDocument()) {
            const { contactLinkType } = thisSchema.ownerDocument() as IJobs;
            return contactLinkType === "email"
              ? emailRegex.test(value)
              : phoneNumberRegex.test(value);
          }
        },
      },
      trim: true,
    },
    applicationLink: {
      type: String, // TODO: Add validation for URL
      required: [true, "Please provide application link"],
      matches: [urlRegex, "Please provide a valid URL"],
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Please provide application deadline"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Jobs: Model<IJobs> = model<IJobs>("Jobs", JobSchema);

export default Jobs;
