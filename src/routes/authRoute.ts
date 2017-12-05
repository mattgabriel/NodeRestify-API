import * as restify from "restify";
import authController from "../controllers/AuthController";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import { AuthMiddleware } from "../services/authService";
// const authService = new Auth();

/**
 * @api {get} /auth Auth
 * @apiName Auth
 * @apiVersion 3.0.0
 * @apiGroup User
 * @apiUse AuthHeader
 * @apiDescription Authenticate a user
 */
// curl -X GET http://localhost:3000/auth/someUser -H 'accept-version: ~3'
function authRoute(server: restify.Server) {
	const routeCtrl = new authController();

	server.post({path: "/auth/accessToken", version: "3.0.0"}, routeCtrl.post);
	server.post({path: "/auth/login", version: "3.0.0"}, routeCtrl.post);

	server.get({path: "/auth/test", version: "3.0.0"}, [AuthMiddleware.validateAccessToken, routeCtrl.get]);

	server.patch({path: "/auth/:user", version: "3.0.0"}, routeCtrl.patch);
	server.put({path: "/auth/:user", version: "3.0.0"}, routeCtrl.put);
	server.del({path: "/auth/:user", version: "3.0.0"}, routeCtrl.del);
}

// function validate(req: restify.Request, res: restify.Response, next: restify.Next) {
// 	const authService = new Auth();
// 	authService.validateAccessTokenMiddleware(req, res, function(success: boolean, error: ApiError) {
// 		if (success) {
// 			const response = {
// 				continue: true,
// 			};
// 			res.json(200, response);
// 			next();
// 		} else {
// 			return next(error);
// 		}
// 	});
// }

// function validate1(req: restify.Request, res: restify.Response, next: restify.Next) {
// 	console.log("REAKEEEEEE");
// }

module.exports.routes = authRoute;
