import { Schema, model, Document, Model } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailRegex, validPasswordRegex } from "../utils";

interface EncodedProps {
  userId: string;
  email: string;
}

export interface IAdmin extends Document {
  email: string;
  password: string;
  isLoggedIn: boolean;
  loginAttempts: number;
  isVerified: boolean;
  validatePassword(inputPassword: string): Promise<boolean>;
  generateToken(encodedProps: EncodedProps): string;
  validateToken(token: string): any;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [emailRegex, "Invalid email"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide Password"],
      match: [
        validPasswordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, a number and special character",
      ],
      trim: true,
      minLength: [
        8,
        "The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).",
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Setup bcrypt for password encryption
AdminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// Setup password validation
AdminSchema.methods.validatePassword = async function (inputPassword: string) {
  return await bcryptjs.compare(inputPassword, this.password);
};

// Setup token generation
AdminSchema.methods.generateToken = function ({ userId, email }: EncodedProps) {
  let token = jwt.sign({ userId, email }, process.env.JWT_SECRET as string, {
    issuer: process.env.ISSUER,
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

const Admin: Model<IAdmin> = model<IAdmin>("Admins", AdminSchema);

export default Admin;
