import { ZodError } from "zod";
import { sendError } from "../shared/utils/responseUtils.js";
import { Request, Response, NextFunction } from "express";
import { getFormattedZodIssue } from "../shared/utils/zodErrorUtils.js";
import { HTTPError } from "../shared/errors/HTTPErrors.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError && "body" in err) {
    return sendError(res, "Invalid JSON payload", 400);
  } else if (err instanceof ZodError) {
    const formattedZodIssue = err.issues[0]
      ? getFormattedZodIssue(err.issues[0])
      : "Invalid request format";
    return sendError(res, formattedZodIssue, 400);
  } else if (err instanceof HTTPError) {
    return sendError(res, err.message, err.statusCode);
  } else {
    req.log.error({ err }, "Unhandled Exception");
    return sendError(res, "Internal server error", 500);
  }
}
