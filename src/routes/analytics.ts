import { routerCreator } from "../helpers";
import { getDashboardAnalytics } from "../controllers";
import { validateToken } from "../middlewares";

const analyticsRouter = routerCreator();
analyticsRouter.get("/get-analytics", validateToken, getDashboardAnalytics);

export default analyticsRouter;
