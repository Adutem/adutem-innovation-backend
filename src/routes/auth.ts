import {
  createAdminAccount,
  getAdminDetails,
  loginAdminAccount,
  logoutAdminAccount,
  requestAccountVerificationOTP,
  verifyAccount,
} from "../controllers";
import { routerCreator } from "../helpers";
import { validateToken } from "../middlewares";

// Create a new router
const authRouter = routerCreator();

// Bind routes to controllers
authRouter.post("/login", loginAdminAccount);
authRouter.post("/register", createAdminAccount);
authRouter.post("/logout", validateToken, logoutAdminAccount);
authRouter.get("/get-user", validateToken, getAdminDetails);
authRouter.post(
  "/account-ver-otp",
  validateToken,
  requestAccountVerificationOTP
);
authRouter.post("/verify-account", validateToken, verifyAccount);

export default authRouter;
