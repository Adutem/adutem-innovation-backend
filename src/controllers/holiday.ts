import { Request, Response } from "express";
import { IHoliday, Holiday } from "../models";
import { throwErrorIfBodyIsEmpty } from "../utils";
import { sendSuccessResponse, throwNotFoundError } from "../helpers";
import { StatusCodes } from "http-status-codes";

export const getHoliday = async (req: Request, res: Response) => {
  let holiday;
  const { type } = req.query;
  let queryObject: Record<string, any> = {};
  if (type && type === "active") {
    const today = new Date();
    queryObject.date = { $gte: today };
  }
  holiday = await Holiday.findOne(queryObject);
  return res.status(StatusCodes.OK).json({ success: true, holiday: holiday });
};

export const createHoliday = async (req: Request, res: Response) => {
  const data = req.body;
  throwErrorIfBodyIsEmpty(
    data,
    ["textContent", "startDate", "endDate"],
    "Provide all required fields"
  );
  const holiday = await Holiday.create(data);
  return sendSuccessResponse(
    res,
    { holiday, message: "Holiday created" },
    StatusCodes.CREATED
  );
};

export const updateHoliday = async (req: Request, res: Response) => {
  const data = req.body;
  throwErrorIfBodyIsEmpty(data, undefined, "No update information provided!");
  const { holidayId } = req.params;
  const holiday = await Holiday.findByIdAndUpdate(holidayId, data, {
    new: true,
    runValidators: true,
  });
  if (!holiday) throwNotFoundError("Resource not found");
  return sendSuccessResponse(res, { holiday, message: "Holiday Updated" });
};
