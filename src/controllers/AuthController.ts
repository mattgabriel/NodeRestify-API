import * as restify from "restify";

export default class AuthController {
	public get(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "test 1234"});
		return next();
	}
}