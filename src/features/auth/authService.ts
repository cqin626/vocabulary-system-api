import { AuthRepository, authRepo } from "./authRepository.js";
import { UserType } from "../../shared/types/userTypes.js";
import {
  ConflictError,
  UnauthorizedError,
} from "../../shared/errors/HTTPErrors.js";
import argon2 from "argon2";
import fs from "fs";
import jwt from "jsonwebtoken";
import ms from "ms";

const privateKey = fs.readFileSync("private.pem", "utf-8");
const publicKey = fs.readFileSync("public.pem", "utf-8");
const signingAlgo = "RS256";

type UserTokenType = {
  id: number;
  email: string;
};

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

  verifyToken(token: string) {
    return jwt.verify(token, publicKey, { algorithms: [signingAlgo] });
  }
}

export const authService = new AuthService(authRepo);
