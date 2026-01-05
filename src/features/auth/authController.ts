import { AuthService, authService } from "./authService.js";
import { Request, Response } from "express";
import { UserSchema } from "../../shared/types/userTypes.js";
import { sendSuccess } from "../../shared/utils/responseUtils.js";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../../shared/errors/HTTPErrors.js";
import "dotenv/config";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  registerUser = async (req: Request, res: Response) => {
    const newUser = UserSchema.parse(req.body);
    const registeredUser = await this.service.registerUser(newUser);

    return sendSuccess(res, registeredUser, 201);
  };

  handleLogin = async (req: Request, res: Response) => {
    const user = UserSchema.parse(req.body);
    const verifiedUser = await this.service.verifyUser(user);
    const { refreshToken, expiresAt: refreshExpiresAt } =
      await this.service.generateRefreshToken(verifiedUser);
    const { accessToken, expiresAt: accessExpiresAt } =
      this.service.generateAccessToken(verifiedUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "DEV" ? false : true,
      path: "/api/v1/auth",
      expires: refreshExpiresAt,
    });
    return sendSuccess(res, { accessToken, accessExpiresAt }, 200);
  };

  handleLogout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) return sendSuccess(res, null, 200);

    await this.service.invalidateRefreshToken(refreshToken);

    res.clearCookie("refreshToken", {
      path: "/api/v1/auth",
      expires: new Date(0),
    });

    return sendSuccess(res, null, 200);
  };

  refresh = async (req: Request, res: Response) => {
    const currentRefreshToken = req.cookies?.refreshToken;
    if (!currentRefreshToken)
      throw new UnauthorizedError("Unauthorized to perform refresh");

    // Verify token
    const verifiedPayload =
      this.service.verifyRefreshToken(currentRefreshToken);

    // Check if the token was revoked
    const currentRefreshTokenDetails =
      await this.service.getRefreshTokenDetails(currentRefreshToken);

    if (currentRefreshTokenDetails?.revoked) {
      // Anomaly detected, invalidate all tokens from the user in db
      await this.service.invalidateAllRefreshTokensByUserId(verifiedPayload.id);
      throw new ForbiddenError(
        "Revoked token is used. Malicious activity is suspected."
      );
    } else {
      // Invalidate old token
      await this.service.invalidateRefreshToken(currentRefreshToken);

      // Issue new tokens
      const { refreshToken: newRefreshToken, expiresAt: refreshExpiresAt } =
        await this.service.generateRefreshToken(verifiedPayload);
      const { accessToken, expiresAt: accessExpiresAt } =
        this.service.generateAccessToken(verifiedPayload);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENVIRONMENT === "DEV" ? false : true,
        path: "/api/v1/auth",
        expires: refreshExpiresAt,
      });
      return sendSuccess(res, { accessToken, accessExpiresAt }, 200);
    }
  };
}

export const authController = new AuthController(authService);
