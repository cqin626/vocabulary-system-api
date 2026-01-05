import { AuthService, authService } from "./authService.js";
import { Request, Response } from "express";
import { UserSchema } from "../../shared/types/userTypes.js";
import { sendSuccess } from "../../shared/utils/responseUtils.js";
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
}

export const authController = new AuthController(authService);
