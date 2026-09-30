export abstract class AppError extends Error {
  abstract readonly code: string;

  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }
}

export class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';

  constructor(message: string, readonly url: string, cause?: unknown) {
    super(message, cause);
  }
}

export class XmlParseError extends AppError {
  readonly code = 'XML_PARSE_ERROR';

  constructor(message: string, readonly source: string, cause?: unknown) {
    super(message, cause);
  }
}

export class TransformationError extends AppError {
  readonly code = 'TRANSFORMATION_ERROR';

  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

export class PersistenceError extends AppError {
  readonly code = 'PERSISTENCE_ERROR';

  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

export class ConfigurationError extends AppError {
  readonly code = 'CONFIGURATION_ERROR';

  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
