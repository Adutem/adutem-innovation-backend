import { Document, Schema, model, Model } from "mongoose";
import { urlRegex, emailRegex, phoneNumberRegex } from "../utils";
import { createUnprocessableEntityError } from "../errors";

export interface IJobs extends Document {
  role: string;
  description: string;
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
    description: {
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
          if (thisSchema.ownerDocument && thisSchema.ownerDocument()) {
            const { contactLinkType } = thisSchema.ownerDocument() as IJobs;
            return contactLinkType === "email"
              ? emailRegex.test(value)
              : phoneNumberRegex.test(value);
          } else if (thisSchema.contactLinkType) {
            return thisSchema.contactLinkType === "email"
              ? emailRegex.test(thisSchema.contactLink)
              : phoneNumberRegex.test(thisSchema.contactLink);
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

// Middleware to handle validation for `findOneAndUpdate` (for requirements)
JobSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const requirements = update.$set?.requirements || update.requirements;

  if (typeof requirements === "string" && !requirements.trim()) {
    next(createUnprocessableEntityError("Please provide job requirement(s)"));
    return;
  }

  if (Array.isArray(requirements)) {
    const filteredRequirements = requirements.filter(
      (value: any) => typeof value === "string" && !!value.trim()
    );
    if (filteredRequirements.length === 0) {
      next(createUnprocessableEntityError("Please provide job requirement(s)"));
      return;
    }
  }
  next();
});

// Middleware to handle validation for `save` (for requirements)
JobSchema.pre("save", async function (next) {
  const requirements = this.requirements;
  if (requirements && typeof requirements === "string" && !!requirements) {
    next(createUnprocessableEntityError("Please provide job requirement(s)"));
    return;
  }

  if (requirements && Array.isArray(requirements)) {
    const filteredRequirements = requirements.filter(
      (value: any) => typeof value === "string" && !!value.trim()
    );
    if (filteredRequirements.length === 0) {
      next(createUnprocessableEntityError("Please provide job requirement(s)"));
      return;
    }
  }
  next();
});

// Middleware to handle validation for `findOneAndUpdate` (for contactLinkType and contactLink)
JobSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const currentDocument = await this.model.findOne(this.getQuery());
  const contactLinkType =
    update.$set?.contactLinkType ||
    update.contactLinkType ||
    currentDocument?.contactLinkType;
  const contactLink =
    update.$set?.contactLink ||
    update.contactLink ||
    currentDocument?.contactLink;

  if (contactLinkType && contactLink) {
    let err;
    if (
      (contactLinkType === "email" && !emailRegex.test(contactLink)) ||
      (contactLinkType === "phoneNumber" && !phoneNumberRegex.test(contactLink))
    ) {
      err = createUnprocessableEntityError(
        `Invalid ${contactLinkType} contact link: ${contactLink}`
      );
      return next(err);
    }
  }
  next();
});

const Jobs: Model<IJobs> = model<IJobs>("Jobs", JobSchema);

export default Jobs;
