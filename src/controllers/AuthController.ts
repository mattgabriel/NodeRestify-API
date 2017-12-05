import * as restify from "restify";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import { Auth } from "../services/authService";

export default class AuthController {

	/**
	 *
	 * curl -X GET "http://localhost:3000/auth?token=myToken"
	 * curl -X GET "http://localhost:3000/auth" -d '{"token":"myToken"}' -H 'Content-Type: application/json'
	 * curl -X GET "http://localhost:3000/auth" -H "AUTHORIZATION: Bearer myToken"
	 *
	 */
	public get(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "GET "});
		return next();
	}

	/**
	 *
	 * curl -X POST "http://localhost:3000/auth/accessToken" -H 'AUTHORIZATION: Bearer <refreshToken>'
	 * curl -H 'Content-Type: Application/json' -X POST "http://localhost:3000/auth/login" -d '{"email":"ms@gmx.de","password":"c21f969b5f03d33d43e04f8f136e7682"}'
	 *
	 */
	public post(req: restify.Request, res: restify.Response, next: restify.Next) {
		const authService = new Auth();
		authService.authenticate(req, res, function(success: boolean, error: ApiError) {
			if (success) {
				const response = {
					tokenType: "bearer",
					accessToken: authService.accessToken,
					expiresIn: authService.accessTokenExpiration,
					refreshToken: authService.refreshToken,
					userId: authService.userId
				};
				res.json(200, response);

				return next();
			} else {
				// if there is an error
				// the service wil return an instance of ApiError that contains
				// a restify-error object which handles error responses
				return next(error);
			}
		});
	}

	public patch(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "PATCH "});
		return next();
	}

	public put(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "PUT "});
		return next();
	}

	public del(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "DELETE "});
		return next();
	}

}