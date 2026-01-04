import { ConflictError } from "./baseErrors.js";

export class InvalidNewUserError extends ConflictError {
  constructor(reason: string) {
    super(reason);
  }
}
