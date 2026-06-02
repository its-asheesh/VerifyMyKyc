export class HTTPError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
