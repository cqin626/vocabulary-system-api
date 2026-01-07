import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { publicKey, signingAlgo } from "../config/jwt.js";
import { UserTokenSchema } from "../shared/types/userTypes.js";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../shared/errors/HTTPErrors.js";

export function verifyAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) throw new UnauthorizedError("Authentication is required");

  try {
    const payload = jwt.verify(accessToken, publicKey, {
      algorithms: [signingAlgo],
    });
    const user = UserTokenSchema.parse(payload);
    req.user = user;
    next();
  } catch (err) {
    throw new ForbiddenError("Invalid access token");
  }
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }

  if (req.user.role !== "ADMIN") {
    throw new ForbiddenError("Access denied: Admin privileges required");
  }
  
  next();
}
