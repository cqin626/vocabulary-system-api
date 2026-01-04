import { AuthService, authService } from "./authService.js";
import { Request, Response } from "express";
import { UserSchema } from "../../shared/types/userTypes.js";
import { sendSuccess } from "../../shared/utils/responseUtils.js";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  registerUser = async (req: Request, res: Response) => {
    const newUser = UserSchema.parse(req.body);
    const registeredUser = await this.service.registerUser(newUser);

    return sendSuccess(res, registeredUser, 201);
  };
}

export const authController = new AuthController(authService);
