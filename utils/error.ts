export class NotFoundUserError extends Error {
  constructor() {
    super();
    this.name = "NotFoundUserError";
  }
}

export class NotFoundContentError extends Error {
  constructor() {
    super();
    this.name = "NotFoundContentError";
  }
}
