import * as errors from "restify-errors";

class RestError {

	static General = {
		DatabaseError: "DatabaseError",
	};

	static Auth = {
		InvalidToken: "InvalidToken",
		MissingToken: "MissingToken",
		UnadaptableToken: "UnadaptableToken",
		ExpiredToken: "ExpiredToken",
		InsufficientParameters: "InsufficientParameters",
		InvalidCredentials: "InvalidCredentials",
	};

}

export enum ErrorCode {
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
	MethodNotAllowedError,
	InternalServerError,
	ServiceUnavailableError
}

export class ApiError extends RestError {

	static httpResponse(message: string, restifyError: ErrorCode): any {

		switch (restifyError) {
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