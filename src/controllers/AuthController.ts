import * as restify from "restify";
import { ApiError, ErrorCode } from "../helpers/apiErrors";
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
					refreshToken: authService.refreshToken
				};
				res.json(200, response);

				return next();
			} else {
				return next(error);
			}
		});
		// if it fails, the service will handle the 4xx or 5xx response
		// so there's nothing else to do here

		// res.json(401, {"message": "POST 401"});
		// return next();

		// const err = new errors.PaymentRequiredError("Pay up!");
		// return next(err);
		// res.json(200, {"message": "POST "});
		// return next();
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