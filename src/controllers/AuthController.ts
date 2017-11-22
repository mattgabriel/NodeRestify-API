import * as restify from "restify";

export default class AuthController {
	public get(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "GET "});
		return next();
	}

	public post(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "POST "});
		return next();
	}

	public patch(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "PATCH "});
		return next();
	}

	public put(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "PUT "});
		return next();
	}

	public delete(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"message": "DELETE "});
		return next();
	}
}