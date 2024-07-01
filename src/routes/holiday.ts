import { routerCreator } from "../helpers";
import { createHoliday, getHoliday, updateHoliday } from "../controllers";
import { validateToken } from "../middlewares";

const holidayRouter = routerCreator();

holidayRouter.route("/").get(getHoliday);
holidayRouter.use(validateToken);
holidayRouter.route("/").post(createHoliday);
holidayRouter.patch("/:holidayId", updateHoliday);

export default holidayRouter;
