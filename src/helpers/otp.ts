import { Otp } from "../models";
import {
  throwBadRequestError,
  throwUnprocessableEntityError,
} from "./throw-request-error";

export interface OtpGeneratorParams {
  email: string;
}

export interface VerifyOtpParams {
  email: string;
  otp: string;
}

export const generateOtp = async ({ email }: OtpGeneratorParams) => {
  const otpCode = Math.floor(Math.random() * 900000) + 100000;
  /**
   * @deprecated
   */
  //   const expiresIn = new Date().getTime() + 300 * 1000;
  //   let otpDoc = await Otp.findOne({ email });
  //   if (otpDoc) {
  //     otpDoc.$set("otpCode", otpCode.toString());
  //     otpDoc = await otpDoc.save();
  //   } else {
  //     otpDoc = await Otp.create(newOtpDoc);
  //   }
  // const expireAt = new Date(Date.now());
  // const newOtpDoc = { email, otpCode: otpCode.toString(), expireAt };
  const newOtpDoc = { email, otpCode: otpCode.toString() };
  await Otp.deleteMany({ email });
  const otpDoc = await Otp.create(newOtpDoc);
  return otpDoc;
};

export const verifyOTP = async ({ email, otp }: VerifyOtpParams) => {
  if (otp.length < 6)
    throwBadRequestError(
      "Incorrect token length. Please provide a valid 6-character OTP"
    );
  const token = await Otp.findOne({ email });
  if (!token) return throwUnprocessableEntityError("Invalid token or expired.");
  const { otpCode, tries } = token;
  /**
   * @deprecated Otp now disappears from database after 10mins.
   */
  //   const { expiresIn } = token;
  //   const timeDifference = expiresIn - new Date().getTime();
  //   if (timeDifference < 0) {
  //     await Otp.findOneAndDelete({ email });
  //     throwBadRequestError("Token expired. Please request a new one");
  //   }
  const otpIsValid = otp === otpCode;
  if (!otpIsValid) {
    if (tries < 2) {
      await token.$inc("tries", 1);
      await token.save();
      throwBadRequestError("Invalid token");
    }
    await Otp.findOneAndDelete({ email });
    throwBadRequestError(
      "Invalid Token. Maximum tries exceeded. Please request a new token."
    );
  }
  await Otp.findOneAndDelete({ email });
  return true;
};
