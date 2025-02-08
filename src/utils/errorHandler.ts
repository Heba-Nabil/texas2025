class ErrorHandler extends Error {
  public title: string;
  public statusCode: number;

  constructor(title: string, message: string, statusCode: number) {
    super(message);

    this.title = title;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
