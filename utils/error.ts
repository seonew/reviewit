export class NotFoundContentError extends Error {
  constructor() {
    super();
    this.name = "NotFoundContentError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.name = "UnauthorizedError";
  }
}
