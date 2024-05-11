import { Document, Schema, model, Model } from "mongoose";

export interface IHoliday extends Document {
  textContent: string;
  date: Date;
}

const HolidaySchema: Schema<IHoliday> = new Schema<IHoliday>(
  {
    textContent: {
      type: String,
      required: [true, "Please provide holiday text"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide date"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Holiday: Model<IHoliday> = model<IHoliday>("Holidays", HolidaySchema);

export default Holiday;
