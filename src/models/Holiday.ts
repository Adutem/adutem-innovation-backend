import { Document, Schema, model, Model } from "mongoose";
import { createConflictError, createUnprocessableEntityError } from "../errors";

export interface IHoliday extends Document {
  textContent: string;
  isDeactivated: boolean;
  startDate: Date;
  endDate: Date;
}

const HolidaySchema: Schema<IHoliday> = new Schema<IHoliday>(
  {
    textContent: {
      type: String,
      required: [true, "Please provide holiday text"],
      trim: true,
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: [true, "Please provide holiday start date"],
      trim: true,
    },
    endDate: {
      type: Date,
      required: [true, "Please provide holiday end date"],
      trim: true,
      validate: {
        validator: function (value: Date) {
          const thisSchema = this as any;
          if (thisSchema.ownerDocument && thisSchema.ownerDocument()) {
            const { startDate } = thisSchema.ownerDocument() as IHoliday;
            return value >= startDate;
          } else if (thisSchema.startDate) {
            return value >= thisSchema.startDate;
          }
        },
        message: "End date must be after start date",
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook to check for existing documents
HolidaySchema.pre("save", async function (next) {
  const holidayConstructor = this.constructor as any;
  const doc = await holidayConstructor.findOne();

  if (doc && this.isNew) {
    next(createConflictError("A document already exist in the collection"));
  }
  next();
});

// Middleware to handle validation for `findOneAndUpdate`
HolidaySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const endDate = update.$set?.endDate || update.endDate;
  const startDate =
    update.$set?.startDate ||
    update.startDate ||
    (await this.model.findOne(this.getQuery()))?.startDate;

  if (
    endDate &&
    startDate &&
    new Date(endDate).getTime() < new Date(startDate).getTime()
  ) {
    const err = createUnprocessableEntityError(
      "End date must be after start date"
    );
    return next(err);
  }
  next();
});

// Pre-update hook to check for existing documents
HolidaySchema.pre("insertMany", async function (next) {
  const docCount = await this.countDocuments({});
  console.log(this);
  console.log(docCount);
  if (docCount > 0) {
    next(
      createConflictError("Only one document is allowed in this collection")
    );
  }
  next();
});

const Holiday: Model<IHoliday> = model<IHoliday>("Holidays", HolidaySchema);

export default Holiday;
