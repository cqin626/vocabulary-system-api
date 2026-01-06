import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "./config/logger.js";
import routerV1 from "./routes/routeV1.js";
import { sendError } from "./shared/utils/responseUtils.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  pinoHttp({
    logger,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", routerV1);

app.use((req, res) => {
  sendError(res, "Endpoint not found", 404);
});

app.use(errorHandler);

export default app;
