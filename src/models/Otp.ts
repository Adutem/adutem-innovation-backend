import { Document, Schema, Model, model } from "mongoose";

export interface IResetOTP extends Document {
  email: string;
  otpCode: string;
  //   expiresIn: number;
  tries: number;
  // expireAt: Date;
  createdAt: Date;
}

const ResetOTPSchema: Schema<IResetOTP> = new Schema<IResetOTP>(
  {
    email: {
      type: String,
      required: [true, "Must provide current email"],
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    otpCode: {
      type: String,
      required: [true, "Must provide otp code"],
    },
    /**
     * @deprecated Otp now disappear from database after 10 mins
     */
    // expiresIn: {
    //   type: Number,
    //   required: [true, "Must provide expiration date"],
    // },
    tries: {
      type: Number,
      default: 0,
    },
    // expireAt: { type: Date, expires: 600 },
    createdAt: { type: Date, expires: "9m", default: Date.now },
  },
  { timestamps: true }
);

export const Otp: Model<IResetOTP> = model<IResetOTP>("Otps", ResetOTPSchema);
export default Otp;
