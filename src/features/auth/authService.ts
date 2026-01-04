import { AuthRepository, authRepo } from "./authRepository.js";
import { UserType } from "../../shared/types/userTypes.js";
import { InvalidNewUserError } from "../../shared/errors/userErrors.js";
import argon2 from "argon2";

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async registerUser(newUser: UserType) {
    const userExists = await this.repo.userExists(newUser.email);

    if (userExists) throw new InvalidNewUserError("User already exists");

    const passwordHash = await argon2.hash(newUser.password);

    return await this.repo.createUser({
      email: newUser.email,
      password: passwordHash,
    });
  }
}

export const authService = new AuthService(authRepo);
