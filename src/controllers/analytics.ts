import { Request, Response } from "express";
import { Jobs, Blog } from "../models";
import { createJobStat, createBlogStat, sendSuccessResponse } from "../helpers";
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  const jobsCount = await Jobs.countDocuments({});
  const blogsCount = await Blog.countDocuments({});
  const jobsStat = createJobStat(jobsCount);
  const blogStat = createBlogStat(blogsCount);
  const analytics = [jobsStat, blogStat];
  return sendSuccessResponse(res, { analytics, message: "Successful" });
};
