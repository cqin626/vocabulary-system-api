import { AuthRepository, authRepo } from "./authRepository.js";
import { UserType } from "../../shared/types/userTypes.js";
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from "../../shared/errors/HTTPErrors.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import ms from "ms";
import { privateKey, publicKey, signingAlgo } from "../../config/jwt.js";
import {
  UserTokenType,
  UserTokenSchema,
} from "../../shared/types/userTypes.js";
import crypto from "crypto";

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}
  private getRefreshTokenHash(refreshToken: string) {
    return crypto.createHash("sha256").update(refreshToken).digest("hex");
  }

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
      role: true,
    });

    if (
      !foundUser ||
      !(await argon2.verify(foundUser.passwordHash, user.password))
    )
      throw new UnauthorizedError("Invalid email or password");

    return {
      id: foundUser.id,
      email: user.email,
      role: foundUser.role,
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
    const refreshTokenHash = this.getRefreshTokenHash(refreshToken);

    await this.repo.createRefreshToken(refreshTokenHash, payload.id, expiresAt);
    return { refreshToken, expiresAt };
  }

  async getRefreshTokenDetails(refreshToken: string) {
    const refreshTokenHash = this.getRefreshTokenHash(refreshToken);
    return await this.repo.getRefreshToken(refreshTokenHash);
  }

  async invalidateRefreshToken(refreshToken: string) {
    const refreshTokenHash = this.getRefreshTokenHash(refreshToken);
    await this.repo.invalidateRefreshToken(refreshTokenHash);
  }

  async invalidateAllRefreshTokensByUserId(userId: number) {
    return await this.repo.invalidateAllRefreshTokensByUserId(userId);
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, publicKey, {
        algorithms: [signingAlgo],
      });
      return UserTokenSchema.parse(payload);
    } catch (err) {
      throw new ForbiddenError("Invalid or expired refresh token");
    }
  }
}

export const authService = new AuthService(authRepo);
