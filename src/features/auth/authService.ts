import { AuthRepository, authRepo } from "./authRepository.js";
import { UserType } from "../../shared/types/userTypes.js";
import {
  ConflictError,
  UnauthorizedError,
} from "../../shared/errors/HTTPErrors.js";
import argon2 from "argon2";

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

  async handleLogin(user: UserType) {
    const userExists = await this.repo.userExists(user.email);

    if (!userExists) throw new UnauthorizedError("User does not exist");

    const passwordHash = await this.repo.getUserPasswordHash(user.email);
    const isValidPassword = await argon2.verify(passwordHash, user.password);

    if (!isValidPassword) throw new UnauthorizedError("Invalid password");

    // Grant access and refresh tokens
    //  Return true at the moment first
    return true;
  }
}

export const authService = new AuthService(authRepo);
