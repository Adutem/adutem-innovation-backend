import { routerCreator } from "../helpers";
import { submitContactRequest } from "../controllers";

const contactRouter = routerCreator();

contactRouter.post("/contact-org", submitContactRequest);

export default contactRouter;
