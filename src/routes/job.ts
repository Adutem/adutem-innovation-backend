import { routerCreator } from "../helpers";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers";
import { validateToken } from "../middlewares";

const jobRouter = routerCreator();
jobRouter.get("/", getAllJobs);
jobRouter.use(validateToken);
jobRouter.route("/").post(createJob);
jobRouter.route("/:jobId").get(getJob).patch(updateJob).delete(deleteJob);

export default jobRouter;
