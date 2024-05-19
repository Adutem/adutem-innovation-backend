import { Request, Response } from "express";
import { IJobs, Jobs } from "../models";
import { throwErrorIfBodyIsEmpty } from "../utils";
import {
  sendSuccessResponse,
  throwBadRequestError,
  throwNotFoundError,
} from "../helpers";
import { StatusCodes } from "http-status-codes";

export const getAllJobs = async (req: Request, res: Response) => {
  let jobs;
  const { type } = req.query;
  let queryObject: Record<string, any> = {};
  if (type && type === "active") {
    const today = new Date();
    queryObject.applicationDeadline = { $gte: today };
  }
  jobs = await Jobs.find(queryObject);
  return sendSuccessResponse(res, { jobs, message: "Successful" });
};

export const getJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = await Jobs.findById(jobId);
  if (!job) throwNotFoundError("Resource not found");
  return sendSuccessResponse(res, { job, message: "Successful" });
};

export const createJob = async (req: Request, res: Response) => {
  const data = req.body;
  throwErrorIfBodyIsEmpty(
    data,
    [
      "role",
      "description",
      "requirements",
      "contactLink",
      "applicationLink",
      "applicationDeadline",
      "contactLinkType",
    ],
    "Please provide all required fields"
  );
  if (
    data.hasOwnProperty("requirements") &&
    typeof data.requirements === "string" &&
    !data.requirements.trim()
  )
    throwBadRequestError("Please provide job requirement(s)");

  if (data.hasOwnProperty("requirements") && Array.isArray(data.requirements)) {
    const filteredRequirements = data.requirements.filter(
      (value: any) => typeof value === "string" && !!value.trim()
    );
    if (filteredRequirements.length === 0)
      throwBadRequestError("Please provide job requirement(s)");
    data.requirements = filteredRequirements;
  }
  const job = await Jobs.create(data);
  return sendSuccessResponse(
    res,
    { job, message: "Job created" },
    StatusCodes.CREATED
  );
};

export const updateJob = async (req: Request, res: Response) => {
  const data = req.body;
  throwErrorIfBodyIsEmpty(data, undefined, "No update information provided!");
  const { jobId } = req.params;
  const job = await Jobs.findOneAndUpdate({ _id: jobId }, data, {
    new: true,
    runValidators: true,
  });
  if (!job) throwNotFoundError("Resource not found");
  return sendSuccessResponse(res, { job, message: "Job Updated" });
};

export const deleteJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = await Jobs.findByIdAndDelete(jobId);
  if (!job) throwNotFoundError("Resource not found");
  return sendSuccessResponse(res, { job, message: "Job Deleted" });
};
