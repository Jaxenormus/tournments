export class WhopError extends Error {
  constructor(error: { status: number; message: string }) {
    const message = `${error.status}: ${error.message}`;
    super(message);
    this.name = "WhopError";
  }
}
