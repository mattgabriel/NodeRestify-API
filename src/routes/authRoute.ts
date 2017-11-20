import * as errors from "restify-errors";
import * as restify from "restify";
import authController from "../controllers/AuthController";

function authRoute(server: restify.Server) {
	const routeCtrl = new authController();
	server.get("/auth", routeCtrl.get);

}

module.exports.routes = authRoute;