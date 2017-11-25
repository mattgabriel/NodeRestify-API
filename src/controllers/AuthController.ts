import * as restify from "restify";
import * as errors from "restify-errors";
import * as auth from "../models/authModel";

const a = new auth.Auth();

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
	 * curl -X POST "http://localhost:3000/auth" -d '{"refresh_token":"test"}' -H 'Content-Type: Application/json'
	 * curl -X POST "http://localhost:3000/auth" -d '{"email":"test","pass":"test"}' -H 'Content-Type: Application/json'
	 *
	 */
	public post(req: restify.Request, res: restify.Response, next: restify.Next) {
		if (a.authenticate(req, res, next)) {
			res.json(200, {"message": "POST "});
			return next();
		}	
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