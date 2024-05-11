import { Request, Response } from "express";
import { throwErrorIfBodyIsEmpty } from "../utils";
import { sendContactEmail, sendEmail, sendSuccessResponse } from "../helpers";

export const submitContactRequest = async (req: Request, res: Response) => {
  const data = req.body;
  throwErrorIfBodyIsEmpty(
    data,
    ["fullName", "email"],
    "Provide all required fields"
  );
  await sendContactEmail(data);
  return sendSuccessResponse(res, {
    message: "Form submitted successfully. Kindly await our response.",
  });
};
