import * as errors from "restify-errors";
import * as restify from "restify";
import authController from "../controllers/AuthController";

// curl -X GET http://localhost:3000/auth/someUser -H 'accept-version: ~3'
function authRoute(server: restify.Server) {
	const routeCtrl = new authController();
	server.get({path: "/auth/:user", version: "3.0.0"}, routeCtrl.get);

}

module.exports.routes = authRoute;