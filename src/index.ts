import "express-async-errors";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./connection/mongodb";
import {
  requestLogger,
  methodChecker,
  routeNotFound,
  errorHandler,
} from "./middlewares";
import {
  authRouter,
  contactRouter,
  holidayRouter,
  analyticsRouter,
  jobRouter,
} from "./routes";

// Configure env
dotenv.config();

// Initialize an express app
const app = express();

// Create a root router
const appRouter = express.Router();

// Env variables
const PORT = (process.env.PORT || 3000) as number;
const NODE_ENV = process.env.NODE_ENV;
const IPV4_ADDRESS = process.env.IPV4_ADDRESS;
const HOSTNAME =
  NODE_ENV === "development" ? IPV4_ADDRESS || "localhost" : null;

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.137.1:5173",
      "http://localhost:5000",
      ...corsOrigins,
    ],
    credentials: true,
  })
);

app.use(methodChecker); // Checks if the incoming request method is supported
app.use(express.urlencoded({ extended: true })); // Parse urlencoded data in request body
app.use(express.json({})); // Parse json data in request body

app.use(requestLogger); // Log any incoming request to the console

appRouter.use("/contact", contactRouter);
appRouter.use("/holiday", holidayRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/analytics", analyticsRouter);
appRouter.use("/jobs", jobRouter);
app.use("/adutem/api/v1", appRouter);

app.get("/", (req, res) => {
  return res.send({
    success: true,
    message: "Hello! Adutem Innovations backend system says hi!👋",
  });
});

// All route that are not handled from the top will be handled here
app.all("*", routeNotFound); // Returns a 404 response for such routes
app.use(errorHandler); // Handles all error in the app

const startServer = () =>
  app.listen(PORT, HOSTNAME || "", () => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
  });

connectDB(startServer);
// startServer();
