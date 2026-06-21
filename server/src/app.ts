import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/companion/auth.routes";
import companionRoutes from "./modules/companion/companion.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express(); // create express app

app.use(helmet()); // enable security headers

// Enable CORS
app.use(
  cors({
    origin: "*", // allow all origins
    credentials: true, // allow credentials
  }),
);

app.use(express.json()); // parse JSON request body

app.use(compression()); // compress response
app.use(morgan("dev")); // log requests

// Rate limiting (prevent brute force / DOS)
const limiter = rateLimit({
  max: 100, // max requests
  windowMs: 15 * 60 * 1000, // 15 mins
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter); // apply rate limiter to /api routes

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// API routes
app.use("/api/users", userRoutes); // mount user routes
app.use("/api/auth", authRoutes);
app.use("/api", companionRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler); // global error handler

export default app;
