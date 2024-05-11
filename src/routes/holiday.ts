import { routerCreator } from "../helpers";
import { createHoliday, getHoliday, updateHoliday } from "../controllers";

const holidayRouter = routerCreator();

holidayRouter.route("/").get(getHoliday).post(createHoliday);
holidayRouter.patch("/:holidayId", updateHoliday);

export default holidayRouter;
