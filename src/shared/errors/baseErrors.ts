export class HTTPError extends Error {
  constructor(reason: string, public statusCode: number) {
    super(reason);
  }
}

export class BadRequestError extends HTTPError {
  constructor(reason: string) {
    super(reason, 400);
  }
}

export class ResourceNotFoundError extends HTTPError {
  constructor(reason: string) {
    super(reason, 404);
  }
}

export class ConflictError extends HTTPError {
  constructor(reason: string) {
    super(reason, 409);
  }
}
