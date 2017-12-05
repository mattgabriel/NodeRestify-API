import * as errors from "restify-errors";

/**
 *
 * All possible error messages that will be returned in the error response
 *
 */
export enum ErrorMsg {
	// General errors
	General_DatabaseError = "DatabaseError",

	// Authentication errors
	Auth_InvalidToken = "InvalidToken",
	Auth_MissingToken = "MissingToken",
	Auth_UnadaptableToken = "UnadaptableToken",
	Auth_ExpiredToken = "ExpiredToken",
	Auth_InsufficientParameters = "InsufficientParameters",
	Auth_InvalidCredentials = "InvalidCredentials",
}


/**
 *
 * Needs to exist in restify-errors
 * Will be returned in the erorr response alongside
 * its corresponding error code (401, 402...)
 *
 */
export enum ErrorCode {
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
	MethodNotAllowedError,
	InternalServerError,
	ServiceUnavailableError
}


/**
 *
 * ApiError is in charge or building the error responses for you
 * it simply takes restify error code and an error message.
 * when a controller receives a callback with success=false and error=ApiError()
 * it will pass it on to next() return the error response to the client
 *
 */
export class ApiError {

	static httpResponse(message: ErrorMsg, errorCode: ErrorCode): any {

		switch (errorCode) {
			case ErrorCode.BadRequestError:
				return new errors.BadRequestError(message);
			case ErrorCode.UnauthorizedError:
				return new errors.UnauthorizedError(message);
			case ErrorCode.ForbiddenError:
				return new errors.ForbiddenError(message);
			case ErrorCode.NotFoundError:
				return new errors.NotFoundError(message);
			case ErrorCode.MethodNotAllowedError:
				return new errors.MethodNotAllowedError(message);
			case ErrorCode.InternalServerError:
				return new errors.InternalServerError(message);
			case ErrorCode.ServiceUnavailableError:
				return new errors.ServiceUnavailableError(message);
			default:
				return new errors.InternalServerError("Unhandled");
		}
	}

}