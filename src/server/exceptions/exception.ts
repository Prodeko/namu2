type InvalidSessionErrorCause =
  | "missing_session"
  | "invalid_session"
  | "missing_role"
  | "invalid_role";

type AuthenticationErrorCause = "missing_credentials" | "invalid_credentials";

type ErrorCause = AuthenticationErrorCause | InvalidSessionErrorCause;

/**
 * BaseError - A custom error class that extends the built-in Error class.
 *
 * This class provides a foundation for creating more specific error types
 * with additional context and formatting capabilities.
 *
 * @param name - The name of the error, used to identify the error type.
 * @param message - A descriptive message providing details about the error.
 * @param cause - Optional. The underlying cause of the error, if applicable.
 *
 * @constructor
 * @param params - The parameters for creating the error.
 * @param params.name - The name of the error.
 * @param params.message - The error message.
 * @param params.cause - Optional. The underlying cause of the error.
 *
 * @method toString
 * @returns A formatted string representation of the error,
 * including the name, cause (if present), and message.
 *
 * @example
 * const myError = new BaseError({
 *   name: 'ValidationError',
 *   message: 'Invalid input',
 *   cause: 'Missing required field'
 * });
 * console.log(myError.toString()); // Outputs: ValidationError (Missing required field): Invalid input
 */
class BaseError extends Error {
  name: string;
  message: string;
  cause?: ErrorCause;

  constructor({
    name,
    message,
    cause,
  }: {
    name: string;
    message: string;
    cause?: ErrorCause;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;

    // https://github.com/microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
    // Object.setPrototypeOf(this, BaseError.prototype);
  }

  toString() {
    return `${this.name}${this.cause && ` (${this.cause})`}: ${this.message}`;
  }
}

/**
 * InvalidSessionError - An error class for handling invalid session errors.
 *
 * This class extends the BaseError class and provides additional context
 * for errors related to session validation and authentication.
 *
 * @param message - A descriptive message providing details about the error.
 * @param cause - The underlying cause of the error.
 *
 * @constructor
 * @param params - The parameters for creating the error.
 * @param params.message - The error message.
 */
export class InvalidSessionError extends BaseError {
  constructor({
    message,
    cause,
  }: {
    message: string;
    cause: InvalidSessionErrorCause;
  }) {
    super({
      name: "Invalid session error",
      message,
      cause,
    });
  }
}

/**
 * AuthenticationError - An error class for handling authentication errors.
 *
 * This class extends the BaseError class and provides additional context
 * for errors related to authentication and credential validation.
 *
 * @param message - A descriptive message providing details about the error.
 * @param cause - The underlying cause of the error.
 *
 * @constructor
 * @param params - The parameters for creating the error.
 * @param params.message - The error message.
 */
export class AuthenticationError extends BaseError {
  constructor({
    message,
    cause,
  }: {
    message: string;
    cause: AuthenticationErrorCause;
  }) {
    super({
      name: "Authentication error",
      message,
      cause,
    });
  }
}
