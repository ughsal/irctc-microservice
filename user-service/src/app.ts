import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestMiddleware } from "./middleware/request.middleware";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";

export const app = express();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestMiddleware);
app.use(
  cors({
    origin: env.allowedOrigins,
    credentials: true,
  }),
);

app.get("/", (_req, res) => {
  res.json({
    service: env.serviceName,
    status: "ok",
  });
});

app.use("/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);
