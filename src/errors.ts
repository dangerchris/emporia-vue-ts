export class EmporiaVueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmporiaVueError";
  }
}

export class AuthenticationError extends EmporiaVueError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ApiError extends EmporiaVueError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export class NetworkError extends EmporiaVueError {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends EmporiaVueError {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}
