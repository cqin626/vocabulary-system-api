import { AuthRepository, authRepo } from "./authRepository.js";
import { UserType } from "../../shared/types/userTypes.js";
import {
  ConflictError,
  UnauthorizedError,
} from "../../shared/errors/HTTPErrors.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import ms from "ms";
import { privateKey, signingAlgo } from "../../config/jwtConfig.js";
import { UserTokenType } from "../../shared/types/userTypes.js";

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async registerUser(newUser: UserType) {
    const userExists = await this.repo.userExists(newUser.email);

    if (userExists) throw new ConflictError("User already exists");

    const passwordHash = await argon2.hash(newUser.password);

    return await this.repo.createUser({
      email: newUser.email,
      password: passwordHash,
    });
  }

  async verifyUser(user: UserType): Promise<UserTokenType> {
    const foundUser = await this.repo.getUserDetails(user.email, {
      id: true,
      passwordHash: true,
    });

    if (
      !foundUser ||
      !(await argon2.verify(foundUser.passwordHash, user.password))
    )
      throw new UnauthorizedError("Invalid email or password");

    return {
      id: foundUser.id,
      email: user.email,
    };
  }

  generateAccessToken(payload: UserTokenType) {
    const expiresIn = "10m";
    const expiresAt = new Date(Date.now() + ms(expiresIn));
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: signingAlgo,
      expiresIn: expiresIn,
    });

    return { accessToken, expiresAt };
  }

  async generateRefreshToken(payload: UserTokenType) {
    const expiresIn = "7d";
    const expiresAt = new Date(Date.now() + ms(expiresIn));
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: signingAlgo,
      expiresIn: expiresIn,
    });

    await this.repo.createRefreshToken(refreshToken, payload.id, expiresAt);

    return { refreshToken, expiresAt };
  }

  async invalidateRefreshToken(refreshToken: string) {
    await this.repo.invalidateRefreshToken(refreshToken);
  }
}

export const authService = new AuthService(authRepo);
