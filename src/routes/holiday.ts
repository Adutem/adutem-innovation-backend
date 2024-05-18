import { routerCreator } from "../helpers";
import { createHoliday, getHoliday, updateHoliday } from "../controllers";
import { validateToken } from "../middlewares";

const holidayRouter = routerCreator();

holidayRouter.use(validateToken);
holidayRouter.route("/").get(getHoliday).post(createHoliday);
holidayRouter.patch("/:holidayId", updateHoliday);

export default holidayRouter;
