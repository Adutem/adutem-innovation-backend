import nodemailer from "nodemailer";
import { config } from "dotenv";
import CustomError from "../errors/CustomError";
import path from "path";
import hbs from "nodemailer-express-handlebars";
config();

interface VerifyEmailProps {
  template: string;
  content: {
    otpCode: number;
    email: string;
  };
}

type ContactEmailProps = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  organization?: string;
};

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTPPASS,
  },
});

let options = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./src/views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/views"),
  extName: ".hbs",
};

transporter.use("compile", hbs(options as any));

export const sendEmail = async (mailOptions: any) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        reject(new CustomError("Error occured. Please try again"));
      } else {
        console.log("Email sent: " + info.response);
        // return true;
        resolve(info.response);
      }
    });
  });
};

export const sendContactEmail = (data: ContactEmailProps) => {
  let mailOptions = {
    // from: process.env.EMAIL,
    from: `${data.fullName} <${data.email}>`,
    // to: "Adutem05@gmail.com",
    to: "philipowolabi79@gmail.com",
    // subject: "New Contact",
    subject: "Someone just reached out to you.",
    template: "contact",
    context: {
      body: data,
    },
  };
  return sendEmail(mailOptions);
};

export const sendOtpEmail = (data: VerifyEmailProps) => {
  let mailOptions = {
    from: "Philip from Adutem",
    to: data.content.email,
    subject: "Account Verification",
    template: data.template,
    context: { body: data.content },
  };
  return sendEmail(mailOptions);
};

export default sendEmail;
