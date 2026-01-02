import { ResourceNotFoundError, ConflictError } from "./baseError.js";

export class TermNotFoundError extends ResourceNotFoundError {
  constructor(reason: string) {
    super(reason);
  }
}

export class InvalidNewTermError extends ConflictError {
  constructor(reason: string) {
    super(reason);
  }
}
