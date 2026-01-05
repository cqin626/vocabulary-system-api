import { Request, Response, NextFunction } from "express";
import { sendError } from "../shared/utils/responseUtils.js";
import jwt from "jsonwebtoken";
import { publicKey, signingAlgo } from "../config/jwtConfig.js";
import { UserTokenSchema } from "../shared/types/userTypes.js";

export function verifyAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) return sendError(res, "Authentication is required", 401);

  try {
    const payload = jwt.verify(accessToken, publicKey, {
      algorithms: [signingAlgo],
    });
    const user = UserTokenSchema.parse(payload);
    req.user = user;
    next();
  } catch (err) {
    return sendError(res, "Invalid access token", 403);
  }
}
