import { Request, Response } from "express";
import { Jobs, News } from "../models";
import { createJobStat, createNewsStat, sendSuccessResponse } from "../helpers";
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  const jobsCount = await Jobs.countDocuments({});
  const newsCount = await News.countDocuments({});
  const jobsStat = createJobStat(jobsCount);
  const newsStat = createNewsStat(newsCount);
  const analytics = [jobsStat, newsStat];
  return sendSuccessResponse(res, { analytics, message: "Successful" });
};
